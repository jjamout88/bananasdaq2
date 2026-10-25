// cache key follows ?v of the registration URL (sw.js?v=N). HTML is network-first so a new deploy is picked up immediately.
const V=new URL(self.location).searchParams.get('v')||'0',CACHE='bn2-v'+V;
const CORE=['./','index.html','manifest.webmanifest','data2.js?v='+V,'data_open100.js?v='+V,'js/config.js?v='+V,'js/engine.js?v='+V,'js/assets.js?v='+V,'js/bananart.js?v='+V,'js/fx2.js?v='+V,'js/main.js?v='+V,'js/ending.js?v='+V,'js/bgm.js?v='+V,'css/screens.css?v='+V,'fonts/Galmuri11.woff2','fonts/Galmuri11-Bold.woff2','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('bn2-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 const html=r.mode==='navigate'||r.destination==='document';
 if(html){e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html',{ignoreSearch:true})));return}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok&&res.type==='basic'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})))});
