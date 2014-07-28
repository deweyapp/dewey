define(
[
  'underscore'
],
function(_) { "use strict";

var OmniboxEngine = function(){

	this.init = function(){
		chrome.omnibox.setDefaultSuggestion({
		    description: 'dew: Search the Dewey for %s'
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