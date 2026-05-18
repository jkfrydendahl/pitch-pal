const CACHE_NAME = 'pitchpal-v3';
const APP_SHELL = [
  './',
  './index.html',
  './styles/style.css',
  './scripts/app.js',
  './scripts/player.js',
  './scripts/state.js',
  './scripts/ui.js',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Don't cache API calls or audio files
  if (event.request.url.includes('/api/') || event.request.url.includes('.mp3')) {
    return;
  }

  // Network-first: try network, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
