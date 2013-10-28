define(
'controllers/editBookmark',
[
  'jQuery', 
  'bookmarksApp'
], 
function($, bookmarksApp) {
'use strict';

var EditBookmarkController = function ($scope, $modalInstance, bookmark) {
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
    EditBookmarkController
  ]);

});