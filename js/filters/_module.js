define(
[
'angular',
'./complex'
],
function(angular, complexFilter) { 'use strict';

// Creates new module 'dewey.filters'
var module = angular.module('dewey.filters', []);

// Register complex filter
module.filter('complex', complexFilter);

});