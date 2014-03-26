define(
[
'angular',
'./updateBackground'
],
function(angular, updateBackgroundFactory) { 'use strict';

// Creates `dewey.directives` module
var module = angular.module('dewey.directives', []);

// Register update background directive
module.directive('myUpdateBackground', updateBackgroundFactory);

});