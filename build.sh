#!/bin/bash
set -e

# rm -rf node_modules package-lock.json
# npm install

rm -r node_modules/arlas-api/*
cp ../ARLAS-web-core/node_modules/arlas-api/* node_modules/arlas-api/

cd ../ARLAS-web-contributors
sh ./build.sh

cd ../ARLAS-wui-toolkit

rm -r node_modules/arlas-web-core/*
cp -r ../ARLAS-web-core/dist/* node_modules/arlas-web-core/

rm -r node_modules/arlas-web-contributors/*
cp -r ../ARLAS-web-contributors/dist/* node_modules/arlas-web-contributors/

npm run build-release
