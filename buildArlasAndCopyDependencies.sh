if [[ ! -d ../ARLAS-web-core/ ]] ; then
    echo 'Directory "../ARLAS-web-core/" is not there, aborting.'
    exit
fi

if [[ ! -d ../ARLAS-web-contributors/ ]] ; then
    echo 'Directory "../ARLAS-web-contributors/" is not there, aborting.'
    exit
fi

if [[ ! -d ../ARLAS-web-components/ ]] ; then
    echo 'Directory "../ARLAS-web-components/" is not there, aborting.'
    exit
fi

# get initial dependencies
# cd ../ARLAS-web-core/
# yarn install
# cd -

# cd ../ARLAS-web-contributors/
# yarn install
# cd -

# cd ../ARLAS-web-components/
# yarn install
# cd -

# now we build
# cd ../ARLAS-web-core/
# yarn build-release
# cd -

# cd ../ARLAS-web-contributors/
# yarn build-release
# cd -

# cd ../ARLAS-web-components/
# yarn build-release
# cd -

# now we copy
# now we copy
# cp -r ../ARLAS-web-core/dist/* ../ARLAS-web-contributors/node_modules/arlas-web-core
rm -rf ../ARLAS-wui-toolkit/node_modules/arlas-api
mkdir ../ARLAS-wui-toolkit/node_modules/arlas-api
cp -r ../../../Downloads/typescript-fetch/dist/* ../ARLAS-wui-toolkit/node_modules/arlas-api
rm -rf ../ARLAS-wui-toolkit/node_modules/arlas-web-core
mkdir ../ARLAS-wui-toolkit/node_modules/arlas-web-core
cp -r ../ARLAS-web-core/dist/* ../ARLAS-wui-toolkit/node_modules/arlas-web-core
# rm -rf ../ARLAS-wui-toolkit/node_modules/arlas-web-contributors
# mkdir ../ARLAS-wui-toolkit/node_modules/arlas-web-contributors
# cp -r ../ARLAS-web-contributors/dist/* ../ARLAS-wui-toolkit/node_modules/arlas-web-contributors
# rm -rf ../ARLAS-wui-toolkit/node_modules/arlas-web-components
# mkdir ../ARLAS-wui-toolkit/node_modules/arlas-web-components
# cp -r ../ARLAS-web-components/dist/* ../ARLAS-wui-toolkit/node_modules/arlas-web-components

# rm -rf ../ARLAS-wui/node_modules/arlas-wui-toolkit
# mkdir ../ARLAS-wui/node_modules/arlas-wui-toolkit
# cp -r ../ARLAS-wui-toolkit/dist/* ../ARLAS-wui/node_modules/arlas-wui-toolkit
