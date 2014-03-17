define(
[
/* No dependencies */
],
function() { 'use strict';

/* 
* Filter split search string on fields conditions and after that 
* uses them to build special expression for default AngularJS filter.
*
* For example:
*
* - When search string is "search string" - filter will try to find a match in any object field.
* - When search string is "tag:search string" - filter will try to find a match only in object `tag` property.
* - When search string is "search title tag:search tag" - filter will try to find a match for 'search tag' in object `tag` property
* an 'search title' in `title` field.
*/

var complexFactory = function($filter) {
  var angularFilter = $filter('filter');
  var angularOrderBy = $filter('orderBy');

  return function(input, search, order) {
    var expression = {};

    var filterExpression = null;
    var filterString = '';

    if (search) {
      // Trying to parse search string by fields
      var pattern = '';
      var field = null; 
      var hasExpressions = false;
      for (var i = (search.length - 1); i >= 0; i--) {
        if (search[i]  === ':') {
          field = '';
          continue;
        } 

        if (field !== null) {
          if (search[i] === ' '){
            expression[field] = pattern;
            hasExpressions = true;
            field = null;
            pattern = '';
            continue;
          } else {
            field = search[i] + field;
            continue;
          }
        } else {
            pattern = search[i] + pattern;
        }
      }

      if (field !== null) {
        expression[field] = pattern;
        hasExpressions = true;
      } else {
        if (hasExpressions) {
          expression.title = pattern;
        } else {
          expression = pattern;
        }
      }
    }

    return angularOrderBy(angularFilter(input, expression), order, order === 'date');
  };
};

return [
  '$filter',
  complexFactory
];

});