#!/bin/bash

zip -r webstore/published/chrome-bookmarks\($(date +"%F")\).zip ./ \
  -i css/bootstrap-tagsinput.css \
  -i css/bootstrap-theme.min.css \
  -i css/bootstrap.min.css \
  -i css/font-awesome.min.css \
  -i css/style.css \
  -i fonts/*.woff \
  -i bower_components/angular/angular.min.js \
  -i bower_components/angular-ui-router/release/angular-ui-router.min.js \
  -i bower_components/jquery/jquery.min.js \
  -i bower_components/bootstrap/dist/js/bootstrap.min.js \
  -i bower_components/requirejs/require.js \
  -i bower_components/underscore/underscore-min.js \
  -i bower_components/ui-bootstrap/dist/ui-bootstrap-custom-tpls-0.10.0.js \
  -i js/lib/bootstrap-tagsinput.min.js \
  -i js/lib/bootstrap-tagsinput-angular.js \
  -i js/filters/*.js \
  -i js/controllers/*.js \
  -i js/services/*.js \
  -i js/*.js \
  -i partials/* \
  -i app.html \
  -i icon_*.png \
  -i manifest.json \
  /
