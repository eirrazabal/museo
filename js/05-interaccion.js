/* 05-interaccion.js: cartela por cercanía, visor de imagen/video, clic sobre las obras, audio por proximidad y botones.
   Se carga al final. Usa: lista, PIEZAS, cuadroV, ampliada, pintarV (03), MUSEO.audio, AUDIO_B64 y AUDIO_RIO_B64 (datos/audio.js),
   y los ids del DOM: cam, ayuda, entrar, cartela, c-titulo, c-autor, c-texto, c-hint, avanzar, sonido, visor, v-*, aviso. */
/* Cartela por cercanía */
function deFrente(l,p){const r=l.o.ry*Math.PI/180;return (p.x-l.x)*Math.sin(r)+(p.z-l.z)*Math.cos(r)>0}
const cam=document.getElementById('cam'),cart=document.getElementById('cartela'),canoaEl=document.getElementById('canoa-juego');
let actual=-1;
setInterval(()=>{
  const p=cam.object3D.position;let mejor=-1,dm=2.6;
  lista.forEach((l,i)=>{if(!deFrente(l,p))return;const d=Math.hypot(p.x-l.x,p.z-l.z);if(d<dm){dm=d;mejor=i}});
  const enBalconCanoa=mejor<0&&p.x>9.5&&Math.abs(p.z+1.8)<7.5;
  const sig=mejor>=0?mejor:(enBalconCanoa?-2:-1);
  if(sig===actual)return;
  actual=sig;
  if(sig===-1){cart.hidden=true;return}
  if(sig===-2){
    document.getElementById('c-titulo').textContent='Vamos de pesca';
    document.getElementById('c-autor').textContent='Juego interactivo en el río';
    document.getElementById('c-texto').textContent='Subite a la canoa del pescador y jugá a pescar el surubí sobre el Paraná.';
    document.getElementById('c-hint').textContent='Clic en la canoa para jugar';
    cart.hidden=false;return;
  }
  const o=lista[sig].o;
  document.getElementById('c-titulo').textContent=o.t;
  document.getElementById('c-autor').textContent=o.a;
  document.getElementById('c-texto').textContent=o.x;
  document.getElementById('c-hint').textContent=o.v?'Clic en el cuadro para ver el video':'Clic en el cuadro para ampliarlo';
  cart.hidden=false;
},150);

/* Aviso si el navegador no puede dibujar 3D */
try{const t=document.createElement('canvas');if(!(t.getContext('webgl2')||t.getContext('webgl'))){const a=document.getElementById('aviso');a.textContent='Tu navegador tiene desactivado WebGL, que hace falta para ver la sala en 3D. Probá activar la aceleración por hardware o abrirla en Chrome.';a.hidden=false}}catch(e){}
/* Ampliar un cuadro: imagen completa y video */
const visor=document.getElementById('visor'),vMedio=document.getElementById('v-medio'),vTabs=document.getElementById('v-tabs');
const tImg=document.getElementById('t-img'),tVid=document.getElementById('t-vid'),vYt=document.getElementById('v-yt'),vVt=document.getElementById('v-vt');
let abierto=false,actualVisor=-1;
function mostrarImagen(i){
  vMedio.textContent='';
  const c=cuadroV(ampliada(PIEZAS[i]),i,PIEZAS[i].e==='video'?2:2.5);c.setAttribute('role','img');c.setAttribute('aria-label',PIEZAS[i].t);
  vMedio.appendChild(c);tImg.setAttribute('aria-pressed','true');tVid.setAttribute('aria-pressed','false');
}
function mostrarVideo(i){
  if(!PIEZAS[i].v){mostrarBloqueo(i);return}
  vMedio.textContent='';
  const f=document.createElement('iframe');
  f.src='https://www.youtube-nocookie.com/embed/'+PIEZAS[i].v+'?rel=0&autoplay=1';
  f.title=PIEZAS[i].vt||'Video';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
  vMedio.appendChild(f);tImg.setAttribute('aria-pressed','false');tVid.setAttribute('aria-pressed','true');
}
function controles(on){['look-controls','wasd-controls'].forEach(c=>cam.setAttribute(c,'enabled',on))}
const JUEGO_URL='https://museo.goyasurubi.com/surubi/';
function abrirJuego(){
  abierto=true;actualVisor=-2;window.__avanzar=false;
  visor.classList.add('v-juego');
  document.getElementById('v-titulo').textContent='Vamos de pesca';
  document.getElementById('v-autor').textContent='Juego interactivo · Museo del Surubí';
  document.getElementById('v-texto').textContent='Jugá directamente desde aquí o abrí el juego en una pestaña nueva si tu navegador bloquea el marco.';
  vTabs.hidden=true;vVt.hidden=true;vYt.hidden=false;
  vYt.href=JUEGO_URL;vYt.textContent='Abrir el juego en una pestaña nueva';
  vMedio.textContent='';
  const f=document.createElement('iframe');
  f.src=JUEGO_URL;f.title='Juego Pesca del Surubí';
  f.allow='autoplay; fullscreen; gamepad';f.allowFullscreen=true;
  f.referrerPolicy='strict-origin-when-cross-origin';
  vMedio.appendChild(f);
  visor.hidden=false;controles(false);
  document.getElementById('v-cerrar').focus();
}
function abrir(i){
  const o=PIEZAS[i];abierto=true;actualVisor=i;window.__avanzar=false;
  visor.classList.remove('v-juego');
  document.getElementById('v-titulo').textContent=o.t;
  document.getElementById('v-autor').textContent=o.a;
  document.getElementById('v-texto').textContent=o.d||o.x;
  vTabs.hidden=true;vVt.hidden=true;vYt.hidden=!o.v;
  if(o.v){vYt.href='https://www.youtube.com/watch?v='+o.v;vYt.textContent='¿No carga? Abrir el video en YouTube'}
  (o.v?mostrarVideo:mostrarImagen)(i);visor.hidden=false;controles(false);
  document.getElementById('v-cerrar').focus();
}
function cerrar(){vMedio.textContent='';visor.classList.remove('v-juego');visor.hidden=true;abierto=false;controles(true)}
document.getElementById('v-cerrar').addEventListener('click',cerrar);
visor.addEventListener('click',e=>{if(e.target===visor)cerrar()});
tImg.addEventListener('click',()=>mostrarImagen(actualVisor));
tVid.addEventListener('click',()=>mostrarVideo(actualVisor));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&abierto)cerrar()});

function mostrarBloqueo(i){
  vMedio.textContent='';const a=document.createElement('a');
  const url=i===-2?JUEGO_URL:'https://www.youtube.com/watch?v='+PIEZAS[i].v;
  a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className='v-poster';
  if(i===-2){
    const div=document.createElement('div');div.style.cssText='padding:3rem 1.5rem;text-align:center;background:#10161a;color:#fff';
    div.innerHTML='<p style="font-size:1.25rem;margin:0 0 1rem">No se pudo incrustar el juego aquí.</p>';
    a.appendChild(div);
  }else{
    a.appendChild(cuadroV(ampliada(PIEZAS[i]),i,2));
  }
  const sp=document.createElement('span');sp.textContent=i===-2?'Abrir juego en museo.goyasurubi.com':'Ver el video en YouTube';a.appendChild(sp);vMedio.appendChild(a);
}
document.addEventListener('securitypolicyviolation',e=>{if(abierto&&(actualVisor===-2||(actualVisor>=0&&(PIEZAS[actualVisor].v||PIEZAS[actualVisor].url)))&&/frame|child|default/.test(e.violatedDirective))mostrarBloqueo(actualVisor)});
function rehacer(l){pintarV(l.cv,l.o,lista.indexOf(l),1);const m=l.lienzo.getObject3D('mesh');if(m&&m.material&&m.material.map)m.material.map.needsUpdate=true}
function cargarMiniatura(l){
  const o=l.o;if(!o.v)return;
  const probar=(u,sig)=>{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{o.th=im;rehacer(l)};im.onerror=()=>{if(sig)probar(sig)};im.src=u};
  probar('https://i.ytimg.com/vi/'+o.v+'/maxresdefault.jpg','https://i.ytimg.com/vi/'+o.v+'/mqdefault.jpg');
}
lista.forEach(cargarMiniatura);
async function cargarFoto(l){
  try{const b=atob(FOTO_B64),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  l.o.th=await createImageBitmap(new Blob([u],{type:'image/jpeg'}));rehacer(l)}catch(e){}
}
lista.forEach(l=>{if(l.o.e==='foto')cargarFoto(l)});

/* Elegir el cuadro o la canoa bajo el puntero */
const rc=new AFRAME.THREE.Raycaster(),mv=new AFRAME.THREE.Vector2();
rc.params.Line.threshold=.06;
function elegir(cx,cy){
  const sc=document.querySelector('a-scene');if(!sc.camera||!sc.canvas)return -1;
  const r=sc.canvas.getBoundingClientRect();
  mv.set((cx-r.left)/r.width*2-1,-((cy-r.top)/r.height)*2+1);rc.setFromCamera(mv,sc.camera);rc.far=10;
  let mejor=-1,dm=1e9;
  lista.forEach((l,i)=>{if(!deFrente(l,cam.object3D.position))return;const m=l.lienzo.getObject3D('mesh');if(!m)return;const h=rc.intersectObject(m,false)[0];if(h&&h.distance<dm){dm=h.distance;mejor=i}});
  if(mejor<0&&canoaEl){
    const cm=canoaEl.getObject3D('mesh');
    if(cm){rc.far=28;if(rc.intersectObject(cm,true).length)mejor=-2}
  }
  return mejor;
}
let bajada=null,tmov=0;
document.addEventListener('pointerdown',e=>{bajada={x:e.clientX,y:e.clientY}});
document.addEventListener('pointerup',e=>{
  if(!bajada||abierto)return;const d=Math.hypot(e.clientX-bajada.x,e.clientY-bajada.y);bajada=null;
  if(d>6||e.target.closest('#ayuda,#cartela,#avanzar,#visor,#sonido,#tiempo-ui'))return;
  const i=elegir(e.clientX,e.clientY);
  if(i>=0)abrir(i);else if(i===-2)abrirJuego();
});
document.addEventListener('pointermove',e=>{
  if(abierto||e.pointerType==='touch')return;const n=performance.now();if(n-tmov<90)return;tmov=n;
  const i=elegir(e.clientX,e.clientY),sc=document.querySelector('a-scene');
  if(sc.canvas)sc.canvas.style.cursor=i!==-1?'pointer':'';
  if(canoaEl&&canoaEl.components['canoa-pescador'])canoaEl.components['canoa-pescador'].hovered=(i===-2);
});

/* Sonido ambiente de la fotografía: se oye más cuanto más cerca */
const fotoIdx=PIEZAS.findIndex(o=>o.e==='foto');
const D_MAX=MUSEO.audio.distMax,D_MIN=MUSEO.audio.distMin,GAIN_MAX=MUSEO.audio.gainBosque,GAIN_RIO=MUSEO.audio.gainRio;
let actx=null,ganancia=null,ganancia2=null,sonidoOn=true;
const bSonido=document.getElementById('sonido');
function iniciarAudio(){
  if(actx||fotoIdx<0)return;
  try{
    const AC=window.AudioContext||window.webkitAudioContext;actx=new AC();
    ganancia=actx.createGain();ganancia.gain.value=0;ganancia.connect(actx.destination);
    const b=atob(AUDIO_B64),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
    actx.decodeAudioData(u.buffer,buf=>{const f=actx.createBufferSource();f.buffer=buf;f.loop=true;f.connect(ganancia);f.start();bSonido.hidden=false},()=>{});
    ganancia2=actx.createGain();ganancia2.gain.value=0;ganancia2.connect(actx.destination);
    {const b2=atob(AUDIO_RIO_B64),u2=new Uint8Array(b2.length);for(let i=0;i<b2.length;i++)u2[i]=b2.charCodeAt(i);actx.decodeAudioData(u2.buffer,buf=>{const f=actx.createBufferSource();f.buffer=buf;f.loop=true;f.connect(ganancia2);f.start()},()=>{})}
  }catch(e){}
}
function volumenSegunDistancia(){
  if(!actx||!ganancia)return;
  const l=lista[fotoIdx],p=cam.object3D.position,d=Math.hypot(p.x-l.x,p.z-l.z);
  const t=Math.min(1,Math.max(0,(D_MAX-d)/(D_MAX-D_MIN))),v=sonidoOn?GAIN_MAX*t*t*(3-2*t):0;
  ganancia.gain.setTargetAtTime(v,actx.currentTime,.3);
  if(ganancia2){const dr=Math.abs(p.x+10.5),tr=Math.min(1,Math.max(0,(D_MAX-dr)/(D_MAX-D_MIN)));ganancia2.gain.setTargetAtTime(sonidoOn?GAIN_RIO*tr*tr*(3-2*tr):0,actx.currentTime,.3)}
}
setInterval(volumenSegunDistancia,100);
document.getElementById('entrar').addEventListener('click',iniciarAudio);
document.addEventListener('pointerdown',()=>{if(actx&&actx.state==='suspended')actx.resume()});
bSonido.addEventListener('click',()=>{sonidoOn=!sonidoOn;bSonido.setAttribute('aria-pressed',String(sonidoOn));bSonido.textContent=sonidoOn?'Sonido: sí':'Sonido: no';volumenSegunDistancia()});

/* Controles */
document.getElementById('entrar').addEventListener('click',()=>{document.getElementById('ayuda').hidden=true});
const b=document.getElementById('avanzar');
['pointerdown'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();window.__avanzar=true}));
['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{window.__avanzar=false}));

 /* Selector rápido de franja horaria (teclas 1, 2, 3, 4 y 0 para hora real) */
 {const HORAS={auto:null,amanecer:6.8,dia:13.0,atardecer:18.75,noche:23.0};
  const TECLAS={'0':'auto','1':'amanecer','2':'dia','3':'atardecer','4':'noche'};
  const ui=document.getElementById('tiempo-ui');
  function setModoTiempo(modo){
    if(!(modo in HORAS))return;
    window.__horaPrueba=HORAS[modo];
    if(ui)ui.querySelectorAll('button').forEach(bt=>bt.setAttribute('aria-pressed',String(bt.dataset.modo===modo)));
  }
  if(ui)ui.addEventListener('click',e=>{const bt=e.target.closest('button[data-modo]');if(bt)setModoTiempo(bt.dataset.modo)});
  document.addEventListener('keydown',e=>{
    if(abierto||e.altKey||e.ctrlKey||e.metaKey)return;
    if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    const m=TECLAS[e.key];if(m)setModoTiempo(m);
  });
 }

/* Al final, cuando ya existen todas las entidades: texturas nítidas y redibujo al cargar las tipografías */
iniciarCalidad();
