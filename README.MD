# SingleFile Lite

This is the new version of SingleFile compatible with the long-awaited Manifest
V3!

![Manifest V3 logo with a thug font](https://github.com/gildas-lormeau/SingleFile-Lite/blob/main/promo.png?raw=true)

Don't have any idea what Manifest V3 is? You can find more information in this
blog article: https://developer.chrome.com/blog/mv2-transition/

The objective is summarized as follows:

> Manifest V3 is more secure, performant, and privacy-preserving than its
> predecessor. It is an evolution of the extension platform that takes into
> consideration both the changing web landscape and the future of browser
> extensions.

## Notable features of SingleFile Lite

- **more RAM & CPU intensive**

  > With the Manifest V2, it was possible to download efficiently pages as
  > `Blob` objects. With the Manifest V3, it's no more possible (cf.
  > https://crbug.com/1224027).

- **saved pages limited to 42MB max.**
  > With the Manifest V2, it was possible to download pages weigthing hundreds
  > of MB. With the Manifest V3, it's limited to 42 MB (cf. 
  > https://crbug.com/1224027).

- **no auto-save**

  > With the Manifest V2, it was possible to process a page in background. With
  > the Manifest V3, it's no more possible (cf. https://crbug.com/1056354).

- **no "Referrer" header injection**

  > With the Manifest V2, it was possible to inject a "Referrer" HTTP header if
  > necessary. With the Manifest V3, it's no more possible (cf.
  > https://crbug.com/1149619).

- **limited support for fonts dynamically loaded with the `FontFace` API**

  > With the Manifest V2, it was possible to save on page on
  > https://www.theverge.com/ and keep the original fonts. With the Manifest V3,
  > it's no more possible (cf. https://crbug.com/1054624).

- and more to come!

## Benefits of the Manifest V3

- none
