#!/bin/bash

zip -r webstore/published/chrome-bookmarks\($(date +"%F")\).zip ./ \
  -i css/bootstrap-theme.min.css \
  -i css/bootstrap.min.css \
  -i css/font-awesome.min.css \
  -i css/style.css \
  -i fonts/*.woff \
  -i js/lib/angular.min.js \
  -i js/lib/jquery-2.0.3.min.js \
  -i js/lib/bootstrap.min.js \
  -i js/lib/require.js \
  -i js/lib/ui-bootstrap-custom-tpls-0.6.0-SNAPSHOT.min.js \
  -i js/filters/*.js \
  -i js/controllers/*.js \
  -i js/*.js \
  -i partials/*
  -i app.html \
  -i icon_*.png \
  -i manifest.json \
  /
