#!/bin/bash
#

set -e

_icons_path="src/fa-icons/"
_scss="src/css/var.scss"
_g_scss="$(dirname ${_scss})/generated_$(basename ${_scss})"

cp ${_scss} ${_g_scss}

IFS=$'\n'
while read -r _p; do
  _h=$(md5sum "${_icons_path}${_p}" | cut -d' ' -f1)
  eval "sed -Ei '/${_p//\//\\\/}/s/.svg/.svg?s=${_h}/' ${_g_scss}"
done <<<"$(sed -nE 's/.*url\(\/assets\/icons\/(.*)\);/\1/p' ${_g_scss})"
