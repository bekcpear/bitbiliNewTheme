#!/bin/bash
#

mkdir -p dist/assets/{js,css,icons} \
  && cp -a src/templates dist/ && cp -a src/fa-icons/fa dist/assets/icons/

cp node_modules/workbox-window/build/workbox-window.prod.mjs* dist/assets/js/
