define(
'controllers/editBookmark',
[
  'jQuery', 
  'bookmarksApp', 
  'angular', 
  'bootstrap', 
  'ui-bootstrap'
], 
function($, bookmarksApp, angular) {
'use strict';

var editBookmarkController = function ($scope, $modalInstance, bookmark) {
  $scope.bookmark = bookmark;
  $scope.editTag = { tagName: ''}; 

  $scope.save = function() {
    $modalInstance.close($scope.editTag.tagName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

bookmarksApp.controller(
  'editBookmarkController', 
  [
    '$scope', 
    '$modalInstance', 
    'bookmark', 
    editBookmarkController
  ]);

});