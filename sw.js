var cacheName = 'mws-ver2';
var cacheImgs = 'mws-imgs-ver3';

self.addEventListener('install',(event)=>{
    var cacheFiles = [
        '/',
        'sw.js',
        'restaurant.html',
        'index.html',
        'js/dbhelper.js',
        'js/main.js',
        'js/serviceworker_init.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'data/restaurants.json',
        '/restaurant.html?id=1',
        '/restaurant.html?id=2',
        '/restaurant.html?id=3',
        '/restaurant.html?id=4',
        '/restaurant.html?id=5',
        '/restaurant.html?id=6',
        '/restaurant.html?id=7',
        '/restaurant.html?id=8',
        '/restaurant.html?id=9',
        '/restaurant.html?id=10'
    ];

    event.waitUntil(
        caches.open(cacheName).then((cache)=>{
            console.log('Caching all images.');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate',(event)=>{
    event.waitUntil(
        caches.keys().then((cacheNames)=>{
            return Promise.all(
                cacheNames.filter((name)=>{
                    return name.startsWith('mws-ver') &&
                        name != cacheName;
                }).map((name)=>{
                    return caches.delete(name);
                })
            );
        })
    )
});

cachedResponse = (event)=>{
    let requestUrl = new URL(event.request.url);

    if (requestUrl.pathname.startsWith('/img/')) {
        return caches.open(cacheImgs).then(function(cache) {
            return cache.match(requestUrl).then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(function(networkResponse) {
                    cache.put(requestUrl, networkResponse.clone());
                    return networkResponse;
                });
            });
        });
    }

    return caches.match(event.request).then((response)=>{
        if(response) {
            console.log('Grab from cache: ' + event.request.url);
            return response;
        }
        return fetch(event.request).then((response)=>{
            if(response.status == 404) {
                return new Response("Error not found");
            }
            return response;
        }).catch((err)=>{
            console.log(`Failed to cache. Error: ${err}`);
        })
    })
}

self.addEventListener('fetch', (event)=>{
    event.respondWith(cachedResponse(event));
});
