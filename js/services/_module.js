define(
[
'angular',
'./bookmarksStorage',
'./booleanSearchEngine',
'./settings',
'./exporter'
],
function(angular, bookmarksStorage, booleanSearchEngine, settings, exporter) { 'use strict';

// Creates new module 'dewey.filters'
var module = angular.module('dewey.services', []);

// Register bookmarksStorage service
module.factory('bookmarksStorage', bookmarksStorage);

// Register booleanSearchEngine service
module.factory('booleanSearchEngine', booleanSearchEngine);

// Register settings service
module.value('appSettings', settings);

// Register export to Netscape service
module.factory('exporter', exporter);

});