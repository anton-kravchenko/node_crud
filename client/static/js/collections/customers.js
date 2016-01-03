define([
	'jquery',
	'underscore',
	'backbone',
	'customerModel'
], function ($, _, Backbone, Model) {

	var Customers = Backbone.Collection.extend({
		model: Model
	});

	return Customers;
});
