define([
  'jquery',
  'underscore',
  'backbone',
  'backboneModal',
  'templatesHandler',
  'API',
  'customerModel'
], function ($, _, Backbone, BackboneModal, TemplatesHandler, API, CustomerModel) {

    var Modal = Backbone.Modal.extend({
      	
        template: _.template(TemplatesHandler.edit_popup_template()),
      	viewContainer: '.my-container',
      	submitEl: '.bbm-button',
	     
      	events: {
        	'click .confirm': 'deleteDocument',
	        'click .cancel' : 'closePopup',
	        'click .popup_close_button' : 'closePopup',
            'click .submit_new_customer' : 'submitNewCustomer',
            'click .update_customer' : 'updateCustomer',
            'click .cancel_new_customer' : 'closePopup',
      	},
      	closePopup : function () {
	        this.destroy();
      	},
      	cancel: function(){
        	this.destroy();
      	},

        submitNewCustomer: function(){
            var self = this;
            this.grepData();
            this.model.createCustomer(function(customer){
                console.log(customer);
                self.customers.add(customer);
                self.closePopup();
            }, function(err){   
                console.log(err);
            });
        },
        updateCustomer: function(){
            var self = this;
            this.grepData();
            this.model.updateCustomer(function(customer){
                console.log(customer);
                self.closePopup();
            }, function(err){   
                console.log(err);
            });
        },
        grepData: function(){
            this.model.set({    
                firstName:    $('#firstName').val(),
                lastName:     $('#lastName').val(),
                dateOfBirth:  $('#dateOfBirth').val(),
                companyName:  $('#companyName').val(),
                mobilePhone:    $('#mobilePhone1').val() + '-' + 
                                $('#mobilePhone2').val() + '-' + 
                                $('#mobilePhone3').val() + '-' + 
                                $('#mobilePhone4').val(),

                workPhone:      $('#workPhone1').val() + '-' + 
                                $('#workPhone2').val() + '-' + 
                                $('#workPhone3').val() + '-' + 
                                $('#workPhone4').val(),
                skype:        $('#skype').val()
            });
        },
  		initialize: function (createNewCustomer, customers, model) {
            this.customers = customers;
			this.createNewCustomer = createNewCustomer;
            if(this.createNewCustomer){
                this.model = new CustomerModel();
            } else {
                this.model = model;
            }
		},
        onShow: function(){
            if(!this.createNewCustomer) {
                $('.submit_new_customer').addClass('update_customer');
                $('.submit_new_customer').text('Update');
                $('.submit_new_customer').removeClass('submit_new_customer');
            }
        }
    });

    return Modal;
});