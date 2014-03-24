define(
'services/booleanSearchEngine',
[
  'underscore',
  'bookmarksApp'
],
function(_, bookmarksApp) { "use strict";

/*
* Boolean search engine.
*/
var BooleanSearchEngine = function () {

	var andExpression = 'and';
    var patterns = ['tag', 'url', 'title'];
    var tagPattern = 'tag';
	var bookmarks = {};

	// Compress some whitespaces to one. Defaults to whitespace characters.
	var clean = function(input, characters){
		if (!angular.isString(input)) return input;

        if (!characters) characters = '\\s';
        
        return String(input).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    };

	// Trims defined characters from begining and ending of the string. Defaults to whitespace characters.
    var trim = function(input, characters){
    	if (!angular.isString(input)) return input;
        
        if (!characters) characters = '\\s';
        
        return String(input).replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
    };

    // Checks if string is blank or not.
    var isBlank = function(str){
        if (str == null) str = '';
        return (/^\s*$/).test(str);
    };

    // Splits input string by words. Defaults to whitespace characters.
    var words = function(str, delimiter) {
        if (isBlank(str)) return [];
        return trim(str, delimiter).split(delimiter || /\s+/);
    };

    var evaluateExpression = function(bookmark, searchText){
        // check on pattern
        var hasExpression = searchText.indexOf('tag:') != -1;
        // check if flitered
        if(!hasExpression){
            var filteredValue = _.find(_.values(bookmark), function(propertyValue){
                return propertyValue.toString().indexOf(searchText) != -1;
            });
            return filteredValue != null;
        }

    };

	this.filterBookmark = function(bookmark, searchText){
		// var search = searchText;
		var search = '181.100';
		if(!search) return true;

        return evaluateExpression(bookmark, search);

		//var cleanSearch = clean(search);
		var searchWords = words(search, andExpression);


		var s = bookmark.title.indexOf(search) != -1;
		return s;
	};
};

/*
* Boolean search engine factory method.
*/
var BooleanSearchEngineFactory = function() {
  return new BooleanSearchEngine();
};

bookmarksApp.factory('booleanSearchEngine', BooleanSearchEngineFactory);

});