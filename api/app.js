var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var nconf = require('nconf');
var cors = require('express-cors')

var package_json = require('./package.json');

var init_api = require('./lib/api');
var Router = require('./lib/router');

nconf
    .argv()
    .env('__')
    .file({file: './defaults.json'});

var log = bunyan.createLogger({
    name: package_json['name'],
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },
        {
            level: nconf.get('log:level'),
            type: 'rotating-file',
            path: nconf.get('log:path')
        }
    ]
});

init_api(nconf, log, function (error, api) {
	var app = express();
    var router = new Router(app, {
        target: api,
        log: log
    });

	app.on('uncaughtException', function (req, res, route, err) {
	    var a_log = req.log ? req.log : log;
	    a_log.error(err);

	    res.send(500, {
	        status: 'server_error',
	        message: err.message
	    });
	});

	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(session({
	    secret: nconf.get('security:session_secret'),
	    name: 'user_session',
	    rolling: true,
	    resave: false,
	    saveUninitialized: false,
	    cookie: {
	        maxAge: 12 * 24 * 60 * 60 * 1000
	    }
	}));

	app.use(cors({
	    allowedOrigins: [
	        nconf.get('frontend:host'), nconf.get('backend:host')
	    ]
	}));

	app.use(function (req, res, next) {
	    res.setHeader('Access-Control-Allow-Origin', nconf.get('frontend:host'));
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	    res.setHeader('Access-Control-Allow-Credentials', true);
	    next();
	});

    router.post('/login', {
        parameters: {
            username: router.String,
            password: router.String
        },
        call: [api.login, 'username', 'password']
    });

    router.post('/register', {
        parameters: {
            username: router.String,
            email: router.String,
            password: router.String
        },
        call: [api.register, 'username', 'email', 'password']
    });

    router.post('/add_customer', {
        parameters: {
            firstName: 	 router.String,
            lastName:    router.String,
            dateOfBirth: router.Date,
            companyName: router.String,
            mobilePhone: router.String,
            workPhone: 	 router.String,
            skype: 	 	 router.String,
        },
        call: [ api.createCustomer, 'session:user_id', 
        							'firstName', 
        							'lastName', 
        							'dateOfBirth', 
        							'companyName', 
        							'mobilePhone',
        							'skype']
    });

    router.get('/get_customers', {
        parameters: {
        },
        call: [ api.getAllCustomers, 'session:user_id']
    });

    router.post('/update_customer/:customer_id', {
        parameters: {
            customer_id : router.Integer,
            firstName: 	  router.String,
            lastName:     router.String,
            dateOfBirth:  router.Date,
            companyName:  router.String,
            mobilePhone:  router.String,
            workPhone: 	  router.String,
            skype: 	 	  router.String,
        },
        call: [ api.updateCustomer, 'session:user_id', 
        							'firstName', 
        							'lastName', 
        							'dateOfBirth', 
        							'companyName', 
        							'mobilePhone',
        							'skype']
    });

    router.delete('/delete_customer/:customer_id', {
        parameters: {
            customer_id : router.Integer,
        },
        call: [ api.deleteCustomer, 'session:user_id', 'customer_id']
    });

	app.listen(nconf.get('port'), function () {
	    console.log('Listening %s at %d', package_json['name'], nconf.get('port'));
	});
});