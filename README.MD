# SingleFile Lite

This is the new version of SingleFile compatible with the long-awaited Manifest V3!

![Manifest V3 logo with a thug font](https://github.com/gildas-lormeau/SingleFile-Lite/blob/main/promo.png?raw=true)

This is a work in progress.
## Notable features

 - more RAM intensive: with the Manifest V2, it was possible to inject the script needed to capture a tab only when you actually saved it. With the Manifest V3, it's no more possible.
 - more CPU intensive: with the Manifest V2, it was possible to download efficiently pages as Blob objects. With the Manifest V3, it's no more possible.
 - no auto-save: with the Manifest V2, it was possible to process a page in background. With the Manifest V3, it's no more possible.
 - no "Referrer" header injection: with the Manifest V2, it was possible to inject a "Referrer" HTTP header if necessary. With the Manifest V3, it's no more possible.
 - no support for fonts dynamically loaded with the `FontFace` API: with the Manifest V2, you could save on page on https://www.theverge.com/ and keep the original fonts. With the Manifest V3, it's no more possible.
 - no translations of Chrome UI elements: with the Manifest V2, labels in the context menu and button tooltip/badge could be easily translated. With the Manifest V3, it's no more possible.
 - and more to come!
