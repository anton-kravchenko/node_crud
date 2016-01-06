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
        fillCustomers: function(customers,  newCustomers){
            var self = this;
            for(i in customers){

                var dateOfBirth = new Date(customers[i].dateOfBirth);
                var day = dateOfBirth.getDay();
                var month = dateOfBirth.getMonth();
                if(day < 10){
                    day = '0' + day;
                }
                if(month < 10){
                    month = '0' + month;
                }

                dateOfBirth =  dateOfBirth.getFullYear() + '-' + day  + '-' + month;

                if(newCustomers){
                    this.customers.add({
                        _id : customers[i]._id,
                        firstName : customers[i].firstName || customers[i].name.first,
                        lastName : customers[i].lastName || customers[i].name.last,
                        dateOfBirth : dateOfBirth,
                        mobilePhone : customers[i].mobilePhone || customers[i].phone.mobile,
                        workPhone : customers[i].workPhone || customers[i].phone.work,
                        companyName : customers[i].companyName,
                        skype : customers[i].skype
                    });
                }

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
                self.fillCustomers(customers, true);
            });
        },
		render: function () {
            var self = this;
            $(this.el).html(this.template());

            this.getAllCustomers();
            $('.customers_container').on('updateView', function(){
                $('.customer_container').remove();
                self.fillCustomers(self.customers.toJSON(), false);
            })
		},

	});

	return LandingScreen;

});