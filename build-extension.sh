#!/bin/bash

dpkg -s zip &> /dev/null
if [ $? -ne 0 ]
then
    if ! command -v zip &> /dev/null; then
        echo "Installing zip"
        sudo apt install zip
    fi
fi

dpkg -s jq &> /dev/null
if [ $? -ne 0 ]
then
    if ! command -v jq &> /dev/null; then
        echo "Installing jq"
        sudo apt install jq
    fi
fi

npm install
npm update

./build.sh

rm singlefile-extension-chromium.zip singlefile-extension-edge.zip

zip -r singlefile-extension-chromium.zip manifest.json lib _locales src

cp src/core/bg/config.js config.copy.js
cp manifest.json manifest.copy.json
jq 'del(.oauth2)' manifest.json > manifest.tmp.json && mv manifest.tmp.json manifest.json
sed -i "" 's/forceWebAuthFlow: false/forceWebAuthFlow: true/g' src/core/bg/config.js
sed -i "" 's/image\/avif,//g' src/core/bg/config.js
zip -r singlefile-extension-edge.zip manifest.json lib _locales src
mv config.copy.js src/core/bg/config.js
mv manifest.copy.json manifest.json