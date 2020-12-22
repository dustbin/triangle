#! /usr/bin/bash

#set -x

function install {
  set -x

  cp js/*.js $STATIC_DATA
  cp html/index.html $STATIC_DATA

  chown -R nginx: $STATIC_DATA

  chcon -Rt httpd_sys_content_t $STATIC_DATA

  cp ./triangle.conf /etc/nginx/conf.d/

  set +x
}

function update {
  set -x

  cp js/*.js $STATIC_DATA
  cp html/index.html $STATIC_DATA

  nginx -s reload
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

