define(
[
  'angular',
  './routes',
  './filters/_module',
  './services/_module',
  './directives/_module',
  './controllers/_module',
  'angular-route',
  'ui.bootstrap',
  'bootstrap-tagsinput-angular'
], 
function(angular, routesConfiguration) { 'use strict';

var module = angular.module(
  'dewey', 
  [
    'ngRoute',
    'ui.bootstrap', 
    'bootstrap-tagsinput', 
    'dewey.filters', 
    'dewey.directives',
    'dewey.services',
    'dewey.controllers'
  ]);

// Configure routes
module.config(routesConfiguration);

// Configure logging
// TODO: Should be enabled/disabled based on url or somehow differently
module.config(function($logProvider) {
  $logProvider.debugEnabled(true); 
});

return module;

});