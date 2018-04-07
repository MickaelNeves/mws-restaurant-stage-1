if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function (registration) {
    	console.log('Service Worker is registered');
    }).catch(function (error) {
    	console.log('Service Worker failed to register', error);
    });
}