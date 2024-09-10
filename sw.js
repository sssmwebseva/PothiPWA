const CACHE_NAME = `shrikrishna-vijay-v1`;
const CACHE_ASSETS = [
  '/app.html',
  '/app.js',
  '/app.css',
  '/purva.json',
  '/uttar.json',
  '/img/bg.jpg',
  '/img/Swami.jpg'
];

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', e => {
  console.log('Service Worker: Installing');
  
  /*Delete any old caches*/
  e.waitUntil(
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cache => {
        //if ( cache !== CACHE_NAME ){ Just clear all caches
          console.log(`Service Worker: Clearing Old Cache ${cache}`);
          return caches.delete(cache);
        //}
      })
    )
  }).then(
            /**/
      e.waitUntil(
       caches.open(CACHE_NAME)
       .then( cache => {
       console.log('Service Worker: Caching Files');
       cache.addAll(CACHE_ASSETS);
  })
  .then(() => self.skipWaiting())
    ); 
   )
  )


});

/*self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
});*/
/* 
Activate event fires when the service worker is activated. So this is going to happen multiple times.
Every time the app is launched. Whereas install happens only once when the Service Worker is registered


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

})*/

/*self.addEventListener('fetch', e => {
  console.log("Service Worker: Fetching");
  //Open the cache first
  e.respondWith(caches.open(CACHE_NAME).then((cache) => {
	// Go to network first
	return fetch(e.request).then((fetchedResponse) => {
		if(fetchedResponse.status == 200){
			cache.put(e.request, fetchedResponse.clone());
			return fetchedResponse;
		}
		else{
			cache.match(e.request).then(cachedResponse => {
				
			return cachedResponse;	
		// If the network is unavailable, get        
		})
			
		}

	}).catch(err => cache.match(e.request).then(cachedResponse => {
		return cachedResponse;	
		// If the network is unavailable, get        
	}));
  }));

});*/

//Cache Only strategy
self.addEventListener('fetch', (event) => {
  // Is this one of our precached assets?
  const url = new URL(event.request.url);
  const isPrecachedRequest = CACHE_ASSETS.includes(url.pathname);

  if (isPrecachedRequest) {
    // Grab the precached asset from the cache
    event.respondWith(caches.open(cacheName).then((cache) => {
      return cache.match(event.request.url);
    }));
  } else {
    // Go to the network
    return;
  }
});