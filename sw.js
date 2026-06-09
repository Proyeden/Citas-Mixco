// ── SERVICE WORKER — Clínica Médica Juan Ciudad Duarte ──────────────────
const CACHE_NAME = 'clinica-jcd-v1';
const CHANNEL = 'clinica-jcd-denis-2026';

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Push notifications from server
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || '🏥 Clínica Juan Ciudad Duarte';
  const options = {
    body: data.body || 'Nueva notificación',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/icon.png',
    tag: data.tag || 'clinica-notif',
    renotify: true,
    vibrate: [200, 100, 200],
    data: data
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

// Background sync — check for new citas/espera every minute
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NOTIFY') {
    const { title, body, tag } = e.data;
    self.registration.showNotification(title, {
      body,
      tag: tag || 'clinica',
      renotify: true,
      vibrate: [200, 100, 200],
      icon: e.data.icon || ''
    });
  }
});
