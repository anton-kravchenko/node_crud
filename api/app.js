var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var nconf = require('nconf');
var cors = require('express-cors')

var package_json = require('./package.json');

var init_api = require('./lib/api.js');

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


	app.listen(nconf.get('port'), function () {
	    console.log('Listening %s at %d', package_json['name'], nconf.get('port'));
	});
});