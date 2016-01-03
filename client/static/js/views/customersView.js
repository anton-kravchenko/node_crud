define([
	'jquery', 
	'underscore',
	'backbone',
    'templatesHandler',
    'API',
    'editCustomerPopup',
    'customers'
], function ($, _, Backbone, TemplateHandler, API, EditCustomerPopup, Customers) {

    var LandingScreen = Backbone.View.extend({

		el: '#app',

		signInUpcontainer : '.signInUpContainer',

		template : TemplateHandler.customers_template,

        noteTemplate : TemplateHandler.customer_template,

		events: {
            'click .submit_new_note': 'submitCustomer',
            'click .cancel_new_note': 'cancelNewCustomer',
            'click .add_new_customer' : 'showCreateCustPopup'
		},
        
		maxNoteLength :  255,

		initialize: function () {
            this.customers = new Customers();
            // this.customers.on('change')
		},
        showCreateCustPopup: function(){
            this.popup = new EditCustomerPopup(true, this.customers, null);
            $('#app').append(this.popup.render().el);
        },
        showEditCustPopup: function(model, customers){
            this.popup = new EditCustomerPopup(false, customers, model);
            $('#app').append(this.popup.render().el);  
        },
        fillCustomers: function(customers){
            var self = this;
            for(i in customers){
                this.customers.add({
                    _id : customers[i]._id,
                    firstName : customers[i].firstName,
                    lastName : customers[i].lastName,
                    dateOfBirth : customers[i].dateOfBirth,
                    mobilePhone : customers[i].mobilePhone,
                    workPhone : customers[i].workPhone,
                    companyName : customers[i].companyName,
                    skype : customers[i].skype
                });

                $('.customers_container').append(TemplateHandler.customer_template(this.customers.at(i).toJSON()));

                (function(customerEl, model){
                    $(customerEl).find('.update_customer').on('click', function(){
                        self.showEditCustPopup(model, self.customers);
                    });
                    $(customerEl).find('.delete_customer').on('click', function(){

                         API.deleteCustomer(model.get('_id'), function(response){
                                $(customerEl).fadeOut(function(){
                                    $(customerEl).remove();
                                })
                            },
                            function(error){
                                $(note_text_el).parent().find('.updating_spinner').css('display', 'none');
                            }
                        );
                    });

                })($('.customer_container').last(), this.customers.at(i));

            }
        },
        getAllCustomers: function(){
            var self = this;
            API.getCustomers(function(data){
                var customers = data.customers;
                self.fillCustomers(customers);
            });
        },
		render: function () {
            $(this.el).html(this.template());

            this.getAllCustomers();
		},

	});

	return LandingScreen;

});