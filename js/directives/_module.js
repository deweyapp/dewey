define(
[
'angular',
'./updateBackground',
'./exportBookmark'
],
function(angular, updateBackgroundFactory, exportBookmarkFactory) { 'use strict';

// Creates `dewey.directives` module
var module = angular.module('dewey.directives', []);

// Register update background directive
module.directive('myUpdateBackground', updateBackgroundFactory);

// Register export bookmark directive
module.directive('exportBookmark', exportBookmarkFactory);
});