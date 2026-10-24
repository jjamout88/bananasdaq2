// BGM: Web Audio loop. OGG if decodable, else MP3 with LAME padding skipped (1105 samples delay).
const BGM=(()=>{const LEN=2236056,SR=44100,MP3_OFF=1105;let ctx=null,buf=null,src=null,gain=null,loopS=0,loopE=0,pos=0,startAt=0,loading=null,unlocked=false,hold=false;
 const want=()=>META.bgm&&unlocked&&!hold&&!document.hidden;
 const vol=()=>(META.bgmVol==null?.6:META.bgmVol)*.35;
 const getCtx=()=>{if(typeof AC!=='undefined'&&AC)ctx=AC;if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();try{AC=ctx}catch(e){}}return ctx};
 const smooth=b=>{const N=256;for(let c=0;c<b.numberOfChannels;c++){const d=b.getChannelData(c),s=Math.round(loopS*b.sampleRate),e=Math.round(loopE*b.sampleRate);const v0=d[s];for(let j=0;j<N;j++){const t=(j+1)/N,k=e-N+j;d[k]=d[k]*(1-t)+v0*t}}};
 const dec=async u=>{const r=await fetch(u);const a=await r.arrayBuffer();return await new Promise((ok,ng)=>{const p=ctx.decodeAudioData(a,ok,ng);if(p&&p.then)p.then(ok,ng)})};
 const load=()=>loading||(loading=(async()=>{getCtx();const ogg=!!document.createElement('audio').canPlayType('audio/ogg; codecs="vorbis"');
   if(ogg){try{buf=await dec('audio/bgm.ogg');loopS=0;loopE=Math.min(buf.duration,LEN/SR)}catch(e){buf=null}}
   if(!buf){buf=await dec('audio/bgm.mp3');const extra=buf.length*SR/buf.sampleRate-LEN;const off=extra>MP3_OFF/2?MP3_OFF:0;loopS=off/SR;loopE=loopS+LEN/SR}
   smooth(buf);BGM.fmt=ogg&&loopS===0?'ogg':'mp3';sync()})());
 function play(){if(src||!buf)return;const c=getCtx();if(c.state==='suspended')c.resume();gain=gain||c.createGain();gain.connect(c.destination);gain.gain.setValueAtTime(0,c.currentTime);gain.gain.linearRampToValueAtTime(vol(),c.currentTime+.4);
  src=c.createBufferSource();src.buffer=buf;src.loop=true;src.loopStart=loopS;src.loopEnd=loopE;src.connect(gain);src.start(0,loopS+pos);startAt=c.currentTime-pos}
 function stop(){if(!src)return;const c=ctx;const L=loopE-loopS;pos=((c.currentTime-startAt)%L+L)%L;try{src.stop()}catch(e){}src.disconnect();src=null}
 function sync(){if(want()){if(!buf)load();else play()}else stop();if(gain&&src)gain.gain.setTargetAtTime(vol(),ctx.currentTime,.05)}
 const un=()=>{if(unlocked)return;unlocked=true;getCtx();if(ctx.state==='suspended')ctx.resume();sync()};
 ['pointerdown','touchend','click','keydown'].forEach(e=>window.addEventListener(e,un,{capture:true,passive:true}));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ctx&&ctx.state!=='running')ctx.resume();sync()});
 return {sync,setHold(v){hold=v;sync()},get playing(){return !!src},get state(){return {playing:!!src,fmt:BGM.fmt,loopS,loopE,ctx:ctx&&ctx.state,pos:src?((ctx.currentTime-startAt)%(loopE-loopS)):pos,vol:vol()}}};})();
