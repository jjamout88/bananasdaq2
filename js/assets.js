// extracted verbatim from original game.js (sprites, sfx, dialogue, portraits, chart/fx renderers). Shared global scope.
const $=id=>document.getElementById(id);
const W=195,H=422; // fx canvas low-res (2x)
const fx=$('fx'),fc=fx.getContext('2d');
const ch=$('chart'),cc=ch.getContext('2d'); const CW=ch.width,CH=ch.height;
// ---------- audio ----------
let AC=null;function snd(f,d=.08,type='square',v=.06,slide=0){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;if(slide)o.frequency.linearRampToValueAtTime(f+slide,AC.currentTime+d);g.gain.value=v;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d);}catch(e){}}
const coinSnd=()=>{snd(988,.08);setTimeout(()=>snd(1319,.25),80)};
const bell=()=>{[0,300,600].forEach(t=>setTimeout(()=>snd(1568,.5,'triangle',.08),t))};
// ---------- sprites (pixel arrays) ----------
const PAL={'k':'#1a1c2c','w':'#f4f4f4','s':'#ffcd75','r':'#b13e53','g':'#38b764','y':'#ffcd75','Y':'#f7e26b','b':'#3b5dc9','B':'#41a6f6','n':'#94531f','N':'#5d3a1a','p':'#ef7d57','G':'#566c86','c':'#73eff7','o':'#ff8c1a','P':'#ff9ec4','d':'#333c57'};
function spr(rows){return rows.map(r=>r.split(''))}
function draw(ctx,s,x,y,sc=1,flip=false){for(let j=0;j<s.length;j++)for(let i=0;i<s[j].length;i++){const c=s[j][i];if(c==='.')continue;ctx.fillStyle=PAL[c];const ii=flip?s[j].length-1-i:i;ctx.fillRect(Math.round(x+ii*sc),Math.round(y+j*sc),sc,sc)}}
const BAN=spr(['.......NN','......YY.','.....YYY.','....YYYY.','Y.YYYYYY.','YYYYYYY..','.YYYYY...','..YYY....']);const BR=[];
const face={
 idle:['..nnnnnn..','.nnnnnnnn.','snnssssnns','snskssksns','.nssssssn.','.nsskkssn.','..nnnnnn..'],
 happy:['..nnnnnn..','.nnnnnnnn.','snnssssnns','snkskkskns','.nPssssPn.','.nskrrksn.','..nnnnnn..'],
 sad:['..nnnnnn..','.nnnnnnnn.','snnssssnns','snskssksns','.nBssssBn.','.nskssksn.','..nnnnnn..'],
 panic:['..nnnnnn..','.nnnnnnnn.','snnssssnns','snwkswkwns','.nssssssn.','.nssrrssn.','..nnnnnn..'],
 faint:['..nnnnnn..','.nnnnnnnn.','snnssssnns','snkksskkns','.nssssssn.','.nsskkssn.','..nnnnnn..'],
};
const body=['..nnnnnn..','.nnssssnn.','.nnssssnnn','..nnnnnn.n','..n...n.n.','.nn...nn..'];
const bodyUp=['n.nnnnnn.n','nnnssssnn.','..nssssnnn','..nnnnnn.n','..n...n.n.','.nn...nn..'];
const bull=spr(['k.......k...','.kNNNNNNk...','.NwNNNNwN...','NNNNNNNNNN..','NNNNNNNNNNNN','.NNNNNNNNNNN','.N.N...N.N..','.k.k...k.k..']);
const bull2=spr(['k.......k...','.kNNNNNNk...','.NwNNNNwN...','NNNNNNNNNN..','NNNNNNNNNNNN','.NNNNNNNNNNN','N..N...N..N.','k..k...k..k.']);
const bear=spr(['.dd....dd...','.dGGGGGGd...','GGkGGGGkGG..','GGGGPPGGGG..','.GGGGGGGGGGG','.GGGGGGGGGGG','.G.G...G.G..','.d.d...d.d..']);
const bear2=spr(['.dd....dd...','.dGGGGGGd...','GGkGGGGkGG..','GGGGPPGGGG..','.GGGGGGGGGGG','.GGGGGGGGGGG','G..G...G..G.','d..d...d..d.']);
const cat=[spr(['k...k...','kok.kok.','kooooo..','kokook..','kooooo.k','.ooooook','.k.k.k..']),spr(['k...k...','kok.kok.','kooooo..','kokook..','kooooo.k','.oooooo.','k.k..k.k'])];
const coin=[spr(['.YYY.','YYyYY','YYyYY','YYyYY','.YYY.']),spr(['.YY.','YyYY','YyYY','YyYY','.YY.']),spr(['.Y.','.Y.','.Y.','.Y.','.Y.'])];
const giftB=spr(['rrrrYrrrr','rrrrYrrrr','rrrrYrrrr','YYYYYYYYY','rrrrYrrrr','rrrrYrrrr','rrrrYrrrr','rrrrYrrrr']);
const giftL=spr(['..YY.YY..','.Y..Y..Y.','rrrrYrrrrr','rrrrYrrrrr']);
const bellS=spr(['...Y...','..YYY..','.YYYYY.','.YYYYY.','.YYYYY.','YYYYYYY','...k...']);
// rank characters
const RANKS=[[0,'개미','r'],[12000,'단타충','B'],[20000,'스캘퍼','g'],[50000,'고래','b'],[100000,'월가의 원숭이','G']];
const rankS={
 '개미':[spr(['.nnnnnn.','snnssnns','nskssksn','nssssssn','.nskksn.','..nnnn..','.nnnnnn.','.n.nn.n.']),spr(['.nnnnnn.','snnssnns','nskssksn','nssssssn','.nskksn.','..nnnn..','.nnnnnn.','n..nn..n'])],
 '단타충':[spr(['knnnnnnk','knnssnnk','kskssksk','nssssssk','.nskksn.','..nnnn..','.nnnnnn.','.n.nn.n.']),spr(['knnnnnnk','knnssnnk','kskssksk','nssssssn','.nskksn.','..nnnn..','.nnnnnn.','n..nn..n'])],
 '스캘퍼':[spr(['.nnnnnn.','snnssnns','nkkkkkkn','nssssssn','.nsrrsn.','..nnnn..','.nnnnnn.','.n.nn.n.']),spr(['.nnnnnn.','snnssnns','nkkkkkkn','nssssssn','.nsrrsn.','..nnnn..','.nnnnnn.','n..nn..n'])],
 '고래':[spr(['.dddddd..','ddddsddd.','dskssksdd','dssssssdd','dsskkssdd','.dddddddd','dddddddd.','.dd..dd..']),spr(['.dddddd..','ddddsddd.','dskssksdd','dssssssdd','dsskkssdd','.dddddddd','.ddddddd.','dd....dd.'])],
 '월가의 원숭이':[spr(['.kkkkkk.','snnssnns','nskssksn','nssssssn','.nskksn.','..nnnn..','kwrwwkk','.k.kk.k.']),spr(['.kkkkkk.','snnssnns','nskssksn','nssssssn','.nskksn.','..nnnn..','kwrwwkkk','k..kk..k'])]
};
// ---------- particles ----------
let P=[];const PM=p=>{p.x=MX+(p.x-14)*MS;p.y=MY+(p.y-260)*MS;P.push(p)};const burstM=(x,y,...r)=>burst(MX+(x-14)*MS,MY+(y-260)*MS,...r);
function burst(x,y,n,cols,sp=2,life=40,g=.08,sz=1){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=Math.random()*sp+.3;P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.4,l:life*(0.6+Math.random()*.6),c:cols[i%cols.length],g,s:sz+(Math.random()<.3?1:0)})}}
let coins=[];function coinRain(n){for(let i=0;i<n;i++)coins.push({x:30+Math.random()*130,y:120,vx:(Math.random()-.5)*2,vy:-2-Math.random()*2,l:90,f:Math.random()*3|0,b:0})}
let my2=0,formT=99,lastForm=0,mood='idle',moodT=0,shout='',shoutT=0,shake=0,critter=null,catX=-10,catF=0,frame=0,state='title',titleT=0,bellT=0;
const fmt=v=>(v<0?'-':'')+'$'+Math.abs(Math.round(v)).toLocaleString();
function setMood(m,t=90){mood=m;moodT=t}
function say(t,d=55,cls='Y',big=true){shout=t;shoutT=d;const e=$('shout');e.textContent=t;e.className='';e.style.fontSize=(t.length>8?40:t.length>5?52:62)+'px';void e.offsetWidth;e.className='go '+cls;e.style.display='block';if(big){shake=Math.max(shake,14);burst(97,150,50,cls==='S'?['B','b','c','w']:cls==='L'?['r','p','Y','w']:['Y','w','P','o'],4,35,.05,2)}}
// ---------- news ----------
const UP=['연준 깜짝 금리인하 시사','빅테크 실적 서프라이즈','美 대통령 "관세 유예" 발표','AI 반도체 수요 폭발','중동 휴전 합의 소식','고용지표 예상치 하회, 금리인하 기대','대형 기술주 자사주 매입 발표','물가 둔화 확인… 안도 랠리'];
const DN=['美 대통령 관세 발표','중동 긴장 고조','연준 매파 발언… 금리인하 멀어져','반도체 수출 규제 강화','물가 예상치 상회 쇼크','대형 은행 유동성 우려','국채금리 급등','전쟁 발발 우려 확산'];
const CALM=[...['(속보) 美 대통령 타코 떴다!!!', '월가 속보 ㄷㄷㄷㄷㄷ', '속보) 단기 악재 발생', '국채도 내리고 유가도 내리는데 지수는 왜 이래?', '오늘은 다우 차례?'],'연준 의장님 발언 대기','CPI 날 = 도박의 날?','기관 형님들 관망','세력 매집설 솔솔','곱버스 거래량 증가','본장 개장 준비','빅테크 실적 대기 중','시장 관망세 지속','거래량 평이','투자자들 숨고르기','오늘의 날씨: 맑음 ☀','국채금리 보합','유가 소폭 변동','개미들 커피 타임 ☕'];
const pick=a=>a[Math.random()*a.length|0];
function setNews(t,hot){const n=$('news');n.innerHTML='<span>'+(hot?'🚨 ':'📰 ')+t+'</span>';n.className=hot?'hot':''}
function planNews(c){const mv=c.map((x,i)=>i+2<c.length?c[i+2][3]-c[i][3]:0);const s=[...mv].map(Math.abs).sort((a,b)=>b-a);const th=Math.max(s[6]||0,15);const out={};let last=-10;mv.forEach((m,i)=>{if(Math.abs(m)>=th&&i-last>6&&i>0){const real=Math.random()>.2;out[i]=((m>0)===real)?pick(UP):pick(DN);last=i}});return out}
function mkPath(c,n=30){const [o,h,l,cl]=c;const pts=Math.random()<.5?[o,h,l,cl]:[o,l,h,cl];const seg=[0,.3+Math.random()*.2,.65+Math.random()*.15,1];const p=[];for(let k=0;k<=n;k++){const t=k/n;let s=0;while(s<2&&t>seg[s+1])s++;const u=(t-seg[s])/(seg[s+1]-seg[s]);let v=pts[s]+(pts[s+1]-pts[s])*u+(k&&k<n?(Math.random()-.5)*(h-l)*.25:0);p.push(Math.min(h,Math.max(l,v)))}return p}
const MUT={
LW:['숏충이들아 정신이 좀 들어?','숏 녹았다 ㅋㅋ','숏스퀴즈 맛 좀 봐라','나스닥은 영원하다','이건 그냥 눌림목이야','달까지 가즈아','내일 퇴사한다','포르쉐 색깔 고르는 중','차트가 나를 사랑해','역시 난 천재야','한강뷰 아파트 계약하러 간다','엄마 나 성공했어','이 정도면 워렌 원숭이','부장님 안녕히 계세요','우상향은 진리다','바나나 트럭째로 산다','오늘 회식은 내가 쏜다','익절? 그게 뭔데','이건 시작에 불과해','떡상의 냄새가 난다','내 롱은 우주를 뚫는다','월가 형님들 나 좀 봐','손가락이 미래를 안다','람보르기니 시승 예약 완료','이 맛에 롱한다'],
LL:['롱 잡으니까 떨어지네','숏충이들 웃고 있겠지','불타기 간다','이건 세일이야','물타면 돼','오버나잇 가야 하나…','원래 오르기 전엔 떨어져','개미 털기 중이네','난 존버한다','아직 손실 확정 아님','바닥이 어디냐','이거 다 페이크야','눈 감으면 수익','물타기 각 재는 중','차트가 잠깐 삐졌어','계좌야 미안해','괜찮아 괜찮아…','앱을 지워야 하나','오늘은 운이 없었을 뿐','곧 반등한다 진짜로','물린 게 아니라 버티는 중이다','손절은 패배자의 것','바나나 값은 벌어야 하는데'],
SW:['롱충이들아 정신이 좀 들어?','떡락 간다','개같이 떡락!','롱 녹았다 ㅋㅋ','세상아 망해라','버블이야 다 터져','폭락만이 살 길','어서 망해라 제발','대공황 와라','나만 돈 벌면 돼','떨어져라 더 떨어져','빨간 불이 아름답다','모두가 울 때 나는 웃지','폭락 기념 바나나 파티','공포 지수 최고야','종말이 오면 내가 부자','하락장의 왕 등장','롱충이들 미안해','중력은 거짓말 안 해','지하실 밑에 지하실','패닉 셀 땡큐','오늘의 메뉴: 폭락','버블 감별사 출근','이 세상 다 거품이야','내 숏은 지구 핵까지'],
SL:['숏 잡으니까 오르네','숏 녹는다…','숏스퀴즈 당했다','롱충이들 웃고 있겠지','아직 안 끝났어','곧 떨어진다고','이건 데드캣 바운스야','마지막 발악이지','시장이 미쳤어','내가 맞고 시장이 틀렸어','조금만 더 버티면 돼','이건 조작이야','올라가 봤자야','곧 폭락 뉴스 뜬다','하락은 반드시 온다','어디까지 오르나 보자','숏은 인내의 예술','이건 함정이야','왜 안 떨어져…','하늘도 무심하시지','버블은 언젠가 터진다','내 숏 아직 살아있다','잠깐 숨 고르는 중','물타기 숏 간다'],
ID:['연준 의장님 입만 봐라','연준 의장님 오늘 뭐라셔','CPI 날은 도박의 날','본장 시작이다','기관 형님들 뭐 하시나','세력 형님들 움직인다','차트는 거짓말 안 한다 (거짓말함)','곱버스 탈까','인버스 살까','레버리지 쓰다 레버리지에 쓰인다','롱숭이 될까 숏숭이 될까','뭐 잡지..','바나나 맛있다','차트 구경 중','오늘 뭐 먹지','타이밍 재는 중…','관망도 투자다','손이 근질근질','현금도 포지션이야','뉴스 좀 보자','심호흡 한 번','기다리는 자에게 복이','눈치 게임 중','바나나 껍질 조심','지금 들어가야 하나','폭풍 전야인가','아무것도 안 하면 안 잃지','커피 한 잔 할까','원숭이도 차트는 본다','오늘 운세 대박이랬는데','손가락 스트레칭 중']};
const MLOSS=['아 ㅋㅋ 시드 증발', '한강 수온 몇도냐', '한강 갈 때가 됐다', '한강 뷰 예약 완료', '마포대교 가는 버스 몇 번이지', '한강 입수각', '깡통 찼다', '반토막 실화냐', '반의반토막…', '물렸다…', '물타기 간다', '존버는 승리한다', '손절은 과학이다…라던데', '손절 못 해서 강청 대기', '나락 가는 중', '내가 롱 잡으면 떨어지는 인간지표', '개미 털기 당하는 중', '개털 당했다', '전재산 넣었는데', '대출 풀매수였는데…', '샤갈!!', '이게 수업료냐', '망했다', '깡통각', '개같이 멸망 중'],MWIN=['푸근하다', '가즈아ㅏㅏ', '떡상 간다', '개같이 부활!', '익절은 항상 옳다', '퇴사각 나왔다', '경제적 자유 가즈아', '바나나스닥', '차트는 거짓말 안 한다'];['LL','SL'].forEach(k=>MUT[k].push(...MLOSS));['LW','SW'].forEach(k=>MUT[k].push(...MWIN));
MUT.LW.push(...['오늘 무조건 롱이다!!', '풀롱 쳐 그냥!!!', '나스닥 롱 진입. 경례.', '미국 튼튼! 반대로 베팅하지 마라', '와 나스닥은 난공불락이냐 ㅋㅋㅋ', '신고가 찍으러 간다', '나스닥 뜨억상!', '킹스닥 가즈아!', '냅두면 오른대 ㅋㅋ',  '나스닥 악귀 숏충이 어디 갔냐']);MUT.LL.push(...['오늘 롱이면 좋겠다… 제발…', '오늘은 좀 올라야 하는 거 아니냐?', '기다려라, 희망을 가져라!', '나 본전 올 때까지 숨 참음', '존버 탄다', '나스닥 롱 승차감 구린데?', '납치당한 느낌인데…', 'N자로 처박네', '포지션 줄이다가 못 참고 다시 늘림']);MUT.SW.push(...['모든 자산을 숏에 베팅하라', '하락은 아직 시작도 안 했다니까 ㅋㅋㅋ', 'AI가 결국 가짜였구나 ㅋㅋㅋㅋ', '더 많이 떨어져라, 더 많이 울어라', '숏 또 준다고? 감사합니다', '지금 풀숏 때리면 집 산다', '롱숭이 망했다 ㅋㅋ', '롱숭이들 빤스 좀 볼까 ㅋㅋ', '롱숭이들은 선물의 본질을 모름', '떨롱 맥여주니까 롱숭이들 미침', '이젠 좀 인정해라 ㅉ', '닷컴버블보다 상황 더 안 좋음']);MUT.SL.push(...['여기서 처박아야 하는데…', '오늘 왠지 또 폭락할 것 같지 않냐?', '아 오늘이 진짜 폭락할 듯', '나스닥 평생 횡보나 해라 ㅉㅉ', '차트가 위로 절대 못 갈 차트 같은데???', '납치당한 느낌인데…', 'AI 버블이 맞는 이유 알려줌']);MUT.LW.push(...['내 계좌 대폭등 ㅋㅋㅋ', '행복한 소식 전하러 왔습니다.', '와 미쳤다 ㅋㅋㅋㅋㅋㅋㅋ', '이틀간 1000포인트 우습네', '내가 말했지?', '익절은 언제나 본절보다 낫다', '불타기 간다! 🔥', '마지막에 웃는 자가 범인이다', '올해 마이너스 4시간 정도 봤나?', ]);MUT.SW.push(...['내 계좌 대폭등 ㅋㅋㅋ', '행복한 소식 전하러 왔습니다.', '와 미쳤다 ㅋㅋㅋㅋㅋㅋㅋ', '이틀간 1000포인트 우습네', '내가 말했지?', '익절은 언제나 본절보다 낫다', '불타기 간다! 🔥', '마지막에 웃는 자가 범인이다', '올해 마이너스 4시간 정도 봤나?', ]);MUT.LL.push(...['대 폭 락 !!! 나 스 닥 !', '돈 백만 원 날아가서 계약 수 하나 줄었다', '오늘 백만 잃었다 흑', '참고로 오늘 납치되면…', '걍 포기다 ㅠㅠ', '꽃을 뽑고 잡초에 물 주기', '광기의 물타기 끝에 한강 정모', '물타다 계약 수만 늘었다', '설거지 당했다', '상투 잡았다', '털렸다… 팔자마자 오름', '아 어제 눈 딱 감고 샀으면…']);MUT.SL.push(...['대 폭 락 !!! 나 스 닥 !', '돈 백만 원 날아가서 계약 수 하나 줄었다', '오늘 백만 잃었다 흑', '참고로 오늘 납치되면…', '걍 포기다 ㅠㅠ', '꽃을 뽑고 잡초에 물 주기', '광기의 물타기 끝에 한강 정모', '물타다 계약 수만 늘었다', '설거지 당했다', '상투 잡았다', '털렸다… 팔자마자 오름', '아 어제 눈 딱 감고 샀으면…']);MUT.ID.push(...['美 대통령 타코 떴다!!!', '타코오~?', '타코할 때 되긴 함', '월가 속보 ㄷㄷㄷㄷㄷ', '올려도 내려도 지랄', '다우가 말아주는~', '오늘은 다우 차례냐', '쮤끔쮤끔 내리다가 갑자기 쳐오르는 차트죠잉', '어제 저점 못 깨면 롱이지 ㅋ', '오늘은 콜 오브 듀티나 해야겠다', '다음 주에 월급날이다', '우주방어 들어간다', '무포 상태, 현금이 왕']);const BUSTL=['-1.2억 확정 손실', '나스닥 선물로 1900만 원 날렸다.',  '경제적 자유 박탈 ㄷㄷㄷ', '외화 유출 현황.xlsx', '외화유출범 등장', '대출전사 2일 차 마무리', '얘들아… 삼천만 원도 큰돈 맞지?',  '진짜 다 끝난 새끼들.jpg', '롱충이들 ㄹㅇ 망했구나'];
MUT.LL.push('어어..나선아..어디가니');MUT.SL.push('어어..나선아..어디가니');MUT.SW.push('롱충이들 희망차니?','롱충이들 이제 그냥 희망사항만 얘기하고 있네 ㅋㅋ');
BUSTL.push('레버리지 풀로 땡기다 인생 망했으면 개추 ㅋㅋㅋ');MUT.LW.push('오늘 나스닥 오른다고 생각하면 개추','롱이 진리라고 생각하면 개추','익절하고 치킨 시킨 사람 개추');MUT.SW.push('세상 망했으면 좋겠는 사람 개추','익절하고 치킨 시킨 사람 개추');MUT.LL.push('나만 롱 물렸으면 개추');MUT.SL.push('숏 치다가 한강 간 사람 개추');
MUT.LW.push('롱이라고 했제 ㅋㅋㅋㅋ','떡상 온다 했제','내가 뭐랬제 ㅋㅋ','반등 온다 했제','나스닥은 오른다 했제');MUT.SW.push('숏이라고 했제 ㅋㅋㅋㅋ','떡락 온다 했제','내가 뭐랬제 ㅋㅋ','거품이라 했제','지하실 간다 했제');
const TITLES=[
[-90,'한강 수영선수','물온도 체크 완료… 수영복 챙겨라','swim'],
[-50,'깡통 원숭이','계좌에 바나나 껍질만 남음','can'],
[-20,'물린 개미','물타다 계약 수만 늘었다','cry'],
[-5,'존버 원숭이','본전 오면 판다 (안 옴)','hold'],
[0,'개미','수수료 기부 감사합니다','sweat'],
[5,'단타충','티끌 모아 티끌','band'],
[15,'치킨값 사냥꾼','오늘 치킨은 내가 쏜다','pick'],
[30,'스캘퍼','손이 눈보다 빠르다','shade'],
[60,'차트 무당','캔들이 말을 걸어온다','shaman'],
[100,'익절 장인','팔고 나서 차트 안 봄','chef'],
[200,'고래','고래형님 떴다 ㅋㅋㅋ','whale'],
[400,'월가의 원숭이','법인카드 한도 무제한','wolf'],
[700,'월가의 킹콩','옥상 헬기장에서 바나나 먹는 중','rich'],
[1000,'나스닥 주인','지수가 내 기분 따라 움직임','crown'],
[2000,'세계 경제 멱살잡이','IMF가 나한테 전화함','gold'],
[3000,'헤지펀드 회장님','월가가 내 눈치 본다','fed'],
[5000,'화성행 로켓숭이','달은 경유지일 뿐','rocket'],
[10000,'원숭이 행성 정복자','인류는 이제 우리 동물원 관람객','planet'],
[1e12,'인간 서킷브레이커','내가 들어가면 거래가 멈춘다','god']];
const titleOf=r=>TITLES.find(t=>r<t[0])||TITLES[TITLES.length-1];
const SPECIALS=[
 ['돌숭이','바위처럼 가만히','stone',s=>s.trades===0],
['청산 수집가','청산 도장 깨기 완료','liq',s=>s.liq>=2&&s.ret<100],
 ['원샷원킬','한 발이면 충분','sniper',s=>s.trades===1&&s.ret>=50],
 ['뚝심있는 원숭이','흔들어도 안 팔아','grit',s=>s.holdW>=40],
 ['존버충','본전 올 때까지 안 판다','jonbeo',s=>s.holdL>=30&&s.ret<100],
 ['기사회생 원숭이','마진콜 맞고 살아남','phoenix',s=>s.mcN>0&&s.ret>0],
 ['인간 지표','내 반대로 하면 부자','contra',s=>s.trades>=5&&s.wins===0&&s.ret<100],
 ['한방맨','아홉 번 털리고 한 방에 역전','oneshot',s=>s.trades>=4&&s.wr<=35&&s.ret>=50&&s.ret<1000],
 ['국밥배터','이길 때마다 국밥 한 그릇','gukbap',s=>s.trades>=5&&s.wr>=80&&s.ret>=0&&s.ret<15],
 ['수수료 기부천사','거래소 사장님 오늘도 감사합니다','angel',s=>s.trades>=3&&s.gross>0&&s.fees>=s.gross&&s.ret<100],
 ['손가락 관절염','손목 보호대 필수','wrist',s=>s.trades>=40&&s.ret<100],
 ['스캘핑 머신','손가락에 쥐 나기 직전','machine',s=>s.trades>=25&&s.trades<=39&&s.ret<100],
 ['롱숭이','나스닥은 오른다고','long',s=>s.trades>=3&&s.shortN===0&&s.ret<100],
 ['숏숭이','세상아 망해라','short',s=>s.trades>=3&&s.longN===0&&s.ret<100]];
const SPN=new Set(SPECIALS.map(x=>x[0]));
const specialOf=s=>{const x=SPECIALS.find(x=>x[3](s));return x?[0,x[0],x[1],x[2]]:null};
const dispTitle=e=>e.ttl&&SPN.has(e.ttl)?e.ttl:titleOf(+e.ret||0)[1];

function drawPortrait(cv,kind){const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);const sc=6,ox=6,oy=8,W=cv.width,H=cv.height;
 const bg={swim:'#3b5dc9',can:'#5d275d',cry:'#566c86',hold:'#29366f',sweat:'#333c57',band:'#b13e53',pick:'#a7f070',shade:'#38b764',shaman:'#3b2a5d',chef:'#257179',whale:'#41a6f6',rich:'#5d3a1a',wolf:'#1a1c2c',crown:'#7a1f3d',gold:'#6b4a00',fed:'#14324a',rocket:'#0b0d2a',planet:'#120a2a',god:'#000',sage:'#4b6b3a',stone:'#566c86',sniper:'#3a1020',grit:'#29366f',jonbeo:'#3f3f4a',phoenix:'#7a2a00',contra:'#1a1c2c',wrist:'#4a3a5a',long:'#1f5a2a',short:'#14142a',liq:'#5a0f0f',oneshot:'#333c57',gukbap:'#8a4b2a',angel:'#9fc9e8',machine:'#222'}[kind]||'#1a1c2c';c.fillStyle=bg;c.fillRect(0,0,W,H);
 const R=(x,y,w,h,k)=>{c.fillStyle=PAL[k]||k;c.fillRect((ox+x)*sc,(oy+y)*sc,w*sc,h*sc)};
 const stars=(n,col)=>{c.fillStyle=col;for(let i=0;i<n;i++)c.fillRect((i*37+11)%W,(i*53+7)%H,4,4)};
 const banana=(x,y,k='Y')=>{R(x,y+1,1,2,k);R(x+1,y+3,2,1,k);R(x+3,y+2,1,1,k);R(x,y,1,1,'N')};
 const crown=(x,y,k,gem)=>{R(x,y+1,8,2,k);R(x,y,1,1,k);R(x+2,y-1,1,2,k);R(x+4,y-1,1,2,k);R(x+7,y,1,1,k);R(x+3,y+1,2,1,gem||'r')};
 if(['wolf','crown','fed'].includes(kind))stars(14,'#f7e26b');
 if(kind==='gold'){for(let i=0;i<8;i++){c.fillStyle=i%2?'#ff4d2e':'#ffa300';c.fillRect(i*17,H-18-(i*13%14),12,30)}c.fillStyle='rgba(255,77,46,.18)';c.fillRect(0,0,W,H)}
 if(kind==='rocket'){stars(30,'#fff');}
 if(kind==='planet'){stars(26,'#fff');c.fillStyle='#b13e53';c.beginPath();c.arc(W-22,26,20,0,7);c.fill();c.fillStyle='#ef7d57';c.fillRect(W-50,24,56,4)}
 if(kind==='god'){c.fillStyle='#0b0d2a';c.fillRect(0,0,W,H);stars(30,'#fff');c.fillStyle='rgba(255,236,39,.28)';c.beginPath();c.arc(W/2,H/2,60,0,7);c.fill()}
 if(kind==='whale'){for(let i=0;i<6;i++){R(-6+i*5,17,3,1,'c')}}
 if(kind==='rich'){for(let i=0;i<4;i++){c.fillStyle=['#94b0c2','#566c86','#94b0c2','#333c57'][i];const bh=46+i*19%44;c.fillRect(i*34,H-bh,28,bh);c.fillStyle='#c2c3c7';c.fillRect(i*34-1,H-bh,30,4);c.fillStyle='#1a1c2c';for(let x=i*34+3;x<i*34+26;x+=6)c.fillRect(x,H-bh+8,2,bh-8)}c.fillStyle='#000';c.fillRect(0,H-30,W||132,7);c.fillStyle='#38b764';for(let x=2;x<132;x+=11)c.fillRect(x,H-28,6,3)}
 if(kind==='sniper'){c.strokeStyle='#ff4d4d';c.lineWidth=3;c.beginPath();c.arc(W/2,H/2,54,0,7);c.stroke();c.fillStyle='#ff4d4d';c.fillRect(W/2-1,0,3,H);c.fillRect(0,H/2-1,W,3)}
 if(kind==='phoenix'){for(let i=0;i<8;i++){c.fillStyle=i%2?'#ff4d2e':'#ffa300';c.fillRect(i*17,H-22-(i*11%16),12,34)}}
 if(kind==='jonbeo'){c.strokeStyle='#c2c3c7';c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.moveTo(0,0);c.lineTo(60-i*12,i*14);c.stroke()}for(let r=12;r<60;r+=14){c.beginPath();c.arc(0,0,r,0,1.6);c.stroke()}}
 if(kind==='long'){c.fillStyle='#38b764';for(let i=0;i<6;i++)c.fillRect(8+i*20,H-20-i*14,12,20+i*14)}
 if(kind==='short'){c.fillStyle='#b13e53';for(let i=0;i<6;i++)c.fillRect(8+i*20,H-90+i*14,12,90-i*14)}
 const fm={swim:'panic',can:'sad',cry:'sad',hold:'idle',sweat:'idle',band:'idle',liq:'panic',angel:'idle',sage:'idle',stone:'idle',jonbeo:'sad',contra:'sad',wrist:'idle',short:'idle',long:'happy',gukbap:'happy',machine:'idle'}[kind]||'happy';
 let Bd=fm==='happy'?bodyUp:body,F=face[fm];if(kind==='long'){Bd=Bd.map(r=>r.replace(/s/g,'Y').replace(/n/g,'r'));F=F.map((r,j)=>j===1?'.rrrrrrrr.':(j===3?'snkkkkkkns':r))}if(kind==='short'){Bd=Bd.map(r=>r.replace(/s/g,'b').replace(/n/g,'d'));F=F.map((r,j)=>j<2?r.replace(/n/g,'d'):(j===2?'dddssssddd':(j===3?r.replace(/k/g,'B'):(j===5?'.nskkkksn.':r))))}draw(c,spr(F),(ox)*sc,(oy)*sc,sc);draw(c,spr(Bd),ox*sc,(oy+7)*sc,sc);
 switch(kind){
 case'swim':R(-6,10,22,4,'B');R(-6,10,22,1,'c');R(2,3,2,1,'c');R(6,3,2,1,'c');R(12,-4,1,3,'w');R(12,0,1,1,'w');break;
 case'can':R(1,-4,8,4,'G');R(1,-4,8,1,'w');R(3,-3,4,1,'r');R(2,4,1,3,'B');R(7,4,1,3,'B');break;
 case'cry':R(2,4,1,4,'B');R(7,4,1,4,'B');R(2,8,1,1,'c');R(7,8,1,1,'c');break;
 case'hold':R(-3,8,3,3,'c');R(-2,7,1,1,'w');R(10,1,1,2,'c');R(1,-2,8,1,'b');break;
 case'sweat':R(10,1,1,2,'c');R(10,3,1,1,'B');R(-2,-3,3,2,'Y');break;
 case'band':R(1,1,8,1,'r');R(9,1,2,1,'r');R(10,2,1,2,'r');R(4,1,2,1,'w');break;
 case'pick':R(10,5,3,3,'o');R(11,4,2,1,'p');R(12,8,1,2,'w');R(12,10,2,1,'w');R(-4,9,4,3,'r');R(-4,9,4,1,'w');R(-3,10,2,1,'w');break;
 case'shade':R(1,3,3,1,'k');R(6,3,3,1,'k');R(4,3,2,1,'k');R(2,3,1,1,'G');R(7,3,1,1,'G');R(10,9,3,1,'Y');R(11,8,2,1,'Y');break;
 case'shaman':R(0,-1,10,1,'#7b3fa0');R(2,-3,6,2,'#7b3fa0');R(4,-5,2,2,'#7b3fa0');R(4,-3,2,1,'Y');R(-4,9,4,4,'c');R(-3,10,2,2,'w');break;
 case'chef':R(1,-1,8,1,'w');R(0,-4,10,3,'w');R(2,-5,2,1,'w');R(6,-5,2,1,'w');R(10,7,1,5,'G');R(10,6,1,1,'w');break;
 case'whale':R(1,-3,8,3,'b');R(2,-4,6,1,'b');R(3,-2,1,1,'w');R(8,-5,1,2,'c');R(7,-6,1,1,'c');R(9,-6,1,1,'c');break;
 case'rich':R(1,10,2,4,'k');R(7,10,2,4,'k');R(4.5,10,1,4,'r');R(-2,15,14,2,'G');R(-2,15,14,0.5,'w');R(4,15,1,1,'Y');R(2,7,6,1,'Y');R(3,8,4,1,'Y');R(4,9,2,1,'#ffd700');R(1,9,3,3,'N');R(6,9,3,3,'N');R(2,10,1,1,'n');R(7,10,1,1,'n');R(-1,1,1,2,'w');R(11,1,1,2,'w');R(12,-5,6,2,'b');R(11,-6,8,0.5,'k');R(18,-5,3,1,'b');R(14,-3,4,0.4,'k');R(13,-4,2,1,'c');break;
 case'wolf':R(1,-3,8,3,'k');R(0,0,10,1,'k');R(3,7,4,3,'w');R(4,7,2,4,'r');R(2,7,1,3,'k');R(7,7,1,3,'k');R(8,5,3,1,'p');R(11,5,1,1,'o');R(-3,8,3,2,'g');R(-3,8,3,0.4,'Y');break;
 case'crown':crown(1,-3,'Y','r');R(-1,7,1,7,'r');R(10,7,1,7,'r');R(2,7,6,1,'Y');break;
 case'gold':R(1,3,3,1,'k');R(6,3,3,1,'k');R(4,3,2,1,'k');R(2,3,1,1,'r');R(7,3,1,1,'r');R(2,7,6,6,'k');R(4,7,2,3,'w');R(4,8,2,2,'r');R(11,6,5,7,'b');R(10,7,7,5,'b');R(12,7,2,2,'g');R(14,9,2,2,'g');R(11,10,2,1,'g');R(13,11,1,1,'g');R(11,5,5,1,'w');R(8,6,3,1,'N');R(10,5,2,2,'N');R(17,5,1,2,'w');R(18,8,1,2,'w');R(17,11,1,2,'w');R(9,13,1,1,'w');break;
 case'fed':R(2,-4,6,4,'k');R(0,0,10,1,'k');R(6,3,3,1,'Y');R(7,3,1,1,'c');R(8,4,1,3,'Y');R(2,7,6,6,'d');R(4,7,2,3,'w');R(4,8,2,2,'b');R(8,5,3,1,'p');R(11,5,1,1,'o');R(-5,10,5,4,'N');R(-4,9,3,1,'N');R(-3,11,1,1,'Y');break;
 case'rocket':c.fillStyle='rgba(115,239,247,.35)';c.fillRect((ox-1)*sc,(oy-2)*sc,12*sc,10*sc);R(-1,-2,12,1,'w');R(11,0,4,8,'w');R(12,-2,2,2,'r');R(11,8,1,2,'r');R(14,8,1,2,'r');R(12,10,2,2,'o');R(12,12,2,1,'Y');break;
 case'planet':crown(1,-3,'Y','r');R(-3,0,1,12,'w');R(-2,0,5,3,'Y');R(-1,1,2,1,'r');break;
 case'god':R(0,-5,10,1,'Y');R(-1,-4,1,1,'Y');R(10,-4,1,1,'Y');R(3,-3,4,3,'#ff2020');R(4,-3,1,1,'w');R(2,0,6,1,'G');c.fillStyle='rgba(255,32,32,.35)';c.fillRect((ox-3)*sc,(oy-5)*sc,16*sc,6*sc);R(11,3,5,5,'#d81b1b');R(12,2,3,1,'#d81b1b');R(12,8,3,1,'#d81b1b');R(10,4,1,3,'#d81b1b');R(16,4,1,3,'#d81b1b');R(11,5,6,1,'w');R(13,9,1,5,'G');break;
case'stone':R(3,9,1,3,'k');R(4,12,2,1,'k');R(-1,10,1,2,'k');R(-5,13,20,3,'#8b9bb4');break;
 case'sniper':R(1,-3,8,2,'#3f6b3f');R(10,7,8,1,'k');R(12,6,3,1,'k');R(11,8,1,2,'N');R(18,7,1,1,'o');R(1,3,3,1,'k');break;
 case'grit':R(1,1,8,1,'r');R(9,1,2,1,'r');R(-4,9,3,3,'c');R(-3,8,1,1,'w');R(10,9,3,3,'c');R(11,8,1,1,'w');break;
 case'jonbeo':R(2,9,6,3,'w');R(3,12,4,1,'w');R(1,-1,8,1,'#c2c3c7');R(10,1,1,2,'c');break;
 case'phoenix':R(1,1,8,1,'w');R(2,1,1,1,'r');R(-2,-4,3,2,'Y');R(9,-4,3,2,'Y');R(4,-5,2,2,'o');break;
 case'contra':R(-5,6,5,6,'w');R(-3,7,1,3,'r');R(-4,9,3,1,'r');R(-3,10,1,1,'r');R(10,-3,1,3,'Y');R(10,1,1,1,'Y');break;
 case'wrist':R(-1,10,3,2,'w');R(8,10,3,2,'w');R(-4,8,2,1,'c');R(-4,12,2,1,'c');R(12,8,2,1,'c');R(12,12,2,1,'c');R(10,1,1,2,'c');break;
 case'long':R(-3,-3,1,3,'Y');R(-4,-2,3,1,'Y');R(11,2,1,3,'g');R(10,3,3,1,'g');break;
 case'short':R(11,9,1,3,'r');R(10,10,3,1,'r');break;
 case'sage':R(1,3,3,1,'k');R(6,3,3,1,'k');R(2,6,6,4,'w');R(-4,10,4,3,'w');R(-3,9,2,1,'c');break;
 case'liq':R(-6,-4,22,1,'r');R(-6,14,22,1,'r');R(1,-3,8,2,'r');R(3,-3,4,1,'w');R(2,4,1,3,'B');R(7,4,1,3,'B');break;
 case'oneshot':R(1,-3,8,3,'#ef7d57');R(10,4,3,3,'k');R(13,5,3,1,'k');R(16,4,1,1,'Y');R(17,3,1,1,'o');break;
 case'gukbap':R(-5,10,7,3,'w');R(-4,13,5,1,'w');R(-4,9,5,1,'#e0c080');R(-3,7,1,2,'G');R(-1,6,1,3,'G');break;
 case'angel':R(1,-3,8,1,'Y');R(0,-2,1,1,'Y');R(9,-2,1,1,'Y');R(-4,7,4,4,'w');R(10,7,4,4,'w');R(11,11,2,2,'g');break;
 case'machine':R(1,3,8,1,'r');R(1,2,8,1,'k');R(-4,8,4,4,'G');R(-3,9,2,2,'c');R(10,8,4,4,'G');R(11,9,2,2,'c');break;}if(kind==='stone'){const im=c.getImageData(0,0,W,H),d=im.data;for(let i=0;i<d.length;i+=4){const g=Math.min(235,(d[i]*.3+d[i+1]*.59+d[i+2]*.11)*.8+55);d[i]=d[i+1]=d[i+2]=g}c.putImageData(im,0,0)}
}

MUT.ID.push('나는 바나나 알러지 원숭이');
MUT.LL.push('비싸게 사서 싸게 팔기');MUT.SL.push('싸게 팔아서 비싸게 사기');
MUT.LL.push('나스닥은 신이고 나는 병신이다');MUT.SL.push('나스닥은 신이고 나는 병신이다');
MUT.SW.push('대공황 떴냐?');
MUT.LW.push('쉽다쉬워 ㅋㅋㅋ');MUT.SW.push('쉽다쉬워 ㅋㅋㅋ');
let lastM='';function pickNR(a){let s,n=0;do{s=pick(a)}while(s===lastM&&n++<9&&a.length>1);return lastM=s}
function sayM(t){if(state==='result')return;const e=$('mut');lastM=t;e.textContent=t;e.className='';void e.offsetWidth;e.className='show';clearTimeout(e._t);e._t=setTimeout(()=>e.className='',2800)}
let mutT=180;function mutter(){if(!G.on)return;let k='ID';if(S.pos){const w=upnl()>=0;k=(S.pos.dir>0?'L':'S')+(w?'W':'L')}const e=$('mut');const HOT={LW:['푸근하다','숏충이들아 정신이 좀 들어?'],SW:['푸근하다','롱충이들아 정신이 좀 들어?'],LL:['한강 물온도 체크','(진짜모름) 이거 환불 안돼요?'],SL:['한강 물온도 체크','(진짜모름) 이거 환불 안돼요?']};const mv=S.pos?(G.price-G.cur[0])*S.pos.dir:0;const yc=S.pos&&S.pos.dir>0?'영차영차!':'영차영차 끌어내려!';const z=(mv>0&&lastM!==yc&&Math.random()<.45)?(S.pos.dir>0?'영차영차!':'영차영차 끌어내려!'):(HOT[k]&&Math.random()<.4)?pickNR(HOT[k]):pickNR(MUT[k]);lastM=z;e.textContent=z;e.className='';void e.offsetWidth;e.className='show';clearTimeout(e._t);e._t=setTimeout(()=>e.className='',2800)}
function dangerOff(){G.danger=0;clearTimeout(G.mt);$('mm').className=''}
function drawChart(){cc.fillStyle='#1a1c2c';cc.fillRect(0,0,CW,CH);if(!G.day)return;const c=G.day.c;const vis=[];for(let j=Math.max(0,G.i-29);j<G.i;j++)vis.push(c[j]);vis.push(G.cur);
 let hi=-1e9,lo=1e9,vm=1;vis.forEach(x=>{hi=Math.max(hi,x[1]);lo=Math.min(lo,x[2]);vm=Math.max(vm,x[4]||0)});if(S.pos){hi=Math.max(hi,S.pos.px);lo=Math.min(lo,S.pos.px)}const pad=(hi-lo)*.1+2;hi+=pad;lo-=pad;
 const ch2=CH-22,y=v=>Math.round((hi-v)/(hi-lo)*ch2)+1;cc.fillStyle='#262b44';for(let g=0;g<5;g++)cc.fillRect(0,(g*ch2/4)|0,CW,1);
 const bw=6,off=CW-vis.length*bw-14;const s0=Math.max(0,G.i-29);
 vis.forEach((x,j)=>{const X=off+j*bw;const up=x[3]>=x[0];cc.fillStyle=up?'#e43b44':'#3b7dd8';cc.fillRect(X+2,y(x[1]),1,Math.max(1,y(x[2])-y(x[1])));const t=Math.min(y(x[0]),y(x[3]));cc.fillRect(X,t,5,Math.max(1,Math.abs(y(x[0])-y(x[3]))));const vh=Math.round((x[4]||0)/vm*16);cc.globalAlpha=.5;cc.fillRect(X,CH-vh,5,vh);cc.globalAlpha=1});
 G.arrows.forEach(a=>{const j=a.i-s0;if(j<0)return;const X=off+j*bw;cc.fillStyle=a.d>0?'#ff6b6b':'#6bb0ff';const Y=y(a.p);if(a.d>0){cc.fillRect(X+2,Y+3,1,1);cc.fillRect(X+1,Y+4,3,1);cc.fillRect(X,Y+5,5,1)}else{cc.fillRect(X,Y-5,5,1);cc.fillRect(X+1,Y-4,3,1);cc.fillRect(X+2,Y-3,1,1)}});
 if(S.pos){cc.fillStyle='#f7e26b';const Y=y(S.pos.px);for(let i=0;i<CW;i+=4)cc.fillRect(i,Y,2,1)}
 const LL=$('liqLine'),L=$('liqLbl');if(S.pos){const lp=S.pos.px-S.pos.dir*S.pos.bet/ptVal();const dist=Math.abs(G.price-lp)/(S.pos.bet/ptVal());const per=Math.max(4,Math.round(dist*40));const on=(frame%per)<per*.6;let Y=y(lp),ar='',pin=false;if(Y<2){Y=2;ar='▲ ';pin=true}else if(Y>ch2-2){Y=ch2-2;ar='▼ ';pin=true}
 const box=$('chartBox');LL.style.display='block';LL.classList.toggle('pin',pin);LL.style.top=(box.offsetTop+$('game').offsetTop+3+Y*2)+'px';LL.style.opacity=on?1:.55;L.textContent=ar+'청산';L.style.top=(pin&&ar==='▲ '?0:Y*2>24?-20:2)+'px'}else LL.style.display='none';
 const Y=y(G.price);cc.fillStyle=G.cur[3]>=G.cur[0]?'#e43b44':'#3b7dd8';cc.fillRect(CW-13,Y-3,13,7);cc.fillStyle='#fff';cc.fillRect(CW-11,Y,9,1);}
const WHALE=spr(['.....bbbbbb.......','...bbbbbbbbbb....b','..bbbwkbbbbbbb..bb','.bbbbbbbbbbbbbbbb.','bbbbbbbbbbbbbbbbb.','.cccccccccccbbbbbb','..cccccccccbb...bb','....ccccc.........']);
function drawFx(){fc.clearRect(0,0,W,H);frame++;const bob=Math.sin(frame/10)>0?0:1;
 if(G.whale>0&&state==='play'){const wx=W+10-G.whale*1.1,wy=78+(Math.sin(G.whale/8)>0?0:1);draw(fc,WHALE,wx,wy,2);if((G.whale/6|0)%3!==2){fc.fillStyle='#8fd3ff';for(let i=0;i<4;i++){const h=4+((G.whale+i*3)%8);fc.fillRect(wx+6+i*2-3,wy-h,1,h-1)}fc.fillRect(wx+2,wy-10-(G.whale%4),2,1);fc.fillRect(wx+12,wy-10-((G.whale+2)%4),2,1)}G.whale++;if(wx<-50)G.whale=0}
 if(state==='title'){titleT++;const open=Math.min(1,Math.max(0,(titleT-40)/30));const gx=80,gy=200;
  // peeled banana: fruit + 3 peel flaps that fall open
  fc.fillStyle='#fff3c4';fc.fillRect(gx+8,gy-4,20,40);fc.fillStyle='#f7e26b';fc.fillRect(gx+4,gy+28,28,22);fc.fillStyle='#5d3a1a';fc.fillRect(gx+14,gy+50,8,6);
  const fl=(dx,dir)=>{for(let k=0;k<8;k++){const a=open*1.9*dir*(k/8),px=gx+dx+Math.sin(a)*k*4*dir*dir,py=gy+28-Math.cos(open*1.9*(k/8))*k*4;fc.fillStyle=k%3?'#f7e26b':'#ffcd75';fc.fillRect(Math.round(px)+Math.round(dir*open*k*1.2),Math.round(py),6,5)}};
  fl(4,-1);fl(24,1);fl(14,0);
  if(open>0){const h=Math.min(60,(titleT-60)*2);for(let i=0;i<6;i++){const hh=Math.max(0,h-((i*7)%20)-i*4);fc.fillStyle=i===3?'#3b7dd8':'#e43b44';fc.fillRect(gx+4+i*5,gy-hh,4,hh);}if(titleT===70)burst(97,190,60,['Y','w','y','r'],3,60)}
  // monkey holding banana
  const mk=rankS['개미'][(frame/15|0)%2];draw(fc,mk,12,226+bob,3);draw(fc,BAN,42,244+bob,2);
  // falling banana rain
  if(frame%14===0)BR.push({x:Math.random()*W,y:-10,v:.4+Math.random()*.5,f:Math.random()<.5});
  for(let k=BR.length-1;k>=0;k--){const b=BR[k];b.y+=b.v;draw(fc,BAN,b.x,b.y,1,b.f);if(b.y>H)BR.splice(k,1)}
  }
 else{ // mascot
  if(moodT>0)moodT--;else if(mood!=='idle'){mood='idle'}
  let m=mood;if(S.pos&&m==='idle'){const r=-upnl()/S.pos.bet;if(r>.4)m='sad';else if(r<-.2)m='happy'}
  fc.save();fc.translate(MX,MY);fc.scale(MS,MS);fc.translate(-14,-260);
  const mx=14,my=260+(m==='happy'?(frame%12<6?-3:0):bob);fc.save();if(m==='faint'){fc.translate(mx+16,my+20);fc.rotate(1.4);fc.translate(-mx-16,-my-20)}
  const fm=S.pos?S.pos.dir:0;if(fm!==lastForm){lastForm=fm;formT=0;const nt=$('ntag');nt.className=fm>0?'L':fm<0?'S':'';nt.textContent=fm>0?'롱숭이':fm<0?'숏숭이':'';if(state==='play'){if(fm<0){const dm=$('dim');dm.className='';void dm.offsetWidth;dm.className='on'}else if(!fm)burstM(mx+15,my+20,25,['w','G'],1.5,20,0,2)}}formT++;
  let F=face[m],Bd=m==='happy'?bodyUp:body;
  if(fm>0){const land=formT>=18;Bd=Bd.map(r=>r.replace(/s/g,'Y').replace(/n/g,'r'));if(land)F=F.map((r,j)=>j===1?'.rrrrrrrr.':(j===3&&m!=='faint'&&m!=='sad'?'snkkkkkkns':r));
   if(!land){const fy=my+3-(18-formT)*5;draw(fc,spr(['.rrrrrrrr.','snkkkkkkns']),mx,fy,3)}if(formT===18){burstM(mx+15,my+5,30,['Y','w','p'],2,25,0,1);snd(1568,.08,'square',.05)}if(formT>18&&formT<26)my2=-((26-formT)%4)}
  if(fm<0){const aw=formT>=12;if(aw)Bd=Bd.map(r=>r.replace(/s/g,'b').replace(/n/g,'d'));if(aw)F=F.map((r,j)=>j<2?r.replace(/n/g,'d'):(j===2?'dddssssdd.'.replace('.','d'):(j===3&&m!=='faint'?r.replace(/k/g,'B'):(j===5&&m==='idle'?'.nskkkksn.':r))));
   if(formT<30){if(formT%3===0)F=F.map((r,j)=>j===3?r.replace(/k/g,'c'):r);if(formT%4===0)PM({x:mx+Math.random()*30,y:my+Math.random()*40,vx:(Math.random()-.5),vy:-.6,l:20,c:pick(['k','d','b']),g:0,s:2});if(formT===12){burstM(mx+15,my+20,30,['k','d','b','c'],2.2,25,0,2);snd(90,.4,'sawtooth',.08,-40)}if(formT<20&&formT%5<2){fc.fillStyle='#73eff7';let lx=mx+5+Math.random()*20;for(let ly=my-30;ly<my;ly+=3){lx+=(Math.random()-.5)*4;fc.fillRect(lx|0,ly,1,3)}}}}
  draw(fc,spr(F),mx,my+my2,3);draw(fc,spr(Bd),mx,my+21,3);my2=0;fc.restore();
  if(fm>0&&m!=='faint'&&formT>=18){draw(fc,spr(['..Y.','.YY.','YY..','Y...']),mx+30,my+12-(frame%30<15?1:0),2);if(frame%25===0)PM({x:mx+Math.random()*30,y:my+Math.random()*10,vx:0,vy:-.2,l:20,c:'Y',g:0,s:1})}
  if(fm<0&&m!=='faint'&&formT>=12){draw(fc,spr(['.GGG.','GGGGG','.GGG.']),mx+6+(frame%40<20?0:1),my-11,3);if(frame%10===0)PM({x:mx+10+Math.random()*10,y:my-2,vx:0,vy:.6,l:10,c:'B',g:0,s:1});draw(fc,spr(['.r.','.r.','rrr','.r.']),mx+31,my+22+(frame%20<10?0:1),2)}
  if(m==='sad'&&frame%20===0)PM({x:mx+22,y:my+6,vx:.2,vy:.3,l:30,c:'B',g:.05,s:1});
  if(m==='panic'){fc.fillStyle='#B13e53';fc.fillRect(mx+27,my-4+(frame%10<5?1:0),2,6);fc.fillRect(mx+27,my+4,2,2)}
  if(m==='faint'&&frame%8===0)PM({x:mx+12+Math.random()*10,y:my,vx:0,vy:-.3,l:25,c:'Y',g:0,s:1});
  fc.restore();
  // critter
  if(critter){critter.f++;const sp=critter.t==='bull'?2:-2;critter.x+=sp;const fr=(critter.f/5|0)%2;const sp2=critter.t==='bull'?(fr?bull2:bull):(fr?bear2:bear);draw(fc,sp2,critter.x,232,2,critter.t==='bear');if(critter.f%4===0)P.push({x:critter.x+(sp>0?0:24),y:246,vx:-sp*.3,vy:-.3,l:15,c:'G',g:0,s:1});if(critter.x<-30||critter.x>W+30)critter=null}
  // cat walking on ticker bar bottom of chart
  
  if(S.combo>=3&&frame%3===0)P.push({x:97+(Math.random()-.5)*60,y:290,vx:(Math.random()-.5)*.4,vy:-.8-Math.random(),l:25,c:pick(['o','Y','r']),g:-.01,s:1});
  if(state==='bell'){bellT--;const a=Math.sin(frame/3)*.5;fc.save();fc.translate(97,150);fc.rotate(a);draw(fc,bellS,-14,-4,4);fc.restore();if(frame%5===0)burst(97,170,3,['Y','w'],1.5,20,0)}
 }
 coins=coins.filter(c=>{c.vy+=.15;c.x+=c.vx;c.y+=c.vy;if(c.y>300&&c.vy>0){c.vy*=-.55;c.b++}c.l--;draw(fc,coin[(frame/4+c.f|0)%3],c.x,c.y,1);return c.l>0});
 P=P.filter(p=>{p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.l--;fc.fillStyle=PAL[p.c]||p.c;fc.fillRect(p.x|0,p.y|0,p.s,p.s);return p.l>0});}
