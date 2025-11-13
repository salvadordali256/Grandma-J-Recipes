'use strict';

self.addEventListener('install', (event) => {
    // Activate immediately so we can clean up the legacy cache/worker.
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
            .finally(async () => {
                await self.clients.claim();
                // Unregister this worker; the site no longer uses offline caching.
                await self.registration.unregister();
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Always fall back to the network so Safari doesn't see cached redirects.
    event.respondWith(fetch(event.request));
});
