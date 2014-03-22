var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-47679369-1']);
_gaq.push(['_trackPageview']);

(function(){ 'use strict';

var ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);

require.config({ 
  baseUrl: '/js',
  paths: {
    underscore: '../bower_components/underscore/underscore-min',
    jQuery: '../bower_components/jquery/jquery.min',
    angular: '../bower_components/angular/angular.min',
    'ui.router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrap-tagsinput': '../bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min',
    'bootstrap-tagsinput-angular': 'lib/bootstrap-tagsinput-angular',
    'ui.bootstrap': '../bower_components/ui-bootstrap/dist/ui-bootstrap-custom-tpls-0.10.0',
    'color-thief': '../bower_components/color-thief/js/color-thief'
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
    },
    'color-thief': {
      exports: 'ColorThief'
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
  'services/booleanSearchEngine',
  'directives/updateBackground',
  'controllers/main'], function($, angular) {
    angular.bootstrap(document, ['bookmarksApp']);
  });

})();