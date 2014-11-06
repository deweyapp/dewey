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
            'url(\'http://api.snapito.io/v2/webshot/spu-611151-o3bp-du0ixqlrpknnlggm?url=' +
              encodeURIComponent(scope.bookmark.url) +
              '&size=250x188&screen=1000x752&quality=low&type=jpg\')'
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