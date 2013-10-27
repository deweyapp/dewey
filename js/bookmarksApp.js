define(['angular'], function(angular) {
'use strict';

return angular.module('bookmarksApp', []).
config(['$routeProvider', function($routeProvider) {
   $routeProvider.when('/main', {templateUrl: 'partials/main.tpl.html', controller: 'mainController'});
   $routeProvider.otherwise({redirectTo: '/main'});
}]);

});