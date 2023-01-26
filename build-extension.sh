#!/bin/sh

sudo apt install zip jq

npm install
npm update

npx rollup -c rollup.config.js

rm singlefile-lite-extension.zip
cp manifest.json manifest.copy.json
sed -i 's/207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj/207618107333-7tjs1im1pighftpoepea2kvkubnfjj44/g' manifest.json
cp src/core/bg/downloads.js downloads.copy.js
sed -i 's/207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj/207618107333-h1220p1oasj3050kr5r416661adm091a/g' src/core/bg/downloads.js
sed -i 's/000000000000000000000000/VQJ8Gq8Vxx72QyxPyeLtWvUt/g' src/core/bg/downloads.js
sed -i 's/207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj/207618107333-7tjs1im1pighftpoepea2kvkubnfjj44/g' manifest.json
zip -r singlefile-lite-extension.zip manifest.json lib _locales src
mv manifest.copy.json manifest.json
mv downloads.copy.js src/core/bg/downloads.js
