// 바나나스닥2 — pure game rules (no DOM). Shared by the browser game and node tests/sims.
(function(GL){
const C=()=>GL.CFG;
const r2=v=>Math.round(v*100)/100, r10=v=>Math.round(v/10)*10;
const BT={};GL.BANANAS.forEach(b=>BT[b[0]]={id:b[0],name:b[1],tier:b[2],desc:b[3]});
const ENG={rng:Math.random,BT,r2,r10};
const rnd=()=>ENG.rng(),ri=n=>Math.floor(rnd()*n),pick=a=>a[ri(a.length)];
const BOSSK=['witch','cpi','fomc','earn','party'];
ENG.BOSSK=BOSSK;
ENG.BOSS_INFO={witch:['세 마녀의 날','마녀 셋이 3봉 동안 차트 위를 날아다니며 캔들을 가려'],cpi:['메일 폭탄의 날','발표 순간 메일 폭탄! 팝업창이 화면을 가려 ([확인]을 눌러야 꺼져, 거래는 가능)'],fomc:['FOMC','의장님 연설 중엔 버튼이 잠겨'],earn:['실적 시즌','실적 쇼크! 화면이 3봉 동안 뒤집혀 (버튼 의미는 그대로)'],party:['대환장 파티','모든 기믹 랜덤(메일 폭탄 포함) + 리밋다운(3봉 블루스크린)\n바나나 1개가 이번 판 동안 꺼져'],limit:['리밋다운','블루스크린! 3봉 동안 차트·금액·손익이 안 보여 (거래는 가능)']};
// ---------- chart pools ----------
let POOL=null;
ENG.pools=function(){if(POOL)return POOL;
 const D2=GL.NQDATA2.days.map(d=>d.c),DO=GL.NQDATA_OPEN.days.map(d=>d.c),all=D2.concat(DO);
 const av=(c,a,b)=>{let s=0;for(let i=a;i<b;i++)s+=(c[i][1]-c[i][2])/c[i][0];return s/(b-a)};
 const openAvg=D2.reduce((s,c)=>s+av(c,0,60),0)/D2.length;
 const nN=C().N_NORMAL,nB=C().N_BOSS,normal=[],boss=[];
 all.forEach((c,di)=>{for(let o=0;o+nN<=c.length;o+=2)if(av(c,o,o+nN)>=C().VOL_MIN_RATIO*openAvg)normal.push([di,o]);
  for(let o=0;o+nB<=c.length;o+=2)boss.push([di,o,av(c,o,o+nB)])});
 boss.sort((a,b)=>b[2]-a[2]);
 return POOL={all,normal,boss:boss.slice(0,Math.ceil(boss.length*C().BOSS_TOP)),openAvg}};
ENG.makeChart=function(isBoss){const P=ENG.pools(),n=isBoss?C().N_BOSS:C().N_NORMAL;const [di,o]=pick(isBoss?P.boss:P.normal);
 let c=P.all[di].slice(o,o+n).map(k=>[k[0],k[1],k[2],k[3],k[4]||0]);const hf=rnd()<.5,vf=rnd()<.5;
 if(hf)c=c.reverse().map(([o,h,l,cl,v])=>[cl,h,l,o,v]);
 const m=c[0][0];if(vf)c=c.map(([o,h,l,cl,v])=>[2*m-o,2*m-l,2*m-h,2*m-cl,v]);
 const k=20000/m,vx=C().VOL_X||1,q=x=>r2(20000+(x*k-20000)*vx);return {bars:c.map(b=>[q(b[0]),q(b[1]),q(b[2]),q(b[3]),b[4]|0]),src:[di,o,hf,vf]}};
// ---------- run ----------
ENG.newRun=()=>({ver:1,stage:0,wage:0,cap:C().WAGE_CAP0,levU:[1],betU:[10],lev:1,pct:10,eq:[],slots:C().SLOTS,comp:0,shelfBonus:false,shop:null,phase:'map',T:null,
 st:{trades:0,wins:0,longN:0,shortN:0,liq:0,bait:0,nana:0,bought:0,earned:0},hist:[],settle:null,result:null});
ENG.stageInfo=s=>{const ch=Math.floor(s/3),k=s%3;return {ch,k,boss:k===2,start:C().START_BAL[ch],target:C().TARGET[ch][k],name:(ch+1)+'-'+(k+1),bk:k===2?BOSSK[ch]:null}};
ENG.has=(R,id)=>R.eq.some(b=>b.id===id)&&!(R.T&&R.T.disabled===id);
const has=ENG.has;
ENG.lv=(R,id)=>{const b=R.eq.find(b=>b.id===id);return b&&b.lv||0};ENG.boost=(R,id)=>1+C().UPG.boost*ENG.lv(R,id);
ENG.sched=function(kind,n){const G=C().GIMMICK;const kinds=[];for(let e=0;e<G.count;e++)kinds.push(kind==='party'?pick(['witch','cpi','fomc','earn','limit']):kind);
 if(kind==='party'){const K=['witch','cpi','fomc','earn','limit'];if(!kinds.includes('limit'))kinds[ri(kinds.length)]='limit';
  for(let e=1;e<kinds.length;e++)if(kinds[e]===kinds[e-1]){const lim=kinds.filter(k=>k==='limit').length;const opts=K.filter(k=>k!==kinds[e-1]&&k!==kinds[e+1]&&!(kinds[e]==='limit'&&lim===1));if(opts.length)kinds[e]=pick(opts)}}
 const durs=kinds.map(k=>G.dur[k]);const first=3,lastEnd=n-2;
 const slack=lastEnd-first-durs.reduce((a,b)=>a+b,0)-G.minGap*(G.count-1);
 const w=kinds.map(()=>rnd()).concat([rnd()]);const ws=w.reduce((a,b)=>a+b,0);
 const ev=[];let at=first;for(let e=0;e<kinds.length;e++){at+=Math.floor(Math.max(0,slack)*w[e]/ws);ev.push({at,k:kinds[e],d:durs[e]});at+=durs[e]+G.minGap}
 return ev};
ENG.gimAt=(T,i)=>{for(const e of T.gim)if(i>=e.at&&i<e.at+e.d)return e.k;return null};
ENG.warnAt=(T,i)=>{const W=C().GIMMICK.warn;for(const e of T.gim)if(e.at>i&&e.at-i<=W)return e.k;return null};
ENG.warnIn=(T,i)=>{const W=C().GIMMICK.warn;for(const e of T.gim)if(e.at>i&&e.at-i<=W)return e.at-i;return 0};
ENG.startStage=function(R){const si=ENG.stageInfo(R.stage);const {bars}=ENG.makeChart(si.boss);
 const T={bars,n:bars.length,i:0,boss:si.bk,bal:si.start,start:si.start,target:si.target,pos:null,combo:0,opened:0,baitN:C().BAIT_N+ENG.lv(R,'bait')*C().UPG.bait,nanaLeft:1+ENG.lv(R,'nana')*C().UPG.nana,nanaUsed:false,
  gim:si.boss?ENG.sched(si.bk,bars.length):[],disabled:null,arrows:[],wins:0,trades:0,liq:0,fees:0,reached:false,res:null};
 if(si.ch===4&&si.boss&&R.eq.length)T.disabled=pick(R.eq).id;
 R.T=T;R.phase='trade';R.settle=null;return T};
ENG.fee=(R,bet)=>has(R,'fee')?0:r2(C().FEE_FLAT+bet*C().FEE_PCT);
ENG.betSize=function(R){const T=R.T;let bet;
 if(has(R,'allin'))bet=has(R,'fee')?Math.floor(T.bal):Math.floor((T.bal-C().FEE_FLAT)/(1+C().FEE_PCT));
 else bet=Math.floor(T.bal*R.pct/100);
 return bet>=C().MINBET?bet:0};
ENG.trendAt=(T,i)=>{if(i<3)return 0;let s=0;for(let j=i-3;j<i;j++){const d=Math.sign(T.bars[j][3]-T.bars[j][0]);if(!d)return 0;s+=d}return s===3?1:s===-3?-1:0};
ENG.upnl=(T,price)=>T.pos?(price-T.pos.px)*T.pos.dir*T.pos.pv:0;
ENG.locked=T=>{const g=ENG.gimAt(T,T.i);return g==='fomc'};
ENG.enter=function(R,dir,price){const T=R.T;if(!T||R.phase!=='trade')return {err:'phase'};if(T.pos)return {err:T.pos.dir===dir?'same':'open'};
 let closed=null;
 const bet=ENG.betSize(R);if(!bet)return {err:'잔고 부족',closed};
 const f=ENG.fee(R,bet);T.bal=r2(T.bal-f);T.fees+=f;const tr=ENG.trendAt(T,T.i);
 T.pos={dir,px:price,bet,pv:Math.sqrt(bet)/C().PV_DIV*R.lev,lev:R.lev,i0:T.i,tr:tr===dir?1:tr===-dir?-1:0,first:T.opened===0};
 T.opened++;T.arrows.push({i:T.i,d:dir,p:price});if(T.arrows.length>40)T.arrows.shift();if(dir>0)R.st.longN++;else R.st.shortN++;
 return {opened:T.pos,closed}};
ENG.close=function(R,price,why='close'){const T=R.T,ps=T&&T.pos;if(!ps)return null;
 const base=ENG.upnl(T,price),held=T.i-ps.i0;let p=base,mult=1,bonus=0;const tags=[];
 if(why==='liq')p=-ps.bet;else if(why==='bait')p=-ps.bet*C().BAIT_LOSS;else if(why==='nana')p=Math.abs(base);
 else if(base>0){const M=(id,x,ok,lab)=>{if(ok&&has(R,id)){if(id!=='combo')x=1+(x-1)*ENG.boost(R,id);mult*=x;tags.push(lab||(BT[id].name+'×'+(+x.toFixed(2))))}};
  M('trend',C().TREND_X,ps.tr===1);M('counter',C().COUNTER_X,ps.tr===-1);M('hold',C().HOLD_X,held>=C().HOLD_BARS);M('scalp',C().SCALP_X,held<=C().SCALP_BARS);
  M('long',C().LONG_X,ps.dir>0);M('short',C().SHORT_X,ps.dir<0);M('first',C().FIRST_X,ps.first);M('allin',C().ALLIN_X,true);
  M('combo',1+(C().COMBO_STEP+C().UPG.combo*ENG.lv(R,'combo'))*T.combo,T.combo>0);
  p=base*mult;if(has(R,'fee')&&ENG.lv(R,'fee')){p+=C().UPG.feeRebate*ENG.lv(R,'fee');tags.push('리베이트')}if(has(R,'compound')&&R.comp>0){bonus=base*R.comp/100;p+=bonus;tags.push('복리+'+R.comp.toFixed(1)+'%')}}
 const f=ENG.fee(R,ps.bet);T.bal=r2(Math.max(0,T.bal+p-f));T.fees+=f;T.pos=null;T.trades++;R.st.trades++;
 if(p>0){T.wins++;R.st.wins++;if(why!=='nana'){T.combo++;if(has(R,'compound'))R.comp=Math.round((R.comp+(C().COMPOUND_STEP+C().UPG.compound*ENG.lv(R,'compound'))*100)*1000)/1000}}else T.combo=0;
 if(why==='liq'){T.liq++;R.st.liq++}
 if(T.bal>=T.start*(1+T.target/100))T.reached=true;
 return {p:r2(p),base:r2(base),mult,bonus:r2(bonus),fee:f,why,tags,held,dir:ps.dir}};
ENG.check=function(R,price){const T=R.T;if(!T||!T.pos)return null;if(-ENG.upnl(T,price)<T.pos.bet)return null;
 if(has(R,'bait')&&T.baitN>0){T.baitN--;R.st.bait++;return ENG.close(R,price,'bait')}return ENG.close(R,price,'liq')};
ENG.canNana=(R,price)=>has(R,'nana')&&R.T.nanaLeft>0&&!!R.T.pos&&ENG.upnl(R.T,price)<0;
ENG.nana=function(R,price){if(!ENG.canNana(R,price))return null;R.T.nanaLeft--;R.T.nanaUsed=R.T.nanaLeft<=0;R.st.nana++;return ENG.close(R,price,'nana')};
ENG.bust=R=>!R.T.pos&&R.T.bal<C().MINBET+(has(R,'fee')?0:C().FEE_FLAT*2);
// call when candle T.i finished. returns {end}
ENG.candle=function(R){const T=R.T;T.i++;if(T.i>=T.n){ENG.endStage(R);return {end:true}}return {end:false,gim:ENG.gimAt(T,T.i),warn:ENG.warnAt(T,T.i)}};
ENG.endStage=function(R,bust){const T=R.T;let last=null;if(T.pos)last=ENG.close(R,T.bars[T.n-1][3],'eod');
 const ret=(T.bal-T.start)/T.start*100;const pass=!bust&&ret>=T.target-1e-9;
 T.res={ret:r2(ret),pass,profit:r2(T.bal-T.start),bust:!!bust,last};R.hist.push({stage:R.stage,ret:r2(ret),pass});
 if(pass){R.phase='settle';ENG.settle(R)}else{R.phase='over';ENG.finishRun(R,false)}return T.res};
ENG.settle=function(R){const T=R.T,si=ENG.stageInfo(R.stage),I=C().INTEREST,N=C().NEGO;const piggy=has(R,'piggy');
 const raw=Math.max(0,T.res.profit)*C().WAGE_PCT,pay=Math.round(Math.min(raw,R.cap));
 const s={raw:Math.round(raw),pay,capped:raw>R.cap,cap:R.cap,piggy:piggy?I.piggyStage+C().UPG.piggyStage*ENG.lv(R,'piggy'):0,nego:null,carry:R.wage,interest:0,shelfBonus:false};
 if(!si.boss&&T.res.ret>=T.target*C().SHELF_BONUS_X)s.shelfBonus=true;
 if(si.boss&&R.stage<14){const over=Math.min(T.res.ret/T.target,N.maxOver);let x=rnd(),mood=null;for(const m of N.moods){if(x<m[0]){mood=m;break}x-=m[0]}if(!mood)mood=N.moods[1];
  const mx=mood[1]==='bonus'?1:mood[1];const inc=r10(N.base*over*mx*(si.ch+1));const bonus=mood[1]==='bonus'?r10((R.cap+inc)*.5):0;
  s.nego={over:r2(over),mood:mood[1],inc,bonus,before:R.cap}}
 R.settle=s;return s};
// apply settlement (called once when leaving settlement screen): pay wage, raise cap, interest, open shop
ENG.applySettle=function(R){const s=R.settle;if(!s||s.applied)return;const I=C().INTEREST;
 R.wage+=s.pay+s.piggy;if(s.nego){R.cap+=s.nego.inc;R.wage+=s.nego.bonus}
 s.interest=Math.min(r10(s.carry*I.pct),has(R,'piggy')?I.capPiggy+C().UPG.piggyCap*ENG.lv(R,'piggy'):I.cap);R.wage+=s.interest;R.st.earned+=s.pay+s.piggy+s.interest+(s.nego?s.nego.bonus:0);
 R.shelfBonus=s.shelfBonus;s.applied=true;
 if(R.stage>=14){R.phase='clear';ENG.finishRun(R,true)}else{R.phase='shop';ENG.openShop(R)}};
// ---------- shop ----------
ENG.price=(R,v)=>r10(v*(has(R,'disc')?1-C().DISC-C().UPG.disc*ENG.lv(R,'disc'):1));
ENG.rollShelf=function(R,n){const own=new Set(R.eq.map(b=>b.id));const out=[];const used=new Set();
 for(let k=0;k<n;k++){let tier=0,x=rnd();const o=C().TIER_ODDS;tier=x<o[0]?0:x<o[0]+o[1]?1:2;
  let pool=GL.BANANAS.filter(b=>!own.has(b[0])&&!used.has(b[0]));if(!pool.length){out.push(null);continue}
  let tp=pool.filter(b=>b[2]===tier);if(!tp.length)tp=pool;const b=pick(tp);used.add(b[0]);
  out.push({id:b[0],base:r10(C().TIER_PRICE[b[2]]*(1+(rnd()*2-1)*C().PRICE_JITTER))})}return out};
ENG.openShop=function(R){const n=C().SHELF+(R.shelfBonus?1:0);R.shop={offer:ENG.rollShelf(R,n),rr:0,free:has(R,'coupon')?1+ENG.lv(R,'coupon')*C().UPG.coupon:0,n}};
ENG.upgDesc=(id,lv)=>{const U=C().UPG;if(!lv)return '';const pc=v=>Math.round(v*1000)/10;switch(id){case 'combo':return '연승 보너스 +'+pc(C().COMBO_STEP+U.combo*lv)+'%/연승';case 'bait':return '방어 횟수 '+(C().BAIT_N+U.bait*lv)+'회';case 'coupon':return '무료 리롤 '+(1+U.coupon*lv)+'회';case 'piggy':return '스테이지당 +$'+(C().INTEREST.piggyStage+U.piggyStage*lv)+', 이자 한도 $'+(C().INTEREST.capPiggy+U.piggyCap*lv);case 'compound':return '이긴 거래마다 +'+pc(C().COMPOUND_STEP+U.compound*lv)+'%';case 'disc':return '상점 -'+pc(C().DISC+U.disc*lv)+'%';case 'fee':return '익절마다 리베이트 +$'+U.feeRebate*lv;case 'nana':return '스테이지당 '+(1+U.nana*lv)+'회';default:return '배율 보너스 +'+Math.round(U.boost*lv*100)+'% (예: ×2 → ×'+(1+(1)*(1+U.boost*lv)).toFixed(2)+')'}};
ENG.upgCost=(R,idx)=>{const b=R.eq[idx];if(!b||(b.lv||0)>=C().UPG.max)return null;return {pr:ENG.price(R,C().UPG.cost[b.lv||0]),p:C().UPG.p[b.lv||0]}};
ENG.upgrade=function(R,idx){const c=ENG.upgCost(R,idx);if(!c)return {err:'max'};if(R.wage<c.pr)return {err:'일급 부족'};R.wage-=c.pr;const b=R.eq[idx];b.paid+=c.pr;const ok=rnd()<c.p;if(ok)b.lv=(b.lv||0)+1;R.st.upg=(R.st.upg||0)+1;return {ok:1,success:ok,lv:b.lv||0}};
ENG.rerollCost=R=>R.shop.free>0?0:ENG.price(R,C().REROLL+C().REROLL_STEP*R.shop.rr);
ENG.reroll=function(R){const c=ENG.rerollCost(R);if(R.wage<c)return {err:'일급 부족'};R.wage-=c;if(R.shop.free>0&&c===0)R.shop.free--;else R.shop.rr++;R.shop.offer=ENG.rollShelf(R,R.shop.n);return {ok:1,cost:c}};
ENG.sellValue=b=>r10(b.paid*C().SELL_PCT);
ENG.sell=function(R,idx){const b=R.eq[idx];if(!b)return {err:'없음'};const v=ENG.sellValue(b);R.eq.splice(idx,1);R.wage+=v;if(b.id==='coupon'&&R.shop)R.shop.free=0;return {ok:1,v,id:b.id}};
ENG.buy=function(R,k,replaceIdx){const o=R.shop&&R.shop.offer[k];if(!o)return {err:'없음'};const pr=ENG.price(R,o.base);
 let refund=0;const full=R.eq.length>=R.slots;if(full){if(replaceIdx==null||!R.eq[replaceIdx])return {err:'full'};refund=ENG.sellValue(R.eq[replaceIdx])}
 if(R.wage+refund<pr)return {err:'일급 부족'};
 if(full)ENG.sell(R,replaceIdx);R.wage-=pr;R.eq.push({id:o.id,paid:pr});R.shop.offer[k]=null;R.st.bought++;
 if(o.id==='coupon'&&R.shop)R.shop.free=Math.max(R.shop.free,0);return {ok:1,pr}};
ENG.nextLev=R=>{const L=C().LEV,i=L.findIndex(l=>l[0]===Math.max(...R.levU));return L[i+1]?{v:L[i+1][0],pr:ENG.price(R,L[i+1][1])}:null};
ENG.nextBet=R=>{const L=C().BET,i=L.findIndex(l=>l[0]===Math.max(...R.betU));return L[i+1]?{v:L[i+1][0],pr:ENG.price(R,L[i+1][1])}:null};
ENG.buyLev=function(R){const n=ENG.nextLev(R);if(!n)return {err:'max'};if(R.wage<n.pr)return {err:'일급 부족'};R.wage-=n.pr;R.levU.push(n.v);R.lev=n.v;return {ok:1}};
ENG.buyBet=function(R){const n=ENG.nextBet(R);if(!n)return {err:'max'};if(R.wage<n.pr)return {err:'일급 부족'};R.wage-=n.pr;R.betU.push(n.v);R.pct=n.v;return {ok:1}};
ENG.slotPrice=R=>R.slots>C().SLOTS?null:ENG.price(R,C().SLOT4_PRICE);
ENG.buySlot=function(R){const p=ENG.slotPrice(R);if(p==null)return {err:'max'};if(R.wage<p)return {err:'일급 부족'};R.wage-=p;R.slots++;return {ok:1}};
ENG.nextStage=function(R){if(R.phase!=='shop'||R.stage>=14)return false;R.stage++;R.shop=null;R.T=null;R.phase='map'};
// ---------- run titles ----------
ENG.TITLES=[['한강 수영선수','swim'],['깡통 원숭이','can'],['마녀에게 털린 개미','cry'],['존버 원숭이','hold'],['수수료 기부천사','angel'],['CPI 희생양','sweat'],
 ['치킨값 사냥꾼','pick'],['스캘퍼','shade'],['FOMC 생존 실패','band'],['차트 무당','shaman'],['익절 장인','chef'],['실적 시즌 낙오자','grit'],
 ['고래','whale'],['월가의 원숭이','wolf'],['월가의 킹콩','rich'],['나스닥 주인','crown']];
ENG.SPECIAL=[['돌숭이','stone',(R)=>R.st.trades===0,'한 번도 매매 안 하고 끝'],['청산 수집가','liq',R=>R.st.liq>=3,'청산 3회 이상'],
 ['기사회생 원숭이','phoenix',R=>R.st.bait>=3,'미끼로 3번 살아남기'],['나나바 마술사','oneshot',R=>R.st.nana>=3,'나나바 3회 사용'],
 ['손가락 관절염','wrist',R=>R.st.trades>=150,'한 런에 150회 매매'],['롱숭이','long',R=>R.st.longN>=20&&R.st.shortN===0,'롱만 20번'],
 ['숏숭이','short',R=>R.st.shortN>=20&&R.st.longN===0,'숏만 20번'],['바나나 수집가','gukbap',R=>R.eq.length>=4,'바나나 4개 장착']];
ENG.finishRun=function(R,clear){const idx=clear?15:R.stage;const t=ENG.TITLES[idx];const sp=ENG.SPECIAL.filter(s=>s[2](R)).map(s=>s[0]);
 R.result={clear,stage:R.stage,title:t[0],kind:t[1],specials:sp};return R.result};
GL.ENG=ENG;
})(typeof window!=='undefined'?window:globalThis);
