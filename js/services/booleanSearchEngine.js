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
        if (!_.isString(input)) return input;
        
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

    var endsWith = function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // Check that tag collection contains search.
    var containsTag = function(tags, patternText){
        
        var tag = _.find(tags, function(item){
            return item.text.indexOf(patternText) != -1;
        });

        return !_.isUndefined(tag);
    };

    // Check that title contains search.
    var containsTitle = function(title, patternText){

        return title.indexOf(trim(patternText)) != -1;
    };

    // Check that url contains search.
    var containsUrl = function(url, patternText){

        return url.indexOf(trim(patternText)) != -1;
    };

    // Check that bookmark could be reached by following expression.
    var evaluateExpression = function(bookmark, searchText){

        var pattern  = _.find(patterns, function(item){ return searchText.indexOf(item) === 0; });

        if(!pattern){
            var filteredValue = _.find(_.values(bookmark), function(propertyValue){
                return propertyValue.toString().indexOf(trim(searchText)) != -1;
            });
            return !_.isUndefined(filteredValue);
        }
        else{
            var evaluateFunc;
            var searchWords = [];
            
            var patternText = trim(searchText.substring(pattern.length));
            
            if(endsWith(patternText, ' ' + andExpression)){
                searchWords = words(patternText, ' ' + andExpression);
            } else{
                searchWords = words(patternText, ' ' + andExpression + ' ');
            }

            if(pattern === 'tag:'){
                evaluateFunc = function(word){ return !containsTag(bookmark.tag, word); };
            }
            else if(pattern === 'title:'){
                evaluateFunc = function(word){ return !containsTitle(bookmark.title, word); };
            }
            else if(pattern === 'url:'){
                evaluateFunc = function(word){ return !containsUrl(bookmark.url, word); };
            }

            var failureWord = _.find(searchWords, function(word){
                return evaluateFunc(word);
            });

            return _.isUndefined(failureWord);
        }
    };

    var searchTextForTree;
    var exTree;
    this.generate = function(searchText, callback){

        if(isBlank(searchText)) return exTree;

        // if(_.isEqual(searchTextForTree, searchText)) return exTree;

        var searchWords = words(searchText);
        if(_.isEmpty(searchWords))
            return exTree;

        var node = '';
        exTree = [];
        _.each(searchWords, function(word){

            var findPattern = _.find(patterns, function(it){ return word.indexOf(it) != -1; });
            
            if(!_.isUndefined(findPattern)) {
                if(!isBlank(node))
                    exTree.push({
                        pattern: 'none',
                        search: trim(node)
                    });
                
                node = word;
            }
            else{
                
            }           
        });

        if(!isBlank(node))
            exTree.push({
                pattern: 'none',
                search: trim(node)
            });

        return exTree;
    };

    // TODO AGRYGOR: Should be calculated one per search text.
    // Generate expression tree by search text.
    this.generateExpressionTree = function(searchText){
        
        var pattern = '';
        var expressionTree = [];
        if(isBlank(searchText)) return expressionTree;

        var search = searchText.replace('tag: ', 'tag:').replace('url: ', 'url:').replace('title: ', 'title:');
        
        var searchWords = words(search);

        if(_.isEmpty(searchWords))
            return expressionTree;
      
        _.each(searchWords, function(word){
            
            var findPattern = _.find(patterns, function(it){ return word.indexOf(it) != -1; });
            if(!_.isUndefined(findPattern)) {
                
                if(!isBlank(pattern))
                    expressionTree.push(pattern);
                
                pattern = word;
            }
            else{
                if(word.toLowerCase() === andExpression){ pattern = pattern + ' ' + word.toLowerCase() + ' '; }
                else{ pattern = pattern + word; }
            }
        });

        if(!isBlank(pattern))
            expressionTree.push(pattern);

        return expressionTree;
    };

    // Check that bookmark could be reached by following search text.
    this.filterBookmark = function(bookmark, searchText){
        
        var search = searchText;
        if(!search) return true;

        var searchWords = this.generateExpressionTree(search);
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