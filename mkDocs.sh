#!/bin/bash -e

## CREATE TARGET DIRECTORY ##
rm -rf target
mkdir target
mkdir target/generated-docs

## GENERATE THE DOCUMENTATION ##
docker run -a STDERR --rm  -i -v `pwd`:/docs gisaia/typedocgen:0.0.4 generatedoc src

## MOVE ALL THE DOCUMENTATION TO THE 'generated-docs' FOLDER ##
mv typedoc_docs/* target/generated-docs
cp CHANGELOG.md target/generated-docs/CHANGELOG_ARLAS-wui-toolkit.md
if [ -d ./docs ] ; then
    cp -r docs/* target/generated-docs
fi

mkdir -p target/generated-docs/schemas-doc/
mkdir -p target/generated-docs/schemas/

## COPY CONTRIBUTOR SCHEMA
cp node_modules/arlas-web-contributors/jsonSchemas/* target/generated-docs/schemas/
## COPY ARLAS SCHEMA
cp src/app/services/startup/*.json target/generated-docs/schemas/
## COPY COMPONENT SCHEMA
for f in $(find node_modules/arlas-web-components -name '*.schema.json'); do
cp $f target/generated-docs/schemas/;
done

function parseFilePath {
    filename=$(basename $1)
    echo '### '${filename} >> target/generated-docs/schemas-doc/schemas.md
    echo ' ' >> target/generated-docs/schemas-doc/schemas.md
    echo ' [source](../schemas/'${1}')'>> target/generated-docs/schemas-doc/schemas.md
    echo ' ' >> target/generated-docs/schemas-doc/schemas.md
    echo '```json' >> target/generated-docs/schemas-doc/schemas.md
    cat ${1} >> target/generated-docs/schemas-doc/schemas.md
    echo ' ' >> target/generated-docs/schemas-doc/schemas.md
    echo '```' >> target/generated-docs/schemas-doc/schemas.md
}

## GENERATE ARLAS SCHEMA MD
echo '# List of json schemas' > target/generated-docs/schemas-doc/schemas.md
echo '## ARLAS' >> target/generated-docs/schemas-doc/schemas.md
for filepath in src/app/services/startup/*.json; do
    parseFilePath ${filepath}
done

## GENERATE CONTRIBUTOR SCHEMA MD
echo '## Contributors' >> target/generated-docs/schemas-doc/schemas.md
for filepath in node_modules/arlas-web-contributors/jsonSchemas/*.json; do
    parseFilePath ${filepath}
done

## GENERATE COMPONENT SCHEMA MD
echo '## Components' >> target/generated-docs/schemas-doc/schemas.md
for filepath in $(find node_modules/arlas-web-components -name '*.schema.json'); do
    parseFilePath ${filepath}
done





