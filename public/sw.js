// Minimal service worker: cache-first for same-origin static assets, network for everything else.
// Intentionally conservative — no offline pages, no push in v1.

const CACHE = "eduintbd-v2-admin";
const PRECACHE = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;
  // Never cache anything under /admin or /api — dynamic / auth-gated.
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api")
  ) {
    return;
  }
  // Only cache static-ish paths
  if (
    !url.pathname.startsWith("/_next/static/") &&
    !url.pathname.startsWith("/uploads/") &&
    !url.pathname.match(/\.(?:png|jpg|jpeg|webp|svg|ico|woff2?|css|js)$/)
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, clone));
        return res;
      });
    })
  );
});
