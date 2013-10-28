define(
'controllers/main',
[
  'jQuery', 
  'bookmarksApp', 
  'angular', 
  'bootstrap', 
  'ui-bootstrap',
  'filters/fieldsFilter',
  'controllers/editBookmark'
], 
function($, bookmarksApp) {
'use strict';

/*
* Application controller.
*/
var AppCtrl = function($scope, $filter, $modal) {
  
  // Constant: default value of how many items we want to display on main page.
  var defaultTotalDisplayed = 30;

  $scope.searchText = ''; // Search text
  $scope.bookmarks = []; // All bookmarks
  $scope.orders = [ // Different sorting orders
                    {title:'Title', value: 'title'}, 
                    {title:'Date created', value: 'date'},
                    {title:'Url', value: 'url'}
                  ];
  $scope.currentOrder = $scope.orders[0]; // title is default sorting order

  // Maximum number of items currently displayed
  $scope.totalDisplayed = defaultTotalDisplayed;

  $scope.selectedIndex = 0;

  // Repository for custom tags
  var customTags = {};

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
  }

  var isElementInViewport = function(el) {
    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= $(window).height() && rect.right <= $(window).width();
  }

  // Key down events handlers
  $(window).keydown(function(e) {
    var updated = false;
    if (e.which === 13) { // Enter press on page - go to the selected bookmark
      var result = getFilteredBookmarks();
      if (result.length > $scope.selectedIndex) {
        window.location.href = result[$scope.selectedIndex].url;
      } 
    } else if (e.which === 38) { // Up arrow key
      if ($scope.selectedIndex > 0) {
        $scope.selectedIndex--;
        updated = true;
      }
    } else if (e.which === 40) { // Down arrow key
      if (getAllPanels().length > $scope.selectedIndex + 1) {
        $scope.selectedIndex++;
        updated = true;
      }
    }
    if (updated) { // key up or key down pressed - select next element
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
  }

  // Recursive bookmarks traversal (we use folders as tags)
  var enumerateChildren = function(tree, tags) {
    if (tree) {
        angular.forEach(tree, function(c) {
            if (typeof c.url === 'undefined') {
                var t = angular.copy(tags);
                if (c.title) {
                    t.push(c.title);
                }
                enumerateChildren(c.children, t);
            } else {
                var bookmark = {
                    title: c.title,
                    url: c.url,
                    tag: [],
                    date: c.dateAdded,
                    id: c.id
                };

                angular.forEach(tags, function(tag) {
                  bookmark.tag.push({text: tag, custom: false});
                });

                if (customTags[bookmark.id]) {
                  angular.forEach(customTags[bookmark.id], function(tag){
                    bookmark.tag.push({text: tag, custom: true});
                  });
                }

                $scope.bookmarks.push(bookmark);
            }
        });
    }
  }

  // Get first custom tags and after this start bookmarks traversal.
  chrome.storage.sync.get('customTags', function(data) {
    if (data && data.customTags) {
      customTags = data.customTags;
    }

    chrome.bookmarks.getTree(function(tree) {
      var tags = [];
      enumerateChildren(tree, tags);
      $scope.$apply();
    });
  });

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
    $scope.searchText = 'tag:' + tag;
  };

  // Change sorting order
  $scope.changeOrder = function(order) {
    $scope.currentOrder = order;
    resetView();
  };

  // Show modal dialog for adding tags
  $scope.addTag = function(bookmark) {
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

    modalInstance.result.then(function (newTag) {
      if (newTag && newTag.length > 0) {
        bookmark.tag.push({ text: newTag, custom: true});
        if (!customTags[bookmark.id]) {
          customTags[bookmark.id] = []
        }

        customTags[bookmark.id].push(newTag);

        chrome.storage.sync.set({'customTags': customTags});
      }
    }, function () {
      
    });
    
    return false;
  };

  // Remove all custom tags for bookmark
  $scope.removeCustomTag = function(bookmark) {
    var tags = [];
    for (var i = bookmark.tag.length - 1; i > 0; i--) {
      if (bookmark.tag[i].custom) {
        bookmark.tag.splice(i, 1);
      }
    }
    if (customTags[bookmark.id]) {
      delete customTags[bookmark.id];
    }

    chrome.storage.sync.set({'customTags': customTags});
  };

  $scope.selectBookmark = function(index) {
    $scope.selectedIndex = index;
  }
}

bookmarksApp.controller('mainController', ['$scope', '$filter', '$modal', AppCtrl]);

});

