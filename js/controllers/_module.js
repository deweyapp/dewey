define(
[
'angular',
'./main',
'./editBookmark'
],
function(angular, mainCtrl, editBookmarkCtrl) { 'use strict';

// Creates `dewey.controllers` module
var module = angular.module('dewey.controllers', ['dewey.services']);

// Register main controller
module.controller('mainController', mainCtrl);

// Register editBookmark controller
module.controller('editBookmarkController', editBookmarkCtrl);

});