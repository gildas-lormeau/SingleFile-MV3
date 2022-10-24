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

- **no "Referrer" header injection**

  > With Manifest V2, it was possible to inject a "Referrer" HTTP header if
  > necessary. With Manifest V3, it's no longer possible (cf.
  > https://crbug.com/1149619).

- **limited support for fonts dynamically loaded with the `FontFace` API**

  > With Manifest V2, it was possible to detect and save fonts loaded early with
  > the `FontFace` API. With Manifest V3, it's no longer possible (cf.
  > https://crbug.com/1207006 and https://crbug.com/1054624).

- and more to come!

## Benefits of the Manifest V3

- none
