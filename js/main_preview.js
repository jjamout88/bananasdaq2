// 바나나스닥2 — trade screen (milestone preview build)
const BAD=/(노[\s!?.…~ㅋㅎ]*$)|좆|씨발|시발|병신|샤갈|개추|새끼|나선|워렌/;
const clean=a=>{for(let i=a.length-1;i>=0;i--)if(BAD.test(a[i]))a.splice(i,1)};
Object.values(MUT).forEach(clean);[MLOSS,BUSTL,UP,DN,CALM].forEach(a=>{try{clean(a)}catch(e){}});
let S={bal:10000,pos:null,combo:0,rank:0,lev:1,pct:10},G={on:true,day:null,i:0,t:0,price:0,cur:null,path:[],news:[],arrows:[]};
state='play';
const ptVal=()=>S.pos?S.pos.pv:0;
function upnl(){return S.pos?(G.price-S.pos.px)*S.pos.dir*ptVal():0}
const BMAP=Object.fromEntries(BANANAS.map(b=>[b[0],b]));
function banIcon(tier){const c=document.createElement('canvas');c.width=9;c.height=8;draw(c.getContext('2d'),BAN,0,0,1);return c}
let MX=8,MY=291,MS=0.6; // small monkey at left of banana row (fx coords)
function setNews(t,hot){const n=$('news');n.innerHTML='<span>'+(hot?'🚨 ':'📰 ')+t+'</span>';n.className='show';n.style.color=hot?'#ff6b6b':'#ffcd75';clearTimeout(n._t);n._t=setTimeout(()=>n.className='',2600)}
function tip(el,m){const t=$('tip');if(t._for===el&&t.style.display==='block'){t.style.display='none';return}t._for=el;t.innerHTML='<b>'+m[1]+'</b> '+['일반','희귀','전설'][m[2]]+'<br>'+m[3];t.style.display='block';const r=el.getBoundingClientRect(),R=$('root').getBoundingClientRect(),s=R.width/390;t.style.left=Math.min(390-t.offsetWidth-6,(r.left-R.left)/s)+'px';t.style.top=((r.top-R.top)/s-t.offsetHeight-8)+'px';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2500)}
function renderBar(eq,slots){const e=$('bbar');e.innerHTML='';eq.forEach(b=>{if(!b)return;const m=BMAP[b.id];const d=document.createElement('div');d.className='bslot t'+m[2]+(b.off?' off':'');d.appendChild(BART.canvas(b.id,1));
 if(b.id==='bait'){const x=document.createElement('b');x.textContent=b.n+'/3';d.appendChild(x)}d.onclick=()=>tip(d,m);e.appendChild(d)});
 const old=$('nana');if(old)old.remove();if(eq.some(b=>b&&b.id==='nana')){const n=document.createElement('button');n.id='nana';n.className='pbtn';n.textContent='나나바';$('row').appendChild(n)}}
function renderSel(levU,betU){const many=a=>a.length>1?' <em>▸</em>':'';$('selLev').innerHTML='<small>레버</small>×'+S.lev+many(levU);$('selBet').innerHTML='<small>베팅</small>'+S.pct+'%'+many(betU);
 $('selLev').onclick=()=>{S.lev=levU[(levU.indexOf(S.lev)+1)%levU.length];renderSel(levU,betU);snd(900,.03)};$('selBet').onclick=()=>{S.pct=betU[(betU.indexOf(S.pct)+1)%betU.length];renderSel(levU,betU);snd(1000,.03)}}
function fit(){const s=Math.min(innerWidth/390,innerHeight/844);$('root').style.transform=`scale(${s})`;$('root').style.left=((innerWidth-390*s)/2)+'px'}
addEventListener('resize',fit);fit();
// preview: a sample 40-bar window, normalized to 20000
const d=NQDATA2.days[3].c.slice(0,40),k=20000/d[0][0];G.day={c:d.map(b=>[b[0]*k,b[1]*k,b[2]*k,b[3]*k,b[4]])};
G.i=14;G.cur=[...G.day.c[14]];G.price=G.cur[3];G.path=mkPath(G.day.c[14]);
const CAN=CFG.CANDLE_MS;let last=0;
function step(dt){G.t+=dt;const c=G.day.c,kk=Math.min(30,G.t/CAN*30|0);G.price=G.path[kk];G.cur[3]=G.price;G.cur[1]=Math.max(G.cur[1],G.price);G.cur[2]=Math.min(G.cur[2],G.price);
 if(G.t>=CAN){G.t-=CAN;G.i=Math.min(c.length-1,G.i+1);G.cur=[c[G.i][0],c[G.i][0],c[G.i][0],c[G.i][0],c[G.i][4]];G.path=mkPath(c[G.i])}}
function hud(){const p=upnl();$('bal').textContent=fmt(S.bal+p);$('price').textContent=G.price.toFixed(2);$('timer').textContent=(G.i+1)+'/40봉';
 const e=$('pnl');if(S.pos){e.textContent=(p>=0?'+':'')+fmt(p)+' '+(S.pos.dir>0?'LONG':'SHORT')+' ×'+S.lev;e.className=p>=0?'g':'r'}
 const pr=Math.max(0,Math.min(1,(S.bal+p-10000)/1000));$('goal').firstChild.style.width=pr*100+'%';$('goalT').textContent='목표 +10%'}
function loop(ts){const dt=Math.min(100,ts-(last||ts));last=ts;step(dt);drawChart();drawFx();hud();requestAnimationFrame(loop)}
setNews(pick(CALM));setTimeout(()=>$('news').className='',0);
S.pos={dir:1,i0:12,px:G.day.c[12][3],bet:1000,pv:Math.sqrt(1000)/3*2,lev:2};S.lev=2;G.arrows.push({i:12,d:1,p:S.pos.px});
renderBar([{id:'trend'},{id:'combo'},{id:'bait',n:3},{id:'nana'}],4);S.pct=30;renderSel([1,2],[10,30]);
requestAnimationFrame(loop);setTimeout(()=>sayM('영차영차!'),3000);
