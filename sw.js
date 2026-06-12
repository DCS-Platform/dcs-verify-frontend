// DCS Verify — KILL-SWITCH service worker.
// The previous verify.dcslabs.ai deploy (dcs-verify-site) registered a caching
// service worker. Now that verify.dcslabs.ai is served by THIS git-connected
// project, returning visitors may still have that old worker installed. The
// browser re-fetches /sw.js on its own; serving this file replaces the old
// worker with one that unregisters itself and purges every cache, so everyone
// gets the live site with zero stale content. Safe no-op for new visitors.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (_) {} });
    } catch (_) {}
  })());
});
