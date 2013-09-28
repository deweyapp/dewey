function AppCtrl($scope) {
  $scope.bookmarks = [];

  var enumerateChildren = function(tree, tags) {
    if (tree) {
        angular.forEach(tree, function(c) {
            if (typeof c.url === 'undefined') {
                if (c.title) {
                    tags.push(c.title);
                }
                enumerateChildren(c.children, tags);
            } else {
                $scope.bookmarks.push({
                    text: c.title,
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
