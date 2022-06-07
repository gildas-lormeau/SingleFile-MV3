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
https://developer.chrome.com/extensions/getstarted#manifest (omit the manifest
creation).

## Notable features of SingleFile Lite

![features](https://user-images.githubusercontent.com/396787/158097498-0f12f05b-c345-4753-b7f4-487f0324200f.png)

- **unreliable auto-updates**

  > With Manifest V2, it was possible to auto-update the extension without
  > breaking the extension. With Manifest V3, it's no longer possible (cf.
  > https://crbug.com/1271154).

- **more RAM intensive**

  > With Manifest V2, it was possible to efficiently download pages as `Blob`
  > objects. With Manifest V3, it's no longer possible (cf.
  > https://crbug.com/1224027).

  > With Manifest V2, it was possible to inject the scripts needed to capture a
  > tab only when you actually saved it. With Manifest V3, it's no longer
  > possible (cf. https://crbug.com/1325114 maybe?).

- **more CPU intensive**

  > With Manifest V2, to reliably use only the power necessary to save a page.
  > With Manifest V3, it's no longer possible (cf. https://crbug.com/1231683).

- **no auto-save**

  > With Manifest V2, it was possible to process a page in the background. With
  > Manifest V3, it's no longer possible (cf. https://crbug.com/1056354).

- **save time limited to 5 minutes max.**

  > With Manifest V2, it was possible to process a page for a very long time.
  > With Manifest V3, it's no longer possible (cf. https://crbug.com/1152255).

- **no "Referrer" header injection**

  > With Manifest V2, it was possible to inject a "Referrer" HTTP header if
  > necessary. With Manifest V3, it's no longer possible (cf.
  > https://crbug.com/1149619).

- and more to come!

## Benefits of the Manifest V3

- none
