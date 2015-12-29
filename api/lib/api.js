var init_model = require('./model.js');

var API = function(nconf, model){
	this.nconf = nconf;
	this.model = model;
}

function _requireAuthorization (user_id, toplevel_callback, callback) {
    if (!user_id) {
        var error_unauthorized = errors.create('auth_unauthorized', 'Unauthorized', {
            code: 401
        });
        toplevel_callback(error_unauthorized);
    } else {
        callback();
    }
}

API.prototype.login = function(username, password, callback) {

}

API.prototype.register = function(username, email, password, callback) {
    var self = this;
    var errors_message = '';
    var invalid_fields_list = [];

    var pushInvalidField = function (list, field) {
        if (!_.contains(list, field)) {
            list.push(field);
        }
    };

    var updateErrorMessage = function (errors_message, new_error_message) {
        var message = '';

        if (errors_message.length > 0) {
            message = errors_message + ' ' + new_error_message + '.';
        } else {
            message = errors_message + new_error_message + '.';
        }

        return message
    };

    //Validating Username
    if (!validator.isLength(username, 1)) {
        pushInvalidField(invalid_fields_list, 'username');
        errors_message = updateErrorMessage(errors_message, 'Empty username');
    } else if (!validator.isLength(username, 4)) {
        pushInvalidField(invalid_fields_list, 'username');
        errors_message = updateErrorMessage(errors_message, 'Username is too short');
    }
    ;

    if (validator.isLength(username, 1) && !validator.isAlphanumeric(username)) {
        pushInvalidField(invalid_fields_list, 'username');
        errors_message = updateErrorMessage(errors_message, 'Invalid username');
    }

    //Validating Email
    if (!validator.isLength(email, 1)) {
        pushInvalidField(invalid_fields_list, 'email');
        errors_message = updateErrorMessage(errors_message, 'Empty email');
    }

    if (validator.isLength(email, 1) && !validator.isEmail(email)) {
        pushInvalidField(invalid_fields_list, 'email');
        errors_message = updateErrorMessage(errors_message, 'Invalid email');
    }

    //Validating Password
    if (!validator.isLength(password, 1)) {
        pushInvalidField(invalid_fields_list, 'password');
        errors_message = updateErrorMessage(errors_message, 'Empty password');
    } else if (!validator.isLength(password, 8)) {
        pushInvalidField(invalid_fields_list, 'password');
        errors_message = updateErrorMessage(errors_message, 'Password is too short');
    }

    if (validator.isLength(password, 1) && !validator.isAlphanumeric(password)) {
        pushInvalidField(invalid_fields_list, 'password');
        errors_message = updateErrorMessage(errors_message, 'Invalid password');
    }

    //Check if have validation errors
    if (invalid_fields_list.length > 0) {
        var error = errors.create('auth_incorrect_register_data', errors_message, {
            code: 403,
            details: invalid_fields_list
        });
        console.log(error);
        callback(error);
        return;
    }
}

API.prototype.createCustomer = function(user_id, note_text, note_date, callback) {
    var self = this;

    _requireAuthorization(user_id, callback, function(){

    });

}

API.prototype.getAllCustomers = function(user_id, note_text, note_date, callback) {
    var self = this;

    _requireAuthorization(user_id, callback, function(){

    });

}

API.prototype.updateCustomer = function(user_id, note_text, note_date, callback) {
    var self = this;

    _requireAuthorization(user_id, callback, function(){

    });

}

API.prototype.deleteCustomer = function(user_id, note_text, note_date, callback) {
    var self = this;

    _requireAuthorization(user_id, callback, function(){

    });

}

module.exports = function(nconf, log, callback){
	init_model(nconf, log, function(error, model){
		if(!error){
			var api = new API(nconf, model);
			callback(undefined, api);
		} else {
			callback(error);			
		}
	})
}