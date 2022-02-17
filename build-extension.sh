#!/bin/sh
npx rollup -c rollup.config.js

rm singlefile-lite-extension.zip
cp manifest.json manifest.copy.json
sed -i 's/207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj/207618107333-7tjs1im1pighftpoepea2kvkubnfjj44/g' manifest.json
cp src/extension/core/bg/downloads.js downloads.copy.js
sed -i 's/207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj/207618107333-7tjs1im1pighftpoepea2kvkubnfjj44/g' src/extension/core/bg/downloads.js
zip -r singlefile-lite-extension.zip manifest.json lib _locales src/extension
mv manifest.copy.json manifest.json
mv downloads.copy.js src/extension/core/bg/downloads.js
