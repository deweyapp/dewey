define(
'filters/booleanSearchFilter',
[
	'underscore',
	'bookmarksApp'
], 
function(_, bookmarksApp) { 'use strict';

bookmarksApp.filter('booleanSearchFilter', function($filter) {
		var standardFilter = $filter('filter');
		var orderBy = $filter('orderBy');

		this.andExpression = 'and';
		var orExpression = 'or';

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

	    var comperator = function(obj){
				return true;
			};

		return function(input, search, order) {
			var searchWords = [];

			if (search) {
				var cleanSearch = clean(search);
				searchWords = words(cleanSearch);
			}

			

			return orderBy(standardFilter(input, function(obj, searchWords){
				return true;
			}), order, order === 'date');
		};
  });
});












