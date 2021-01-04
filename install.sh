#! /usr/bin/bash

#set -x

function install {
  set -x

  if [[ ! -e $STATIC_DATA ]]; then
    mkdir -p $STATIC_DATA
  fi

  cp js/*.js $STATIC_DATA/js/
  cp lib/*.js $STATIC_DATA/lib/
  cp index.html $STATIC_DATA
  cp images/*.jpg $STATIC_DATA/images/

  chown -R nginx: $STATIC_DATA

  chcon -Rt httpd_sys_content_t $STATIC_DATA

  cp config/triangle.conf /etc/nginx/conf.d/

  nginx -s reload

  set +x
}

function update {
  set -x

  cp js/*.js $STATIC_DATA/js/
  cp lib/*.js $STATIC_DATA/lib/
  cp index.html $STATIC_DATA
  cp images/*.jpg $STATIC_DATA/images/

  set +x
}

if [ $# -gt 0 ]; then
  if [ $EUID -ne 0 ]; then
    echo "This script must be run using sudo"
    exit
  fi
  STATIC_DATA=/usr/share/nginx/triangle
  if [ ${1} = "install" ]; then
    install
  fi
  if [ ${1} = "update" ]; then
    update
  fi
else
  echo "usage ${0} [command]"
  echo " - install"
fi

