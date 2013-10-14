#!/bin/bash

zip -r webstore/published/chrome-bookmarks\($(date +"%F")\).zip ./ \
  -i css/bootstrap-theme.min.css \
  -i css/bootstrap.min.css \
  -i css/font-awesome.min.css \
  -i css/style.css \
  -i font/fontawesome-webfont.woff \
  -i fonts/glyphicons-halflings-regular.woff \
  -i js/angular.js \
  -i js/jquery.js \
  -i js/bootstrap.min.js \
  -i js/app.js \
  -i app.html \
  -i icon_*.png \
  -i manifest.json \
  /
