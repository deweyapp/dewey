#!/bin/bash

zip -r webstore/published/dewey\($(date +"%F")\).zip ./ \
  -i css/*.css \
  -i images/settings.svg \
  -i images/search.svg \
  -i images/edit.svg \
  -i images/loader.gif \
  -i images/edit-gray.svg \
  -i images/feedback.svg \
  -i images/review.svg \
  -i images/donate.svg \
  -i images/contact.svg \
  -i images/link.svg \
  -i images/docs.svg \
  -i images/launch.svg \
  -i images/folder.svg \
  -i images/options.svg \
  -i images/pdf.svg \
  -i images/chrome.svg \
  -i images/chrome-32.png \
  -i images/dewey-small.png \
  -i images/dewey-big.png \
  -i bower_components/angular/angular.min.js \
  -i bower_components/angular-ui-router/release/angular-ui-router.min.js \
  -i bower_components/jquery/jquery.min.js \
  -i bower_components/bootstrap/dist/js/bootstrap.min.js \
  -i bower_components/requirejs/require.js \
  -i bower_components/underscore/underscore-min.js \
  -i bower_components/ui-bootstrap/dist/ui-bootstrap-custom-tpls-0.10.0.js \
  -i bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js \
  -i bower_components/color-thief/js/color-thief.js \
  -i js/**/*.js \
  -i js/*.js \
  -i partials/*.html \
  -i app.html \
  -i icon_*.png \
  -i manifest.json \
  /
