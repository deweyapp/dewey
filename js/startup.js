(function(){

'use strict';

require.config({ 
  baseUrl: '/js',
  paths: {
    jQuery: 'lib/jquery-2.0.3.min',
    angular: 'lib/angular.min',
    bootstrap: 'lib/bootstrap.min',
    'ui-bootstrap': 'lib/ui-bootstrap-custom-tpls-0.6.0-SNAPSHOT.min'
  },
  shim: {
    'jQuery': {
      exports : 'jQuery'
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
  'fieldsFilter',
  'mainController'], function($, angular) {
    angular.bootstrap(document, ['bookmarksApp']);
  });

})();