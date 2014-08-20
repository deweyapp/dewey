define(['jQuery'], function ($) {
    'use strict';

    var AutoCompleteFactory = function(booleanSearchEngine) {
        return {
            restrict: 'A',
            link: function($scope, $element) {

                $scope.$watch(
                    function(){ return $scope.searchText; },
                    function(newValue){

                        var suggestions = booleanSearchEngine.getFilteredBookmarks($scope.bookmarks, $scope.searchText, $scope.tags);

                        $element.autocomplete({
                            minLength: 1,
                            source: suggestions,
                            select: function(event, ui) {

                                $scope.$apply(function () { $scope.searchText = ui.item.label; });
                            }
                        });
                });


            }
        };
    };

    return AutoCompleteFactory;
});