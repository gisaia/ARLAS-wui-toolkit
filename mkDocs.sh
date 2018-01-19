#!/bin/sh

## CREATE TARGET DIRECTORY ##
rm -rf target
mkdir target
mkdir target/generated-docs

## GENERATE THE DOCUMENTATION ##
docker run --rm  -it -v `pwd`:/docs gisaia/typedocgen:0.0.2 generatedoc src

## MOVE ALL THE DOCUMENTATION TO THE 'generated-docs' FOLDER ##
mv typedoc_docs/* target/generated-docs
if [ -d ./docs ] ; then
    cp -r docs/* target/generated-docs
fi


