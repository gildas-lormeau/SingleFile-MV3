#!/bin/bash

dpkg -s zip &> /dev/null
if [ $? -ne 0 ]
then
    echo "Installing zip"
    sudo apt install zip
fi

npx rollup -c rollup.config.js

rm singlefile-lite-extension.zip
cp manifest.json manifest.copy.json
sed -i "" 's/3pj2pmelhnl4sf3rpctghs9cean3q8nj/7tjs1im1pighftpoepea2kvkubnfjj44/g' manifest.json
cp src/core/bg/downloads.js downloads.copy.js
sed -i "" 's/3pj2pmelhnl4sf3rpctghs9cean3q8nj/h1220p1oasj3050kr5r416661adm091a/g' src/core/bg/downloads.js
sed -i "" 's/000000000000000000000000/VQJ8Gq8Vxx72QyxPyeLtWvUt/g' src/core/bg/downloads.js
sed -i "" 's/3pj2pmelhnl4sf3rpctghs9cean3q8nj/7tjs1im1pighftpoepea2kvkubnfjj44/g' manifest.json
zip -r singlefile-lite-extension.zip manifest.json lib _locales src
mv manifest.copy.json manifest.json
mv downloads.copy.js src/core/bg/downloads.js
