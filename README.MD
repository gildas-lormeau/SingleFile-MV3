# SingleFile Lite

This is the (future) new version of
[SingleFile](https://github.com/gildas-lormeau/SingleFile) compatible with the
Manifest V3.

## Install

SingleFile Lite cannot be downloaded from the Chrome store yet. You can however
download the
[zip file](https://github.com/gildas-lormeau/SingleFile-Lite/archive/refs/heads/main.zip)
of the project and install it manually by unzipping it somewhere on your disk
and following these instructions:
https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked.

## Blocking Issues

- **unreliable auto-updates**, cf. https://crbug.com/1271154

## Benefits of the Manifest V3

- Ability to save frames with `src` using `blob:` or `data:` protocols via 
  [`match_origin_as_fallback`](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#match_origin_as_fallback).

- Sidebar integration like in Firefox and Opera
