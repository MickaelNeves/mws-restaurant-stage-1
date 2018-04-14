let staticCacheName = 'mws-restaurant-cache-v4';
let urlsToCache = [
    '/',
    '/index.html',
    '/data/restaurants.json',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/serviceworker_init.js',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('Caching...');
            return cache.addAll(urlsToCache);
        }).catch(error => console.error("Install Error:", error))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName.startsWith("mws-restaurant") &&
                    !staticCacheName.includes(cacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        }).catch(error => console.error("Activate Error:", error))
    );
});

self.addEventListener('fetch', event => {
    /* for restaurant info urls */
    if(event.request.url.includes('restaurant.html?id=')){
        const strippedurl = event.request.url.split('?')[0];

        event.respondWith(
            caches.match(strippedurl).then(response => {
                return response || fetch(event.response);
            })
        );
        return;
    }
    /* for all other urls */
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }else {
                return fetch(event.request).then(response => {
                    let cloneResp = response.clone();

                    caches.open(staticCacheName).then(cache => {
                        cache.put(event.request, cloneResp);
                    });
                    return response;
                });
            }
        }).catch(error => console.error("Fetch Error:", error))
    );
});

