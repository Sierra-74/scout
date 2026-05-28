const CACHE_NAME = 'scout-tool-v1';

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json'
            ]);
        })
    );
    self.skipWaiting(); // ✅ activate new version immediately
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        fetch(e.request)
            .then(res => {
                let copy = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
