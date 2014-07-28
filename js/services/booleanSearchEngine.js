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
    var searchTextForExTree;

    var andExpression = 'AND';
    var orExpression = 'OR';
    var nonePattern = 'NONE';

    var patterns = ['TAG:', 'URL:', 'TITLE:'];

    // Trims defined characters from beginning and ending of the string. Defaults to whitespace characters.
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
    var containsTag = function(bookmark, patternText){

        // ARG: improve in future
        //return bookmark.tagsAsString.toUpperCase().indexOf(trim(patternText)) != -1;

        var tag = _.find(bookmark.tag, function(item){
            return item.text.toUpperCase().indexOf(patternText) != -1;
        });

        return !_.isUndefined(tag);
    };

    // Check that title contains search.
    var containsTitle = function(title, patternText){

        return title.toUpperCase().indexOf(trim(patternText)) != -1;
    };

    // Check that url contains search.
    var containsUrl = function(url, patternText){

        return url.toUpperCase().indexOf(trim(patternText)) != -1;
    };

    // Check that bookmark fields contain search.
    var containsField = function(bookmark, patternText){

        return containsTitle(bookmark.title, patternText) ||
                containsUrl(bookmark.url, patternText) ||
                containsTag(bookmark, patternText);
    };

    // Check that bookmark could be reached by following expression.
    var evaluateExpression = function(bookmark, node){

        if(node.pattern === nonePattern && node.literals.length === 1){
            var literal = node.literals[0];
            return containsField(bookmark, literal.text);
        }

        var evaluateFunc = function(word){ return containsField(bookmark, word); };
        if(node.pattern === 'TAG:'){
            evaluateFunc = function(word){ return containsTag(bookmark, word); };
        }
        else if(node.pattern === 'TITLE:'){
            evaluateFunc = function(word){ return containsTitle(bookmark.title, word); };
        }
        else if(node.pattern === 'URL:'){
            evaluateFunc = function(word){ return containsUrl(bookmark.url, word); };
        }

        if(node.literals.length === 1){
            return evaluateFunc(node.literals[0].text);
        }

        var result = true;
        var exp = andExpression;
        _.each(node.literals, function(literal){

            var literalResult = evaluateFunc(literal.text);
            if(exp === andExpression)
            {
                result = result && literalResult;
            }
            else if(exp === orExpression){
                result = result || literalResult;
            }
            exp = literal.expression;
        });

        return result;
    };

    // Generate expression tree by search text.
    this.generateExpressionTree = function(searchText){

        if(isBlank(searchText)) return exTree;

        searchText = searchText.toUpperCase();

        var searchWords = searchText.split(/(TAG:|TITLE:|URL:)/);
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

            var exps = word.split(/(\s+AND($|\s+)|\s+OR($|\s+))/);
            _.each(exps, function(item){
                if(isBlank(word)) return;

                if(trim(item) === andExpression){
                    if(isBlank(literal.text)) return;

                    literal.expression = andExpression;
                    node.literals.push(literal);

                    literal = null;
                }
                else if(trim(item) === orExpression){
                    if(isBlank(literal.text)) return;

                    literal.expression = orExpression;
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

    // Check that bookmark could be reached by following search text.
    this.filterBookmark = function(bookmark, searchText){

        if(!searchText) return true;

        if(!_.isEqual(this.search, searchText)){
            this.search = searchText;
            this.generateExpressionTree(this.search);
        }

        // Improve performance for simple search case
        if(exTree.length === 1){
            return evaluateExpression(bookmark, exTree[0]);
        }

        if(exTree.length > 1){
            var failureNode = _.find(exTree, function(node){
                return !evaluateExpression(bookmark, node);
            });

            return _.isUndefined(failureNode);
        }
        return false;
    };

    // Filter bookmark collection by search test or expression
    this.getFilteredBookmarks = function(bookmarks, newSearchText, tags){

        var pattern = 'NONE';
        var searchText = newSearchText;
        var definedSearch = newSearchText;

        var expressionTree = this.generateExpressionTree(newSearchText);
        if (expressionTree && expressionTree.length > 0) {

            var node = _.last(expressionTree);

            if (node) {

                var lastLiteral = _.last(node.literals);
                pattern = node.pattern;

                searchText = (lastLiteral && lastLiteral.expression === 'NONE' ? lastLiteral.text : '');

                definedSearch = newSearchText.replace(/\s+$/, '');
                definedSearch = definedSearch.substr(0, newSearchText.length - searchText.length);
                if (definedSearch.length > 0) {
                    definedSearch += ' ';
                }
            }
        }

        if (pattern === 'NONE') {
            pattern = 'TITLE:';
        }

        var chain;

        if (pattern === 'TITLE:') {
            chain = _.chain(bookmarks)
                .map(function(b) {
                    return b.title;
                });
        } else if (pattern === 'TAG:') {
            chain = _.chain(tags)
                .map(function(t) {
                    return t.tagText;
                });
        } else if (pattern === 'URL:') {
            chain = _.chain(bookmarks)
                .map(function(b) {
                return b.url;
                });
        }

        if (!chain) {
            return [];
        }

        return chain
            .filter(function(t) {
                return t.toUpperCase().indexOf(searchText.toUpperCase()) >= 0;
            })
            .sortBy(function(t) {
                return t;
            })
            .first(25)
            .map(function(t) {
                return definedSearch + t;
            }).value();
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