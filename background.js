var resultsList = [],
    unlikely = "dewey";

// Return the suggestions
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {

    chrome.bookmarks.search(text, function(searchResults) {

        resultsList = [];

        for (var i = 0; i < searchResults.length; i++) {

            var item = searchResults[i];
            if(item.url === void 0) continue;

            /* jshint scripturl:true */
            if(item.url.substring(0, 11) === 'javascript:') continue;

            resultsList.push({
                content:     unlikely + item.url,
                description: item.title.replace(new RegExp("(" + text + ")", "gi"), "<match>$1</match>")
            });
        }

        var defaultSuggestion = '';
        if(resultsList.length > 0){
            defaultSuggestion = resultsList[0].description;
            suggest(resultsList.slice(1, -1));
        }
        chrome.omnibox.setDefaultSuggestion({ description: defaultSuggestion });
    });
});

chrome.omnibox.onInputEntered.addListener( function(text) {

    // If text doesn't have unlikely prepended its the stupid default
    if(text.substring(0, unlikely.length) !== unlikely) {
        text = resultsList[0].content;
        chrome.tabs.update({ url: chrome.extension.getURL('app.html') + '/github' });
    }

    text = text.substring(unlikely.length); // Trim the unlikely string

    chrome.tabs.update({ url: text });
});