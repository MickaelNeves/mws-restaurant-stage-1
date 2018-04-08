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

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            console.log('Caching...');
            return cache.addAll(urlsToCache);
        })
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
        }).catch(error => console.error("Error:", error))
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) return response;
            return fetch(event.request);
        })
    );
});