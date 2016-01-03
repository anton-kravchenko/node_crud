var libsPath = './lib/';

require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    bootstrap: {
      deps : [
        'jquery'
      ],
      exports : 'bootstrap'
    },
    backbone_modal: {
      deps : [
        'Backbone'
      ],
      exports : 'BackboneModal'
    },
  },
  waitSeconds: 200,
  paths: {
    text:          libsPath + 'text',
    jquery:        libsPath + 'jquery',
    underscore:    libsPath + 'underscore',
    backbone:      libsPath + 'backbone',
    backboneModal: libsPath + 'backbone.modal-min',
    bootstrap:     libsPath + 'bootstrap',

    templatesHandler : './templates/templatesHandler',
    config : './config/config',
    
    appView : './js/views/app',
    landingView : './js/views/landingView',
    customersView : './js/views/customersView',

    editCustomerPopup : './js/views/editCustomerPopup',

    customerModel : './js/models/customerModel',
    customers : './js/collections/customers',

    API : './js/api/API',
    router: './js/router/router',
  
  }
});

require([
  'backbone',
  'appView',
  'router',
  'config'
], function (Backbone, AppView, Router, config) {
    config.initialize(function(){
      new AppView().render();
    });
});