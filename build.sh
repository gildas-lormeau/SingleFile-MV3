#!/bin/bash

npx rollup -c rollup.config.js

cat lib/chrome-browser-polyfill.js lib/single-file-frames.js lib/single-file-extension-frames.js > lib/single-file-frames.bundle.js
cat lib/chrome-browser-polyfill.js lib/single-file-bootstrap.js lib/single-file-extension-bootstrap.js lib/single-file-infobar.js > lib/single-file-bootstrap.bundle.js