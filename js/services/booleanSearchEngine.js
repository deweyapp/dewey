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
	var bookmarks = {};

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

	this.filterBookmark = function(bookmarkTitle, searchText){
		var search = searchText;
		if(!search) return true;


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