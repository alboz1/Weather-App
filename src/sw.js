const cacheName = 'Weather-App-v15';
const dynamicCacheName = 'site-dynamic-v15';
const filesToCache = [
  'index.html',
  'css/main.css',
  'js/index-min.js'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('caching shell assets');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
      caches.keys().then(keys => {
          return Promise.all(keys
              .filter(key => key !== cacheName)
              .map(key => caches.delete(key))
          );
      })
  );
});

self.addEventListener('fetch', evt => {
  if (evt.request.url.indexOf('/current-weather') === -1 & evt.request.url.indexOf('/forecast-weather') === -1) {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request)
              .then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                  cache.put(evt.request.url, fetchRes.clone());
                  // check cached items size
                  limitCacheSize(dynamicCacheName, 15);
                  return fetchRes;
                })
              });
          }).catch((error) => {
            console.log(error);
          })
      );
  }
});