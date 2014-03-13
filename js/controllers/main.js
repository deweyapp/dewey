define(
'controllers/main',
[
  'underscore',
  'jQuery', 
  'bookmarksApp',
  'services/bookmarksStorage',
  'filters/fieldsFilter',
  'controllers/editBookmark',
  'ui.bootstrap'
], 
function(_, $, bookmarksApp) { 'use strict';

/*
* Application controller.
*/
var MainController = function($scope, $filter, $modal, bookmarksStorage) {
  
  // Constant: default value of how many items we want to display on main page.
  var defaultTotalDisplayed = 20;

  $scope.searchText = ''; // Search text
  $scope.bookmarks = []; // All bookmarks
  $scope.tags = ['tag 1', 'tag 2', 'tag 3']; // All custom tags
  $scope.orders = [ // Different sorting orders
                    {title:'Date', value: 'date'}, 
                    {title:'Title', value: 'title'}, 
                    {title:'URL', value: 'url'} 
                  ];
  $scope.currentOrder = $scope.orders[0]; // date is default sorting order

  // Maximum number of items currently displayed
  $scope.totalDisplayed = defaultTotalDisplayed;

  $scope.selectedIndex = 0; 

  $scope.hideTopLevelFolders = false;
  $scope.showThumbnails = true;

  // Auto add showing bookmarks when user scroll to page down
  var loadMorePlaceholder = $('#loadMorePlaceholder').get(0);
  $(window).scroll(function () {
    if (getFilteredBookmarks().length > $scope.totalDisplayed) {
      if (loadMorePlaceholder.getBoundingClientRect().top <= window.innerHeight) {
        $scope.totalDisplayed += defaultTotalDisplayed;
        $scope.$apply();
      }
    }
  });

  var getAllPanels = function() {
    return $('#list-bookmarks div.panel');
  };

  var isElementInViewport = function(el) {
    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= $(window).height() && rect.right <= $(window).width();
  };

  // Key down events handlers
  $('#mainContent').keydown(function(e) {
    var updated = false;
    if (e.which === 13) { // Enter press on page - go to the selected bookmark
      _gaq.push(['_trackEvent', 'Navigation', 'keydown', 'Navigation via enter']);

      // If first pattern is not our filter let's assume that user wants to search on this domain
      var match = /^(\w+)(\.\w+)?:(.+)/i.exec($scope.searchText);
      if (match && !_(['tag', 'url', 'title']).contains(match[1])) {
        window.location = 'https://' + match[1] + (match[2] || '.com') + '/?q=' + encodeURIComponent(match[3].trim());
      } else {
        var result = getFilteredBookmarks();
        if (result.length > $scope.selectedIndex) {
          window.location.href = result[$scope.selectedIndex].url;
        } 
      }
    } else if (e.which === 37) { // left arrow key
      if ($scope.selectedIndex > 0) {
        $scope.selectedIndex--;
        updated = true;
      }
    } else if (e.which === 39) { // right arrow key
      if (getAllPanels().length > $scope.selectedIndex + 1) {
        $scope.selectedIndex++;
        updated = true;
      }

    } else if (e.which === 9 && e.shiftKey) { // shift+tab key
      if ($scope.selectedIndex > 0) {
        $scope.selectedIndex--;
        updated = true;
      }
        
    } else if (e.which === 9) { // tab key
      if (getAllPanels().length > $scope.selectedIndex + 1) {
        $scope.selectedIndex++;
        updated = true;
      }
    }
    if (updated) { // right arrow, left arrow, tab, and shift+tab key pressed - select next element
      $scope.$apply();
      var panels = getAllPanels();
      var selectedElement = panels.get($scope.selectedIndex);
      if (selectedElement) {
        var rect = selectedElement.getBoundingClientRect(); // If element is not visible - scroll to it
        if (!(rect.top >= 0 && rect.left >= 0 && rect.bottom <= $(window).height() && rect.right <= $(window).width())) {
          $("body").animate({
            scrollTop: ($(panels.get($scope.selectedIndex)).offset().top - $(panels.get(0)).offset().top)
          }, 500);
        }
      }
      return false;
    }
  });

  // Get bookmarks we show on the page (in right order)
  var getFilteredBookmarks = function() {
    var bookmarksFilter = $filter('fieldsFilter');
    return bookmarksFilter($scope.bookmarks, $scope.searchText, $scope.currentOrder.value);
  };

  var loadBookmarks = function() {
    bookmarksStorage.getAll(function(bookmarks, setttings) {
      bookmarksApp.appSettings = setttings;
      $scope.hideTopLevelFolders = setttings.hideTopLevelFolders;
      $scope.showThumbnails = setttings.showThumbnails;
      $scope.bookmarks = bookmarks;
      $scope.$apply();
    }.bind(this));
  }.bind(this);
  loadBookmarks();

  // Set maximum total displayed items to default and scroll to top of the page
  var resetView = function() {
    $scope.totalDisplayed = defaultTotalDisplayed;
    $scope.selectedIndex = 0; 
    setTimeout(function() {
      window.scroll(0, 0);
    }, 10);
  };

  // When user change search string we scroll to top of the page and set total displayed items to default
  $scope.$watch('searchText', function() {
    resetView();
  });
 
  // On tag click we set search text
  $scope.selectTag = function(tag) {
    _gaq.push(['_trackEvent', 'Navigation', 'selectTag']);
    $scope.searchText = 'tag:' + tag;
  };

  // Change sorting order
  $scope.changeOrder = function(order) {
    _gaq.push(['_trackEvent', 'Navigation', 'changeOrder',  'Change order to ' + order]);
    $scope.currentOrder = order;
    resetView();
  };

  // Show modal dialog for adding tags
  $scope.editBookmark = function(bookmark) {
    _gaq.push(['_trackEvent', 'Navigation', 'editBookmark']);
     var modalInstance = $modal.open({
      scope: $scope.$new(true /* isolate */),
      templateUrl: 'partials/editBookmark.tpl.html',
      controller: 'editBookmarkController',
      resolve: {
        bookmark: function() {
          return bookmark;
        }
      },
      keyboard: true,
      backdrop: 'static'
    });

    modalInstance.result.then(function (updatedBookmark) {
      if (!updatedBookmark) {
        // Bookmark was deleted
        $scope.bookmarks.splice(_.indexOf($scope.bookmarks, bookmark), 1);
      }
    });
    
    return false;
  };

  $scope.selectBookmark = function(index) {
    $scope.selectedIndex = index;
  };

  $scope.setHideTopLevelFolders = function() {
    _gaq.push(['_trackEvent', 'ChangeSettings', 'HideTopLevelFolders changed to ' + !$scope.hideTopLevelFolders]);
    bookmarksStorage.setHideTopLevelFolders(!$scope.hideTopLevelFolders, loadBookmarks);
  };

  $scope.setShowThumbnails = function() {
    _gaq.push(['_trackEvent', 'ChangeSettings', 'ShowThumbnails changed to ' + !$scope.showThumbnails]);
    bookmarksStorage.setShowThumbnails(!$scope.showThumbnails, loadBookmarks);
  };

  $scope.filterByTag = function(tag){
    if(_.isUndefined(tag)){
      console.log('undefined');
    }
    else{
      console.log(tag);
    }
  }
};

bookmarksApp.controller('mainController', ['$scope', '$filter', '$modal', 'bookmarksStorage', MainController]);

});

