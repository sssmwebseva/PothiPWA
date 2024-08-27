const CACHE_NAME = `shrikrishna-vijay-v1`;
/*const CACHE_ASSETS = [
  'app.html',
  'app.js',
  'app.css',
  'purva.json',
  'uttar.json',
  '/img/bg.jpg',
  '/img/Swami.jpg'
];*/

// Use the install event to pre-cache all initial resources.
/*self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches.open(CACHE_NAME)
    .then( cache => {
      console.log('Service Worker: Caching Files');
      cache.addAll(CACHE_ASSETS);
  })
  .then(() => self.skipWaiting())
 );
});*/

self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', e => {

console.log("Service Worker: Activated");
//Remove old caches and keep only latest

e.waitUntil(
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cache => {
        if ( cache !== CACHE_NAME ){
          console.log("Service Worker: Clearing Old Cache");
          return caches.delete(cache);
        }
      })
    )
  })
)

})

self.addEventListener('fetch', e => {
  console.log("Service Worker: Fetching");
  e.respondWith(
    fetch(e.request)
    .then(res => {
      //Make a copy/clone of response
      const resClone = res.clone();
      caches
      .open(CACHE_NAME)
      .then(cache => {
        //Add response to cache
        cache.put(e.request, resClone);
      });
      return res;
    })
    .catch(err => caches.match(e.request).then(res => res)));
});