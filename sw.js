const CACHE_NAME = `shrikrishna-vijay-v1`;
const PREFIX = '/PothiPWA/'
const CACHE_ASSETS = [
  `${PREFIX}app.html`,
  `${PREFIX}app.js`,
  `${PREFIX}app.css`,
  `${PREFIX}purva.json`,
  `${PREFIX}uttar.json`,
  `${PREFIX}img/bg.jpg`,
  `${PREFIX}img/Swami.jpg`
];

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', e => {
  console.log('Service Worker: Installing');
  
  /*Delete any old caches*/
  e.waitUntil(
       caches.open(CACHE_NAME).then( cache => {
       console.log('Service Worker: Caching Files');
       cache.addAll(CACHE_ASSETS);
      } 
    )
  )
});

//Cache Only strategy
self.addEventListener('fetch', (event) => {
  // Is this one of our precached assets?
  const url = new URL(event.request.url);
  const isPrecachedRequest = CACHE_ASSETS.includes(url.pathname);

  if (isPrecachedRequest) {
    // Grab the precached asset from the cache
    event.respondWith(caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request.url);
    }));
  } else {
    // Go to the network
    return;
  }
});