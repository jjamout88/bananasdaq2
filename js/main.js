// 바나나스닥2 — UI / screens / trade loop. Rules live in engine.js, numbers in config.js.
const BAD=/(노[\s!?.…~ㅋㅎ]*$)|좆|씨발|시발|병신|샤갈|개추|새끼|나선|워렌/;
const clean=a=>{for(let i=a.length-1;i>=0;i--)if(BAD.test(a[i]))a.splice(i,1)};
Object.values(MUT).forEach(clean);[MLOSS,BUSTL,UP,DN,CALM].forEach(a=>{try{clean(a)}catch(e){}});
const QS=new URLSearchParams(location.search);let SPEED=+QS.get('speed')||1;
let R=null,T=null,S={pos:null,combo:0,rank:0},G={on:false,day:null,i:0,t:0,price:0,cur:null,path:[],arrows:[]};
let MX=8,MY=291,MS=0.6;state='idle';
const ptVal=()=>S.pos?S.pos.pv:0;
function upnl(){return T?ENG.upnl(T,G.price):0}
const BMAP=Object.fromEntries(BANANAS.map(b=>[b[0],b]));
const TN=['일반','희귀','전설'];
// ---------- meta / settings ----------
let META={snd:true,bgm:true,bgmVol:.6,tut:false,dex:{},runs:0,clears:0};
try{Object.assign(META,JSON.parse(localStorage.getItem(CFG.META_KEY)||'{}'))}catch(e){}
const saveMeta=()=>{try{localStorage.setItem(CFG.META_KEY,JSON.stringify(META))}catch(e){}};
const _snd=snd;snd=function(...a){if(META.snd)_snd(...a)};
function save(){if(!R)return;try{if(R.phase==='over'||R.phase==='clear')localStorage.removeItem(CFG.SAVE_KEY);else localStorage.setItem(CFG.SAVE_KEY,JSON.stringify(R))}catch(e){}}
function loadSave(){try{const r=JSON.parse(localStorage.getItem(CFG.SAVE_KEY));return r&&r.ver===1&&r.phase&&r.stage>=0&&r.stage<=14?r:null}catch(e){return null}}
// ---------- small ui helpers ----------
function setNews(t,hot,sticky){const n=$('news');n.innerHTML='<span>'+(hot?'🚨 ':'📰 ')+t+'</span>';n.className='show';n.style.color=hot?'#ff6b6b':'#ffcd75';clearTimeout(n._t);n._sticky=!!sticky;if(!sticky)n._t=setTimeout(()=>n.className='',2600)}
function clearSticky(){const n=$('news');if(n._sticky){n._sticky=false;n.className=''}}
const toast=(t,hot)=>setNews(t,hot);
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const money=v=>'$'+Math.round(v).toLocaleString();
const ov=$('ov'),md=$('modal');
function show(html){closeModal();clearMails();if(window.WCH)WCH.halt();ov.innerHTML=html;ov.className='on';$('fx').style.display='none'}
function hideOv(){ov.className='';ov.innerHTML='';$('fx').style.display=''}
function modal(html){md.innerHTML='<div class="box">'+html+'</div>';md.className='on';return md.firstChild}
function closeModal(){md.className='';md.innerHTML=''}
function confirmBox(title,msg,yes,onYes,no='취소'){const b=modal('<h2>'+title+'</h2><p>'+msg+'</p><div class="btns"><button class="b k" id="mN">'+no+'</button><button class="b y" id="mY">'+yes+'</button></div>');$('mN').onclick=()=>{closeModal();snd(300,.05)};$('mY').onclick=()=>{closeModal();onYes()}}
function bcan(id,lv){const c=BART.canvas(id,1);return c}
const lvTxt=b=>b&&b.lv?' +'+b.lv:'';
function tip(el,b){const m=BMAP[b.id];const t=$('tip');if(t._for===el&&t.style.display==='block'){t.style.display='none';return}t._for=el;t.innerHTML='<b>'+m[1]+'바나나'+lvTxt(b)+'</b> '+TN[m[2]]+'<br>'+m[3]+(T&&T.disabled===b.id?'<br><b>먹통! (이번 판 꺼짐)</b>':'');t.style.display='block';const r=el.getBoundingClientRect(),RR=$('root').getBoundingClientRect(),s=RR.width/390;t.style.left=Math.max(4,Math.min(390-t.offsetWidth-6,(r.left-RR.left)/s))+'px';t.style.top=Math.max(4,(r.bottom-RR.top)/s+8)+'px';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2500)}
function invHTML(){let h='<div class="inv">';for(let i=0;i<R.slots;i++){const b=R.eq[i];h+=b?'<div class="bs t'+BMAP[b.id][2]+'" data-i="'+i+'"></div>':'<div class="bs e"></div>'}h+='</div>';return h}
function fillInv(root,onTap){root.querySelectorAll('.inv .bs[data-i],.altrow .bs[data-i]').forEach(d=>{const b=R.eq[+d.dataset.i];d.appendChild(bcan(b.id));if(b.lv){const x=document.createElement('b');x.className='lvb';x.textContent='+'+b.lv;x.style.cssText='position:absolute;top:-8px;right:-8px;font-size:10px;background:#ffcd2e;color:#1a1c2c;border:2px solid #000;padding:0 2px';d.appendChild(x)}d.onclick=()=>onTap?onTap(+d.dataset.i,d):tip(d,b)})}
function fit(){const sa=$('sa'),cs=sa?getComputedStyle(sa):null,g=k=>cs?parseFloat(cs[k])||0:0;const t=g('paddingTop'),b=g('paddingBottom'),l=g('paddingLeft'),r=g('paddingRight');const W=innerWidth-l-r,H=innerHeight-t-b;const s=Math.min(W/390,H/844);const rt=$('root');rt.style.transform=`scale(${s})`;rt.style.left=(l+(W-390*s)/2)+'px';rt.style.top=t+'px'}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));fit();
// ---------- menu ----------
function menu(){G.on=false;state='idle';const sv=loadSave();
 show('<div id="logo">바나나스닥2<small>NQ 선물 스캘핑 로그라이크</small></div><canvas id="mban" width="64" height="64" style="width:128px;height:128px;image-rendering:pixelated;margin-top:30px"></canvas><div class="mcol">'+
 (sv?'<button class="b y big" id="mC">이어하기 <small style="font-size:12px">('+ENG.stageInfo(sv.stage).name+')</small></button>':'')+
 '<button class="b g big rs" id="mN">처음부터</button><button class="b big" id="mD">칭호 도감</button><button class="b k big" id="mS">⚙ 설정</button></div><p class="sub" style="margin-top:auto;margin-bottom:18px">모든 시나리오는 가상입니다 · 투자 권유 아님</p>');
 BART.draw($('mban').getContext('2d'),'trend',0,0,4);
 if(sv)$('mC').onclick=()=>{R=sv;resume()};
 $('mN').onclick=()=>{const go=()=>{R=ENG.newRun();META.runs++;saveMeta();save();mapScr()};sv?confirmBox('처음부터?','저장된 런('+ENG.stageInfo(sv.stage).name+')이 사라져.','새로 시작',go):go()};
 $('mD').onclick=()=>dexScr(menu);$('mS').onclick=()=>settings();}
function settings(after,inRun){BGM.setHold(false);const row=(k,l,ic)=>'<div class="sRow"><span>'+ic+' '+l+'</span><button class="b sTg '+(META[k]?'g':'k')+'" data-k="'+k+'">'+(META[k]?'ON':'OFF')+'</button></div>';const v=Math.round((META.bgmVol==null?.6:META.bgmVol)*100);
 modal('<h2 class="sTtl">⚙ 설정</h2><div class="sPan">'+row('bgm','배경음악','🎵')+'<div class="sRow sVol'+(META.bgm?'':' dim')+'"><span>🔊 BGM 볼륨</span><b id="sVv">'+v+'</b></div><input type="range" id="sVol" class="sRng" min="0" max="100" step="5" value="'+v+'">'+row('snd','효과음','💥')+'</div>'+(inRun?'<div class="btns" style="flex-direction:column"><button class="b k" id="sMenu">메인 메뉴 (저장됨)</button><button class="b r rs" id="sNew">처음부터</button></div>':'')+'<div class="btns"><button class="b y big" id="sX">닫기</button></div>');
 const rg=$('sVol');rg.oninput=()=>{META.bgmVol=rg.value/100;$('sVv').textContent=rg.value;BGM.sync()};rg.onchange=()=>saveMeta();
 md.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{META[b.dataset.k]=!META[b.dataset.k];saveMeta();BGM.sync();settings(after,inRun);snd(900,.04)});if(inRun){$('sMenu').onclick=()=>{closeModal();save();menu()};$('sNew').onclick=()=>confirmBox('처음부터?','지금 런이 사라져.','새로 시작',()=>{R=ENG.newRun();META.runs++;saveMeta();save();shopTab=0;mapScr()})}$('sX').onclick=()=>{closeModal();after&&after()}}
function dexScr(back){let h='<div class="hdr"><span>칭호 도감</span><b>'+Object.keys(META.dex).length+'/'+(ENG.TITLES.length+ENG.SPECIAL.length)+'</b></div><div class="dex">';
 ENG.TITLES.forEach((t,i)=>{const g=META.dex[t[0]];h+='<div class="'+(g?'got':'')+'">'+(g?'<canvas width="132" height="132" data-k="'+t[1]+'"></canvas>'+t[0]:'???<br><small>'+(i<15?ENG.stageInfo(i).name+' 탈락':'클리어')+'</small>')+'</div>'});
 ENG.SPECIAL.forEach(t=>{const g=META.dex[t[0]];h+='<div class="'+(g?'got':'')+'">'+(g?'<canvas width="132" height="132" data-k="'+t[1]+'"></canvas>'+t[0]:'???<br><small>'+t[3]+'</small>')+'</div>'});
 show(h+'</div><div class="btns"><button class="b y big" id="dB">돌아가기</button></div>');ov.querySelectorAll('canvas[data-k]').forEach(c=>{try{drawPortrait(c,c.dataset.k)}catch(e){}});$('dB').onclick=back}
// ---------- map ----------
const CHN=['인턴','대리','과장','부장','이사'];
function mapScr(){R.phase='map';save();G.on=false;state='idle';
 let h='<div class="hdr"><span>일급 지갑</span><b>'+money(R.wage)+'</b><span>상한 '+money(R.cap)+'</span></div><div class="ttl">스케줄표</div><div class="map">';
 for(let c=0;c<5;c++){h+='<div class="chap'+(Math.floor(R.stage/3)===c?' cur':'')+'"><div class="cn"><b>'+(c+1)+'장</b>'+CHN[c]+'<br>'+money(CFG.START_BAL[c]/1000)+'k</div>';
  for(let k=0;k<3;k++){const s=c*3+k,si=ENG.stageInfo(s);if(k)h+='<div class="link"></div>';h+='<div class="node'+(si.boss?' boss':'')+(s<R.stage?' done':s===R.stage?' now':'')+'">'+(s<R.stage?'✔':si.boss?'☠':'')+' '+si.name+'<small>+'+si.target+'%</small></div>'}h+='</div>'}
 h+='</div><div class="sub" style="margin-top:10px">레버 ×'+Math.max(...R.levU)+' · 베팅 '+Math.max(...R.betU)+'%</div>'+invHTML()+'<div class="btns" style="margin-top:auto;margin-bottom:24px"><button class="b k" id="mpM">메뉴</button><button class="b y big" style="min-width:200px" id="mpGo">출근하기 ▶</button></div>';
 show(h);fillInv(ov);$('mpGo').onclick=brief;$('mpM').onclick=menu}
function brief(){const si=ENG.stageInfo(R.stage);let msg='시작 잔고 '+money(si.start)+'\n목표 '+money(si.start*(1+si.target/100))+' (+'+si.target+'%)\n'+(si.boss?CFG.N_BOSS:CFG.N_NORMAL)+'봉 × 3초';
 let h='<h2>'+(si.boss?'☠ BOSS '+si.name+' · '+ENG.BOSS_INFO[si.bk][0]:'STAGE '+si.name)+'</h2><p>'+msg+'</p>';
 if(si.boss)h+='<p style="color:#ffcd2e">'+ENG.BOSS_INFO[si.bk][1]+'\n(60봉 중 5번, 1봉 전에 경고)</p><p class="sub">※ 이 시나리오는 가상이며 실제 사건과 무관합니다.</p>';
 modal(h+'<div class="btns"><button class="b k" id="bB">뒤로</button><button class="b y" id="bGo">장 시작!</button></div>');$('bB').onclick=closeModal;$('bGo').onclick=()=>{closeModal();if(R.phase!=='map')return;ENG.startStage(R);save();enterTrade(false)}}
// ---------- tutorial ----------
const TUT=[['① 매매','LONG = 오를 때 돈 벌기\nSHORT = 내릴 때 돈 벌기\n익절/손절 = 포지션 정리 (지금 손익 기준으로 글자가 바뀌어)\n포지션 잡으면 버튼이 익절(빨강)/손절(파랑) 하나로 바뀌어'],['② 목표','장 마감까지 잔고가 목표 금액을 넘어야 해.\n못 넘으면 런 끝!\n손실이 베팅금만큼 커지면 강제청산.'],['③ 일급 & 상점','클리어하면 수익의 30%가 일급(상한 있음).\n일급으로 레버리지·베팅·바나나를 사.\n보스를 잡으면 연봉협상으로 상한 UP.']];
function tutorial(i,done){if(i>=TUT.length){META.tut=true;saveMeta();closeModal();done();return}
 modal('<h2>'+TUT[i][0]+'</h2><p>'+TUT[i][1]+'</p><p class="sub">'+(i+1)+'/'+TUT.length+'</p><div class="btns"><button class="b k" id="tS">건너뛰기</button><button class="b y" id="tN">'+(i<TUT.length-1?'다음':'시작!')+'</button></div>');
 $('tN').onclick=()=>tutorial(i+1,done);$('tS').onclick=()=>tutorial(99,done)}
// ---------- trade ----------
let paused=true,news={},mutTimer=0,lastHud={},nanaState=null,gimCls='';
const CAN=CFG.CANDLE_MS;
function enterTrade(resumed){T=R.T;S=T;hideOv();closeModal();state='play';G.on=true;G.day={c:T.bars};G.arrows=T.arrows;G.i=T.i;G.t=0;G.whale=0;
 const b=T.bars[T.i];G.cur=[b[0],b[0],b[0],b[0],b[4]];G.path=mkPath(b);G.price=b[0];news=planNews(T.bars);lastHud={};nanaState=null;dangerOff();
 const si=ENG.stageInfo(R.stage);$('day').textContent=si.boss?'☠ '+si.name+' '+ENG.BOSS_INFO[si.bk][0]:'STAGE '+si.name;
 renderBar();renderSel();applyGim();
 if(T.disabled&&!resumed){const dn=BMAP[T.disabled][1];setTimeout(()=>toast(dn+'바나나 먹통! 이번 판 꺼짐',true),600)}
 if(resumed){paused=true;pauseMenu(true)}
 else if(!META.tut){paused=true;tutorial(0,startGo)}else startGo()}
function startGo(){paused=true;say('장 시작!',40,'Y',false);snd(660,.1);setTimeout(()=>{paused=false},700)}
function resume(){if(R.phase==='trade'&&R.T)enterTrade(true);else if(R.phase==='settle')settleScr();else if(R.phase==='shop')shopScr();else mapScr()}
function renderBar(){const e=$('bbar');e.innerHTML='';R.eq.forEach(b=>{const m=BMAP[b.id];const d=document.createElement('div');d.className='bslot t'+m[2]+(T&&T.disabled===b.id?' off':'');d.appendChild(BART.canvas(b.id,1));
  if(b.id==='bait'){const x=document.createElement('b');x.id='baitB';x.textContent=T.baitN+'/'+(CFG.BAIT_N+(b.lv||0));d.appendChild(x)}
  if(b.lv){const x=document.createElement('b');x.textContent='+'+b.lv;x.style.cssText='top:-7px;bottom:auto;background:#ffcd2e;color:#1a1c2c';d.appendChild(x)}
  d.onclick=()=>tip(d,b);e.appendChild(d)});
 const old=$('nana');if(old)old.remove();nanaState=null;if(R.eq.some(b=>b.id==='nana')){const n=document.createElement('button');n.id='nana';n.className='pbtn';n.textContent='나나바';n.onclick=doNana;$('row').appendChild(n)}}
function renderSel(){const many=a=>a.length>1?' <em>▸</em>':'';const levU=[...R.levU].sort((a,b)=>a-b),betU=[...R.betU].sort((a,b)=>a-b);
 $('selLev').innerHTML='<small>레버</small>×'+R.lev+many(levU);const ai=ENG.has(R,'allin');$('selBet').innerHTML='<small>베팅</small>'+(ai?'100% 🔒':R.pct+'%'+many(betU));
 $('selLev').onclick=()=>{R.lev=levU[(levU.indexOf(R.lev)+1)%levU.length];renderSel();snd(900,.03);save()};
 $('selBet').onclick=()=>{if(ai){toast('한방바나나: 베팅 100% 고정');return}R.pct=betU[(betU.indexOf(R.pct)+1)%betU.length];renderSel();snd(1000,.03);save()}}
const MAILS=[["[속보] CPI 예상치 상회", "물가가 또 올랐대.\n바나나도 올랐대.\n월급은 그대로래."], ["[속보] 근원 CPI 쇼크", "근원이 근원까지 뚫음\n숏충이들 축제 중\n롱충이들 묵념 중"], ["[속보] CPI 예상 하회", "물가 잡혔다는데\n내 지갑은 왜 비었지\n일단 롱 가즈아"], ["연준 의장 비서실", "의장님이 바나나를\n드시는 중이라\n발언이 지연됩니다"], ["[속보] 연준 위원 발언", "\"인플레는 일시적\"\n(작년에도 그랬음)\n(재작년에도)"], ["원숭이증권 알림", "증거금 부족 안내\n잔고를 확인해 주세요.\n(확인해도 안 늘어남)"], ["원숭이증권 마진콜", "고객님 계좌가\n숨을 안 쉽니다\n심폐소생 바랍니다"], ["원숭이증권 이벤트", "수수료 0원 이벤트!\n*단, 손실은 유료\n자세한 건 약관 참조"], ["동네마트 영수증", "바나나 12송이 $34.20\n바나나우유 $2.10\n포인트 적립 0점"], ["정글 카드 명세서", "이번 달 결제 예정\n$1,234.56\n대부분 바나나"], ["정글 카드 명세서 (2)", "새벽 3시 결제 17건\n가맹점: 치킨집\n기억 안 나시죠?"], ["정글 카드 한도 안내", "한도 초과입니다\n바나나 1개도\n결제 불가"], ["[광고] 100% 수익 비법", "클릭만 하면 부자!\n(아님)\n수신거부: 확인"], ["[광고] 리딩방 VIP 초대", "적중률 99.9%\n남은 0.1%가\n지금 당신 계좌"], ["[광고] 코인 무료 에어드랍", "지갑 주소와\n비밀번호를 보내주세요\n(보내지 마세요)"], ["[광고] 바나나 구독", "매일 아침 한 송이\n월 $9.99\n해지는 전화로만"], ["[광고] 손절 학원", "손절 못 하는 당신\n첫 수업 무료\n(첫 수업 = 손절)"], ["[스팸] 해외 왕자님", "당신에게 유산을\n남기고 싶습니다\n수수료만 보내세요"], ["[스팸] 당첨 축하", "바나나 1년치 당첨!\n수령하려면\n카드번호 입력"], ["[스팸] 외계인 연락", "지구 증시 관찰 중\n당신 매매 보고\n회의 중단함"], ["[스팸] 다이어트 비법", "계좌가 빠지는 속도로\n살이 빠진다면?\n지금 신청"], ["택배 알림", "고객님 택배가\n문 앞에 놓였습니다\n(옆집 문 앞)"], ["택배 알림 (2)", "주문하신 모니터 6대\n배송 출발\n이제 몰래 못 삼"], ["택배 미수령", "주소 불일치로 보류\n주소: 한강\n확인 부탁드립니다"], ["팀장님", "이번 달 실적 보고서\n오늘까지 부탁해요.\n급한 건 아니고 지금요."], ["팀장님 (2)", "자리에 안 계시네요\n화장실에서 차트\n보는 거 다 압니다"], ["부장님 호출", "잠깐 회의실로\n(5분이면 됩니다)\n(2시간 걸림)"], ["부장님 (2)", "나도 물렸네\n자네 손절 언제\n하나 같이 하세"], ["옆자리 김대리", "님 모니터 다 보임\n그 숏 저도\n탔습니다"], ["인사팀 공지", "근무 중 주식 앱\n사용 자제 바랍니다\n- 인사팀(물림)"], ["회사 전체 메일", "탕비실 바나나\n누가 다 먹었나요\nCCTV 확인 중"], ["사내 동호회", "차트 분석 동호회\n이번 주 모임 취소\n회장님 청산됨"], ["엄마", "밥은 먹고 다니니\n선물 이제 끊었지?"], ["엄마 (2)", "밥은 먹고 다니니\n김치 보냈다\n선물 이제 끊었지?"], ["엄마 (3)", "엄마가 차트 봤는데\n빨간 게 좋은 거지?\n전화 좀 받아"], ["엄마 (4)", "추운데 옷 따뜻하게\n입고 다녀\n계좌도 따뜻하니?"], ["엄마 (5)", "이모가 그러는데\n선물은 도박이래\n이제 안 하지?"], ["엄마 (6)", "옆집 아들은\n적금 들었다더라\n너는 뭐 들었니"], ["친구", "야 나 롱 탔다\n너도 타\n(10분 뒤) 내려"], ["친구 (2)", "형 돈 좀 빌려줘\n아 형 청산됐지\n미안 없던 일로"], ["단톡방 (99+)", "\"다들 탈출함?\"\n\"나만 물림?\"\n\"ㅋㅋ 존버\""], ["여자친구", "오늘 저녁 뭐 먹어?\n...차트 말고\n대답해"], ["집주인", "월세 입금일이\n오늘입니다\n바나나로는 안 받아요"], ["은행 대출 상담", "신용점수 확인 결과\n... 죄송합니다\n좋은 하루 되세요"], ["기상청 특보", "오늘 장중\n변동성 폭풍 예상\n우산 대신 손절"], ["미래의 나", "지금 그 포지션\n... 말 안 할게\n힘내"], ["원숭이 심리실험자 모집", "바나나 앞 참을성 측정\n사례비 {N}만원 지급\n- 제인 구달달 드림"], ["과거의 나", "10년 전에 바나나\n사두라고 했잖아\n안 들었지"]];
let lastMails=[];
function clearMails(){document.querySelectorAll('.mailw').forEach(e=>e.remove())}
function mailStorm(){clearMails();const wr=$('wrap'),W=wr.clientWidth,H=wr.clientHeight;const fresh=MAILS.filter(m=>!lastMails.includes(m)).sort(()=>Math.random()-.5),pool=fresh.concat(MAILS.filter(m=>lastMails.includes(m))),n=5+(Math.random()<.5?1:0);
 lastMails=pool.slice(0,n);lastMails=pool.slice(0,n);for(let k=0;k<n;k++)setTimeout(()=>{if(ENG.gimAt(T,T.i)!=='cpi'&&k>0&&!document.querySelector('.mailw'))return;const m=pool[k];const d=document.createElement('div');d.className='mailw';
  const w=Math.min(230,W-20);d.style.width=w+'px';d.style.left=Math.round(6+Math.random()*(W-w-12))+'px';const wt=wr.getBoundingClientRect().top,at=$('acts').getBoundingClientRect().top-wt,mh=200,lo=H*.2,hi=Math.max(lo,at-mh-8);d.style.top=Math.round(lo+(hi-lo)*(k/(n-1||1))*.85+Math.random()*(hi-lo)*.15)+'px';d.style.transform='rotate('+((Math.random()-.5)*5).toFixed(1)+'deg)';d.style.zIndex=30+k;
  d.innerHTML='<div class="mt"><span>✉ 새 메일</span><i>✕</i></div><div class="ms">'+esc(m[0])+'</div><div class="mb">'+esc(m[1].replace('{N}',[3.14,0.5,69,12,7.77,404,1.5][Math.random()*7|0])).replace(/\n/g,'<br>')+'</div><button class="mok">확인</button>';
  d.querySelector('.mok').onclick=e=>{e.stopPropagation();snd(500,.04);d.remove()};
  wr.appendChild(d);snd(1320,.06);setTimeout(()=>snd(1760,.08),70);},k*140)}
function applyGim(){const g=T?ENG.gimAt(T,T.i):null;const cls=g?'g-'+g:'';if(cls!==gimCls){const gm=$('game');if(gimCls)gm.classList.remove(gimCls);if(cls)gm.classList.add(cls);gimCls=cls;if(!window.WCH)window.WCH=FX2.gfx();if(g&&g!=='cpi')WCH.start(g);else WCH.stop();if(g==='cpi')mailStorm();
 if(g==='fomc')$('lockT').textContent='🎤 의장님 연설 중… 버튼 잠김';
 if(g){snd(220,.25,'sawtooth',.05);}lastHud={}}}
function gimOn(){return !!(T&&ENG.gimAt(T,T.i))}
function flash(k){const f=$('flash');if(!f)return;f.className='f'+k;setTimeout(()=>f.className='',200)}
function floatTxt(t,g,sub){const e=document.createElement('div');e.className='ftxt';e.style.color=g?'#ff6b6b':'#6bb0ff';e.innerHTML=esc(t)+(sub?'<small>'+esc(sub)+'</small>':'');$('wrap').appendChild(e);setTimeout(()=>e.remove(),1200)}
function flt(txt,col,sub){const d=document.createElement('div');d.className='flt';d.style.top='300px';d.style.color=col;d.innerHTML=esc(txt)+(sub?'<small>'+esc(sub)+'</small>':'');$('wrap').appendChild(d);setTimeout(()=>d.remove(),1150)}
function onClose(r){if(!r)return;const s=(r.p>=0?'+':'')+fmt(r.p-r.fee);
 if(r.why==='liq'){const l=$('liq');l.style.display='block';setTimeout(()=>l.style.display='none',1800);shake=30;burst(97,200,90,['r','o','Y','w','d'],3.5,45);floatTxt(s,false,'강제청산');snd(80,.6,'sawtooth',.1,-40);setMood('faint',120);sayM(pick(MLOSS))}
 else if(r.why==='bait'){say('미끼 발동!',45,'Y',false);snd(300,.2);flt(s,'#ffb000','청산 방어 · 베팅 50% 손실')}
 else if(r.why==='nana'){say('나나바!!',50,'Y',true);coinSnd();flt(s,'#ffcd2e','손실 → 수익 뒤집기')}
 else if(r.p>0){setMood('happy',100);burst(97,200,Math.min(120,20+r.p/5|0),['Y','g','B','P','w','p'],2.5+Math.min(3,r.p/200),50);if(r.p>T.start*.02){coinSnd();coinRain(Math.min(25,5+r.p/40|0))}else snd(1175,.1);flash('pos');floatTxt(s,true,r.tags.join(' '));
  if(T.combo>=2){const c=$('combo');if(c){c.textContent=T.combo+' COMBO 🔥';c.style.display='block';clearTimeout(c._t);c._t=setTimeout(()=>c.style.display='none',1500)}}
  if(r.why==='close'&&!gimOn())say(pick(['챙겼다!','익절!','개꿀!','푸근하다','익절은 항상 옳다','개같이 부활!']),55,'Y',true);else shake=Math.max(shake,8)}
 else{setMood('sad',100);shake=Math.max(shake,12);snd(200,.2,'sawtooth',.05,-80);burst(97,200,10,['G','d'],1,30);floatTxt(s,false);
  if(r.why==='close'&&!gimOn())say(pick(['아이고..','손절..','눈물의 손절','손절은 과학이다','아 ㅋㅋ 시드 증발']),55,'S',false)}
 const bb=$('baitB');if(bb)bb.textContent=T.baitN+'/'+(CFG.BAIT_N+ENG.lv(R,'bait'));
 if(r.why!=='liq'){mutTimer=-2000;setTimeout(()=>{if(G.on)mutter()},1100)}
 if(T.reached&&!T._said){T._said=1;say('목표 달성!',50,'Y',true);bell()}save()}
function act(dir){if(!G.on||paused||!T)return;if(dir&&T.pos)return;if(ENG.locked(T)){const b=$(dir>0?'long':dir<0?'short':'close');if(dir&&T.pos)return;b.classList.remove('lk');void b.offsetWidth;b.classList.add('lk');snd(120,.08);return}
 if(dir===0){const r=ENG.close(R,G.price,'close');if(r)onClose(r);return}
 const r=ENG.enter(R,dir,G.price);if(r.err==='same'||r.err==='open')return;if(r.closed)onClose(r.closed);if(r.err){toast(r.err==='phase'?'':'잔고 부족! 최소 베팅 $'+CFG.MINBET,true);checkBust();return}
 snd(dir>0?880:440,.06);const bx=dir>0?35:160;burst(bx,375,14,dir>0?['r','p','Y','w']:['B','b','c','w'],1.8,25);if(R.lev>1){shake=Math.max(shake,6);burst(bx,375,16,['o','r','Y'],2,25)}
 if(!gimOn()){if(dir>0)say(pick(['지금이니!','지금이니!','가즈아!!','가즈아!!','롱롱롱!','떡상 가즈아!']),55,'L');else say(pick(['간다간다 숏간다!','숏숏숏!','숏숏숏!','지금이니!']),55,'S')}else shake=Math.max(shake,8);setMood('happy',40);save()}
function doNana(){if(!G.on||paused)return;const r=ENG.nana(R,G.price);if(r){onClose(r);}else snd(120,.08)}
function checkBust(){if(T&&ENG.bust(R)&&R.phase==='trade'){ENG.endStage(R,true);finishStage()}}
$('leave').textContent='🏃 일찍 퇴근하기 · 보너스 +'+money(CFG.DOUBLE_BONUS);$('leave').onclick=()=>{if(!G.on||paused||!T||R.phase!=='trade'||ENG.gimAt(T,T.i)==='limit')return;const r0=T.pos;const res=ENG.earlyLeave(R,G.price);if(!res)return;if(res.last)onClose(res.last);$('leave').classList.remove('on');lastHud.lv=false;finishStage()};$('long').onclick=()=>act(1);$('short').onclick=()=>act(-1);$('close').onclick=()=>act(0);
$('pause').onclick=()=>{if(G.on&&!paused){paused=true;save();pauseMenu(false)}};
function pauseMenu(res){BGM.setHold(true);modal('<h2>'+(res?'이어하기':'일시정지')+'</h2><p>'+ENG.stageInfo(R.stage).name+' · '+(T.i+1)+'/'+T.n+'봉\n잔고 '+money(T.bal)+'</p><div class="btns"><button class="b k" id="pM">메뉴로</button><button class="b k" id="pS">⚙ 설정</button><button class="b y" id="pG">계속 ▶</button></div>');
 $('pG').onclick=()=>{closeModal();BGM.setHold(false);startGo()};$('pS').onclick=()=>settings(()=>pauseMenu(res));$('pM').onclick=()=>{closeModal();BGM.setHold(false);save();G.on=false;menu()}}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.on&&!paused){paused=true;save();pauseMenu(false)}});
function step(dt){if(!G.on||paused)return;G.t+=dt*SPEED;mutTimer+=dt;if(mutTimer>=4200){mutTimer=-Math.random()*1500;if(!$('mut').classList.contains('show'))mutter()}
 const k=Math.min(30,G.t/CAN*30|0);G.price=G.path[k];G.cur[3]=G.price;G.cur[1]=Math.max(G.cur[1],G.price);G.cur[2]=Math.min(G.cur[2],G.price);
 const lq=ENG.check(R,G.price);if(lq){onClose(lq);checkBust();if(!G.on)return}
 mcTick();
 if(G.t>=CAN){G.t=0;const b=T.bars[T.i];G.cur=b.slice();G.price=b[3];
  const ev=ENG.candle(R);if(ev.end){finishStage();return}
  G.i=T.i;const nb=T.bars[T.i];G.cur=[nb[0],nb[0],nb[0],nb[0],nb[4]];G.path=mkPath(nb);G.price=nb[0];
  const sk=$('news')._sticky;if(news[T.i]&&!sk&&!ev.warn&&!ev.gim)setNews(news[T.i],true);
  if(ev.warn)clearMails();
  if(ev.warn){const wn=ENG.warnIn(T,T.i);if(!window.WCH)window.WCH=FX2.gfx();if(wn===CFG.GIMMICK.warn)WCH.warn(ev.warn);setNews('⚠ '+(wn>1?wn+'봉 뒤':'다음 봉')+': '+ENG.BOSS_INFO[ev.warn][0]+'!',true,true);snd(1200,.1);}
  else if(ev.gim)setNews('⚠ '+ENG.BOSS_INFO[ev.gim][0]+'!',true,true);else clearSticky();
  applyGim();checkBust();save()}
}
function finishStage(){G.on=false;mcOff();clearMails();applyGim();state='bell';bell();const res=T.res;say(res.bust?'깡통!':res.early?'칼퇴!':'장 마감',50,res.bust?'L':'Y',false);
 if(R.phase==='over'||R.phase==='clear')recordRun();save();setTimeout(()=>{state='idle';gimClear();R.phase==='settle'?settleScr():overScr()},1600)}
// margin call (ported from original): loss >= MC_ON of bet -> amber frame + monkey 喝!! slam, recover below MC_OFF. Visual only, no money effect.
const MC_ON=.75,MC_OFF=.6,MC_IN_LIMIT=true;
function mcOff(){$('game').classList.remove('mc');if(G.danger)dangerOff()}
function mcTick(){if(!T||!T.pos){mcOff();return}{const g=ENG.gimAt(T,T.i);if(g&&(g!=='limit'||!MC_IN_LIMIT)){mcOff();return}}
 const r=-upnl()/T.pos.bet;$('game').classList.toggle('mc',r>=MC_ON);
 if(r>=MC_ON&&!G.danger){G.danger=1;T.mcN=(T.mcN||0)+1;sayM(pick(['마진콜 떴다!!','증거금 부족이래','샤갈!!','나락 간다','계좌 녹는 중…','레버리지에 쓰이는 중']));const m=$('mm');m.className='';void m.offsetWidth;m.className='slam '+(T.pos.dir>0?'up':'dn');$('shout').style.display='none';shake=25;snd(150,.4,'sawtooth',.09,200);clearTimeout(G.mt);G.mt=setTimeout(()=>{if(G.danger)m.className='ling '+(T.pos&&T.pos.dir>0?'up':'dn')},1400);if(mood!=='panic')setMood('panic',30)}
 else if(r<MC_OFF&&G.danger){T.mcs=(T.mcs||0)+1;dangerOff();$('game').classList.remove('mc')}}
function gimClear(){if(gimCls)$('game').classList.remove(gimCls);gimCls=''}
function hud(){const p=upnl(),cpi=!!(T&&ENG.gimAt(T,T.i)==='limit');const set=(id,v,prop='textContent')=>{if(lastHud[id]!==v){lastHud[id]=v;$(id)[prop]=v}};
 set('bal',cpi?'$???':fmt(T.bal+p));set('price',cpi?'???':G.price.toFixed(2));set('timer',(T.i+1)+'/'+T.n+'봉');
 const tgt=T.start*(1+T.target/100);const below=!cpi&&T.reached&&T.bal+p<tgt;set('goalT',(below?'⚠ 목표 아래! ':'목표 ')+money(tgt)+' (+'+T.target+'%)');set('goalT',below?'warn':'','className');
 if(T.pos){set('pnl',cpi?'??? '+(T.pos.dir>0?'LONG':'SHORT'):(p>=0?'+':'')+fmt(p)+' '+(T.pos.dir>0?'LONG':'SHORT')+' ×'+T.pos.lev+' $'+T.pos.bet.toLocaleString());set('pnl',cpi?'':p>=0?'g':'r','className')}else{set('pnl','포지션 없음'+(T.combo?' · '+T.combo+'연승':''));set('pnl','','className')}
 {const lv=G.on&&R.phase==='trade'&&ENG.gimAt(T,T.i)!=='limit'&&ENG.canLeave(R,G.price);if(lastHud.lv!==lv){lastHud.lv=lv;$('leave').classList.toggle('on',lv)}}const eq=T.bal+p,span=tgt-T.start,ph=eq>=tgt?(eq>=tgt+span?2:1):0;const pr=ph===0?Math.max(0,Math.min(1,(eq-T.start)/span)):ph===1?(eq-tgt)/span:1;const gw=ph+':'+(pr*100|0)+'%';if(!cpi&&lastHud.gw!==gw){lastHud.gw=gw;const g=$('goal');g.firstChild.style.width=(pr*100|0)+'%';g.classList.toggle('or',ph>0);g.classList.toggle('done',ph===2);$('goalX').textContent=ph===2?'보너스 달성 +'+money(CFG.DOUBLE_BONUS):ph===1?'보너스 2배 수익률 도전':''}
 const n=$('nana');if(n){const ok=ENG.canNana(R,G.price);const ns=ok+'|'+T.nanaLeft;if(ns!==nanaState){nanaState=ns;n.disabled=!ok;n.textContent=T.nanaLeft>0?'나나바'+(T.nanaLeft>1?' ×'+T.nanaLeft:''):'사용함'}}}
let last=0;
let _bs='',_cl='';function closeLabel(){if(!(T&&T.pos&&G.on))return '익절';if(ENG.gimAt(T,T.i)==='limit')return '정리';return upnl()>=0?'익절':'손절'}
function btnState(){const k=(T&&T.pos&&G.on)?'p':'n';const a=$('acts');if(k!==_bs){_bs=k;if(a)a.classList.toggle('haspos',k==='p')}
 const l=closeLabel();if(l!==_cl){_cl=l;const b=$('close');if(b){b.textContent=l;b.classList.toggle('loss',l==='손절');b.classList.toggle('neu',l==='정리')}}}
function loop(ts){const dt=Math.min(100,ts-(last||ts));last=ts;if(G.on||state==='bell'){step(dt);if(T){drawChart();drawFx();if(G.on)hud()}btnState()}const w=$('wrap');if(shake>0){w.style.transform='translate('+((Math.random()-.5)*shake).toFixed(1)+'px,'+((Math.random()-.5)*shake).toFixed(1)+'px)';shake*=.9;if(shake<.5)shake=0}else if(w.style.transform)w.style.transform='';requestAnimationFrame(loop)}
requestAnimationFrame(loop);
// ---------- settlement ----------
function settleScr(){const s=R.settle,res=R.T.res;const firstTime=!s.applied;ENG.applySettle(R);save();const si=ENG.stageInfo(R.stage);
 const items=[['일급',s.pay],['이자',s.interest],['저금통',s.piggy],['2배 보너스',s.dbl],['보너스',s.nego&&s.nego.bonus]].filter(x=>x[1]>0),tot=items.reduce((a,x)=>a+x[1],0);
 let h='<div class="ttl" style="margin-top:40px">'+si.name+' 클리어!</div><div class="box" style="text-align:left"><div class="sub" style="text-align:center">수익률 +'+res.ret.toFixed(1)+'% / 목표 '+R.T.target+'%'+(res.early?' · 🏃 일찍 퇴근':'')+'</div>'+
 '<div class="mbig">+'+money(tot)+'</div><div class="mbd">'+items.map(x=>x[0]+' +'+money(x[1])).join(' · ')+'</div>'+
 '<div class="mwal"><span>지갑</span><b>'+money(R.wage-tot)+' → <i>'+money(R.wage)+'</i></b></div>'+
 (s.shelfBonus?'<p style="color:#ffcd2e;font-size:12px;text-align:center">목표 2배 달성! 다음 상점 진열 +1</p>':'')+
 (s.nego?negoHtml(s.nego,si):'')+'</div><div class="btns"><button class="b y big" id="sGo">'+(R.phase==='clear'?'엔딩 보기 ▶':'상점으로 ▶')+'</button></div>';
 show(h);coinSnd();const go=()=>R.phase==='clear'?overScr():shopScr();
 if(s.nego&&firstTime)bell();
 $('sGo').onclick=go}
function negoHtml(n,si){const N=CFG.NEGO,ch=si.ch+1;if(!n.tier)return '<div id="nego" class="nego"><p>연봉협상 · 상한 '+money(n.before)+' → <b>'+money(n.before+n.inc)+'</b></p></div>';
 let h='<div id="nego" class="nego"><div class="nh">연봉협상 '+n.tier+'단계 · 상한 +'+money(n.inc)+'</div><div class="nt">';
 N.tiers.forEach((x,j)=>{const nx=N.tiers[j+1];h+='<div class="'+(j+1===n.tier?'on':'')+'"><span>'+(j+1)+'단계</span><span>×'+x[0]+(nx?'~'+nx[0]:'+')+'</span><b>+'+money(Math.round(N.base*x[1]*ch/10)*10)+'</b></div>'});
 return h+'</div><p class="sub">목표 대비 ×'+n.over.toFixed(2)+' · 상한 '+money(n.before)+' → <b style="color:#a7f070">'+money(n.before+n.inc)+'</b></p></div>'}
// ---------- shop ----------
let armed=null;
let shopTab=0;
function shopScr(){R.phase='shop';save();const sh=R.shop;const nl=ENG.nextLev(R),nb=ENG.nextBet(R),sp=ENG.slotPrice(R),rc=ENG.rerollCost(R);
 const btn=(id,lab,pr,cls='y')=>'<button class="b '+cls+'" id="'+id+'" '+(pr!=null&&R.wage<pr?'disabled':'')+'>'+(armed===id?'구매 확인!':lab)+'</button>';
 let h='<div class="stop"><div class="stopL"><span class="lbl">🍌 소지금</span><b>'+money(R.wage)+'</b>'+(ENG.has(R,'disc')?'<span class="dsc">할인중</span>':'')+'</div><button class="gear" id="sGear" aria-label="설정">⚙</button></div>';
 h+='<div class="sinv"><span class="lbl">내 바나나 '+R.eq.length+'/'+R.slots+'</span>'+invHTML()+'</div>';
 const tabs=['🍌 진열대','⬆ 업그레이드','✨ 강화 재단'];h+='<div class="stabs">'+tabs.map((t,i)=>'<button class="stab'+(i===shopTab?' on':'')+'" data-t="'+i+'">'+t+'</button>').join('')+'</div><div class="spanel">';
 if(shopTab===0){h+='<div class="shelf">';sh.offer.forEach((o,k)=>{if(!o){h+='<div class="bcard sold"><div class="nm" style="margin-top:70px">SOLD</div></div>';return}const m=BMAP[o.id],pr=ENG.price(R,o.base);
   h+='<div class="bcard t'+m[2]+'"><canvas data-id="'+o.id+'"></canvas><div class="nm">'+m[1]+'</div><div class="tier tcol'+m[2]+'">'+TN[m[2]]+'</div><div class="ds">'+m[3]+'</div>'+btn('o'+k,money(pr),pr)+'</div>'});
  h+='</div><div class="srow">'+btn('rr',rc?'🎲 리롤 '+money(rc):'🎟 무료 리롤',rc,'')+'</div><div class="hint">칸이 꽉 차면 바꿀 바나나를 고를 수 있어 (판매가 적용)</div>'}
 else if(shopTab===1){const up=(ic,nm,cur,nx,id,pr)=>'<div class="uprow"><div class="upic">'+ic+'</div><div class="upt"><div class="nm">'+nm+'</div><b>'+cur+(nx!=null?' <span>→ '+nx+'</span>':' <span class="mx">MAX</span>')+'</b></div>'+(nx!=null?btn(id,money(pr),pr):'<button class="b" disabled>MAX</button>')+'</div>';
  h+=up('📈','레버리지','×'+Math.max(...R.levU),nl?'×'+nl.v:null,'uL',nl&&nl.pr)+up('🎯','베팅 비율',Math.max(...R.betU)+'%',nb?nb.v+'%':null,'uB',nb&&nb.pr)+up('🧺','바나나 칸',R.slots+'칸',sp!=null?(R.slots+1)+'칸':null,'s4',sp);
  h+='<div class="hint">레버·베팅은 장 시작 전 선택창에서 고를 수 있어</div>'}
 else{h+='<div class="altl">';if(!R.eq.length)h+='<div class="hint" style="margin-top:30px">강화할 바나나가 없어</div>';
  R.eq.forEach((b,i)=>{const m=BMAP[b.id],uc=ENG.upgCost(R,i);h+='<div class="altrow"><div class="bs t'+m[2]+'" data-i="'+i+'"></div><div class="upt"><div class="nm">'+m[1]+lvTxt(b)+'</div><small>'+(uc?'다음 +'+((b.lv||0)+1)+': '+ENG.upgDesc(b.id,(b.lv||0)+1):'최대 강화')+'</small></div>'+(uc?'<button class="b y" data-u="'+i+'" '+(R.wage<uc.pr?'disabled':'')+'>'+money(uc.pr)+'<br><small>'+(uc.p*100|0)+'%</small></button>':'<button class="b" disabled>MAX</button>')+'</div>'});
  h+='</div><div class="hint">실패해도 바나나는 사라지지 않아. 비용만 날아가</div>'}
 h+='</div><div class="btns" style="margin-top:auto;margin-bottom:16px"><button class="b g big" id="nx">다음 스케줄 ▶</button></div>';
 show(h);ov.querySelectorAll('.bcard canvas').forEach(c=>{const x=BART.canvas(c.dataset.id,3);c.width=x.width;c.height=x.height;c.getContext('2d').drawImage(x,0,0)});
 fillInv(ov,(i)=>bananaSheet(i));
 ov.querySelectorAll('.stab').forEach(e=>e.onclick=()=>{shopTab=+e.dataset.t;armed=null;snd(700,.03);shopScr()});
 $('sGear').onclick=()=>settings(null,true);
 ov.querySelectorAll('[data-u]').forEach(e=>e.onclick=()=>{const i=+e.dataset.u,b=R.eq[i];const r=ENG.upgrade(R,i);save();if(r.err){toast(r.err,true);return}altar(b.id,r,()=>shopScr())});
 const arm=(id,fn)=>{const e=$(id);if(!e)return;e.onclick=()=>{if(armed!==id){armed=id;snd(800,.03);shopScr();return}armed=null;const r=fn();if(r&&r.err&&r.err!=='full'){toast(r.err,true);snd(120,.1)}else if(r&&r.ok){coinSnd();}save();if(!r||r.err!=='full')shopScr()}};
 arm('uL',()=>ENG.buyLev(R));arm('uB',()=>ENG.buyBet(R));arm('s4',()=>ENG.buySlot(R));
 sh.offer.forEach((o,k)=>arm('o'+k,()=>{if(R.eq.length>=R.slots){replacePick(k);return {err:'full'}}return ENG.buy(R,k)}));
 const rr=$('rr');if(rr)rr.onclick=()=>{const r=ENG.reroll(R);if(r.err){toast(r.err,true);return}snd(600,.05);snd(900,.05);armed=null;save();shopScr()};
 $('nx').onclick=()=>{armed=null;shopTab=0;ENG.nextStage(R);save();mapScr()}}
function replacePick(k){const o=R.shop.offer[k];let h='<h2>칸이 꽉 찼어</h2><p>'+BMAP[o.id][1]+'바나나와 바꿀 바나나를 골라 (판매가 적용)</p><div class="inv" style="flex-wrap:wrap">';
 R.eq.forEach((b,i)=>h+='<button class="b k" data-i="'+i+'" style="min-width:90px;font-size:12px">'+BMAP[b.id][1]+lvTxt(b)+'<br>+'+money(ENG.sellValue(b))+'</button>');
 modal(h+'</div><div class="btns"><button class="b k" id="rpX">취소</button></div>');$('rpX').onclick=closeModal;
 md.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const r=ENG.buy(R,k,+b.dataset.i);closeModal();if(r.err)toast(r.err,true);else coinSnd();save();shopScr()})}
function bananaSheet(i){const b=R.eq[i],m=BMAP[b.id],uc=ENG.upgCost(R,i);
 modal('<h2 class="tcol'+m[2]+'">'+m[1]+'바나나'+lvTxt(b)+'</h2><canvas id="bsC" style="width:64px;height:64px;image-rendering:pixelated"></canvas><p>'+m[3]+(b.lv?'\n<b style="color:#ffcd2e">+'+b.lv+' 강화: '+ENG.upgDesc(b.id,b.lv)+'</b>':'')+(uc?'\n<span class="sub">다음 +'+((b.lv||0)+1)+': '+ENG.upgDesc(b.id,(b.lv||0)+1)+'</span>':'')+'</p>'+
 '<div class="btns"><button class="b k" id="bsX">닫기</button><button class="b r" id="bsS">판매 +'+money(ENG.sellValue(b))+'</button>'+(uc?'<button class="b y" id="bsU" '+(R.wage<uc.pr?'disabled':'')+'>강화 '+money(uc.pr)+'<br><small style="font-size:11px">성공 '+(uc.p*100|0)+'%</small></button>':'<button class="b" disabled>MAX +'+CFG.UPG.max+'</button>')+'</div>');
 const x=BART.canvas(b.id,4),c=$('bsC');c.width=x.width;c.height=x.height;c.getContext('2d').drawImage(x,0,0);
 $('bsX').onclick=closeModal;$('bsS').onclick=()=>confirmBox('판매?',m[1]+'바나나'+lvTxt(b)+'를 '+money(ENG.sellValue(b))+'에 팔까?','판매',()=>{ENG.sell(R,i);coinSnd();save();shopScr()});
 if(uc&&$('bsU'))$('bsU').onclick=()=>{const r=ENG.upgrade(R,i);save();if(r.err){toast(r.err,true);return}altar(b.id,r,()=>{shopScr();bananaSheet(i)})}}
// ---------- upgrade altar animation (holy pixel scene) ----------
function altar(id,r,done){modal('<canvas id="alC" width="320" height="300" style="width:320px;height:300px;image-rendering:pixelated;background:#0b0c16"></canvas><h2 id="alT" style="min-height:26px;margin-top:8px"></h2><div class="btns"><button class="b y" id="alX" style="visibility:hidden">확인</button></div>');
 const OK=r.success;const A=FX2.altar($('alC'),id,OK,()=>{$('alT').textContent=OK?'✨ 강화 성공! +'+r.lv:'아무 일도 일어나지 않았다…';$('alT').style.color=OK?'#ffcd2e':'#94b0c2';$('alX').style.visibility='visible';if(OK){bell();}else snd(180,.4,'triangle',.05,-60)});
 window.__ALTAR=A;const lp=()=>{if(!$('alC'))return;const f=A.step();if(f>=60&&f<190&&f%15===0)snd(400+f*4,.06,'triangle',.04);if(f<600)requestAnimationFrame(lp)};requestAnimationFrame(lp);$('alX').onclick=()=>{closeModal();done()}}
// ---------- run over / clear ----------
function recordRun(){if(R._rec||!R.result)return;R._rec=1;const res=R.result;[res.title,...res.specials].forEach(t=>{if(!META.dex[t])META.dex[t]=Date.now()});if(res.clear)META.clears++;saveMeta()}
function overScr(){if(!R||!R.result)return;recordRun();save();G.on=false;state='idle';const res=R.result,st=R.st;
 let h='<div class="ttl" style="margin-top:44px">'+(res.clear?'🏆 나스닥 정복!':'런 종료')+'</div><div class="sub">'+(res.clear?'15판 전부 클리어. 진짜 월가 원숭이가 됐어':ENG.stageInfo(res.stage).name+'에서 목표 미달'+(R.T&&R.T.res&&R.T.res.bust?' (깡통)':''))+'</div>'+
 '<canvas id="pcv2" width="132" height="132"></canvas><div class="sub">칭호 획득</div><div class="ttl" style="font-size:24px">「'+res.title+'」</div>'+(res.specials.length?'<div>'+res.specials.map(s=>'<span class="chip y">★ '+s+'</span>').join('')+'</div>':'')+
 '<div class="box" style="margin-top:12px;text-align:left"><div class="ln"><span>도달</span><b>'+ENG.stageInfo(Math.min(14,res.stage)).name+'</b></div><div class="ln"><span>매매 / 승</span><b>'+st.trades+' / '+st.wins+'</b></div><div class="ln"><span>강제청산</span><b>'+st.liq+'</b></div><div class="ln"><span>번 일급 총액</span><b>'+money(st.earned)+'</b></div><div class="ln"><span>바나나</span><b>'+(R.eq.map(b=>BMAP[b.id][1]+lvTxt(b)).join(', ')||'-')+'</b></div></div>'+
 '<div class="btns" style="margin-top:auto;margin-bottom:22px"><button class="b k" id="oD">도감</button><button class="b k" id="oM">메뉴</button><button class="b y" id="oN">새 런 ▶</button></div>';
 show(h);try{drawPortrait($('pcv2'),res.kind)}catch(e){}if(res.clear){bell();coinRain(30)}else snd(130,.6,'triangle',.06,-40);
 $('oD').onclick=()=>dexScr(overScr);$('oM').onclick=menu;$('oN').onclick=()=>{R=ENG.newRun();META.runs++;saveMeta();save();mapScr()}}
// ---------- test hook ----------
window.__BN={get R(){return R},set R(v){R=v},ENG,act,doNana,menu,mapScr,shopScr,settleScr,overScr,resume,enterTrade,setSpeed:v=>SPEED=v,state:()=>({on:G.on,paused,phase:R&&R.phase,i:T&&T.i,price:G.price}),unpause:()=>{closeModal();paused=false}};
menu();

delete META.vib;