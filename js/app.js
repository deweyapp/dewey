angular.module('Bookmarks', []).
  /* 
  * Filter split search string on fields conditions and after that 
  * uses them to build special expression for default AngularJS filter.
  *
  * For example:
  *
  * - When search string is "search string" - filter will try to find a match in any object field.
  * - When search string is "tag:search string" - filter will try to find a match only in object `tag` property.
  * - When search string is "search title tag:search tag" - filter will try to find a match for 'search tag' in object `tag` property
  * an 'search title' in `title` field.
  *
  */
  filter('bookmarksFilter', function($filter) {
    var standardFilter = $filter('filter');
    var orderBy = $filter('orderBy');
    return function(input, search, order) {
      var expression = {};

      var i = 0;
      var filterExpression = null;
      var filterString = "";

      if (search) {
        // Trying to parse search string by fields
        var pattern = '';
        var field = null; 
        var hasExpressions = false;
        for (var i = (search.length - 1); i >= 0; i--) {
          if (search[i]  === ':') {
            field = '';
            continue;
          } 

          if (field !== null) {
            if (search[i] === ' '){
              expression[field] = pattern;
              hasExpressions = true;
              field = null;
              pattern = '';
              continue;
            } else {
              field = search[i] + field;
              continue;
            }
          } else {
            pattern = search[i] + pattern;
          }
        }

        if (field !== null) {
          expression[field] = pattern;
          hasExpressions = true;
        } else {
          if (hasExpressions) {
            expression['title'] = pattern;
          } else {
            expression = pattern;
          }
        }
      }

      return orderBy(standardFilter(input, expression), order, order !== 'title');
    } 
  });

/*
* Application controller.
*/
function AppCtrl($scope, $filter) {
  
  // Constant: default value of how many items we want to display on main page.
  var defaultTotalDisplayed = 30;

  $scope.searchText = ''; // Search text
  $scope.bookmarks = []; // All bookmarks
  $scope.orders = [{title:'Title', value: 'title'}, // Different sorting orders
                    {title:'Date created', value: 'date'},
                    {title:'Last visited', value: 'visited'},
                    {title:'Visited count', value: 'visitedCount'}
                  ];
  $scope.currentOrder = $scope.orders[0]; // visitedCount is default sorting order

  // Edit tag dialog models
  $scope.bookmarkEdit = null; // selected bookmark (for dialog)
  $scope.newTag = ''; 

  // Maximum number of items currently displayed
  $scope.totalDisplayed = defaultTotalDisplayed;

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

  // Place focus on input when show dialog
  $("#addTagModal").on('shown', function() {
    $(this).find("[autofocus]:first").focus();
  });

  // Get bookmarks we show on the page (in right order)
  var getFilteredBookmarks = function() {
    var bookmarksFilter = $filter('bookmarksFilter');
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
                    visited: c.dateAdded,
                    visitedCount: 0,
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

                chrome.history.search({text: c.url}, function(history) {
                  var visitedCount 
                  angular.forEach(history, function(hItem) {
                    if (hItem.lastVisitTime > bookmark.visited) {
                      bookmark.visited = hItem.lastVisitTime;
                    }

                    bookmark.visitedCount += hItem.visitCount;
                  })
                });

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
    setTimeout(function() {
      window.scroll(0, 0)
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
    $scope.bookmarkEdit = bookmark;
    $scope.newTag = '';
    $('#addTagModal').modal({
      keyboard: true,
      show: true
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

  // Handler for saving custom tag for selected bookmark
  $scope.saveNewTag = function() {
    
    if ($scope.newTag && $scope.newTag.length > 0) {
      $scope.bookmarkEdit.tag.push({ text: $scope.newTag, custom: true});
      if (!customTags[$scope.bookmarkEdit.id]) {
        customTags[$scope.bookmarkEdit.id] = []
      }

      customTags[$scope.bookmarkEdit.id].push($scope.newTag);

      chrome.storage.sync.set({'customTags': customTags});
    }
    $('#addTagModal').modal('hide');
  };

  // Navigate to first showing bookmark (use it as an enter handler)
  $scope.navigateToFirst = function() {
     var result = getFilteredBookmarks();
     if (result.length > 0) {
       window.location.href = result[0].url;
     } 
  };
}