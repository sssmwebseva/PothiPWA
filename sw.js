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
  //Open the cache first
  e.respondWith(caches.open(CACHE_NAME).then((cache) => {
	// Go to network first
	return fetch(e.request).then((fetchedResponse) => {
		cache.put(e.request, fetchedResponse.clone());
		return fetchedResponse;
	}).catch(err => cache.match(e.request).then(cachedResponse => {
		return cachedResponse;	
		// If the network is unavailable, get        
	}));
  }));

});