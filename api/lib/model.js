var mongoose = require('mongoose'),
	mongodbUri = require('mongodb-uri'),
	autoIncrement = require('mongoose-auto-increment');

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
                    host: nconf.get('mongo_db:host'),
                    port: nconf.get('mongo_db:port')
                }
            ],
            database: nconf.get('mongo_db:db_name'),
        }
	);

	var connection = mongoose.connect(uri, options); 
	autoIncrement.initialize(connection);

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		mongo_log.info('Open ' + nconf.get('mongo_db:db_name') + ' connection.');
	  
		// Create Customer schema
		var Schema = mongoose.Schema;
		var customerSchema = new Schema({
			id			: Schema.Types.ObjectId,
			firstName	: String, 
			lastName	: String, 
			dateOfBirth	: Date,

			companyName	: String, 
			mobilePhone	: String, 
			workPhone	: String, 
			companyName	: String, 
			skype		: String,
		});

		customerSchema.plugin(autoIncrement.plugin, 'customers')
		var Customer = mongoose.model('customers', customerSchema);
		callback(undefined, Customer);
	}
)};
