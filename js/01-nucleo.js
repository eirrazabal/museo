/* 01-nucleo.js: utilidades compartidas y componente de movimiento. Se carga en el <head>, después de la config.
   Expone: H, C, TINTE, VERDE, E, R, lienzo, grano, envolver, b64bmp, viva, rotulo, letrero, tablero, reservado,
           calidad, mejorar, iniciarCalidad, VIVAS, ELS, y el componente 'mover'.
   No toca el DOM al cargarse: busca #sala solo cuando se crea una entidad. */
const H=MUSEO.sala.alto,C=MUSEO.colores,TINTE=MUSEO.tintes,VERDE=MUSEO.colores.verde;
/* ===== Museo del Surubí digital: 21 x 11 m, según la propuesta museográfica ===== */

function E(tag,at,par){const e=document.createElement(tag);for(const k in at)e.setAttribute(k,at[k]);(par||document.getElementById('sala')).appendChild(e);return e}
function R(s){return()=>(s=(s*16807)%2147483647)/2147483647}
function lienzo(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c}
function grano(g,w,h,n,a){for(let i=0;i<n;i++){g.fillStyle=(i%2?'rgba(255,255,255,':'rgba(0,0,0,')+a+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}}
function envolver(g,txt,x,y,ancho,alto){const pal=txt.split(' ');let l='';for(const p of pal){const t=l?l+' '+p:p;if(g.measureText(t).width>ancho&&l){g.fillText(l,x,y);y+=alto;l=p}else l=t}g.fillText(l,x,y);return y+alto}
function b64bmp(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return createImageBitmap(new Blob([u],{type:'image/jpeg'}))}

/* Textos y rótulos que se redibujan al cargar las tipografías */
const VIVAS=[],ELS=[];
function viva(el,w,h,draw,transp){const c=lienzo(w,h,()=>{});
  const f=()=>{const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,h);g.textAlign='left';g.textBaseline='alphabetic';draw(g,w,h);
    const m=el.getObject3D&&el.getObject3D('mesh');if(m&&m.material&&m.material.map)m.material.map.needsUpdate=true};
  f();VIVAS.push(f);ELS.push(el);el.setAttribute('material',{shader:'flat',src:c,transparent:!!transp});return el}
function rotulo(x,y,z,ry,w,h,pxw,draw,marco,transp){
  let dx=0,dz=0;
  if(marco){E('a-box',{width:w+.08,height:h+.08,depth:.03,position:`${x} ${y} ${z}`,rotation:`0 ${ry} 0`,color:'#2a2a2c'});dx=Math.sin(ry*Math.PI/180)*.025;dz=Math.cos(ry*Math.PI/180)*.025}
  const e=E('a-plane',{width:w,height:h,position:`${x+dx} ${y} ${z+dz}`,rotation:`0 ${ry} 0`});
  return viva(e,pxw,Math.round(pxw*h/w),draw,transp)}
function letrero(lema,color){return (g,w,h)=>{
  let fs=96;const f=()=>`300 ${fs}px Lato,"Helvetica Neue",Arial,sans-serif`;g.font=f();
  while(g.measureText(lema).width>w-150&&fs>40){fs-=4;g.font=f()}
  g.fillStyle=color;g.fillText(lema,74,h*.56);g.fillRect(78,h*.56+38,150,4)}}
function tablero(titulo,items,fs,col){fs=fs||1;col=col||'#0f4c6a';return (g,w,h)=>{
  const k=w/1000*fs;g.fillStyle='#fbfbfa';g.fillRect(0,0,w,h);
  g.fillStyle=col;g.fillRect(40*k,44*k,8*k,64*k);
  g.font=`600 ${52*k}px Georgia,serif`;let y=envolver(g,titulo,72*k,92*k,w-120*k,58*k)+16*k;
  items.forEach(it=>{g.font=`600 ${32*k}px Newsreader,Georgia,serif`;g.fillStyle=col;g.fillText(it[0],48*k,y);y+=40*k;
    g.font=`${30*k}px Newsreader,Georgia,serif`;g.fillStyle='#1d2428';y=envolver(g,it[1],48*k,y,w-96*k,38*k)+14*k})}}
function reservado(){return (g,w,h)=>{g.fillStyle='#f3f3f1';g.fillRect(0,0,w,h);g.strokeStyle='#8a8f8c';g.lineWidth=5;g.setLineDash([22,16]);g.strokeRect(24,24,w-48,h-48);g.setLineDash([]);
  g.textAlign='center';g.fillStyle='#4c5b63';g.font='italic 46px Newsreader,Georgia,serif';g.fillText('Espacio reservado',w/2,h/2-6);g.font='600 40px Newsreader,Georgia,serif';g.fillStyle=C.b;g.fillText('Barras pesqueras',w/2,h/2+52)}}

/* Calidad de las texturas de texto y avance de tipografías */
function calidad(p){const m=p.getObject3D('mesh');if(!m||!m.material||!m.material.map)return;const t=m.material.map,r=document.querySelector('a-scene').renderer;t.anisotropy=r?r.capabilities.getMaxAnisotropy():4;t.generateMipmaps=true;t.minFilter=AFRAME.THREE.LinearMipmapLinearFilter;t.magFilter=AFRAME.THREE.LinearFilter;t.needsUpdate=true}
function mejorar(){ELS.forEach(calidad)}
function iniciarCalidad(){
  document.querySelector('a-scene').addEventListener('loaded',()=>{setTimeout(mejorar,400);setTimeout(mejorar,1800)});
  if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('300 40px Lato'),document.fonts.load('45px Newsreader'),document.fonts.load('italic 40px Newsreader'),document.fonts.load('600 32px Newsreader')]).then(()=>{VIVAS.forEach(f=>f());mejorar()}).catch(()=>{})}
}

/* Componente 'mover': botón Avanzar y colisiones con el edificio (los límites salen de MUSEO.limites). */
AFRAME.registerComponent('mover',{
  init(){this.v=new AFRAME.THREE.Vector3()},
  tick(t,dt){
    const p=this.el.object3D.position;
    if(window.__avanzar){
      this.v.set(0,0,-1).applyQuaternion(this.el.object3D.quaternion);this.v.y=0;this.v.normalize();
      p.addScaledVector(this.v,MUSEO.velocidad*dt/1000);
    }
    const L=MUSEO.limites,ok=(x,z)=>{const ax=Math.abs(x),az=Math.abs(z);if(ax<=L.interior.x&&az<=L.interior.z)return !(ax<L.bloque.x&&az<L.bloque.z);if(ax<L.muro.x&&az<L.muro.z)return ax<=L.puertaX&&z>=L.interior.z;return ax<=L.cubierta.x&&az<=L.cubierta.z};
    let x=p.x,z=p.z;if(this.lx===undefined){this.lx=x;this.lz=z}
    if(!ok(x,z)){if(ok(x,this.lz))z=this.lz;else if(ok(this.lx,z))x=this.lx;else{x=this.lx;z=this.lz}}
    p.x=x;p.z=z;this.lx=x;this.lz=z;
  }
});
