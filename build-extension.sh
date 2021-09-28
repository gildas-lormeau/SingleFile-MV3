#!/bin/sh
npx rollup -c rollup.config.js

rm singlefile-lite-extension.zip
cp manifest.json manifest.copy.json
sed -i 's/207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj/207618107333-7tjs1im1pighftpoepea2kvkubnfjj44/g' manifest.json
cp extension/core/bg/downloads.js downloads.copy.js
sed -i 's/207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj/207618107333-7tjs1im1pighftpoepea2kvkubnfjj44/g' extension/core/bg/downloads.js
zip -r singlefile-lite-extension.zip manifest.json dist _locales extension
mv manifest.copy.json manifest.json
mv downloads.copy.js extension/core/bg/downloads.js
