define(
'controllers/editBookmark',
[
  'jQuery', 
  'bookmarksApp',
  'services/bookmarksStorage',
], 
function($, bookmarksApp) { 'use strict';

var EditBookmarkController = function ($scope, $modalInstance, bookmark, bookmarksStorage) {
  $scope.bookmarkModel = {
    title: bookmark.title,
    url: bookmark.url,
    folders: _.map(_.filter(bookmark.tag, function(t) { return t.custom === false }), function(t) { return t.text }),
    customTags: _.map(_.filter(bookmark.tag, function(t) { return t.custom === true }), function(t) { return t.text }),
  }

  $scope.save = function() {
    bookmarksStorage.update(bookmark, $scope.bookmarkModel);
    $modalInstance.close(bookmark);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.delete = function() {
    if (confirm('Are you sure that you want to delete this bookmark?')) {
      bookmarksStorage.remove(bookmark);
      $modalInstance.close(null);
    }
  }
};

bookmarksApp.controller(
  'editBookmarkController', 
  [
    '$scope', 
    '$modalInstance', 
    'bookmark', 
    'bookmarksStorage',
    EditBookmarkController
  ]);

});