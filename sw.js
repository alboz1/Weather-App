const cacheName = 'Weather-App-v4';
const filesToCache = [
  '/',
  'index.html',
  'css/main.css',
  'js/index.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate',  event => {
  event.waitUntil(
      caches.keys().then(keys => {
          return Promise.all(keys
              .filter(key => key !== cacheName)
              .map(key => caches.delete(key))
          );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});