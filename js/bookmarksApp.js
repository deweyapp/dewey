define(['angular', 'ui-bootstrap'], function(angular) {
'use strict';

return angular.module('bookmarksApp', ['ui.bootstrap']).
config(['$routeProvider', function($routeProvider) {
   $routeProvider.when('/main', {templateUrl: 'partials/main.tpl.html', controller: 'mainController'});
   $routeProvider.otherwise({redirectTo: '/main'});
}]);

});