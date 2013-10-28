(function(){

'use strict';

require.config({ 
  baseUrl: '/js',
  paths: {
    underscore: 'lib/underscore-min',
    jQuery: 'lib/jquery-2.0.3.min',
    angular: 'lib/angular.min',
    bootstrap: 'lib/bootstrap.min',
    'ui-bootstrap': 'lib/ui-bootstrap-custom-tpls-0.6.0-SNAPSHOT.min',
    controllers: 'controllers',
    filters: 'filters',
    services: 'services',
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
    'bootstrap': {
      deps: ['jQuery'],
      exports : 'bootstrap'
    },
    'ui-bootstrap': {
      deps: ['jQuery','bootstrap', 'angular'],
      exports : 'ui-bootstrap'
    }
  }
});

require([
  'jQuery', 
  'angular', 
  'bootstrap', 
  'ui-bootstrap', 
  'filters/fieldsFilter',
  'controllers/main'], function($, angular) {
    angular.bootstrap(document, ['bookmarksApp']);
  });

})();