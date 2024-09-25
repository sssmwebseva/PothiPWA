const CACHE_NAME = `shrikrishna-vijay-v1`;
const PREFIX = '/PothiPWA/'
const CACHE_ASSETS = [
  `${PREFIX}app.html`,
  `${PREFIX}app.js`,
  `${PREFIX}app.css`,
  `${PREFIX}manifest.json`
  `${PREFIX}purva.json`,
  `${PREFIX}uttar.json`,
  `${PREFIX}img/bg.jpg`,
  `${PREFIX}img/Swami.jpg`,
  `${PREFIX}img/BookIcon1/android/android-launchericon-512-512.png`
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
  caches
       .has(CACHE_NAME)
       .then((hasCache) => {
        console.log(`ServiceWorker Fetch: Cache Name in cache`);

          }
        ).catch( () => {
          console.log(`ServiceWorker Fetch: Exception in has`);
          }
        );
  
});