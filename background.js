var resultsList = [],
    unlikely = "GOSHDARNYOUCHROME";

// Return the suggestions
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    // Search the bookmarks
    suggest([
      {content: unlikely + "http://www.ii.gl/", description: "the first one (ASDF 1)"},
      {content: unlikely + "http://www.google.com/", description: "the second entry (ASDF 1)"}
    ]);
});

// Activate the selection on submit
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    // If text doesn't have unlikely prepended its the stupid default
    if(text.substring(0, unlikely.length) !== unlikely) {
      text = resultsList[0].content;
    }

    text = text.substring(unlikely.length); // Trim the unlikely string

    if (text.substring(0, 11) == "javascript:") {
      chrome.tabs.executeScript(null, { code: decodeURIComponent(text) });
    } else {
      chrome.tabs.update({ url: text });
    }
  }
);