define(
[
    'jQuery',
    'underscore',
    'color-thief'
],
function($, _, ColorThief) { 'use strict';

var myUpdateBackgroundFactory = function(appSettings, $http) {
    var thief = new ColorThief();

    var updateThumbnail = function(element, url){
        var background = 'url(' + url + ')';
        
        var thumbnail = $('.thumbnail-loading', element.parent());
        thumbnail
            .removeClass('thumbnail-loading')
            .addClass('thumbnail')
            .css('background', background);
    };

    var updateThumbnailColor = function(element){
        var color = null;
        try {
            color = thief.getColor(element.get(0));
        } catch(e) {}

        var background = color ? 'rgb(' + color.join(',') + ')' : 'white';

        var thumbnail = $('.thumbnail-loading', element.parent());
        thumbnail
          .removeClass('thumbnail-loading')
          .addClass('thumbnail')
          .css('background', background);
    };

    var requestThumbnail = function(element, url) {

        return $http({
            url: 'http://dewey-server.azurewebsites.net/screenshot?query=' +
            encodeURIComponent(url),
            method: "GET",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).success(function(responseData) {
            //updateThumbnail(element, responseData.image_url);
            if (responseData.status === "processing") {
                // Server processing results, let's try later in 3 seconds,
                // but not more than 40 times (120 seconds)
                if (tries <= 40) {
                    setTimeout(function() {
                        requestThumbnail(element, url, ++tries);
                    }, ((parseInt(responseData.estimated_need_time) || 2) + 1) * 1000);
                }
            } else if(responseData.status === "finished" && responseData.image_url){
                // Finished, let's update thumbnail
                updateThumbnail(element, responseData.image_url);
            }
        });
    };

    return function(scope, element, attrs) {
        // request thumbnails separately from favicons
        if (appSettings.showThumbnails) {
            requestThumbnail(element, scope.bookmark.url);
        }
        else{
            scope.$watch(attrs.dLoad, function(value) {
                element.on('load', function() {               
                    updateThumbnailColor(element);                
                });
            });
        }
    };
};

return [
    'appSettings',
    '$http',
    myUpdateBackgroundFactory
];

});
