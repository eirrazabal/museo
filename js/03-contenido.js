/* 03-contenido.js: lo que se ve colgado y escrito. Pintores de cuadros, íconos, textos de presentación, bloque central,
   rótulos de sector, línea de tiempo y obras. Crea la lista 'lista' (una entrada por pieza) que usa 05.
   Usa: PIEZAS e IMG (datos/), E, lienzo, viva, rotulo, letrero, C, H. Expone: lista, P, cuadroV, pintarV, ampliada, ICO, colgar. */
const SUB='Plataforma colaborativa para la preservación, valorización y difusión del patrimonio cultural vivo de la Fiesta Nacional del Surubí';
const CUERPO='La 50.ª Fiesta Nacional del Surubí, que se realiza en Goya en abril de 2027, es la ocasión para recuperar casi cinco décadas de fotografías, publicaciones y testimonios que hoy se conservan en soportes físicos, sin digitalizar ni catalogar. El proyecto propone una plataforma que reúne un archivo digital del patrimonio fotográfico y documental, un museo digital colaborativo donde la comunidad identifica y enriquece los materiales, una experiencia interactiva inspirada en el Mundial de Pesca para el público infantil y un espacio de participación durante la Fiesta.';
const PIE='Articulan Informática, Historia, Comunicación Social y Sociología, junto a la UNNE, el Municipio de Goya y la CO.MU.PE.';
const GLOW=lienzo(256,256,(g,w,h)=>{const r=g.createRadialGradient(128,128,4,128,128,128);r.addColorStop(0,'rgba(255,240,205,.9)');r.addColorStop(.5,'rgba(255,236,200,.35)');r.addColorStop(1,'rgba(255,236,200,0)');g.fillStyle=r;g.fillRect(0,0,w,h)});

/* Pintores de cuadros (fotos, imágenes del proyecto y pósters de video) */
const P={};
P.foto=function(g,w,h,r,o){const t=o.th;
  if(t){const k=Math.max(w/t.width,h/t.height),dw=t.width*k,dh=t.height*k;g.imageSmoothingQuality='high';g.drawImage(t,(w-dw)/2,(h-dh)/2,dw,dh)}
  else{g.fillStyle='#2a2926';g.fillRect(0,0,w,h);g.fillStyle='#b9b4a8';g.font='italic 26px Georgia,serif';g.textAlign='center';g.fillText('Cargando imagen…',w/2,h/2)}};
P.imagen=P.foto;
P.video=function(g,w,h,r,o){
  const t=o&&o.th;
  if(t){const k=Math.max(w/t.width,h/t.height),dw=t.width*k,dh=t.height*k;g.drawImage(t,(w-dw)/2,(h-dh)/2,dw,dh);g.fillStyle='rgba(8,24,34,.38)';g.fillRect(0,0,w,h)}
  else{const s=g.createLinearGradient(0,0,w,h);s.addColorStop(0,'#0f4c6a');s.addColorStop(1,'#0a2a3b');g.fillStyle=s;g.fillRect(0,0,w,h);
    g.strokeStyle='rgba(255,255,255,.07)';g.lineWidth=2;for(let i=0;i<9;i++){g.beginPath();g.arc(w*.5,h*.4,40+i*38,0,7);g.stroke()}}
  g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.arc(w/2,h*.4,52,0,7);g.fill();
  g.fillStyle='#0f4c6a';g.beginPath();g.moveTo(w/2-15,h*.4-27);g.lineTo(w/2-15,h*.4+27);g.lineTo(w/2+29,h*.4);g.fill();
  g.fillStyle='#fff';g.font='600 27px Georgia,serif';envolver(g,o.t,34,h*.69,w-68,34);
  g.fillStyle='rgba(255,255,255,.82)';g.font='italic 20px Georgia,serif';g.fillText(o.a,34,h-26);
};
function ampliada(o){return o.thFull?Object.assign({},o,{th:o.thFull,ar:o.arFull,tw:0}):o}
function dims(o){const a=o.ar,T=o.tw||640;return a>=1?[T,Math.round(T/a)]:[Math.round(T*a),T]}
function pintarV(c,o,i,k){const d=dims(o),g=c.getContext('2d');g.setTransform(k,0,0,k,0,0);g.globalAlpha=1;g.textAlign='left';(P[o.e]||P.video)(g,d[0],d[1],R((i+1)*977+13),o);g.globalAlpha=1}
function cuadroV(o,i,k){const d=dims(o),c=document.createElement('canvas');c.width=Math.round(d[0]*k);c.height=Math.round(d[1]*k);pintarV(c,o,i,k);return c}

/* Iconos: mano que toca e insignia según el tipo de pieza */
const ICO={};
function insignia(dibujo){return lienzo(128,128,g=>{g.fillStyle='#c9a45c';g.beginPath();g.arc(64,64,60,0,7);g.fill();g.strokeStyle='#8a6a2f';g.lineWidth=4;g.stroke();dibujo(g)})}
ICO.play=insignia(g=>{g.fillStyle='#2a2118';g.beginPath();g.moveTo(50,38);g.lineTo(50,90);g.lineTo(94,64);g.fill()});
ICO.lupa=insignia(g=>{g.strokeStyle='#2a2118';g.lineCap='round';g.lineWidth=9;g.beginPath();g.arc(58,58,24,0,7);g.stroke();g.beginPath();g.moveTo(76,76);g.lineTo(96,96);g.stroke();g.lineWidth=6;g.beginPath();g.moveTo(48,58);g.lineTo(68,58);g.moveTo(58,48);g.lineTo(58,68);g.stroke()});
ICO.mano=lienzo(256,256,g=>{
  const formas=[[96,44,34,120,17],[80,124,118,92,30],[132,104,26,56,13],[156,112,26,52,13],[178,124,22,44,11],[56,136,44,30,15]];
  g.lineJoin='round';g.lineCap='round';
  g.strokeStyle='#fff';g.lineWidth=14;formas.forEach(f=>{g.beginPath();g.roundRect(f[0],f[1],f[2],f[3],f[4]);g.stroke()});
  [34,52].forEach(r=>{g.strokeStyle='#fff';g.lineWidth=16;g.beginPath();g.arc(113,46,r,Math.PI*1.12,Math.PI*1.88);g.stroke()});
  g.fillStyle='#0f4c6a';formas.forEach(f=>{g.beginPath();g.roundRect(f[0],f[1],f[2],f[3],f[4]);g.fill()});
  g.strokeStyle='#0f4c6a';g.lineWidth=8;[34,52].forEach(r=>{g.beginPath();g.arc(113,46,r,Math.PI*1.12,Math.PI*1.88);g.stroke()});
});

/* Bloque central: vitrinas de premios (cara norte) y presentación (cara sur) */
E('a-box',{position:'0 1.4 0',width:6,height:2.8,depth:.84,color:'#5a3b27'});
const cPremios=lienzo(1200,623,(g,w,h)=>{g.fillStyle='#5a3b27';g.fillRect(0,0,w,h)});
const pPremios=E('a-plane',{position:'0 1.4 -.43',rotation:'0 180 0',width:5.4,height:2.8});
pPremios.setAttribute('material',{shader:'flat',src:cPremios});
b64bmp(IMG.premios).then(bm=>{const g=cPremios.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(bm,0,0,1200,623);const m=pPremios.getObject3D('mesh');if(m&&m.material&&m.material.map)m.material.map.needsUpdate=true}).catch(()=>{});
const cartelPremios=E('a-plane',{width:1.5,height:.32,position:'-2.0 2.62 -.44',rotation:'0 180 0'});
viva(cartelPremios,512,110,(g,w,h)=>{g.fillStyle='#0f4c6a';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='300 54px Lato,Arial,sans-serif';g.textAlign='center';g.fillText('Premios',w/2,76)});
let logoExpBm=null;
function dibujarLogoExp(g,w,h){
  g.fillStyle='#fff';g.fillRect(0,0,w,h);
  if(logoExpBm){const p=64,k=Math.min((w-p*2)/logoExpBm.width,(h-p*2)/logoExpBm.height),dw=logoExpBm.width*k,dh=logoExpBm.height*k;g.imageSmoothingQuality='high';g.drawImage(logoExpBm,(w-dw)/2,(h-dh)/2,dw,dh)}
}
const pLogo=rotulo(-2.05,1.4,.45,0,1.8,1.8,1024,dibujarLogoExp,true);
if(IMG.logoExperiencia){b64bmp(IMG.logoExperiencia).then(bm=>{logoExpBm=bm;const c=pLogo.getAttribute('material').src;dibujarLogoExp(c.getContext('2d'),c.width,c.height);const m=pLogo.getObject3D('mesh');if(m&&m.material&&m.material.map)m.material.map.needsUpdate=true}).catch(()=>{})}
rotulo(.95,1.4,.45,0,3.6,1.8,2048,(g,w,h)=>{
  g.fillStyle='#fbfbfa';g.fillRect(0,0,w,h);
  g.fillStyle='#0f4c6a';g.fillRect(96,84,10,196);
  g.font='300 78px Lato,"Helvetica Neue",Arial,sans-serif';g.fillText('Experiencia Surubí',140,150);
  g.fillStyle='#4c5b63';g.font='italic 34px Newsreader,Georgia,serif';envolver(g,SUB,140,206,1800,46);
  g.fillStyle='#d3d6d4';g.fillRect(96,310,1856,3);
  g.fillStyle='#1d2428';g.font='38px Newsreader,Georgia,serif';envolver(g,CUERPO,96,390,1856,56);
  g.fillStyle='#0f4c6a';g.font='italic 32px Newsreader,Georgia,serif';envolver(g,PIE,96,860,1856,42)},true);

/* Rótulos de sector y tableros (textos de la propuesta) */
rotulo(-6.9,2.85,5.47,180,4.8,.75,2048,letrero('Infancias, biodiversidad y memoria viva',C.s1),false,true);
/* Línea de tiempo a lo largo de la pared norte (dos tramos, por debajo de las vigas) */
const ETAPAS=[['1940 a 1969','El Camino de los Hacedores','Orígenes y gestación comunitaria.'],['1969 a 1981','Goya para el País','Institucionalización y proyección nacional.'],['1981 a 2005','Consolidación Única','Crecimiento masivo y arraigo cultural.'],['2006 a 2015','Bodas de Oro','Modernización y proyección regional.'],['2015 a hoy','Pesca con Devolución','Sustentabilidad y conciencia ecológica.']];
const XT=[-6.4,-3.9,-1.4,1.1,3.6];
function tiempo(x0,x1,desde,lema){
  const w=x1-x0;
  rotulo((x0+x1)/2,2.745,-5.47,0,w,.57,4096,(g,W,Hh)=>{
    const m=W/w,k=m/490,X=x=>(x-x0)*m;g.fillStyle=C.s2;
    if(lema){g.font=`300 ${80*k}px Lato,"Helvetica Neue",Arial,sans-serif`;g.fillText(lema,30*k,150*k);g.fillRect(34*k,176*k,120*k,4*k)}
    const a=Math.max(x0,XT[0]-1.1),b=Math.min(x1,XT[4]+1.1);g.fillRect(X(a),81*k,X(b)-X(a),3*k);
    for(let i=desde;i<desde+(x1<-2?2:3);i++){const e=ETAPAS[i],cx=X(XT[i]);
      g.fillStyle=C.s2;g.beginPath();g.arc(cx,82.5*k,12*k,0,7);g.fill();g.textAlign='center';
      g.font=`600 ${60*k}px Newsreader,Georgia,serif`;g.fillText(e[0],cx,62*k);
      g.font=`600 ${48*k}px Newsreader,Georgia,serif`;g.fillText(e[1],cx,138*k);
      g.fillStyle='#4c5b63';g.font=`italic ${36*k}px Newsreader,Georgia,serif`;envolver(g,e[2],cx,182*k,1100*k,38*k)}
  },false,true)}
tiempo(-10.4,-2.65,0,'Rituales y evolución');
tiempo(-2.65,6.3,2,'');
rotulo(10.47,2.85,-2.7,-90,4.8,.75,2048,letrero('Arraigo e identidad',C.s3),false,true);
rotulo(4.7,2.85,5.47,180,4.8,.75,2048,letrero('Patrimonio gráfico e iconografía histórica',C.s4),false,true);
rotulo(8.4,2.85,-5.47,0,3.9,.75,1800,letrero('Barras pesqueras y cultura fluvial',C.b),false,true);
rotulo(7.75,1.4,-5.47,0,1.3,1.0,800,reservado(),true);
rotulo(9.15,1.4,-5.47,0,1.3,1.0,800,reservado(),true);
E('a-box',{position:'8.45 .25 -4.5',width:2.4,height:.5,depth:.5,color:'#6b4a32'});
rotulo(0,2.85,-5.95,180,4.8,.75,2048,letrero('El lugar: costanera y flotante','#4c5b63'),false,true);

/* Obras colgadas */
function colgar(o,i){
  const W=o.W,Hh=o.mural?H:W/o.ar;
  let g,lienzo,yp,xp=0,xb,yb,xh,zz=0,fw=0,fh=0;
  if(o.mural){
    g=E('a-entity',{id:'p'+i,position:`${o.px} ${H/2} ${o.pz}`,rotation:`0 ${o.ry} 0`});
    lienzo=E('a-plane',{width:W,height:Hh,position:'0 0 .015'},g);
    xp=-W/2+1.3;yp=-1.15;xb=xp-.72;yb=yp;xh=xp+.62;zz=.03;
  }else if(o.print){
    g=E('a-entity',{id:'p'+i,position:`${o.px} ${o.y||1.7} ${o.pz}`,rotation:`0 ${o.ry} 0`});
    E('a-plane',{width:W+.16,height:Hh+.16,position:'0 0 .01',color:'#f3f1ea'},g);
    lienzo=E('a-plane',{width:W,height:Hh,position:'0 0 .02'},g);
    xp=-W/2+.8;yp=-(Hh/2+.35);xb=xp-.7;yb=yp;xh=xp+.6;zz=.02;
  }else{
    fw=W+.45;fh=Hh+.36;
    g=E('a-entity',{id:'p'+i,position:`${o.px} ${o.y||1.4} ${o.pz}`,rotation:`0 ${o.ry} 0`});
    E('a-plane',{width:fw+2.2,height:fh+1.8,position:'0 .1 .012'},g).setAttribute('material',{shader:'flat',transparent:true,src:GLOW,blending:'additive',depthWrite:false,opacity:.55});
    E('a-box',{width:fw,height:fh,depth:.08,color:'#9c7a3c',metalness:.4,roughness:.5},g);
    E('a-plane',{width:W+.28,height:Hh+.22,position:'0 0 .045',color:'#ece6d8'},g);
    lienzo=E('a-plane',{width:W,height:Hh,position:'0 0 .05'},g);
    yp=-(Hh/2+.41);xb=fw/2;yb=-fh/2;xh=.56;
    E('a-cylinder',{position:'0 1.45 1',rotation:'35 0 0',radius:.06,height:.2,color:'#26262a'},g);
    E('a-cylinder',{position:'0 1.65 1',radius:.01,height:.4,color:'#26262a'},g);
  }
  const cv=cuadroV(o,i,1);lienzo.setAttribute('material',{shader:'flat',src:cv});
  E('a-box',{width:.5,height:.14,depth:.03,position:`${xp} ${yp} ${.02+zz}`,color:'#c9a45c'},g);
  const placa=document.createElement('canvas');placa.width=256;placa.height=72;
  {const q=placa.getContext('2d');q.fillStyle='#c9a45c';q.fillRect(0,0,256,72);q.fillStyle='#2a2118';q.font='600 50px Georgia,serif';q.textAlign='center';q.textBaseline='middle';q.fillText(String(i+1),128,38)}
  E('a-plane',{width:.5,height:.14,position:`${xp} ${yp} ${.037+zz}`},g).setAttribute('material',{shader:'flat',src:placa});
  E('a-plane',{width:.3,height:.3,position:`${xb} ${(o.mural||o.print)?yp:yb} ${.09+zz}`},g).setAttribute('material',{shader:'flat',transparent:true,src:o.v?ICO.play:ICO.lupa});
  E('a-plane',{width:.28,height:.28,position:`${xh} ${yp} ${.06+zz}`,animation:`property:position;from:${xh} ${yp} ${.06+zz};to:${xh} ${yp+.06} ${.06+zz};dir:alternate;dur:900;easing:easeInOutSine;loop:true`},g).setAttribute('material',{shader:'flat',transparent:true,src:ICO.mano});
  return {o,x:o.px,z:o.pz,lienzo,cv};
}
const lista=PIEZAS.map(colgar);
async function cargarImg(l){const k=l.o.img;if(!k)return;try{l.o.th=await b64bmp(IMG[k]);rehacer(l)}catch(e){}}
lista.forEach(cargarImg);
lista.forEach(async l=>{if(l.o.full){try{l.o.thFull=await b64bmp(IMG[l.o.full.img]);l.o.arFull=l.o.full.ar}catch(e){}}});
