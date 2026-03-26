// Express Lumber Ops - Service Worker for Driver PWA
const CACHE_NAME = "elo-driver-v1";
const STATIC_ASSETS = ["/driver/route", "/driver/summary"];

// Install: cache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (mutations go through offline queue)
  if (request.method !== "GET") return;

  // API calls: network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// Background sync for offline mutations
self.addEventListener("sync", (event) => {
  if (event.tag === "offline-mutations") {
    event.waitUntil(replayMutations());
  }
});

async function replayMutations() {
  // Mutations are managed by the offline-sync service via IndexedDB
  // This triggers a client message to replay the queue
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({ type: "REPLAY_MUTATIONS" });
  }
}
