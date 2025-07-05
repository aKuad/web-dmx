#!/usr/bin/env sh

direction="$1"

if [ "$direction" = "" ]; then
  echo "0. cube-mx     -> platform-io"
  echo "1. platform-io -> cube-mx"
  echo -n "Direction [0/1]: "
  read direction
fi

if [ "$direction" = 0 ]; then
  mkdir -p platform-io/include
  mkdir -p platform-io/src
  cp -rf cube-mx/Core/Inc/* platform-io/include
  cp -rf cube-mx/Core/Src/* platform-io/src

elif [ "$direction" = 1 ]; then
  mkdir -p cube-mx/Core/Inc
  mkdir -p cube-mx/Core/Src
  cp -rf platform-io/include/* cube-mx/Core/Inc
  cp -rf platform-io/src/*     cube-mx/Core/Src

else
  echo "Invalid switch" > /dev/err
  exit 1;

fi
