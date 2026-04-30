const CACHE_NAME = "it112-pwa-cache-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/offline.html",
    "/css/styles.css",
    "/js/app.js",
    "/manifest.json",
    "/icon.png",
    "/status",
    "/api/health",
    "/api/users"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        const responseClone = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseClone));

                        return response;
                    });
            })
            .catch(() => {
                if (event.request.mode === "navigate") {
                    return caches.match("/offline.html");
                }

                return caches.match(event.request);
            })
    );
});
