// fx2: fine-pixel animations (1 CSS px dots). ALTAR scene + WITCH chart-cover gimmick.
const FX2=(()=>{
const P=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const spr=(c,rows,x,y,pal,flip)=>{for(let j=0;j<rows.length;j++){const r=rows[j];for(let i=0;i<r.length;i++){const k=r[i];if(k==='.')continue;c.fillStyle=pal[k];c.fillRect((x+(flip?r.length-1-i:i))|0,(y+j)|0,1,1)}}};
const line=(c,x0,y0,x1,y1,col,t=1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0||1;c.fillStyle=col;for(let s=0;s<=n;s++)c.fillRect(Math.round(x0+(x1-x0)*s/n-t/2),Math.round(y0+(y1-y0)*s/n-t/2),t,t)};
const MP={n:'#94531f',N:'#5d3a1a',d:'#3d250f',s:'#ffcd75',S:'#e0a85a',k:'#1a1c2c',w:'#f4f4f4',p:'#ef7d57',P:'#ff9ec4'};
// monkey head 18x16
const HEAD=['.....NNNNNNNN.....','...NNnnnnnnnnNN...','..Nnnnnnnnnnnnnn..','.Nnnnnnnnnnnnnnnn.','sSNnnsssnnsssnnNSs','sSNnsssssssssssnSs','sSNnswkssssswksnSs','.sNnskksssskksn.s.','..Nnssssssssssn...','..NnPsssSSsssPn...','...nsssSkkSsssn...','...nnsssssssnnn...','....nnsskkssnn....','.....NnnnnnnN.....'];
const HEAD_HAPPY=HEAD.slice();HEAD_HAPPY[6]='sSNnsskssssskssnSs';HEAD_HAPPY[7]='.sNnskskssskskn.s.';HEAD_HAPPY[12]='....nnskkkksnn....';
const HEAD_SAD=HEAD.slice();HEAD_SAD[6]='sSNnssssssssssnSs.';HEAD_SAD[7]='.sNnskksssskksn.s.';HEAD_SAD[12]='....nnsssssnn.....';HEAD_SAD[11]='...nnsskkkksnnn...';
const BODY=['....NnnnnnnnnN....','...NnnnsssssnnnN..','..Nnnnssssssnnnn..','..Nnnsssssssnnnn..','..Nnnsssssssnnnn..','..NnnnsssssnnnnN..','...NnnnnnnnnnnN...','....NNnnnnnnNN....'];
function monkey(c,cx,fy,o){// o:{walk,kneel,arm,face,tail}
 const kn=o.kneel||0,arm=o.arm||0,lift=Math.round(kn*7);const by=fy-14-8+lift; // body top
 // tail
 for(let i=0;i<12;i++){const tx=cx+8+i*.9,ty=by+6-i*.8+Math.sin(o.t/8+i/2)*2;P(c,tx,ty,2,2,i>9?'#5d3a1a':'#94531f')}
 // legs
 if(kn<.5){const a=o.walk?Math.sin(o.walk)*2:0;P(c,cx-6,fy-8-Math.max(0,a),5,8,'#94531f');P(c,cx+1,fy-8-Math.max(0,-a),5,8,'#94531f');P(c,cx-7,fy-2-Math.max(0,a),6,2,'#5d3a1a');P(c,cx+1,fy-2-Math.max(0,-a),6,2,'#5d3a1a')}
 else{P(c,cx-9,fy-6,7,6,'#94531f');P(c,cx+2,fy-6,7,6,'#94531f');P(c,cx-10,fy-2,8,2,'#5d3a1a');P(c,cx+2,fy-2,8,2,'#5d3a1a');P(c,cx-7,fy-6,3,1,'#b8723a');P(c,cx+4,fy-6,3,1,'#b8723a')}
 spr(c,BODY,cx-9,by,MP);
 // arms: angle from down(0) to straight up(1)
 const sh=[[cx-7,by+2,-1],[cx+7,by+2,1]];const hands=[];
 for(const [sx,sy,sd] of sh){const ang=Math.PI/2+sd*(Math.PI*.15)-arm*Math.PI*(sd>0?-1:1)*0.0;const a=(1-arm)*(Math.PI/2+sd*.25)+arm*(-Math.PI/2+sd*.28);const L=11;const ex=sx+Math.cos(a)*L*(sd>0?1:1)*(1),ey=sy+Math.sin(a)*L;const hx=sx+(sd*Math.abs(Math.cos(a)))*L,hy=ey;
  line(c,sx,sy,hx,hy,'#94531f',3);P(c,hx-2,hy-2,4,4,'#ffcd75');P(c,hx-2,hy+1,4,1,'#e0a85a');hands.push([hx,hy])}
 spr(c,o.face==='happy'?HEAD_HAPPY:o.face==='sad'?HEAD_SAD:HEAD,cx-9,by-13,MP);
 if(o.blink&&o.face!=='happy'){P(c,cx-4,by-7,3,2,'#ffcd75');P(c,cx+2,by-7,3,2,'#ffcd75');P(c,cx-4,by-6,3,1,'#1a1c2c');P(c,cx+2,by-6,3,1,'#1a1c2c')}
 return {hands,headY:by-13}}
function altar(cv,id,ok,cb){const c=cv.getContext('2d');c.imageSmoothingEnabled=false;const W=cv.width,H=cv.height;const ban=BART.canvas(id,1);
 const stars=[...Array(70)].map(()=>[Math.random()*W,Math.random()*H*.55,Math.random()*10]);const parts=[];let f=0,done=false;const G=262;// ground
 const steps=[[96,G-10,128],[104,G-20,112],[112,G-30,96]];const TOP=G-30;
 const draw=()=>{f++;
  // sky gradient bands (dithered)
  const sky=['#0b0c16','#10122a','#151a3a','#1b2150'];for(let b=0;b<4;b++){P(c,0,b*45,W,45,sky[b])}for(let y=0;y<180;y+=2)for(let x=(y/2%2)*2;x<W;x+=4)if((y/45|0)<3&&y%45>38){c.fillStyle=sky[(y/45|0)+1];c.fillRect(x,y,1,1)}
  P(c,0,180,W,H-180,'#1b2150');
  stars.forEach(s=>{const tw=(f/6+s[2])%10;c.fillStyle=tw<1?'#ffffff':tw<5?'#94b0c2':'#3b4a7a';c.fillRect(s[0]|0,s[1]|0,1,1);if(tw<1){P(c,s[0]-1,s[1],3,1,'#94b0c2');P(c,s[0],s[1]-1,1,3,'#94b0c2')}});
  // moon
  c.fillStyle='#f7e26b';c.beginPath();c.arc(262,46,14,0,6.283);c.fill();c.fillStyle='#10122a';c.beginPath();c.arc(268,42,12,0,6.283);c.fill();
  // distant temple silhouettes
  P(c,0,200,W,62,'#141833');for(let x=0;x<W;x+=18)P(c,x,194+((x*7)%9),12,8,'#141833');
  // pillars
  for(const px of [52,252]){P(c,px,120,18,G-120,'#566c86');P(c,px+2,120,2,G-120,'#94b0c2');P(c,px+14,120,3,G-120,'#333c57');P(c,px-3,116,24,6,'#94b0c2');P(c,px-3,G-6,24,6,'#333c57');for(let y=130;y<G-8;y+=14)P(c,px+5,y,1,8,'#3e4a66');
   // torch
   const fl=[ '#ff8c1a','#ffcd2e','#f4f4f4'];P(c,px+6,106,6,10,'#5d3a1a');for(let i=0;i<3;i++){const h=8-i*2+((f+i*3)%6<3?1:0);P(c,px+7-((f/4|0)%2)+i,100-h+i*2,4-i,h,fl[i])}
   if(f%5===0)parts.push({x:px+9,y:96,vx:(Math.random()-.5)*.3,vy:-.5,l:30,col:'#ff8c1a'})}
  // ground tiles
  P(c,0,G,W,H-G,'#262b44');for(let x=0;x<W;x+=16){P(c,x,G,1,H-G,'#1a1c2c')}for(let y=G;y<H;y+=8)P(c,0,y,W,1,'#1a1c2c');P(c,0,G,W,1,'#566c86');
  // stairs + altar
  steps.forEach(([x,y,w])=>{P(c,x,y,w,10,'#566c86');P(c,x,y,w,1,'#c2d3e0');P(c,x,y+9,w,1,'#333c57');for(let k=x+6;k<x+w;k+=12)P(c,k,y+2,1,6,'#45546e')});
  // altar table on top
  P(c,138,TOP-26,44,26,'#3e4a66');P(c,134,TOP-30,52,5,'#94b0c2');P(c,134,TOP-30,52,1,'#f4f4f4');P(c,140,TOP-20,40,1,'#ffcd2e');for(let i=0;i<5;i++)P(c,144+i*8,TOP-16,3,3,i%2?'#b13e53':'#41a6f6');P(c,138,TOP-6,44,1,'#ffcd2e');
  // holy light pillar from sky
  const g=Math.min(1,f/60);for(let i=0;i<6;i++){c.fillStyle='rgba(255,236,150,'+(.025*g*(6-i)/6+.01)+')';c.fillRect(160-10-i*5,0,20+i*10,TOP-30)}
  for(let i=0;i<14;i++){const y=((f*0.8+i*23)%(TOP-30));c.fillStyle='rgba(255,246,200,'+(.5*g)+')';c.fillRect(150+((i*37)%22),TOP-30-y,1,2)}
  // monkey path: walk 0-70 on ground, climb 70-110, walk on top to altar 110-125, kneel 125-150, raise 150-185, result at 190
  let mx,my,o={t:f,walk:0,kneel:0,arm:0,face:null,blink:f%90<4};
  if(f<70){mx=10+f*1.25;my=G;o.walk=f/3}
  else if(f<110){const k=(f-70)/40,step=Math.min(2,k*3|0),fr=k*3-step;mx=98+k*30;my=G-10*(step+ (fr>.5?1:0))-Math.sin(Math.min(1,fr*2)*Math.PI)*5;o.walk=f/3;if(step===2&&fr>.5)my=TOP}
  else if(f<125){mx=128+(f-110)*1.6;my=TOP;o.walk=f/3}
  else{mx=152;my=TOP;o.kneel=Math.min(1,(f-125)/20);o.arm=f<150?0:Math.min(1,(f-150)/35);if(f>=150)o.arm=1-Math.pow(1-o.arm,3)}
  // shadow
  c.fillStyle='rgba(0,0,0,.35)';c.fillRect(mx-10,my-1,20,2);
  if(f>=190)o.face=ok?'happy':'sad';
  const M=monkey(c,mx,my,o);
  // banana held between hands
  if(f>=125){const hx=(M.hands[0][0]+M.hands[1][0])/2,hy=Math.min(M.hands[0][1],M.hands[1][1]);const bob=f>190&&ok?Math.sin(f/7)*1.5:0;const bx=hx-8,byy=hy-15+bob-(f>190&&ok?Math.min(10,(f-190)/3):0);
   if(f>150&&f<190&&f%6<3){c.fillStyle='rgba(255,236,150,.25)';c.fillRect(bx-2,byy-2,20,20)}
   if(f>=190&&ok){const k=f-190;for(let r=3;r>0;r--){c.fillStyle='rgba(255,240,170,'+(.12*r)+')';c.beginPath();c.arc(bx+8,byy+8,6+r*5+Math.sin(f/5)*2,0,6.283);c.fill()}
    for(let a=0;a<16;a++){const an=a/16*6.283+f/40,L=26+((a%2)*14)+Math.sin(f/6+a)*4;line(c,bx+8+Math.cos(an)*12,byy+8+Math.sin(an)*12,bx+8+Math.cos(an)*L,byy+8+Math.sin(an)*L,a%2?'rgba(255,205,46,.7)':'rgba(255,255,230,.8)',1)}
    if(k<40)for(let i=0;i<5;i++){const an=Math.random()*6.283,sp=.6+Math.random()*1.8;parts.push({x:bx+8,y:byy+8,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp-.4,l:40+Math.random()*30,col:['#fff7c2','#ffcd2e','#f7e26b','#ffffff'][i%4],star:Math.random()<.3})}
    else if(f%3===0)parts.push({x:bx+Math.random()*16,y:byy+16,vx:0,vy:-.4,l:50,col:'#fff7c2'});
    // halo over monkey
    c.strokeStyle='#ffcd2e';P(c,mx-6,M.headY-5,12,1,'#ffcd2e');P(c,mx-8,M.headY-4,2,1,'#ffcd2e');P(c,mx+6,M.headY-4,2,1,'#ffcd2e')}
   c.drawImage(ban,bx|0,byy|0,16,16);
   if(f>=190&&!ok){const k=f-190;if(k<20&&k%4===0)parts.push({x:bx+8,y:byy+10,vx:(Math.random()-.5)*.6,vy:-.2,l:30,col:'#566c86',dust:1});
    // sweat drop + "..." bubble
    P(c,mx+9,M.headY+2+(k/8%6),2,3,'#73eff7');if(k>20){P(c,mx+12,M.headY-18,22,10,'#f4f4f4');P(c,mx+14,M.headY-8,3,3,'#f4f4f4');for(let d=0;d<3;d++)if(k>24+d*10)P(c,mx+16+d*6,M.headY-14,2,2,'#1a1c2c')}
    // a lone cricket chirp-hop on the floor
    const cx=230-(k*.4%60);P(c,cx,G-3,4,2,'#38b764');P(c,cx+3,G-5-(k%20<4?2:0),1,2,'#38b764')}}
  // kneel dust
  if(f===135)for(let i=0;i<10;i++)parts.push({x:mx+(Math.random()-.5)*20,y:my-1,vx:(Math.random()-.5)*1.2,vy:-Math.random()*.6,l:20,col:'#94b0c2',dust:1});
  // particles
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;if(!p.dust)p.vy-=.005;else p.vy+=.02;p.l--;if(p.l<=0){parts.splice(i,1);continue}c.fillStyle=p.col;if(p.star&&p.l%8<4){c.fillRect(p.x-1|0,p.y|0,3,1);c.fillRect(p.x|0,p.y-1|0,1,3)}else c.fillRect(p.x|0,p.y|0,p.l>20?2:1,p.l>20?2:1)}
  if(f===190&&!done){done=true;cb&&cb()}
 };return {step:()=>{draw();return f},frame:()=>f,jump:n=>{while(f<n)draw()}}}
// ---------- witches ----------
const WP={k:'#1a1c2c',p:'#5b2a86',P:'#8d4cc4',g:'#38b764',G:'#a7f070',s:'#ffcd75',w:'#f4f4f4',n:'#94531f',N:'#5d3a1a',y:'#ffcd2e',o:'#ff8c1a',r:'#b13e53'};
const WITCH=[['.........k..........','........kpk.........','.......kpPpk........','......kpPPPpk.......','.....kkkkkkkkk......','....kyyyyyyyyyk.....','......kGGGGk........','......kGwkGGk.......','.......kGGGGk.rr....','.....kpPPpppkkrr....','....kpPPPPppppk.....','NNnnnnnnnnnnnnnnoooo','...kpPPPpppk..oyoyo.','....kkGk.kGk...ooo..'],
 ['.........k..........','........kpk.........','.......kpPpk........','......kpPPPpk.......','.....kkkkkkkkk......','....kyyyyyyyyyk.....','......kGGGGk........','......kGkkGGk.......','.......kGGGGk.rr....','.....kpPPpppkkrr....','....kpPPPPppppk.....','NNnnnnnnnnnnnnnnoooo','...kpPPPpppk..ooyoo.','.....kGk..kGk..o.o..']];
const FONT='"DungGeunMo","Galmuri11",monospace';
function txt(c,t,x,y,col,sz=11,al='center'){c.font=sz+'px '+FONT;c.textAlign=al;c.textBaseline='middle';c.fillStyle='#1a1c2c';c.fillText(t,x+1,y+1);c.fillStyle=col;c.fillText(t,x,y)}
const SIREN=['..kkkk..','.krrrrk.','krrwrrrk','krrrrrrk','kGGGGGGk','kkkkkkkk'];

const BIGW=(()=>{const FW=132,FH=96,out=[];
 const mk1=(f)=>{const cv=document.createElement('canvas');cv.width=FW;cv.height=FH;const g=cv.getContext('2d');const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x|0,y|0,w|0||1,h|0||1)};
  const ph=f/8*6.283,fl=Math.sin(ph);
  // broom stick
  for(let x=10;x<112;x++){const y=66+(x-10)*.06;R(x,y,1,3,'#5d3a1a');R(x,y,1,1,'#94531f')}
  R(108,68,4,5,'#b13e53');R(108,69,4,1,'#ef7d57');
  // bristles (left side = tail)
  for(let i=0;i<22;i++){const yy=58+i*0.75,len=26+((i*7)%9)+fl*2;for(let x=0;x<len;x++){const xx=14-x+Math.sin(x/4+i)*0.6;R(xx,yy+x*(i-11)*0.035,1,1,['#c28d38','#f7e26b','#94531f','#ffcd2e'][(i+x)%4])}}
  R(12,60,5,14,'#5d3a1a');R(13,61,3,12,'#94531f');R(12,64,5,1,'#b13e53');R(12,69,5,1,'#b13e53');
  // cape flapping behind
  for(let y=0;y<34;y++){const w=10+y*0.9+fl*(y/34)*8,x0=46-w;for(let x=0;x<w;x++){const wave=Math.sin(x/5-ph+y/9)*2;R(x0+x,30+y+wave*(x/w),1,1,y%6==0&&x%3==0?'#5a2a82':((x+y)%11==0?'#3a1a5a':'#29124a'))}}
  // body robe
  for(let y=0;y<26;y++){const w=18+y*.35;for(let x=0;x<w;x++)R(48+x-y*.2,36+y,1,1,x<3?'#1a1c2c':(x>w-3?'#5a2a82':'#41226a'))}
  R(48,52,24,2,'#ffcd2e');R(58,51,4,4,'#f4f4f4');R(59,52,2,2,'#ffcd2e');// belt + buckle
  // legs/boots over broom
  R(62,62,8,6,'#41226a');R(66,68,10,4,'#1a1c2c');R(74,69,3,2,'#333c57');R(64,70,4,6,'#b13e53');R(66,76,10,3,'#1a1c2c');
  // arm holding broom
  R(68,42,12,5,'#41226a');R(80,44,6,6,'#a7f070');R(81,45,4,4,'#38b764');R(86,56,4,10,'#a7f070');R(78,48,10,9,'#41226a');
  // head
  const hx=62,hy=16;for(let y=0;y<18;y++)for(let x=0;x<16;x++){const d=(x-8)**2/64+(y-9)**2/81;if(d<1)R(hx+x,hy+y,1,1,d>.75?'#257179':(x>11?'#38b764':'#a7f070'))}
  R(hx+15,hy+7,7,4,'#a7f070');R(hx+19,hy+9,3,5,'#38b764');R(hx+20,hy+13,2,2,'#257179');R(hx+18,hy+8,1,1,'#257179');// long nose + wart
  R(hx+10,hy+5,4,4,'#f4f4f4');R(hx+12,hy+6,2,2,'#1a1c2c');R(hx+13,hy+6,1,1,'#ff004d');R(hx+9,hy+3,6,1,'#1a1c2c');// eye + brow
  R(hx+9,hy+13,8,2,'#1a1c2c');R(hx+10,hy+13,1,1,'#f4f4f4');R(hx+14,hy+13,1,1,'#f4f4f4');R(hx+10,hy+15,6,1,'#b13e53');// grin teeth
  R(hx+3,hy+9,3,2,'#ff9ec4');
  // hair
  for(let i=0;i<14;i++){const L=8+(i%4)*3;for(let k=0;k<L;k++)R(hx-1-k*.8+Math.sin(ph+k/3)*1.5*(k/L),hy+4+i*1.2+k*.5,1,1,i%3?'#ef7d57':'#b13e53')}
  // hat brim + cone with bent tip
  for(let x=0;x<34;x++){R(hx-9+x,hy+2-Math.abs(x-17)*.08,1,3,x%5?'#1a1c2c':'#29124a')}R(hx-9,hy+2,34,1,'#333c57');
  for(let y=0;y<22;y++){const w=16-y*.62,cx=hx+8-y*.55+(y>14?(y-14)*(y-14)*.12*(1+fl*.3):0);for(let x=0;x<w;x++)R(cx-w/2+x,hy-y,1,1,x<1?'#5a2a82':'#29124a')}
  R(hx+1,hy-3,14,3,'#ffcd2e');R(hx+6,hy-3,3,3,'#f7e26b');R(hx+7,hy-2,1,1,'#b13e53');// band + buckle
  R(hx+4,hy-10,1,1,'#f7e26b');R(hx+8,hy-14,1,1,'#73eff7');// stars
  return cv};
 for(let f=0;f<8;f++){const a=mk1(f),b=document.createElement('canvas');b.width=FW;b.height=FH;const g=b.getContext('2d');g.translate(FW,0);g.scale(-1,1);g.drawImage(a,0,0);out.push([a,b])}
 return {fr:out,W:FW,H:FH}})();

const GOR3=(()=>{const a=new Image(),b=new Image();a.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAsCAYAAAAuCEsgAAADFUlEQVR4nO2YT2gTQRTGv5QKFkJYQnrI1m7Qlh4k0ENFpQcPQsFDKRYK5mg9eJCCIB6KeBTxJAjiQfDPsYIgSD15EYUiUkVBQi0aSaqbkqRliYGIB8dDM8tks7M7uzuT0pofLOzOvp15j2/mzdsBeoQjNTxBdmPcfvYhN7/o6cTSo1uxIJ2nhidIMj0CAKS28T7Qt1F9sQPLzS+SM7Nn/cYjIsFlslMEAIZGx9u+BQCRAGX40s97EZZMdooMjY5DP2TA/FGy21vKASHUC4O0wFiVnEGldAM1c+eZTk1ATL2wSAmMqkRhg3KjG+rZgW1WqsivFTyNNyvVjjZnUDxY1Si8xBLWF5Y+X4/2KLZir148iAEgy0/uuBpOn7tMbTxxqhIGGb60rbEvH95gcnLa1bBaNYWcunb9iq/NzRu3fW2i+qJkKs6dzuL8zEnfNpVECsyZOC5emAMAxOPxDlu2jVU1mR5RUnZJ36AB4PHzt0JtKlGaFenU6+YUpCgNjKrUbbUARVPx+MIl7rt3d++pGLKDQIql02OEXgBQ/Pwy9vPrJ/v9/YdPhfph0/12+ZtdMzr7j4KwYoODurOJAMCfrSK+bxVx+MQMACC/VkB+4Sq/I6ZU+rXxEQewExBnjNC0BdZsNmBZNVdDTUu1PUd1IqUbOPi74mnD86XZbPj231aWaJpOEomkq6EzMDfiR4752lAahVVfG15g9fo2LMv0LKmkZkURZ4PYRUF6VmwUVrGysgwAKB09Zbcb+dcAwK3/ZKNkH+M5362gAIdirXlrp1rDGOuaI26w67pUWrfv/dYX4EgeTrz2E5GsuGTV7fuclvC19/odKZfXAx0heK4xXmcyNtCgYwZFaa1IVRJRSzb79sxDeWC7oRYQcR/jVQZhEKlsghB6obqVX8VnfcjM/g3Vn0iZFASpUzFsUCroJY+9xr4NLNJi1TSd8OpJtrajeNnKTBxARMUGBjoPRtl3lmXG6OVnKxtlU9H5+y7yOy+TSBu01xlJa48jlmXG6J4X5QwjKL3kwUPTdO4vDJsQRO16/K/8A3znPQz801P1AAAAAElFTkSuQmCC";b.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAsCAYAAAAuCEsgAAADv0lEQVR4nO1ZW0gUURj+RoSSNl2W9WFXXSnFB/ECKRUSBYUgIdKKoE+1RviQSdCTmI8iPgXR5SEq7U1B1MKeQogCyXCjG1JLCa66K67IuG5sEHZ6yJnmvmdm56xlfiB4/vOfyzfff/7z7wywB2twF9WQnVg3W9poa+823MTw4ABnZnJ3UQ1xeUoAgKwtBk2NTRcisbb2btLgP5fKn9CQK66oJwBQUFotGwsAmSKYndrFHIor6klBaTW8hT5ElsKifVs5IEPq2UZMqpKSlNvrw1rkd1sITYCterYQE1QSICWlhUyoJxJbWY1h7tO8ofPKakxlU5LSg1Q1ASwTS5bdE/4tEBV7/vQBB4BMjtzUdGxsvSr4GEKpyk5BdsY+v3mJurpGTcdYLEI1YU/vtZQ+/X03qOZKB0xCseV0BQJNx1PaWCItYsrE0XGxBQDgcDhUvlKbVFWXp4RJ2WX7BQ0AQ09eUdlYgmlWFEIvkyEogCkxQaVMqwUwCsWjVy7r9r2+fZfFkiqYUszjKSPCHwAsfHzGLX95J/bfezhKNY803a9HvzKpGWUTejxlJD/fSzVQea8dOtYEADhRdyTl2InRCQDA5uJbVV80GrKFpCwUk8kEeH5N09HpdMvatA9AD26vD/u/r2p1qVK/FbKyAU6nl+TmujQdlcS04DhcS71wYn6W2jcWi5gmZ2tWpN2sGVJWYXtWTMzPYnp6EgAQLj8p2n1zLwBAtxa1G0zuMb3Np0NKyMS0kCnG8xEOksPr85VZ3oidkCQqQnvWDJ2MnhJNVhzm4+L/bc5cmv0YwkwSMTxjepOYDYudANNaUVCJVq1YLEL9g1YJEqySPexd8c6DBKsIV/NeFl3MidlxtoygRQpI8x7TK7+sgKayUYIEq0hzYAn+SpcsDMc/rHOWiEWjIS6ZTKjKr4XxLBT7f1qZEuFwCDwf4cwkpubAEs6UHVTZx4YKia2Vh1VSUpxqaMb9W72afZe6+jA8OGA4vrMnD82BJeN7zAhGBbMVxOPraPCfR6ovPo+vn5W1tRSbCm2y+QXNColHrZpEtLAr0r0WLCsm1JV69WQ4HFLZjHyVdaoWHBdGVKE4NlQIALjTvyGzpxWKOTnqF6PSPmlJZpTtcnIc4Hm6NffVdoifjP2VLiIQ6uzJE32mAgzPWDKZMGxrYXvD1N/Bw/EtzER/AABmuv7cqeH4lvWsCKTOjPH4Ong+wtH6mV2/pjiPlBccUNnnlr/9W1lRieDChqbCwYUNLu1XXU6nVzd0pCrQ+u3hf8UvmdlsgYsCX2sAAAAASUVORK5CYII=";return {idle:a,slam:b,W:54,H:44}})();
const GOR=(()=>{const FW=150,FH=120,out=[];
 const mk1=(pose,arg)=>{const cv=document.createElement('canvas');cv.width=FW;cv.height=FH;const g=cv.getContext('2d');const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  const fur=(x,y,w,h,base)=>{for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const n=(xx*7+yy*13+(xx*yy)%5)%9;R(x+xx,y+yy,1,1,n<2?'#2b2b33':n<4?base:n<8?'#3d3d48':'#55556a')}};
  const blob=(cx,cy,rx,ry,fn)=>{for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){const d=x*x/(rx*rx)+y*y/(ry*ry);if(d<=1)fn(cx+x,cy+y,d,x,y)}};
  const furC=(x,y,d,xx,yy)=>{const n=((xx+40)*7+(yy+40)*13+((xx+40)*(yy+40))%5)%9;R(x,y,1,1,d>.88?'#18181e':n<2?'#2b2b33':n<5?'#33333d':n<8?'#3d3d48':'#5a5a70')};
  // shoulders/torso
  blob(75,62,40,28,furC);
  // chest skin + suit
  blob(75,70,22,18,(x,y,d)=>R(x,y,1,1,d>.85?'#1a1c2c':'#262b44'));
  for(let y=56;y<88;y++){const w=(y-56)*.45;R(75-w,y,w*2,1,'#f4f4f4')}
  for(let y=58;y<84;y++){const w=y<62?(y-58)*.8+1:3.5-(y-62)*.05;R(75-w/2,y,w,1,y<62?'#ff004d':'#b13e53');if(y%4==0)R(75-w/2,y,w,1,'#ef7d57')}
  R(73,57,4,3,'#ff004d');
  // head
  // suit jacket over torso (navy) with lapels
  blob(75,72,34,20,(x,y,d)=>R(x,y,1,1,d>.9?'#10121e':'#29366f'));
  for(let y=54;y<92;y++){const w=Math.max(0,(y-54)*.55);R(75-w-6,y,6,1,'#1d2550');R(75+w,y,6,1,'#1d2550');R(75-w,y,w*2,1,'#f4f4f4')}
  for(let y=56;y<90;y++){const w=y<60?(y-56)+2:4-(y-60)*.04;R(75-w/2,y,w,1,'#ff004d');if(y%5==0&&y>60)R(75-w/2,y,w,1,'#b13e53')}
  R(72,54,7,4,'#ff004d');R(73,55,2,1,'#ff8c9e');for(const by of [74,82])R(64,by,2,2,'#ffcd2e');R(64,64,4,1,'#f4f4f4');
  blob(75,30,22,20,furC);blob(75,20,15,9,furC);// sagittal crest
  blob(75,36,15,11,(x,y,d)=>R(x,y,1,1,d>.85?'#2b2b33':(y>40?'#4a4258':'#5d5470')));// face
  R(62,26,26,3,'#18181e');// brow ridge
  // glasses
  for(const ex of [67,83]){R(ex-6,28,12,9,'#1a1c2c');R(ex-5,29,10,7,'#73eff7');R(ex-4,30,4,2,'#f4f4f4');R(ex-3,31,5,5,'#1a1c2c');R(ex-2,31,2,2,'#f4f4f4')}R(73,31,4,2,'#1a1c2c');R(54,31,7,1,'#1a1c2c');R(89,31,7,1,'#1a1c2c');
  // nose + mouth
  R(70,38,10,4,'#2b2b33');R(71,39,3,2,'#18181e');R(76,39,3,2,'#18181e');
  if(pose==='pound'){R(66,43,18,5,'#18181e');R(67,43,3,2,'#f4f4f4');R(80,43,3,2,'#f4f4f4');R(70,46,10,2,'#b13e53')}else{R(69,44,2,1,'#18181e');R(71,45,8,1,'#18181e');R(79,44,2,1,'#18181e')}
  R(58,39,5,2,'#ff8c9e');R(87,39,5,2,'#ff8c9e');
  // ears
  blob(52,33,4,5,(x,y,d)=>R(x,y,1,1,d>.6?'#2b2b33':'#4a4258'));blob(98,33,4,5,(x,y,d)=>R(x,y,1,1,d>.6?'#2b2b33':'#4a4258'));
  // arms
  const arm=(sx,sy,ex,ey,r)=>{const L=Math.hypot(ex-sx,ey-sy);for(let k=0;k<=L;k++){const x=sx+(ex-sx)*k/L,y=sy+(ey-sy)*k/L;blob(Math.round(x),Math.round(y),r,r,furC)}};
  if(pose==='gavel'){const a=arg;// a: 0 up .. 1 down
   const ex=118,ey=46+a*30;arm(108,58,ex,ey,8);blob(ex,ey,7,6,(x,y,d)=>R(x,y,1,1,d>.7?'#2b2b33':'#4a4258'));
   const ang=-1.9+a*1.9;const hx=ex+Math.cos(ang)*22,hy=ey+Math.sin(ang)*22;
   for(let k=0;k<22;k++){R(ex+Math.cos(ang)*k,ey+Math.sin(ang)*k,2,2,k%5?'#94531f':'#5d3a1a')}
   g.save();g.translate(hx,hy);g.rotate(ang+1.57);R(-7,-4,14,8,'#5d3a1a');R(-7,-4,14,2,'#94531f');R(-8,-4,2,8,'#c28d38');R(6,-4,2,8,'#c28d38');g.restore();
   arm(42,58,40,84,8);blob(40,88,7,5,(x,y,d)=>R(x,y,1,1,d>.7?'#2b2b33':'#4a4258'))}
  else{const L=arg%2===0;// chest pound
   arm(42,60,L?66:44,L?66:86,8);blob(L?68:44,L?66:90,7,6,(x,y,d)=>R(x,y,1,1,d>.7?'#2b2b33':'#4a4258'));
   arm(108,60,!L?84:106,!L?66:86,8);blob(!L?82:106,!L?66:90,7,6,(x,y,d)=>R(x,y,1,1,d>.7?'#2b2b33':'#4a4258'))}
  // podium
  R(32,88,86,32,'#5d3a1a');R(32,88,86,3,'#94531f');R(32,91,86,1,'#3a2410');for(let x=36;x<116;x+=8)R(x,94,1,24,'#4a2e14');
  R(60,96,30,20,'#ffcd2e');R(62,98,26,16,'#3b5dc9');blob(75,106,7,7,(x,y,d)=>R(x,y,1,1,d>.6?'#ffcd2e':'#3b5dc9'));R(73,101,4,10,'#ffcd2e');R(70,105,10,2,'#ffcd2e');
  // mic
  for(let k=0;k<16;k++)R(96-k*.6,88-k,1,1,'#94b0c2');R(84,68,6,7,'#1a1c2c');R(85,69,4,5,'#566c86');R(86,70,1,1,'#f4f4f4');
  // nameplate
  R(44,82,26,6,'#f4f4f4');R(45,83,24,4,'#1a1c2c');g.fillStyle='#ffcd2e';g.font='5px monospace';g.fillText('CHAIR',47,87);
  return cv};
 const fr={gavel:[0,.33,.66,1].map(a=>mk1('gavel',a)),pound:[0,1].map(a=>mk1('pound',a))};return {fr,W:FW,H:FH}})();
function gfx(){let cv=document.getElementById('gfxC');if(!cv){cv=document.createElement('canvas');cv.id='gfxC';document.body.appendChild(cv)}
 let kind=null,warnK=null,warnT=0,raf=0,t=0,c,W=0,H=0,smoke=[],ws=[],parts=[],qs=[];
 function size(){let r=document.getElementById('chart').getBoundingClientRect();if(kind==='limit'){const h=document.getElementById('hud').getBoundingClientRect(),a=document.getElementById('acts').getBoundingClientRect();r={left:h.left,top:h.top,width:h.width,height:a.top-h.top-4}}cv.style.left=r.left+'px';cv.style.top=r.top+'px';cv.style.width=r.width+'px';cv.style.height=r.height+'px';cv.width=Math.round(r.width);cv.height=Math.round(r.height);W=cv.width;H=cv.height;c=cv.getContext('2d');c.imageSmoothingEnabled=false}
 function run(){if(!raf){size();cv.style.display='block';raf=requestAnimationFrame(loop)}}
 function start(k){if(kind===k)return;kind=k;warnK=null;t=0;if(raf)size();smoke=[];parts=[];qs=[];ws=[0,1,2].map(i=>({x:W*(.35+i*.22),y:H*(.2+i*.25),a:Math.random()*6,sp:.9+i*.25,ph:i*2,dir:1}));run()}
 function stop(){const wasL=kind==='limit';kind=null;if(!warnK)halt();else if(wasL)size()}
 function halt(){cancelAnimationFrame(raf);raf=0;cv.style.display='none';kind=null;warnK=null}
 function warn(k){warnK=k;warnT=0;run()}
 const mk=(x,y,o)=>monkey(c,x,y,Object.assign({t},o));
 function sWitch(){const sw=Math.round(W*.6),SW=sw/BIGW.W,shh=Math.round(BIGW.H*SW);
  ws.forEach((w,i)=>{w.a+=.006*w.sp;const tx=W*(.58+.42*Math.sin(w.a+w.ph*2)),ty=H*(.42+.22*Math.sin(w.a*2.3+w.ph))+Math.sin(t/13+i*2)*H*.06;
   const nd=tx>w.x?1:-1;if(nd!==w.dir&&Math.abs(tx-w.x)>4)w.dir=nd;w.x+=(tx-w.x)*.05;w.y+=(ty-w.y)*.05;
   w.tr=w.tr||[];if(t%3===0){w.tr.push([w.x,w.y,w.dir]);if(w.tr.length>4)w.tr.shift()}
   if(t%7===i*2&&smoke.length<45)smoke.push({x:w.x-w.dir*sw*.42,y:w.y+shh*.12,r:6+Math.random()*5,l:0,L:240+Math.random()*90,v:(Math.random()-.5)*.2})});
  for(let i=smoke.length-1;i>=0;i--){const s=smoke[i];s.l++;if(s.l>s.L){smoke.splice(i,1);continue}const k=s.l/s.L,r=s.r*(1+k*2.2);s.x+=s.v;s.y-=.04;
   c.fillStyle='rgba(150,70,200,'+(.28*(1-k))+')';c.beginPath();c.arc(s.x,s.y,r,0,6.283);c.arc(s.x+r*.6,s.y+r*.2,r*.7,0,6.283);c.fill();
   c.fillStyle='rgba(200,140,240,'+(.35*(1-k))+')';c.fillRect((s.x-r*.4)|0,(s.y-r*.4)|0,1,1);c.fillRect((s.x+r*.5)|0,(s.y-r*.1)|0,1,1)}
  c.imageSmoothingEnabled=false;
  ws.forEach((w,i)=>{const fi=(t/4+i*3|0)%8,bob=Math.sin(t/10+i)*3;
   w.tr.forEach((p,k)=>{c.globalAlpha=.07+k*.05;c.drawImage(BIGW.fr[fi][p[2]<0?1:0],Math.round(p[0]-sw/2),Math.round(p[1]-shh/2),sw,shh)});c.globalAlpha=1;
   c.drawImage(BIGW.fr[fi][w.dir<0?1:0],Math.round(w.x-sw/2),Math.round(w.y-shh/2+bob),sw,shh);
   if(t%2===i%2){c.fillStyle=['#f7e26b','#ffcd2e','#a7f070'][t%3];c.fillRect((w.x-w.dir*sw*.5+Math.random()*6)|0,(w.y+shh*.15+Math.random()*8)|0,1,1)}
   if((t+i*90)%300<50)txt(c,'히히힛',w.x+w.dir*sw*.1,w.y-shh*.55,'#a7f070',12)})}
 function sCPI(){// ticker board + clerk monkey + bouncing ? marks
  P(c,6,6,W-12,18,'#1a1c2c');P(c,6,6,W-12,1,'#566c86');P(c,6,23,W-12,1,'#566c86');
  const digs='0123456789?';let str='CPI ';for(let i=0;i<20;i++)str+=t%40<20||i%3?digs[(Math.random()*11)|0]:'?';txt(c,str,W/2,15,t%10<5?'#ff004d':'#38b764',11);
  if(t%7===0&&qs.length<18)qs.push({x:20+Math.random()*(W-40),y:30,vx:(Math.random()-.5)*1.4,vy:0,r:Math.random()*6});
  qs.forEach(q=>{q.vy+=.12;q.x+=q.vx;q.y+=q.vy;if(q.y>H-40){q.y=H-40;q.vy*=-.75}if(q.x<8||q.x>W-8)q.vx*=-1;q.r+=.1;txt(c,'?',q.x,q.y,['#ffcd2e','#73eff7','#ff9ec4'][(q.r|0)%3],14)});if(qs.length>=18&&t%7===0)qs.shift();
  const cx=(t*.8)%(W+60)-30;mk(cx,H-6,{walk:t/3,face:t%60<30?'sad':null});P(c,cx-10,H-38-6+7,8,2,'#1a1c2c');P(c,cx-1,H-38-6+7,8,2,'#1a1c2c');P(c,cx-3,H-37+7-6,2,1,'#1a1c2c');// glasses
  P(c,cx+14,H-22,16,12,'#94531f');P(c,cx+15,H-21,14,1,'#b8723a');txt(c,'?',cx+22,H-16,'#ffcd2e',10);P(c,cx+16,H-9,3,3,'#1a1c2c');P(c,cx+26,H-9,3,3,'#1a1c2c')}
 function sFOMC(){// giant gorilla chair at podium + reporters flash + gavel shockwave
  const gw=Math.round(W*.6),SC=gw/GOR.W,gh=Math.round(GOR.H*SC),gx=Math.round(W/2-gw/2),gy=H-gh-4;
  for(let i=0;i<9;i++)P(c,14+i*((W-28)/8),H-14,10,14,'#262b44'),P(c,16+i*((W-28)/8),H-20,6,6,'#5d3a1a');
  const cyc=t%150,ga=cyc<60;let img,hit=-1;
  if(ga){const g=cyc%30;const a=g<14?0:g<17?.33:g<19?.66:1;img=GOR.fr.gavel[a===0?0:a===.33?1:a===.66?2:3];if(g>=19)hit=g-19}
  else img=GOR.fr.pound[((cyc-60)/6|0)%2];
  const shake=hit>=0&&hit<4?(hit%2?2:-2):0;c.imageSmoothingEnabled=false;
  const g3=ga&&hit>=0?GOR3.slam:GOR3.idle,s3=gw/GOR3.W,bob=!ga&&((cyc-60)/6|0)%2?Math.round(s3):0,g3h=GOR3.H*s3,g3y=gy+gh*.80-g3h+bob;
  if(g3.complete&&g3.naturalWidth)c.drawImage(g3,gx+shake,g3y,gw,g3h);
  const px=gx+gw*.21,pw=gw*.58,py=gy+gh*.733;P(c,px,py,pw,H-py,'#5d3a1a');P(c,px,py,pw,Math.max(2,s3*.6),'#94531f');P(c,px+pw*.35,py+(H-py)*.25,pw*.3,(H-py)*.5,'#ffcd2e');P(c,px+pw*.37,py+(H-py)*.3,pw*.26,(H-py)*.4,'#3b5dc9');
  if(hit>=0){const k=hit;const hx=gx+gw*(48/54),hy=g3y+g3h*(36/44);c.strokeStyle='rgba(255,205,46,'+Math.max(0,1-k/11)+')';c.lineWidth=2;c.beginPath();c.arc(hx,hy,8+k*6,Math.PI,0);c.stroke();c.strokeStyle='rgba(255,255,255,'+Math.max(0,.7-k/11)+')';c.lineWidth=1;c.beginPath();c.arc(hx,hy,4+k*4,Math.PI,0);c.stroke();txt(c,'쾅!',hx+10,hy-24-k,'#ffcd2e',16)}
  if(!ga&&(t/6|0)%2)txt(c,'둥!',gx+gw*(((cyc-60)/6|0)%2?.6:.4),gy+gh*.5,'#ff8c1a',12);
  for(let i=0;i<9;i++)if((t*7+i*31)%97<4){c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.arc(19+i*((W-28)/8),H-24,6,0,6.283);c.fill();for(let r=0;r<4;r++){c.fillRect(19+i*((W-28)/8)+Math.cos(r*1.57)*9,H-24+Math.sin(r*1.57)*9,1,1)}}
  const msgs=['금리는…','음…','데이터를…','지켜보겠…','우호호!'];const by=Math.max(30,g3y-4);P(c,W/2-58,by-20,116,20,'#f4f4f4');P(c,W/2-3,by,6,4,'#f4f4f4');const ms=ga?msgs[(t/70|0)%4]:msgs[4];txt(c,ms.slice(0,1+(t%70)/6|0),W/2,by-10,'#1a1c2c',11);
  for(let i=0;i<W;i+=12){const y=4+Math.sin(t/12+i/20)*2;P(c,i,y,8,4,'#94b0c2');P(c,i+2,y+1,4,2,'#262b44')}}
 function sEarn(){// flying report papers, dizzy swirls, upside-down cartwheel monkeys
  if(t%6===0&&parts.length<26)parts.push({x:Math.random()*W,y:-10,vx:(Math.random()-.5),vy:.6+Math.random()*.6,r:Math.random()*6.28,s:Math.random()<.5});
  parts.forEach(p=>{p.x+=p.vx+Math.sin(t/14+p.r);p.y+=p.vy;p.r+=.05;const w=Math.abs(Math.cos(p.r))*12+2;P(c,p.x-w/2,p.y,w,15,'#f4f4f4');P(c,p.x-w/2,p.y+3,w,1,'#94b0c2');P(c,p.x-w/2,p.y+6,w*.7,1,'#94b0c2');if(w>8)txt(c,p.s?'EPS':'↓',p.x,p.y+11,p.s?'#b13e53':'#ff004d',7)});parts=parts.filter(p=>p.y<H+20);
  for(let k=0;k<2;k++){const cx=(t*1.2+k*W/2)%(W+40)-20,fr=(t/10+k|0)%4;c.save();if(fr>=2){c.translate(0,2*(H-20));c.scale(1,-1)}mk(cx,H-6,{walk:t/3,arm:fr%2,face:'happy'});c.restore()}
  for(let i=0;i<5;i++){const a=t/10+i*1.256,x=W/2+Math.cos(a)*40,y=H*.35+Math.sin(a)*12;txt(c,'★',x,y,'#ffcd2e',9)}
  if(t<120||t%120<60)txt(c,'실적 쇼크! 세상이 뒤집혔다',W/2,H*.2,'#ff8c1a',12)}
 const BSL=['A problem has been detected and BANANA OS','has been shut down to prevent damage','to your portfolio.','','LIMIT_DOWN_CIRCUIT_BREAKER','','If this is the first time you have seen','this Stop error screen, hold your banana.','If this screen appears again, follow','these steps:','','Check to make sure your leverage is','properly installed. Do not panic-sell.','Disable stop-loss options such as','hoping or praying.','','Technical information:','','*** STOP: 0xBANANA0D (0x0000NASDAQ,','    0xDEADMONKEY, 0x00000000, 0xC0FFEE)','','Beginning dump of physical bananas...','Chart lost. Trading still enabled. Good luck.'];
 function sLimit(){c.fillStyle='#0000aa';c.fillRect(0,0,W,H);c.textAlign='left';c.textBaseline='top';const fs=W<380?10:11,lh=fs+3;c.font=fs+'px DungGeunMo, monospace';
  let left=t*2.2|0,y=8;for(let i=0;i<BSL.length&&left>0;i++){const L=BSL[i],n=Math.min(L.length,left);left-=L.length+3;if(y+lh>H-6)break;c.fillStyle=L.startsWith('***')||L.startsWith('LIMIT')?'#ffffff':'#e8e8f8';c.fillText(L.slice(0,n),8,y);
   if(n<L.length||(left<=0&&(t/15|0)%2)){c.fillStyle='#fff';c.fillRect(8+c.measureText(L.slice(0,n)).width+1,y+1,fs*.6,fs-1)}y+=lh}
  if(t>BSL.join('').length/2.2+60){const k=Math.min(1,(t%90)/90);c.fillStyle='#fff';c.fillText('Dumping: '+(k*100|0)+'%',8,H-lh-4)}
  c.textAlign='center';c.textBaseline='middle'}
 function sWarn(){warnT++;const k=warnK;const lab={witch:'🧹 세 마녀 접근!',cpi:'📨 메일 폭탄 접근!',fomc:'🎤 의장님 등장',earn:'📄 실적 발표 임박',limit:'⛔ 리밋다운 경보'}[k]||'⚠';
  const slide=Math.min(1,warnT/15)*(warnT>320?Math.max(0,1-(warnT-320)/15):1);const x=W-slide*90;
  c.fillStyle='rgba(255,0,77,'+(.25+.25*Math.sin(warnT/4))+')';c.fillRect(0,0,W,3);c.fillRect(0,H-3,W,3);c.fillRect(0,0,3,H);c.fillRect(W-3,0,3,H);
  mk(x+40,H/2+30,{arm:(warnT/6|0)%2?1:.6,face:'sad'});P(c,x+4,H/2-36,74,22,'#ffcd2e');P(c,x+6,H/2-34,70,18,'#1a1c2c');txt(c,lab,x+41,H/2-25,'#ffcd2e',9);P(c,x+38,H/2-14,2,12,'#94b0c2');
  if(warnT>340){warnK=null;if(!kind)halt()}}
 function loop(){raf=0;t++;c.clearRect(0,0,W,H);
  if(kind==='witch')sWitch();else if(kind==='cpi')sCPI();else if(kind==='fomc')sFOMC();else if(kind==='earn')sEarn();else if(kind==='limit')sLimit();
  if(warnK)sWarn();if(kind||warnK)raf=requestAnimationFrame(loop)}
 addEventListener('resize',()=>{if(raf)size()});
 return {start,stop,warn,halt,get on(){return !!raf},get kind(){return kind}}}
return {altar,gfx,monkey}})();