define(
[
'angular',
'./bookmarksStorage',
'./booleanSearchEngine',
'./settings'
],
function(angular, bookmarksStorage, booleanSearchEngine, settings) { 'use strict';

// Creates new module 'dewey.filters'
var module = angular.module('dewey.services', []);

// Register bookmarksStorage service
module.factory('bookmarksStorage', bookmarksStorage);

// Register booleanSearchEngine service
module.factory('booleanSearchEngine', booleanSearchEngine);

// Register settings service
module.value('appSettings', settings);

});