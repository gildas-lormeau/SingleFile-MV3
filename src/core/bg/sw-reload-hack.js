/* global self, skipWaiting, clients */

// See https://issues.chromium.org/issues/40805401

self.oninstall = () => skipWaiting();
self.onactivate = () => clients.claim();