define(
[
  'underscore'
],
function(_) { "use strict";

var OmniboxEngine = function(){

    var booleanSearchEngine,
        filteredBookmarks,
        bookmarks,
        tags;


	this.init = function(booleanSearchEngine, bookmarks, tags){

        this.booleanSearchEngine = booleanSearchEngine;
        this.bookmarks = bookmarks;
        this.tags = tags;

		chrome.omnibox.setDefaultSuggestion({
		    description: 'dew: Search the Dewey for %s'
		});

        chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
            console.log('inputChanged: ' + text);

            filteredBookmarks = booleanSearchEngine.getFilteredBookmarks(bookmarks, text, tags);
            var suggestions = [];
            _.each(filteredBookmarks, function(item, key){
                    //content: key.toString(), description: item
                // suggestions.push({
                //     content: key.toString(), description: item.toString()
                // });
                suggest([{content: key.toString(), description: item.toString()}]);
            });

            suggest(suggestions);
        });

        chrome.omnibox.onInputEntered.addListener(function(text) {
            console.log('inputEntered: ' + text);
            //alert('You just typed "' + text + '"');

            var bookmarkTitle = filteredBookmarks[parseInt(text)];
            var bookmark = _.find(bookmarks, function(item){ return item.title == bookmarkTitle; });
            window.location.href = bookmark.url;
        });
	};
};

/*
* Boolean search engine factory method.
*/
var OmniboxEngineFactory = function() {
    return new OmniboxEngine();
};

return [
	OmniboxEngineFactory
];
});