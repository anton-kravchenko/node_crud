var mongoose = require('mongoose'),
	mongodbUri = require('mongodb-uri'),
	autoIncrement = require('mongoose-auto-increment'),
	model = {};

module.exports = function(nconf, log, callback){
	var mongo_log = log.child({
		component : 'mongo'
	});

	var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
                
	var uri = mongodbUri.format(
        {
        	username : nconf.get('mongo_db_username'),
        	password : nconf.get('mongo_db_password'),
            hosts: [
                {
                    host: nconf.get('mongo_db_host'),
                    port: nconf.get('mongo_db_port')
                }
            ],
            database: nconf.get('mongo_db_db_name'),
        }
	);

	var connection = mongoose.connect(uri, options); 
	autoIncrement.initialize(connection);

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		mongo_log.info('Open ' + nconf.get('mongo_db_db_name') + ' connection.');

		var Schema = mongoose.Schema;
	  	var userSchema = new Schema({
	  		_id		 : Schema.Types.ObjectId,
	  		username : String,
	  		email	 : String, 
	  		password : String, 
	  		salt	 : String,

	  		customers : [{ type: Schema.Types.ObjectId, ref: 'customers' }]
	  	});
		
		userSchema.plugin(autoIncrement.plugin, 'User');
		var Users = mongoose.model('User', userSchema);

		function personPlugin (schema, options) {
		  	schema.add({
	  			name :{
					first	: String, 
					last	: String, 
				},
				dateOfBirth	: Date
			});
		  
		  	schema.pre('save', function (next) {
		    	this.lastMod = new Date
		    	next()
		  	})
		  
		  	if (options && options.index) {
		    	schema.path('person').index(options.index);
		  	}
		}

		var customerSchema = new Schema({
			_creator    : { type: Number, ref: 'User' },
			id			: Schema.Types.ObjectId,
			phone: {
				mobile : String,
				work : String
			},
			companyName	: String, 
			skype		: String,
		});

		customerSchema.plugin(personPlugin);
		customerSchema.plugin(autoIncrement.plugin, 'Customer')
		var Customers = mongoose.model('Customer', customerSchema);

		model.Users = Users;
		model.Customers = Customers;

		callback(undefined, model);
	}
)};
