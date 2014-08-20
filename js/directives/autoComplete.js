define(['jQuery'], function ($) {
    'use strict';

    var AutoCompleteFactory = function(booleanSearchEngine) {
        return {
            restrict: 'A',
            link: function($scope, $element) {

                $element.autocomplete({
                    source: ['One', 'Two', 'Three'],
                    minLength: 1
                });
            }
        };
    };

    return AutoCompleteFactory;
});