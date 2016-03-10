define(
[
    'jQuery',
    'underscore',
    'color-thief'
],
function($, _, ColorThief) { 'use strict';

var myUpdateBackgroundFactory = function(appSettings, $http) {
    var thief = new ColorThief();

    var updateThumbnailColor = function(element, color){
        var favicon = element.parent().find('img.favicon');

        function updateColor() {
            if (!color) {
                try {
                    color = thief.getColor(favicon.get(0));
                } catch(e) {}
            }

            var background = color ? 'rgb(' + color.join(',') + ')' : 'white';

            element
            .removeClass('thumbnail-loading')
            .addClass('thumbnail')
            .css('background', background);
        }

        if (favicon.prop('complete')) {
            updateColor();
        } else {
            favicon
            .on('load', function() {
                updateColor();
            })
            .on('error', function() {
                favicon.hide();
                updateColor();
            });
        }
    };

    return function(scope, element, attrs) {
        scope.$watch(attrs.dLoad, function(value) {
            if (appSettings.showThumbnails) {
                // Get url without search or hash, so we will be able to cache
                var requestedUrl = scope.bookmark.url;
                var url = 'https://deweyapp.com/screenshot/' + encodeURIComponent(requestedUrl) + '/screenshot.png';
                var thumbnail = element.find('img');
                thumbnail
                .prop('src', url)
                .on('load', function() {
                    updateThumbnailColor(element, [255, 255, 255]);
                })
                .on('error', function() {
                    thumbnail.hide();
                    updateThumbnailColor(element);
                });
            } else {
                updateThumbnailColor(element);
            }
        });
    };
};

return [
    'appSettings',
    '$http',
    myUpdateBackgroundFactory
];

});
