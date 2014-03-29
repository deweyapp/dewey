define(
[
  'underscore'  
],
function(_) { "use strict";

/*
* Boolean search engine.
*/
var BooleanSearchEngine = function () {

	var andExpression = 'and';
    var patterns = ['tag:', 'url:', 'title:'];
	var bookmarks = {};

	// Trims defined characters from begining and ending of the string. Defaults to whitespace characters.
    var trim = function(input, characters){
        if (!angular.isString(input)) return input;
        
        if (!characters) characters = '\\s';
        
        return String(input).replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
    };

    // Checks if string is blank or not.
    var isBlank = function(str){
        if (_.isNull(str)) str = '';
        return (/^\s*$/).test(str);
    };

    // Splits input string by words. Defaults to whitespace characters.
    var words = function(str, delimiter) {
        if (isBlank(str)) return [];
        return trim(str, delimiter).split(delimiter || /\s+/);
    };

    var evaluateExpression = function(bookmark, searchText){

        var pattern  = _.find(patterns, function(item){ return searchText.indexOf(item) === 0; });

        if(!pattern){
            var filteredValue = _.find(_.values(bookmark), function(propertyValue){
                return propertyValue.toString().indexOf(trim(searchText)) != -1;
            });
            return !_.isUndefined(filteredValue);
        }
        else{
            var patternText = trim(searchText.substring(pattern.length));
            if(pattern === 'tag:'){
                var tag = _.find(bookmark.tag, function(item){
                    return item.text.indexOf(patternText) != -1;
                });

                return !_.isUndefined(tag);
            }
            else if(pattern === 'title:'){
                return bookmark.title.indexOf(trim(patternText)) != -1;
            }
            else if(pattern === 'url:'){
                return bookmark.url.indexOf(trim(patternText)) != -1;
            }
        }
    };

    this.generateExpressionTree = function(searchText){
        
        var expressionTree = [];
        var search = searchText;
        if(isBlank(search)) return expressionTree;

        var searchWords = words(search);
        if(_.isEmpty(searchWords))
            return expressionTree;

        var pattern = '';
        _.each(searchWords, function(it){
            if(_.contains(patterns, it)) {
                if(!isBlank(pattern))
                    expressionTree.push(pattern);
                pattern = it;
            }
            else{
                pattern = pattern + it;
            }
        });

        if(!isBlank(pattern))
            expressionTree.push(pattern);

        return expressionTree;
    };

	this.filterBookmark = function(bookmark, searchText){
        
		var search = searchText;
		//var search = 'tag:  prog  and Algo';
		if(!search) return true;

		var searchWords = words(search, andExpression);
        var failureWord = _.find(searchWords, function(word){
            return !evaluateExpression(bookmark, word);
        });

        return _.isUndefined(failureWord);
	};
};

/*
* Boolean search engine factory method.
*/
var BooleanSearchEngineFactory = function() {
    return new BooleanSearchEngine();
};

return [
  BooleanSearchEngineFactory
];

});