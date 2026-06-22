// ============================================================
// ISARACK Instaladores - Service Worker
// Estrategia: Network First para HTML/JS, Cache First para iconos
// ============================================================
// IMPORTANTE: Cambia esta versión en cada deploy a Vercel
const VERSION = '2026-06-22-v3';
const CACHE_NAME = `isarack-inst-${VERSION}`;

// Archivos esenciales (la app funciona sin internet si están cacheados)
const ESSENTIAL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ── INSTALL: precarga archivos esenciales ──
self.addEventListener('install', e => {
  console.log('[SW] Installing version:', VERSION);
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(ESSENTIAL))
      .then(() => self.skipWaiting()) // Activar inmediatamente, no esperar
  );
});

// ── ACTIVATE: borra cachés viejos y toma control ──
self.addEventListener('activate', e => {
  console.log('[SW] Activating version:', VERSION);
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k.startsWith('isarack-inst-'))
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      ))
      .then(() => self.clients.claim()) // Tomar control de todas las pestañas abiertas
      .then(() => {
        // Notificar a todos los clientes que hay nueva versión activa
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'SW_ACTIVATED', version: VERSION });
          });
        });
      })
  );
});

// ── FETCH: estrategia Network First para HTML/JS, Cache First para imágenes ──
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  
  // No interceptar peticiones a Supabase (datos en vivo)
  if (url.hostname.includes('supabase')) return;
  
  // No interceptar peticiones POST/PUT/DELETE
  if (req.method !== 'GET') return;
  
  // ── Cache First para imágenes/iconos (no cambian frecuentemente) ──
  if (req.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico)$/i)) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return resp;
      }).catch(() => caches.match('./icon-192.png')))
    );
    return;
  }
  
  // ── Network First para HTML/JS/manifest (siempre intentar versión nueva) ──
  e.respondWith(
    fetch(req)
      .then(resp => {
        // Si la red responde OK, actualizar caché y devolver la versión fresca
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return resp;
      })
      .catch(() => {
        // Si no hay internet, usar caché. Si tampoco hay caché, mostrar index
        return caches.match(req).then(cached => cached || caches.match('./index.html'));
      })
  );
});

// ── Escuchar mensaje del cliente para forzar actualización ──
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
