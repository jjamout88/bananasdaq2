// ENDING after 5-3 clear. Steps 1-4 fixed; step 5 = ENDING_FINALE (swap freely).
// 1 celebration -> 2 모의투자 popup (monkey freeze, BGM cut) -> 3 silence + 喝 slam -> 4 credits (tap to skip) -> 5 finale
function endingScr(){if(!R||!R.result)return;recordRun();save();G.on=false;state='idle';const st=R.st,T=R.T,tm=[];const at=(ms,f)=>tm.push(setTimeout(f,ms));
 const bal=T?T.bal:0,lose=Math.max(0,st.trades-st.wins);
 show('<div id="end" class="end"><canvas id="endFw" width="390" height="844"></canvas><div class="e1"><div class="etl"><span>나스닥 주인</span></div><div class="ebal" id="endBal">$0</div></div></div>');
 const E=$('end'),cv=$('endFw'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;const W=390,H=844;
 const PALF=[['#ffcd2e','#fff7c2','#ef7d57'],['#e43b44','#ff9ec4','#fff'],['#73eff7','#41a6f6','#f4f4f4'],['#a7f070','#38b764','#fff7c2'],['#b55dff','#ff9ec4','#f4f4f4']];
 const BANR=['......NN','.....YY.','....YYY.','..YYYYY.','YYYYYYY.','.YYYYY..','..YYY...'],BC={N:'#5d3a1a',Y:'#ffcd2e'};
 const px=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
 let f=0,raf=0,frozen=false,rk=[],P=[],cf=[],bars=[];
 for(let i=0;i<120;i++)cf.push({x:Math.random()*W,y:-Math.random()*H,v:.6+Math.random()*1.2,s:Math.random()*6,b:Math.random()<.12,col:pick(['#ffcd2e','#e43b44','#73eff7','#a7f070','#ff9ec4','#f4f4f4'])});
 // 불기둥 chart behind: candles rise one by one
 let lv=H-150;for(let i=0;i<34;i++){const o=lv,up=Math.random()<.82,cl=o-(up?8+Math.random()*16:-(4+Math.random()*8));bars.push({o,cl,h:Math.min(o,cl)-3-Math.random()*6,l:Math.max(o,cl)+2+Math.random()*5,up});lv=cl}
 const fire=()=>{const p=pick(PALF);rk.push({x:40+Math.random()*310,y:H-120,vy:-(7+Math.random()*2.2),ty:110+Math.random()*260,p,tr:[]})};
 const burstAt=(x,y,p)=>{const n=46+Math.random()*24|0,ring=Math.random()<.5;for(let k=0;k<n;k++){const a=k/n*6.283+Math.random()*.1,v=ring?2.4:.6+Math.random()*2.4;P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:50+Math.random()*30|0,L:80,col:p[k%3],tr:[]})}snd(150+Math.random()*120,.25,'triangle',.05,-60);setTimeout(()=>snd(2400,.03,'square',.015),120)};
 const POSES=[{arm:1,kneel:0},{arm:.5,kneel:.2,walk:1.5},{arm:0,kneel:.6},{arm:.5,kneel:.2,walk:-1.5},{arm:1,kneel:0,flip:1},{arm:.8,kneel:.4,flip:1},{arm:.2,kneel:.6,flip:1},{arm:.8,kneel:.4}];
 const scene=()=>{
  // bg
  const bg=['#0b0c16','#10122a','#151a3a','#1b2150','#222a5c'];for(let b=0;b<5;b++)px(0,b*H/5,W,H/5+1,bg[b]);
  for(let y=0;y<H;y+=H/5)for(let x=0;x<W;x+=4)px(x+(y%8?2:0),y-1,1,1,'#2a3466');
  // 불기둥 candles (grow in over 1.2s)
  const shown=Math.min(bars.length,f/2|0);for(let i=0;i<shown;i++){const b=bars[i],X=24+i*10,col=b.up?'#e43b44':'#3b7dd8';px(X+2,b.h,1,b.l-b.h,col);const t=Math.min(b.o,b.cl),hh=Math.max(2,Math.abs(b.o-b.cl));px(X,t,5,hh,col);if(b.up)px(X,t,1,hh,'#ff6b6b')}
  if(shown){const lb=bars[shown-1];const gy=Math.min(lb.o,lb.cl);for(let k=0;k<6;k++)px(24+(shown-1)*10+1+Math.random()*3,gy-4-Math.random()*14,1,2,pick(['#ffcd2e','#ef7d57','#fff7c2']))}
  // rockets
  if(!frozen&&f%22===0)fire();
  for(let k=rk.length-1;k>=0;k--){const r=rk[k];if(!frozen){r.tr.push([r.x,r.y]);if(r.tr.length>10)r.tr.shift();r.y+=r.vy;r.vy*=.985;r.x+=Math.sin((f+k)/5)*.3}
   r.tr.forEach((t,j)=>px(t[0],t[1],1,2,j>6?'#fff7c2':'#ef7d57'));px(r.x-1,r.y-1,2,3,'#fff');if(!frozen&&(r.y<=r.ty||r.vy>-1.3)){burstAt(r.x,r.y,r.p);rk.splice(k,1)}}
  // sparks with trails + twinkle
  for(let k=P.length-1;k>=0;k--){const p=P[k];if(!frozen){p.tr.push([p.x,p.y]);if(p.tr.length>5)p.tr.shift();p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy=p.vy*.97+.035;p.l--}
   const fade=p.l<18;p.tr.forEach((t,j)=>{if(j%2===0)px(t[0],t[1],1,1,fade?'#566c86':p.col)});if(!fade||(f+k)%3)px(p.x,p.y,(f+k)%7===0?2:1,(f+k)%7===0?2:1,(f+k)%9===0?'#fff':p.col);if(p.l<=0)P.splice(k,1)}
  // confetti + bananas
  cf.forEach(q=>{if(!frozen){q.y+=q.v;q.x+=Math.sin((f+q.s*20)/14)*.6;if(q.y>H){q.y=-10;q.x=Math.random()*W}}
   if(q.b){for(let j=0;j<BANR.length;j++)for(let i=0;i<8;i++){const ch=BANR[j][i];if(ch!=='.')px(q.x+i,q.y+j,1,1,BC[ch])}}else{const ph=(f/4+q.s)%4|0;px(q.x,q.y,ph%2?1:3,ph%2?3:1,q.col)}});
  // stage + dancing monkey (2x fine pixels)
  px(0,H-96,W,96,'#141833');px(0,H-96,W,2,'#333c57');for(let x=0;x<W;x+=12)px(x+(f/2%12),H-90,6,1,'#262b44');
  const ps=POSES[(f/9|0)%POSES.length],bob=Math.abs(Math.sin(f/9*Math.PI))*3,mx=W/2,my=H-104;
  // spotlight
  c.globalAlpha=.10;c.fillStyle='#fff7c2';c.beginPath();c.moveTo(mx-20,0);c.lineTo(mx+20,0);c.lineTo(mx+70,my+8);c.lineTo(mx-70,my+8);c.fill();c.globalAlpha=1;
  c.save();c.translate(mx,my-bob*2);c.scale(ps.flip&&!frozen?-2.5:2.5,2.5);FX2.monkey(c,0,0,Object.assign({t:f,face:frozen?'sad':'happy'},frozen?{arm:.6,kneel:0}:ps));c.restore();
  px(mx-24,my+2,48,3,'rgba(0,0,0,.35)');
 };
 const loop=()=>{if(!frozen)f++;scene();if(!frozen)raf=requestAnimationFrame(loop)};for(let i=0;i<3;i++)fire();burstAt(90,200,PALF[0]);burstAt(300,260,PALF[2]);loop();bell();
 // balance count-up
 const t0=performance.now(),bEl=$('endBal');const cnt=()=>{const k=Math.min(1,(performance.now()-t0)/1800),e=1-Math.pow(1-k,3);bEl.textContent=money(Math.round(bal*e));if(k<1&&!frozen){if(Math.random()<.3)snd(1200+k*800,.03,'square',.02);requestAnimationFrame(cnt)}else{bEl.textContent=money(bal);bEl.classList.add('pop')}};cnt();
 const stop=()=>{tm.forEach(clearTimeout);cancelAnimationFrame(raf)};
 // 2: popup
 at(3400,()=>{frozen=true;scene();E.classList.add("frz");if(window.BGM)BGM.setHold(true);snd(880,.12,'square',.07);setTimeout(()=>snd(660,.18,'square',.07),140);
  const w=document.createElement('div');w.className='ewin';w.innerHTML='<div class="mt"><span>⚠ 경고</span><i>✕</i></div><div class="eb"><b>!</b><span>※ 이 계좌는<br>선물 모의투자 계좌입니다</span></div>';E.appendChild(w)});
 // 3: silence then 喝 slam (reuse margin-call image + text)
 at(6200,()=>{const src=$('mm').querySelector('img').src;const s=document.createElement('div');s.className='eslam';s.innerHTML='<img src="'+src+'"><b>喝!!!!!!</b>';E.appendChild(s);E.classList.add('eshake');snd(70,.7,'sawtooth',.12,-30);snd(110,.5,'square',.08,-60)});
 // 4: credits
 const nm=i=>ENG.stageInfo(i).name,lines=[['최고 스테이지 수익',money(st.bestP||0)+(st.bestP?' ('+nm(st.bestS||0)+')':'')],['익절',(st.wins||0)+'번'],['손절',lose+'번'],['마진콜',(st.mc||0)+'번'],['일찍 퇴근',(st.early||0)+'번'],['최장 보유',(st.maxHeld||0)+'봉'],['번 일급 총액',money(st.earned||0)],['장착 바나나',R.eq.map(b=>BMAP[b.id][1]+lvTxt(b)).join(', ')||'없음']];
 let credDone=false;const toFinale=()=>{if(credDone)return;credDone=true;stop();ENDING_FINALE(E)};
 at(8800,()=>{E.innerHTML='<div class="ecred"><div class="ecr">'+'<p class="eh">바나나스닥 2</p><p class="es">— 이번 런 기록 —</p>'+lines.map(l=>'<p><span>'+l[0]+'</span><b>'+esc(l[1])+'</b></p>').join('')+'<p class="es" style="margin-top:40px">수고했어</p></div><div class="eskip">탭하면 넘기기</div></div>';
  E.classList.remove('eshake');E.onclick=toFinale;at(16500,toFinale)});
 window.__END={skip:toFinale,stop}}
// 5: finale placeholder — 엄마 메일. Replace this function to swap the finale.
var ENDING_FINALE=function(E){E.onclick=null;
 E.innerHTML='<div class="efin"><div class="mailw ewm"><div class="mt"><span>✉ 엄마</span><i>✕</i></div><div class="ms">밥은 먹었니</div><div class="mb">그래서 선물 끊었니?</div><div class="ebt"><button class="b k" id="eQ">끊었어요</button><button class="b y" id="eA">아직이요</button></div></div></div>';
 const out=()=>{if(window.BGM)BGM.setHold(false)};
 $('eQ').onclick=()=>{out();menu()};
 $('eA').onclick=()=>{out();R=ENG.newRun();META.runs++;saveMeta();save();mapScr()}};
