#! /usr/bin/bash

#set -x

function install {
  if [ $EUID -ne 0 ]; then
    echo "This script must be run using sudo"
    exit
  fi

  set -x

  STATIC_DATA=/usr/share/nginx/triangle

  cp js/*.js $STATIC_DATA
  cp html/index.html $STATIC_DATA

  chown -R nginx: $STATIC_DATA

  chcon -Rt httpd_sys_content_t $STATIC_DATA

  cp ./triangle.conf /etc/nginx/conf.d/

  set +x
}

if [ $# -gt 0 ]; then
  if [ ${1} = "install" ]; then
    install
  fi
else
  echo "usage ${0} [command]"
  echo " - install"
fi

