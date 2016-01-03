define([
	'jquery',
	'underscore',
	'backbone',
	'API',
], function ($, _, Backbone, API) {

	var CustomerModel = Backbone.Model.extend({
		defaults : {
			_id : 0,
            firstName: 	  '',
            lastName:     '',
            dateOfBirth:  '',
            companyName:  '',
            mobilePhone:  '',
            workPhone: 	  '',
            skype: 	 	  ''
		},
		updateCustomer : function(callback, errorCallback){
			var self = this;
			var data = this.attributes;
			delete data.customer_id;

			API.updateCustomer(this.get('_id'), data, callback, errorCallback);
		},
		createCustomer: function(callback, errorCallback){
			var data = this.attributes;
			delete data['_id'];

			API.createCustomer(data, callback, errorCallback);
		}
	});

	return CustomerModel;
});
