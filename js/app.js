angular.module('Bookmarks', []).
  filter('bookmarksFilter', function($filter) {
    var standardFilter = $filter('filter');
    var orderBy = $filter('orderBy');
    return function(input, search, order) {
      var expression = {};

      var i = 0;
      var filterExpression = null;
      var filterString = "";

      if (search) {
        while (i < search.length) {

          if (search[i] === '@') {
            var oldExpression = filterExpression;

            if (i == search.indexOf('@url:')) {
              filterExpression = "url";
            } else if (i == search.indexOf('@title:')) {
              filterExpression = "title";
            } else if (i == search.indexOf('@tags:')) {
              filterExpression = "tags";
            } 

            if (oldExpression != filterExpression) {
              i += (filterExpression.length + 2);
              expression[filterExpression] = filterString;
              filterString = '';
              continue;
            }
          }

          filterString += search[i];
          i++;
        }
      }

      if (filterExpression) {
        expression[filterExpression] = filterString;
      }

      if (!expression.title && !expression.tags && !expression.url) {
        return orderBy(standardFilter(input, search), order, order !== 'title');
      } else {
        return orderBy(standardFilter(input, expression), order, order !== 'title');
      }
    } 
  });


function AppCtrl($scope, $filter) {
  
  $scope.bookmarks = [];
  $scope.orders = [{title:'Title', value: 'title'},
                    {title:'Date created', value: 'date'},
                    {title:'Last visited', value: 'visited'},
                    {title:'Visited count', value: 'visitedCount'}
                  ];
  $scope.currentOrder = $scope.orders[0]; // visitedCount is by default
  $scope.bookmarkEdit = null;
  $scope.newTag = '';

  var customTags = {};

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
                    tags: [],
                    date: c.dateAdded,
                    visited: c.dateAdded,
                    visitedCount: 0,
                    id: c.id
                };

                angular.forEach(tags, function(tag) {
                  bookmark.tags.push({text: tag, custom: false});
                });

                if (customTags[bookmark.id]) {
                  angular.forEach(customTags[bookmark.id], function(tag){
                    bookmark.tags.push({text: tag, custom: true});
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
 
  $scope.selectTag = function(tag) {
    $scope.searchText = '@tags:' + tag;
  };

  $scope.changeOrder = function(order) {
    $scope.currentOrder = order;
  };

  $scope.addTag = function(bookmark) {
    $scope.bookmarkEdit = bookmark;
    $scope.newTag = '';
    $('#addTagModal').modal({
      keyboard: true,
      show: true
    });
    return false;
  };

  $scope.saveNewTag = function() {
    
    if ($scope.newTag && $scope.newTag.length > 0) {
      $scope.bookmarkEdit.tags.push({ text: $scope.newTag, custom: true});
      if (!customTags[$scope.bookmarkEdit.id]) {
        customTags[$scope.bookmarkEdit.id] = []
      }

      customTags[$scope.bookmarkEdit.id].push($scope.newTag);

      chrome.storage.sync.set({'customTags': customTags});
    }
    $('#addTagModal').modal('hide');
  };

  $scope.navigateToFirst = function() {
     var bookmarksFilter = $filter('bookmarksFilter');
     var result = bookmarksFilter($scope.bookmarks, $scope.searchText, $scope.currentOrder.value);
     if (result.length > 0) {
       window.location.href = result[0].url;
     } 
  };
}

$("#addTagModal").on('shown', function() {
    $(this).find("[autofocus]:first").focus();
});
