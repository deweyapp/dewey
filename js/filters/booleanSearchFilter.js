define(
'filters/booleanSearchFilter',
['bookmarksApp'], 
function(bookmarksApp) { 'use strict';

bookmarksApp.filter('booleanSearchFilter', function($filter) {
		var standardFilter = $filter('filter');
		var orderBy = $filter('orderBy');

		// Compress some whitespaces to one. Defaults to whitespace characters.
		var clean = function(input, characters){
			if (!angular.isString(input)) {
                return input;
            }

            if (!characters) {
                characters = '\\s';
            }

            return String(input).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
        };

        // Trims defined characters from begining and ending of the string. Defaults to whitespace characters.
        var trim = function(input, characters){
			if (!angular.isString(input)) {
                return input;
            }

            if (!characters) {
                characters = '\\s';
            }

            return String(input)
                .replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
        };

        var isBlank = function(str){
	    	if (str == null) str = '';
	    	return (/^\s*$/).test(str);
	    };

        var words = function(str, delimiter) {
	    	if (isBlank(str)) return [];
	    	return trim(str, delimiter).split(delimiter || /\s+/);
	    };

		return function(input, search, order) {
			var expression = {};

			if (search) {
				var cleanSearch = clean(search);
				var searchWords = words(cleanSearch, ':');
			}

			return orderBy(standardFilter(input, expression), order, order === 'date');
		};
  });
});