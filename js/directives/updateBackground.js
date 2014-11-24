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

    return function(scope, element, attrs) {
        scope.$watch(attrs.dLoad, function(value) {
            element.on('load', function() {       
                
                updateThumbnailColor(element);

                if (appSettings.showThumbnails) {
          
                    $http({
                        url: 'http://api.page2images.com/restfullink?p2i_url=' +
                        encodeURIComponent(scope.bookmark.url) +
                        '&p2i_device=6&p2i_screen=1024x768&p2i_imageformat=jpg&p2i_wait=0&p2i_key=7cd903b37d087238',
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        }
                    }).success(function(responseData) {

                        if(!_.isUndefined(responseData.image_url)){
                            updateThumbnail(element, responseData.image_url);
                        }
                    });
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
