// Minimal service worker — satisfies PWA installability on Android Chrome.
// No offline caching; the app always loads fresh from the network.
self.addEventListener('fetch', () => {});
