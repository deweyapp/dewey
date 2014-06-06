define(
[
  'jQuery',
  'color-thief'
],
function($, ColorThief) { 'use strict';

var myUpdateBackgroundFactory = function(appSettings) {
  var thief = new ColorThief();

  return function(scope, element, attrs) {
    scope.$watch(attrs.dLoad, function(value) {
      element.on('load', function() {
        var color = null;

        try {
          color = thief.getColor(element.get(0));
        } catch(e) {}


        var backgrounds = [];

        if (appSettings.showThumbnails) {
          backgrounds.push(
            'url(\'http://api.snapito.com/web/sapuk-363c81e6-0e5e082b-73e5544a-71f3-4f05fc39-3/250x188?url=' +
              encodeURIComponent(scope.bookmark.url) +
              '&delay=1&freshness=-1\')'
          );
        }

        backgrounds.push(color ? 'rgb(' + color.join(',') + ')' : 'white');

        var thumbnail = $('.thumbnail-loading', element.parent().parent().parent());
        thumbnail
          .removeClass('thumbnail-loading')
          .addClass('thumbnail')
          .css('background', backgrounds.join(', '));
      });
    });
  };
};

return [
  'appSettings',
  myUpdateBackgroundFactory
];

});