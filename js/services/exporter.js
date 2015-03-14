define(
[
  'underscore'
],
function(_) { "use strict";

/*
* Bookmark exporter service.
*/
var Exporter = function () {

    this.exportToNetscape = function(bookmarks){

        return angular.toJson(bookmarks);
    };
};

/*
* Bookmark exporter service factory method.
*/
var ExporterFactory = function() {
    return new Exporter();
};

return [
    ExporterFactory
];

});