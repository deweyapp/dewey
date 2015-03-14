define(
[
  'underscore'
],
function(_) { "use strict";

/*
* Bookmark exporter service.
*/
var Exporter = function () {

    var exTree

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