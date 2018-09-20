#!/bin/bash -e

# CREATE TARGET DIRECTORY ##
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

# GENERATE ARLAS CONFIG SCHEMA MD
find src/app/services/startup -name '*.schema.json' -type f -exec docker run --rm -v `pwd`:/schema gisaia/jsonschema2md:0.1.2 -d /schema/{} -o /schema/target/generated-docs/schemas-doc/arlasconfig  \;

## GENERATE CONTRIBUTORS SCHEMA MD
find node_modules/arlas-web-contributors/jsonSchemas -type f -exec docker run --rm -v `pwd`:/schema gisaia/jsonschema2md:0.1.2 -d /schema/{} -o /schema/target/generated-docs/schemas-doc/contributors \;

## GENERATE COMPONENTS SCHEMA MD
find node_modules/arlas-web-components -name '*.schema.json' -type f -exec docker run --rm -v `pwd`:/schema gisaia/jsonschema2md:0.1.2 -d /schema/{} -o /schema/target/generated-docs/schemas-doc/components  \;

## MOVE ALL SCHEMA JSON FILES TO A REP
mkdir -p target/generated-docs/schemas/
find target/generated-docs/schemas-doc/* -name '*.schema.json' -type f -exec cp {} target/generated-docs/schemas \;

function parseFilePath {
    filename=$(basename $1)
    echo ' - ['${filename}'](../schemas/'${filename}')'>> target/generated-docs/schemas/schemas.md
}

function addHashTag {
    sed -i -e 's/^# /## /g' ${1}
    cat ${1} >> target/generated-docs/schemas/schemas.md
}

## Build on md file from all generated ones
export -f parseFilePath
export -f addHashTag

echo ' # Documentation of Arlas-wui configuration' > target/generated-docs/schemas/schemas.md
echo ' ' >> target/generated-docs/schemas/schemas.md

### Arlasconfig schema
echo ' ## Arlas configuration json schema files' >> target/generated-docs/schemas/schemas.md
echo ' ' >> target/generated-docs/schemas/schemas.md
parseFilePath target/generated-docs/schemas-doc/arlasconfig/arlasconfig.schema.json
### Contributors schemas
echo ' ## Contributors json schemas files' >> target/generated-docs/schemas/schemas.md
echo ' ' >> target/generated-docs/schemas/schemas.md
find target/generated-docs/schemas-doc/contributors -name '*.schema.json' -type f -exec bash -c 'parseFilePath {}' \;

# ### Components schemas
echo ' ## Components json schemas files' >> target/generated-docs/schemas/schemas.md
echo ' ' >> target/generated-docs/schemas/schemas.md
find target/generated-docs/schemas-doc/components -name '*.schema.json' -type f -exec bash -c 'parseFilePath {}' \;

addHashTag target/generated-docs/schemas-doc/arlasconfig/arlasconfig.schema.md
find target/generated-docs/schemas-doc/contributors -name '*.schema.md' -type f -exec bash -c 'addHashTag {}' \;
find target/generated-docs/schemas-doc/components -name '*.schema.md' -type f -exec bash -c 'addHashTag {}' \;

find target/generated-docs/schemas-doc/ -name "*.json" -type f -delete
