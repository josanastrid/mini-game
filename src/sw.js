// For Progressive Web App-
importScripts('serviceworker-cache-polyfill.js');

var CACHE_NAME = 'mini-card-game';

// File want to cache
var urlsToCache = [
  './',
  './index.html',
  './serviceworker-cache-polyfill.js',
  './assets/images/icon-48.png',
  './assets/images/icon-96.png',
  './assets/images/icon-144.png',
  './assets/images/starwars/card-a.jpg',
  './assets/images/starwars/card-b.jpg',
  './assets/images/starwars/card-c.jpg',
  './assets/images/starwars/card-d.jpg',
  './assets/images/starwars/card-e.jpg',
  './assets/images/starwars/card-f.jpg',
  './assets/images/starwars/cover.jpg',
  './assets/vendor/reset.min.css',
  './assets/vendor/lodash.min.js',
  './assets/vendor/vue.min.js',
];


// Set the callback for the install step
self.addEventListener('install', function (e) {
  console.log('[serviceWorker]: Installing...');
  // perform install steps
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('[serviceWorker]: Cache All');
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log('[serviceWorker]: Intalled And Skip Waiting on Install');
        return self.skipWaiting();
      })
  );
});


self.addEventListener('fetch', function (event) {

  console.log('[serviceWorker]: Fetch', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );

});


self.addEventListener('activate', function (e) {

  console.log('[serviceWorker]: Actived');

  var whiteList = ['mini-card-game'];

  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (whiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      )
    }).then(function () {
      console.log('[serviceWorker]: Clients Claims');
      return self.clients.claim();
    })
  );

});