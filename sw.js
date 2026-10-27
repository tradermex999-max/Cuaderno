const V='cuaderno-v6';
const SHELL=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','fonts/fonts.css','fonts/kalam-400.woff2','fonts/kalam-700.woff2','fonts/patrick-hand-400.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.headers.has('range'))return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith((async()=>{const c=await caches.open(V);const hit=await c.match(r,{ignoreSearch:r.mode==='navigate'})||(r.mode==='navigate'?await c.match('index.html'):null);
    const isPage=r.mode==='navigate'||u.pathname.endsWith('/index.html');const old=hit&&isPage?hit.clone():null;
    const net=fetch(r,{cache:'no-cache'}).then(async res=>{if(res&&res.ok&&res.status===200&&res.type==='basic'){
      let changed=false;if(old){try{const[a,b]=await Promise.all([old.text(),res.clone().text()]);changed=a!==b}catch(_){}}
      await c.put(r,res.clone());if(changed){(await self.clients.matchAll()).forEach(x=>x.postMessage({type:'upd'}))}}return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return (await net)||new Response('Sin conexión',{status:503,headers:{'Content-Type':'text/plain'}})})())});
