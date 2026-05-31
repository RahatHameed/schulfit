/// <reference lib="webworker" />
// =============================================================================
// Custom Service Worker (injectManifest strategy)
//   - Precaches the app shell so SchulFit loads fully offline.
//   - Prompt-style updates: waits until the user taps "Reload" (SKIP_WAITING).
//   - Handles daily-streak reminder clicks: focus an open window or open one.
//
// Scheduling itself is done from the page via the Notification Triggers API
// (see NotificationService); this SW handles delivery-side click behaviour.
// =============================================================================
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

// __WB_MANIFEST is replaced at build time with the precache manifest.
precacheAndRoute(self.__WB_MANIFEST);

// Prompt-style updates: the new SW waits until the user taps "Reload", which
// posts SKIP_WAITING (via vite-plugin-pwa's updateSW(true)).
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if ((event.data as { type?: string } | undefined)?.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      if (clients.length > 0) {
        const client = clients[0];
        if ('focus' in client) await client.focus();
        return;
      }
      await self.clients.openWindow('/');
    })(),
  );
});
