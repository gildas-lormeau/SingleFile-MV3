# SingleFile Lite

This is the new version of
[SingleFile](https://github.com/gildas-lormeau/SingleFile) compatible with the
long-awaited Manifest V3!

![Manifest V3 logo with a thug font](https://github.com/gildas-lormeau/SingleFile-Lite/blob/main/promo.png?raw=true)

Don't have any idea what Manifest V3 is? You can find more information in this
blog article: https://developer.chrome.com/blog/mv2-transition/

The objective is summarized as follows:

> Manifest V3 is more secure, performant, and privacy-preserving than its
> predecessor. It is an evolution of the extension platform that takes into
> consideration both the changing web landscape and the future of browser
> extensions.

## Install

SingleFile Lite cannot be downloaded from the Chrome store yet. You can however
download the
[zip file](https://github.com/gildas-lormeau/SingleFile-Lite/archive/refs/heads/main.zip)
of the project and install it manually by unzipping it somewhere on your disk
and following these instructions:
https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked.

## Notable features of SingleFile Lite

- **unreliable auto-updates**

  > With Manifest V2, it was possible to auto-update the extension without
  > breaking the extension. With Manifest V3, it's no longer possible (cf.
  > https://crbug.com/1271154).

- **no "Referrer" header injection**

  > With Manifest V2, it was possible to inject a "Referrer" HTTP header if
  > necessary. With Manifest V3, it's no longer possible (cf.
  > https://crbug.com/1149619).

## Benefits of the Manifest V3

- Ability to save frames with `src` using `blob:` or `data:` protocols via 
  [`match_origin_as_fallback`](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#match_origin_as_fallback).

- Sidebar integration like in Firefoc
