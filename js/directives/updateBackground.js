define(
[
    'jQuery',
    'underscore',
    'color-thief'
],
function($, _, ColorThief) { 'use strict';

var myUpdateBackgroundFactory = function(appSettings, $http) {
    var thief = new ColorThief();

    var updateThumbnailColor = function(element){
        var favicon = element.parent().find('img.favicon');

        function updateColor() {
            var color = null;
            try {
                color = thief.getColor(favicon.get(0));
            } catch(e) {}

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
                var requestedUrl = scope.bookmark.url.split(/[?#]/).shift();
                var url = 'https://deweyapp.com/screenshot/' + encodeURIComponent(requestedUrl) + '/screenshot.jpg';
                var thumbnail = element.find('img');
                thumbnail
                .prop('src', url)
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
