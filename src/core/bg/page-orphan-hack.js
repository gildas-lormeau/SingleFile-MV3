/* global navigator, location */

// see https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ld3n-rTmj54

navigator.serviceWorker.oncontrollerchange = () => location.reload(); // might need setTimeout