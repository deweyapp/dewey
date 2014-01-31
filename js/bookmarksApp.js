define(
[
  'angular', 
  'ui.bootstrap'
], 
function(angular) { 'use strict';

return angular.module('bookmarksApp', ['ui.router', 'ui.bootstrap', 'bootstrap-tagsinput']).
config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/main');
  $stateProvider.state(
    'main', 
    { 
      url: '/main',
      templateUrl: 'partials/main.tpl.html',
      controller: 'mainController'
    }
  );
});
});