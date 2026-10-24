/* Клуб романтики: Выброс — offline cache. Pages and files.json: network first; everything else: cache first. */
const C='vybros-files';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  const fresh=r.mode==='navigate'||/\.(html|json|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
  if(fresh){
    e.respondWith(fetch(r).then(res=>{if(res.ok&&!u.search){const cp=res.clone();caches.open(C).then(c=>c.put(u.href,cp))}return res})
      .catch(()=>caches.match(u.href,{ignoreSearch:true}).then(m=>m||caches.match(new URL('./',location.href).href))));
    return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
});
