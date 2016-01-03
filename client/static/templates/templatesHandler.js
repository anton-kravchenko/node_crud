define([
	'jquery',
	'underscore',
	'text!./templates/app_template.html',
	'text!./templates/landingTemplate.html',
	'text!./templates/sign_in_template.html',
	'text!./templates/sign_up_template.html',
	'text!./templates/customers_template.html',
	'text!./templates/customer_template.html',
	'text!./templates/new_customer_template.html',
	'text!./templates/sign_in_up_buttons.html',
	'text!./templates/edit_popup_template.html'

], function ($, _, 	app_template,
					landing_template,
					sign_in_template,
					sign_up_template,
					customers_template,
					customer_template,
					new_customer_template,
					sign_in_up_buttons,
					edit_popup_template
	) {

	return {
		app_template : _.template(app_template),
		landing_template : _.template(landing_template),
		sign_in_template : _.template(sign_in_template),
		sign_up_template : _.template(sign_up_template),
		customers_template : _.template(customers_template),
		customer_template : _.template(customer_template),
		new_customer_template : _.template(new_customer_template),
		sign_in_up_buttons : _.template(sign_in_up_buttons),
		edit_popup_template : _.template(edit_popup_template)
	} 
});
 