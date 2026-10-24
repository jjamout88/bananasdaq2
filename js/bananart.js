// 16 banana illustrations: 16x16 code sprites (original PAL), auto dark outline.
const BART=(()=>{
 const BV=['.......NN','......YY.','.....YYY.','....YYYY.','Y.YYYYYY.','YYYYYYY..','.YYYYY...','..YYY....'];
 function make(id){const g=[...Array(16)].map(()=>Array(16).fill('.'));
  const R=(x,y,w,h,k)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&i<16&&j>=0&&j<16)g[j][i]=k};
  const P=(pts,k)=>pts.forEach(([x,y])=>R(x,y,1,1,k));
  const ban=(x,y,o={})=>{let rows=BV.slice();if(o.vf)rows=rows.reverse();rows.forEach((r,j)=>[...r].forEach((c,i)=>{if(c==='.')return;const ii=o.hf?r.length-1-i:i;R(x+ii,y+j,1,1,c==='Y'&&o.col?o.col:c)}))};
  const up=(x,y,len,k)=>{R(x+2,y,1,1,k);R(x+1,y+1,3,1,k);R(x,y+2,5,1,k);R(x+1,y+3,3,len,k)};
  const dn=(x,y,len,k)=>{R(x+1,y,3,len,k);R(x,y+len,5,1,k);R(x+1,y+len+1,3,1,k);R(x+2,y+len+2,1,1,k)};
  const coin=(x,y)=>{R(x+1,y,3,1,'Y');R(x,y+1,5,3,'Y');R(x+1,y+4,3,1,'Y');R(x+2,y+1,1,3,'o')};
  switch(id){
  case'trend':up(9,1,10,'g');R(8,13,8,2,'g');ban(1,6);break;
  case'counter':R(3,1,9,2,'p');R(10,1,2,7,'p');R(1,3,6,1,'p');R(2,4,4,1,'p');R(3,5,2,1,'p');R(3,3,2,0,'p');ban(5,7,{hf:1});break;
  case'hold':R(0,1,16,2,'N');R(3,3,1,2,'n');R(9,3,1,2,'n');ban(2,5);P([[13,5],[13,6],[14,7],[12,9],[12,10]],'B');P([[0,10],[0,11]],'B');break;
  case'fee':ban(0,0);coin(8,7);R(9,9,0,0,'k');R(4,11,4,2,'r');R(9,13,0,0,'k');R(9,8,3,0,'w');break;
  case'piggy':ban(4,0,{vf:1});R(2,7,12,7,'P');R(1,9,1,2,'P');R(14,9,2,3,'p');R(6,7,4,1,'k');R(11,9,1,1,'k');R(3,14,2,2,'p');R(10,14,2,2,'p');R(3,6,2,1,'P');break;
  case'coupon':R(1,3,14,10,'w');for(let j=3;j<13;j+=2){R(1,j,1,1,'.');R(14,j,1,1,'.')}for(let j=4;j<12;j+=2)R(10,j,1,1,'G');ban(1,4);R(11,6,3,1,'r');R(11,8,2,1,'r');break;
  case'long':R(5,1,3,1,'N');R(5,2,3,12,'Y');R(4,4,1,9,'Y');R(6,14,2,1,'Y');R(7,3,1,10,'s');up(10,1,9,'r');break;
  case'short':R(3,7,6,3,'Y');R(2,8,1,2,'Y');R(4,10,4,1,'Y');R(8,6,2,1,'N');R(4,8,1,1,'k');R(6,8,1,1,'k');dn(10,2,8,'B');break;
  case'disc':ban(0,7);R(7,1,8,8,'w');R(8,0,1,1,'k');R(8,1,1,1,'k');P([[9,3],[10,3],[13,3],[12,4],[11,5],[10,6],[12,6],[13,6]],'r');P([[9,7]],'r');R(6,8,2,1,'G');break;
  case'first':ban(0,7);R(10,2,2,10,'Y');R(9,3,1,1,'Y');R(9,11,4,1,'Y');P([[2,1],[1,2],[2,2],[3,2],[2,3],[14,4],[13,0],[14,13]],'w');break;
  case'combo':P([[3,3],[7,1],[11,2],[5,5],[9,4],[13,5],[2,6],[14,8]],'Y');R(2,7,12,3,'o');R(4,5,2,2,'o');R(9,3,2,4,'o');R(12,6,2,1,'o');R(1,10,14,2,'r');ban(3,8);break;
  case'bait':R(8,0,1,6,'G');R(8,6,1,1,'c');R(6,7,3,1,'c');R(5,5,1,3,'c');ban(4,8,{vf:1});P([[11,13],[13,12],[14,14]],'B');break;
  case'allin':R(7,5,8,8,'k');R(6,6,10,6,'k');R(8,6,2,2,'G');R(11,2,2,3,'N');P([[13,1],[14,0],[12,0],[14,2]],'o');P([[13,0]],'Y');ban(0,8);break;
  case'scalp':P([[11,0],[10,1],[9,2],[8,3],[7,4],[8,5],[9,5],[10,5],[11,5],[10,6],[9,7],[8,8],[12,4]],'c');P([[10,0],[9,1],[8,2],[7,3],[11,4],[9,6],[8,7]],'w');ban(0,8);break;
  case'nana':R(0,0,16,2,'N');R(6,2,1,2,'N');ban(2,4,{vf:1});P([[12,9],[13,10],[12,11]],'w');P([[14,6],[13,6],[14,7]],'Y');break;
  case'compound':coin(0,11);coin(5,9);coin(5,12);coin(10,6);coin(10,9);coin(10,12);R(5,7,0,0,'k');ban(1,1);up(12,0,0,'g');break;
  }
  // outline pass
  const o=g.map(r=>r.slice());for(let j=0;j<16;j++)for(let i=0;i<16;i++)if(g[j][i]==='.'&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const v=(g[j+b]||[])[i+a];return v&&v!=='.'&&v!=='k'}))o[j][i]='k';
  return o}
 const cache={};
 return {draw(ctx,id,x=0,y=0,sc=1){const s=cache[id]||(cache[id]=make(id));draw(ctx,s,x,y,sc)},canvas(id,sc=1){const c=document.createElement('canvas');c.width=c.height=16*sc;this.draw(c.getContext('2d'),id,0,0,sc);return c}};
})();
