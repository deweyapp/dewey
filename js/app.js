angular.module('Bookmarks', []).
  filter('bookmarksFilter', function($filter) {
    var standardFilter = $filter('filter');
    return function(input, search) {
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
        return standardFilter(input, search);
      } else {
        return standardFilter(input, expression);
      }
    } 
  });


function AppCtrl($scope) {
  $scope.bookmarks = [];

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
                $scope.bookmarks.push({
                    title: c.title,
                    url: c.url,
                    tags: angular.copy(tags),
                    date: c.dateAdded
                });
            }
        });
    }
  }

  chrome.bookmarks.getTree(function(tree) {
    var tags = [];
    enumerateChildren(tree, tags);
    $scope.$apply();
  });
 
  
}
