define(
[
  'underscore'
],
function(_) { "use strict";

/*
* Bookmark exporter service.
*/
var Exporter = function () {

    // this.exportToNetscape = function(bookmarks){

    //     return angular.toJson(bookmarks);
    // };

    var header = function(){
        return '<!DOCTYPE NETSCAPE-Bookmark-file-1>'+
                '<!-- This is an automatically generated file.'+
                     'It will be read and overwritten.'+
                     'DO NOT EDIT! -->'+
                '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">'+
                '<TITLE>Bookmarks</TITLE>'+
                '<H1>Bookmarks</H1>'+
                '<DL><p>';
    };

    var footer = function(){
        return '</DL><p>';
    };

    var exportBookmark = function(bookmark){

        //<DT><A HREF="https://.apple.com/" 
        //ADD_DATE="1414706885" 
        //PRIVATE="0" 
        //TAGS="javascript,mac,osx,yosemite">JavaScript for Automation Release Notes</A>

        var tags = '';
        if(bookmark.tag.length > 0) {
            tags = _.pluck(bookmark.tag, 'text').join(',');
        }
        return '<DT><A HREF="' + bookmark.url + 
            '" ADD_DATE="' + bookmark.date +
            '" TAGS="' + tags +
            '">' + bookmark.title + '</A>';
    };

    this.exportToNetscape = function(bookmarks){

        var fileData = header();

        if(!_.isNull(bookmarks) 
            && toString.call(bookmarks) === "[object Array]"
            && bookmarks.length > 0){
            
            _.each(bookmarks, function(bookmark){
                fileData += exportBookmark(bookmark);
            });
        }
        
        fileData += footer();
        return fileData;
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