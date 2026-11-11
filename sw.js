// Apex GP Mobile — ออฟไลน์: ใช้ไฟล์ใหม่ถ้ามีเน็ต ไม่มีเน็ตใช้ที่เก็บไว้
const C = 'owgp-v17-1';
const FILES = ['./', './play/', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return; // Supabase/ออนไลน์ ไม่ผ่านแคช
  const page = r.mode === 'navigate';
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(page ? './play/' : r, cp)); }
    return res;
  }).catch(() => caches.match(page ? './play/' : r).then(m => m || caches.match('./play/'))));
});
