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

        var thumbnail = $('.thumbnail', element.parent().parent().parent());
        thumbnail.css('background', background);
    };

    var updateThumbnailColor = function(element){
        var color = null;
        try {
            color = thief.getColor(element.get(0));
        } catch(e) {}

        var background = color ? 'rgb(' + color.join(',') + ')' : 'white';

        var thumbnail = $('.thumbnail-loading', element.parent().parent().parent());
        thumbnail
          .removeClass('thumbnail-loading')
          .addClass('thumbnail')
          .css('background', background);
    };

    var requestThumbnail = function(element, url) {

        return $http({
            url: 'http://dewey-server.azurewebsites.net//screenshot?query=' +
                encodeURIComponent(url),
            method: "GET",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).success(function(responseData) {
            updateThumbnail(element, responseData.image_url);
        });
    };

    return function(scope, element, attrs) {
        scope.$watch(attrs.dLoad, function(value) {
            element.on('load', function() {       

                updateThumbnailColor(element);

                if (appSettings.showThumbnails) {
                    requestThumbnail(element, scope.bookmark.url);
                }
            });
        });
    };
};

return [
    'appSettings',
    '$http',
    myUpdateBackgroundFactory
];

});
