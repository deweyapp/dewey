define(
[
'angular',
'./omniboxEngine',
'./bookmarksStorage',
'./booleanSearchEngine',
'./settings'
],
function(angular, omniboxEngine, bookmarksStorage, booleanSearchEngine, settings) { 'use strict';

// Creates new module 'dewey.filters'
var module = angular.module('dewey.services', []);

// Register bookmarksStorage service
module.factory('bookmarksStorage', bookmarksStorage);

// Register booleanSearchEngine service
module.factory('booleanSearchEngine', booleanSearchEngine);

// Register omniboxEngine service
module.factory('omniboxEngine', omniboxEngine);

// Register settings service
module.value('appSettings', settings);

});