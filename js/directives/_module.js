define(
[
'angular',
'./updateBackground',
'./autoComplete'
],
function(angular, updateBackgroundFactory, autoComplete) { 'use strict';

// Creates `dewey.directives` module
var module = angular.module('dewey.directives', []);

// Register update background directive
module.directive('myUpdateBackground', updateBackgroundFactory);
module.directive('autoComplete', autoComplete);

});