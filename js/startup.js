(function(){ 'use strict';

require.config({ 
  baseUrl: '/js',
  paths: {
    underscore: '../bower_components/underscore/underscore-min',
    jQuery: '../bower_components/jquery/jquery.min',
    angular: '../bower_components/angular/angular.min',
    'ui.router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
    controllers: 'controllers',
    filters: 'filters',
    services: 'services',
    'bootstrap-tagsinput': 'lib/bootstrap-tagsinput.min',
    'bootstrap-tagsinput-angular': 'lib/bootstrap-tagsinput-angular',
    'ui.bootstrap': '../bower_components/ui-bootstrap/dist/ui-bootstrap-custom-tpls-0.10.0',
  },
  shim: {
    'jQuery': {
      exports : 'jQuery'
    },
    'underscore': {
      exports : '_'
    },
    'angular': {
      deps: ['jQuery'],
      exports : 'angular'
    },
    'ui.router': {
      deps: ['angular']
    },
    'bootstrap': {
      deps: ['jQuery'],
      exports : 'bootstrap'
    },
    'ui.bootstrap': {
      deps: ['jQuery','bootstrap', 'angular']
    },
    'bootstrap-tagsinput': {
      deps: ['bootstrap']
    },
    'bootstrap-tagsinput-angular': {
      deps: ['bootstrap-tagsinput', 'angular']
    }
  }
});

require([
  'jQuery',
  'angular',
  'ui.router',
  'bootstrap',
  'ui.bootstrap',
  'bootstrap-tagsinput',
  'bootstrap-tagsinput-angular',
  'filters/fieldsFilter',
  'controllers/main'], function($, angular) {
    angular.bootstrap(document, ['bookmarksApp']);
  });

})();