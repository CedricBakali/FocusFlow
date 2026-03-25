const CACHE_NAME = "focusflow-v1";

const ASSETS = [
    "/",
    "/index.html",
    "/reset.css",
    "/main.css",
    "/app.js",
    "/focus.js",
    "/notify.js",
    "/schedule.js",
    "/storage.js",
    "/time.js",
    "/ui.js",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap"
];

// Install — cache all assets
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).catch(() => {
                // If both cache and network fail, return the offline page
                if (event.request.destination === "document") {
                    return caches.match("/index.html");
                }
            });
        })
    );
});