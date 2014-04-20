define(
[
  'underscore'  
],
function(_) { "use strict";

/*
* Boolean search engine.
*/
var BooleanSearchEngine = function () {

    var exTree;
    var andExpression = 'and';
    var nonePattern = 'none';
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
    
    // Generate expression tree by search text.    
    this.generateExpressionTree = function(searchText, callback){

        if(isBlank(searchText)) return exTree;

        var searchWords = searchText.split(/(tag:|title:|url:)/);
        if(_.isEmpty(searchWords))
            return exTree;

        exTree = [];
        var node = { pattern: nonePattern, literals:[] };
        var literal = { text: '', expression: nonePattern};
        
        _.each(searchWords, function(word){
            if(isBlank(word)) return;

            if(_.isEqual(word, andExpression)){
                
                literal.expression = andExpression;
                return;
            }
            
            var pattern = _.find(patterns, function(it){ return word.indexOf(it) != -1; });
            if(!_.isUndefined(pattern)){
                // flush node
                if(node.literals.length !== 0) exTree.push(node);

                // create a new node
                node = {                    
                    pattern: pattern,
                    literals:[]
                };

                return;
            }

            var exps = word.toLowerCase().split(/(and|or)/);
            _.each(exps, function(item){
                if(isBlank(word)) return;

                if(item === andExpression){
                    if(isBlank(literal.text)) return;

                    literal.expression = andExpression;
                    node.literals.push(literal);

                    literal = null;
                }
                else if(item === 'or'){
                    if(isBlank(literal.text)) return;

                    literal.expression = 'or';
                    node.literals.push(literal);

                    literal = null;
                }
                else{
                    literal = {
                        expression: nonePattern,
                        text: trim(item)
                    };
                }
            });

            if(!isBlank(literal.text)) node.literals.push(literal);
        });

        exTree.push(node);

        return exTree;
    };

    // Check that bookmark could be reached by following expression.
    var evaluateExpression = function(bookmark, node){
        if(node.pattern === nonePattern && node.literals.length === 1){
            var literal = node.literals[0];
            var filteredValue = _.find(_.values(bookmark), function(propertyValue){
                return propertyValue.toString().indexOf(trim(literal.text)) != -1;
            });
            return !_.isUndefined(filteredValue);
        }

        var evaluateFunc;
        if(node.pattern === 'tag:'){
            evaluateFunc = function(word){ return !containsTag(bookmark.tag, word); };
        }
        else if(node.pattern === 'title:'){
            evaluateFunc = function(word){ return !containsTitle(bookmark.title, word); };
        }
        else if(node.pattern === 'url:'){
            evaluateFunc = function(word){ return !containsUrl(bookmark.url, word); };
        }

        var failureWord = _.find(node.literals, function(literal){
            return evaluateFunc(literal.text);
        });

        return _.isUndefined(failureWord);
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