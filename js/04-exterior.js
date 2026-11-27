/* 04-exterior.js: el mundo de afuera. Ciclo día/noche (amanecer, día, atardecer, noche), cielo, sol, luna y estrellas,
   agua, islas (arboleda variada, juncos, camalotes), canoa con pescador y farol, y peces 3D sobre la foto del río.
   Usa: E, R, lienzo, MUSEO, FISH_IMG y FISH_AR (datos/imagenes.js). */
/* Cielo procedural con gradiente interpolado, nubes suaves, sol, luna, estrellas y niebla según la hora */
const ENT_TINT=[];
function regTint(el,colHex){
  const c=new AFRAME.THREE.Color(colHex||'#ffffff');
  ENT_TINT.push({el,base:c});
  return el;
}
const CIELO_SH={
  uCenit:{value:new AFRAME.THREE.Color('#2f3f78')},
  uMedio:{value:new AFRAME.THREE.Color('#b77f9c')},
  uHoriz:{value:new AFRAME.THREE.Color('#ffd49a')},
  uNadir:{value:new AFRAME.THREE.Color('#6b5254')},
  uSolDir:{value:new AFRAME.THREE.Vector3(-1,.22,0).normalize()},
  uSolCol:{value:new AFRAME.THREE.Color('#ffbe78')},
  uSolGlow:{value:.65},
  uNubeCol:{value:new AFRAME.THREE.Color('#ffc49a')},
  uNubeOp:{value:.35},
  uNublado:{value:0},
  uLluvioso:{value:0},
  uTiempo:{value:0}
};
{const T=AFRAME.THREE,cieloEl=E('a-entity',{});
 const cieloMat=new T.ShaderMaterial({
   uniforms:CIELO_SH,side:T.BackSide,depthWrite:false,fog:false,
   vertexShader:'varying vec3 vDir;void main(){vDir=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
   fragmentShader:`uniform vec3 uCenit,uMedio,uHoriz,uNadir,uSolDir,uSolCol,uNubeCol;
     uniform float uSolGlow,uNubeOp,uNublado,uLluvioso,uTiempo;varying vec3 vDir;
     void main(){
       vec3 d=normalize(vDir);float y=d.y;
       vec3 col=y<0.0?mix(uHoriz,uNadir,clamp(-y*4.5,0.0,1.0)):(y<0.28?mix(uHoriz,uMedio,smoothstep(0.0,0.28,y)):mix(uMedio,uCenit,smoothstep(0.28,0.92,y)));
       float ds=max(dot(d,normalize(uSolDir)),0.0);
       col+=uSolCol*(pow(ds,7.0)*0.42+pow(ds,72.0)*0.55)*uSolGlow;
       float a=atan(d.z,d.x)+uTiempo*0.015;
       float n=sin(a*3.0+y*11.0)*0.5+sin(a*7.0-y*17.0+1.4)*0.3+sin(a*13.0+y*23.0)*0.2;
       float banda=smoothstep(0.04,0.18,y)*(1.0-smoothstep(0.22,0.52,y))*smoothstep(0.12,0.75,n);
       col=mix(col,uNubeCol,banda*uNubeOp);
       if(uNublado>0.001||uLluvioso>0.001){
         float lum=clamp(dot(uCenit+uHoriz,vec3(0.28)),0.10,1.0);
         float n2=sin(a*2.0+y*8.0+uTiempo*0.04)*0.45+sin(a*5.0-y*13.0-uTiempo*0.03)*0.35+sin(a*11.0+y*21.0)*0.2;
         float cub=smoothstep(-0.04,0.28,y)*smoothstep(-0.35,0.65,n2);
         vec3 cieloGris=vec3(0.56,0.60,0.64)*lum;
         vec3 nubeGris=mix(uNubeCol,vec3(0.45,0.49,0.53)*lum,0.75);
         col=mix(col,cieloGris,uNublado*0.48);
         col=mix(col,nubeGris,cub*uNublado*0.62);
         vec3 tormenta=vec3(0.26,0.29,0.33)*lum;
         col=mix(col,tormenta,uLluvioso*(0.52+0.32*cub));
       }
       gl_FragColor=vec4(col,1.0);
     }`
 });
 cieloEl.setObject3D('mesh',new T.Mesh(new T.SphereGeometry(452,64,32),cieloMat));
}
/* Campo de estrellas nocturnas */
const ESTRELLAS_MAT=(()=>{
  const T=AFRAME.THREE,N=950,pos=[],col=[],r=R(101);
  for(let i=0;i<N;i++){
    const th=r()*Math.PI*2,sy=.03+Math.pow(r(),1.35)*.95,cy=Math.sqrt(1-sy*sy),rad=436;
    pos.push(rad*cy*Math.cos(th),rad*sy,rad*cy*Math.sin(th));
    const v=.75+r()*.25,t=r();
    col.push(t<.2?v*.85:v,v*(t>.8?.92:1),t>.8?v*.8:v);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));
  const m=new T.PointsMaterial({size:2.2,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:0,depthWrite:false,fog:false});
  const e=E('a-entity',{});e.setObject3D('mesh',new T.Points(g,m));
  return m;
})();

const BRILLO=lienzo(256,256,(g,w,h)=>{const q=g.createRadialGradient(128,128,2,128,128,128);q.addColorStop(0,'rgba(255,255,255,1)');q.addColorStop(.25,'rgba(255,255,255,.58)');q.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=q;g.fillRect(0,0,w,h)});
const SOL_GRP=E('a-entity',{position:'-420 95 0'});
const SOL_HALO1=E('a-circle',{radius:125,position:'0 0 2'},SOL_GRP);SOL_HALO1.setAttribute('material',{shader:'flat',src:BRILLO,color:'#ffbe78',transparent:true,blending:'additive',depthWrite:false,fog:false});
const SOL_HALO2=E('a-circle',{radius:72,position:'0 0 1'},SOL_GRP);SOL_HALO2.setAttribute('material',{shader:'flat',src:BRILLO,color:'#ffe4a8',transparent:true,blending:'additive',depthWrite:false,fog:false});
const SOL_DISC=E('a-circle',{radius:20,position:'0 0 0'},SOL_GRP);SOL_DISC.setAttribute('material',{shader:'flat',color:'#fff4cf',transparent:true,opacity:1,fog:false});

const LUNA_TEX=lienzo(256,256,(g,w,h)=>{
  g.fillStyle='#eef3ff';g.beginPath();g.arc(128,128,124,0,7);g.fill();
  const r=R(88);
  for(let i=0;i<26;i++){g.fillStyle=`rgba(145,160,185,${.12+r()*.22})`;g.beginPath();g.arc(46+r()*164,46+r()*164,5+r()*20,0,7);g.fill()}
  const q=g.createRadialGradient(108,108,40,128,128,124);q.addColorStop(0,'rgba(255,255,255,0)');q.addColorStop(1,'rgba(120,145,185,.35)');g.fillStyle=q;g.beginPath();g.arc(128,128,124,0,7);g.fill();
});
const LUNA_GRP=E('a-entity',{position:'360 120 -40'});
const LUNA_HALO=E('a-circle',{radius:58,position:'0 0 1'},LUNA_GRP);LUNA_HALO.setAttribute('material',{shader:'flat',src:BRILLO,color:'#9abaff',transparent:true,blending:'additive',depthWrite:false,fog:false});
const LUNA_DISC=E('a-circle',{radius:15,position:'0 0 0'},LUNA_GRP);LUNA_DISC.setAttribute('material',{shader:'flat',src:LUNA_TEX,transparent:true,opacity:0,alphaTest:.05,fog:false});

const AGUA=lienzo(256,256,(g,w,h)=>{g.fillStyle='#6c8c98';g.fillRect(0,0,w,h);const r=R(31);for(let i=0;i<260;i++){g.strokeStyle=`rgba(${r()>.5?'205,218,228':'45,68,78'},${.1+r()*.14})`;g.lineWidth=1+r()*1.5;const x=r()*w,y=r()*h,l=8+r()*26;g.beginPath();g.moveTo(x,y);g.lineTo(x+l,y+(r()-.5)*3);g.stroke()}});
const AGUA_EL=E('a-circle',{radius:440,position:'0 -1.2 0',rotation:'-90 0 0'});
AGUA_EL.setAttribute('material',{shader:'flat',src:AGUA,repeat:'110 110',color:'#bcc6d2'});

const BRUMA_AGUA=lienzo(256,256,(g,w,h)=>{const q=g.createRadialGradient(128,128,0,128,128,128);q.addColorStop(0,'rgba(255,255,255,0)');q.addColorStop(.45,'rgba(255,255,255,0)');q.addColorStop(1,'rgba(255,255,255,.85)');g.fillStyle=q;g.fillRect(0,0,w,h)});
const BRUMA_EL=E('a-circle',{radius:438,position:'0 -1.19 0',rotation:'-90 0 0'});
BRUMA_EL.setAttribute('material',{shader:'flat',src:BRUMA_AGUA,color:'#e0a382',transparent:true,depthWrite:false,fog:false});

const REFLEJO=lienzo(512,128,(g,w,h)=>{const q=g.createLinearGradient(0,0,w,0);q.addColorStop(0,'rgba(255,255,255,.65)');q.addColorStop(.4,'rgba(255,255,255,.32)');q.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=q;g.fillRect(0,0,w,h);
  g.globalCompositeOperation='destination-in';const vf=g.createLinearGradient(0,0,0,h);vf.addColorStop(0,'rgba(0,0,0,0)');vf.addColorStop(.5,'rgba(0,0,0,1)');vf.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=vf;g.fillRect(0,0,w,h);
  g.globalCompositeOperation='source-over';const r=R(12);for(let i=0;i<260;i++){const x=Math.pow(r(),1.6)*w,y=h*.2+r()*h*.6;g.fillStyle=`rgba(255,255,255,${.25+r()*.35})`;g.fillRect(x,y,3+r()*14*(1-x/w),1.5)}});
const REFLEJO_PIV=E('a-entity',{position:'0 -1.17 0'});
const REFLEJO_EL=E('a-plane',{width:430,height:110,position:'-215 0 0',rotation:'-90 0 0'},REFLEJO_PIV);
REFLEJO_EL.setAttribute('material',{shader:'flat',src:REFLEJO,color:'#ffbe78',transparent:true,opacity:.9,blending:'additive',depthWrite:false});

const ISLAS=lienzo(2048,256,(g,w,h)=>{const r=R(41);
  for(let capa=0;capa<2;capa++){g.fillStyle=capa?'#2b3a40':'#44565c';g.beginPath();g.moveTo(0,h-3);let x=0;while(x<=w){const alto=(capa?34:20)+r()*(capa?60:44);const ancho=14+r()*30;g.lineTo(x,h-alto);g.lineTo(x+ancho/2,h-alto-8-r()*10);x+=ancho}g.lineTo(w,h-3);g.closePath();g.fill()}
  const v=g.createLinearGradient(0,h-110,0,h);v.addColorStop(0,'rgba(255,255,255,0)');v.addColorStop(1,'rgba(255,255,255,.22)');g.fillStyle=v;g.fillRect(0,h-110,w,107)});
regTint(E('a-cylinder',{radius:330,height:16,position:'0 6.8 0','open-ended':true}),'#ffffff').setAttribute('material',{shader:'flat',transparent:true,src:ISLAS,repeat:'3 1',side:'back',alphaTest:.05,fog:false,color:'#e6bca4'});

/* Isla principal frente al lado contrario a la entrada, y más islas lejanas hasta el horizonte */
const ARC0=65,ARC1=295,ARC=ARC1-ARC0;
function ruido(a,sd){return Math.sin(a*.07+sd)*.5+Math.sin(a*.19+sd*2.3)*.3+Math.sin(a*.43+sd*.7)*.2}
function orilla(a){return 56+8*ruido(a,1.7)}
AFRAME.registerComponent('isla-suelo',{init(){
  const T=AFRAME.THREE,pos=[],col=[],idx=[],N=ARC*2,K=5;
  const cs=['#b9a67c','#b9a67c','#8a9460','#587040','#3f5636'].map(c=>new T.Color(c));
  for(let i=0;i<=N;i++){const a=ARC0+i/2,t=a*Math.PI/180,r0=orilla(a),rs=[r0-1.5,r0+1.5,r0+7,r0+16,180];
    rs.forEach((r,k)=>{pos.push(r*Math.sin(t),0,r*Math.cos(t));col.push(cs[k].r,cs[k].g,cs[k].b)})}
  for(let i=0;i<N;i++)for(let k=0;k<K-1;k++){const a=i*K+k,b=a+K;idx.push(a,b,a+1,a+1,b,b+1)}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('color',new T.Float32BufferAttribute(col,3));geo.setIndex(idx);
  this.el.setObject3D('mesh',new T.Mesh(geo,new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide})))}});
regTint(E('a-entity',{position:'0 -1.15 0','isla-suelo':''}),'#ffffff');

function suavizar(g,w,h){g.save();g.globalCompositeOperation='destination-in';const m=g.createLinearGradient(0,0,w,0);m.addColorStop(0,'rgba(0,0,0,0)');m.addColorStop(.05,'rgba(0,0,0,1)');m.addColorStop(.95,'rgba(0,0,0,1)');m.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=m;g.fillRect(0,0,w,h);g.restore()}
function tipoArbol(q){return q<.26?'copa':q<.38?'sauce':q<.48?'palma':q<.58?'cipres':q<.68?'paraiso':q<.76?'ceibo':q<.82?'lapacho':q<.88?'jacaranda':'cana'}
function arbol(g,x,base,alto,rr,tipo,r,pal,k){
  g.strokeStyle=pal.tronco;g.lineCap='round';g.lineJoin='round';
  const tronco=(wd,xe,ye)=>{g.lineWidth=wd*k;g.beginPath();g.moveTo(x,base);g.lineTo(xe,ye);g.stroke()};
  const blob=(cx,cy,rad,col)=>{g.fillStyle=col;g.beginPath();g.arc(cx,cy,rad,0,7);g.fill()};
  if(tipo==='palma'){
    g.lineWidth=5*k;g.beginPath();g.moveTo(x,base);g.quadraticCurveTo(x+(r()-.5)*20*k,base-alto*.5,x+(r()-.5)*14*k,base-alto);g.stroke();
    const ty=base-alto;g.strokeStyle=pal.hebra;g.lineWidth=3*k;
    for(let i=0;i<11;i++){const an=-Math.PI*(.05+.9*i/10),L=rr*1.5*(.8+r()*.4);g.beginPath();g.moveTo(x,ty);g.quadraticCurveTo(x+Math.cos(an)*L*.6,ty+Math.sin(an)*L*.9-L*.1,x+Math.cos(an)*L,ty+Math.sin(an)*L*.5+L*.35);g.stroke()}
  }else if(tipo==='cipres'){
    tronco(3,x,base-alto*.2);g.fillStyle=pal.copa;g.beginPath();g.ellipse(x,base-alto*.58,rr*.5,alto*.42,0,0,7);g.fill();
    g.fillStyle=pal.luz;g.beginPath();g.ellipse(x-rr*.12,base-alto*.62,rr*.22,alto*.3,0,0,7);g.fill();
  }else if(tipo==='paraiso'){
    tronco(5,x+(r()-.5)*6*k,base-alto+rr*.5);g.lineWidth=3*k;[-1,1].forEach(sg=>{g.beginPath();g.moveTo(x,base-alto*.6);g.lineTo(x+sg*rr*.9,base-alto+rr*.25);g.stroke()});
    g.fillStyle=pal.copa;g.beginPath();g.ellipse(x,base-alto,rr*1.55,rr*.5,0,0,7);g.fill();
    g.fillStyle=pal.luz;g.beginPath();g.ellipse(x-rr*.2,base-alto-rr*.12,rr*.9,rr*.26,0,0,7);g.fill();
  }else if(tipo==='cana'){
    for(let i=0;i<7;i++){const bx=x+(i-3)*5*k,tx=bx+(r()-.5)*28*k,ty=base-alto*(.7+r()*.4);g.strokeStyle='#6f6f3c';g.lineWidth=2.2*k;g.beginPath();g.moveTo(bx,base);g.quadraticCurveTo(bx+(tx-bx)*.3,base-alto*.5,tx,ty);g.stroke();
      g.fillStyle=pal.hebra;for(let j=0;j<5;j++){g.beginPath();g.ellipse(tx+(r()-.5)*14*k,ty+j*5*k,9*k,2.5*k,(r()-.5),0,7);g.fill()}}
  }else{
    tronco(4+r()*3,x+(r()-.5)*8*k,base-alto+rr*.4);
    let c1=pal.copa,c2=pal.luz;if(tipo==='lapacho'){c1='#8a4f6c';c2='#c97a9b'}if(tipo==='jacaranda'){c1='#5b4f86';c2='#8478b4'}
    [[0,0,1],[-.7,.35,.7],[.75,.3,.75]].forEach(c=>blob(x+c[0]*rr,base-alto+c[1]*rr,rr*c[2],c1));blob(x-rr*.25,base-alto-rr*.3,rr*.5,c2);
    if(tipo==='ceibo'){g.fillStyle='#c9402b';for(let i=0;i<16;i++){const a=r()*6.28,d=r()*rr*.9;g.beginPath();g.arc(x+Math.cos(a)*d,base-alto+Math.sin(a)*d*.8-rr*.1,(2+r()*2.5)*k,0,7);g.fill()}}
    if(tipo==='sauce'){g.strokeStyle=pal.hebra;g.lineWidth=2*k;for(let i=0;i<26;i++){const hx=x+(r()-.5)*rr*2.2,hy=base-alto+rr*.2,l=rr*(.7+r()*1.1);g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo(hx+(r()-.5)*8*k,hy+l*.6,hx+(r()-.5)*10*k,hy+l);g.stroke()}}
  }}
function arboleda(w,h,pal,seed,solido,hMin,hMax,rMin,rMax,paso,suave){const k=w/2048;return lienzo(w,h,g=>{const r=R(seed),lista=[];
  for(let x=0;x<w;x+=paso*k*(.5+r()))lista.push({x:x,q:r(),al:(hMin+r()*(hMax-hMin))*k,rr:(rMin+r()*(rMax-rMin))*k,sd:Math.floor(r()*1e6)+1});
  if(solido){g.fillStyle=pal.copa;g.fillRect(0,h-hMin*.6*k,w,hMin*.6*k-3)}
  lista.forEach(t=>[0,-w,w].forEach(off=>{const xx=t.x+off;if(xx>-120*k&&xx<w+120*k)arbol(g,xx,h-3,t.al,t.rr,tipoArbol(t.q),R(t.sd),pal,k)}));
  g.globalCompositeOperation='source-atop';const v=g.createLinearGradient(0,h-120*k,0,h);v.addColorStop(0,'rgba(255,170,120,0)');v.addColorStop(1,'rgba(255,170,120,.3)');g.fillStyle=v;g.fillRect(0,h-120*k,w,120*k-3);g.globalCompositeOperation='source-over';
  if(suave)suavizar(g,w,h)})}
const PAL={
 front:{copa:'#2b4130',luz:'#3d5a3a',tronco:'#2e2a22',hebra:'#5d7f45'},
 mid:{copa:'#33493a',luz:'#445f46',tronco:'#2a2c26',hebra:'#587a52'},
 back:{copa:'#46605a',luz:'#58746a',tronco:'#34413c',hebra:'#6a8878'},
 far1:{copa:'#5c6f78',luz:'#6e8390',tronco:'#4a5a62',hebra:'#7f95a0'},
 far2:{copa:'#7a7f96',luz:'#8a90a6',tronco:'#646a82',hebra:'#9098b0'}};
const JUNCOS=lienzo(2048,128,(g,w,h)=>{const r=R(61);g.lineCap='round';
  for(let i=0;i<1800;i++){const x=r()*w,a=10+r()*16,inc=(r()-.5)*14;g.strokeStyle=['#7d9150','#5f7d40','#92a05c','#4d6b37'][Math.floor(r()*4)];g.lineWidth=1.5+r()*1.5;g.beginPath();g.moveTo(x,h-3);g.quadraticCurveTo(x+inc*.4,h-a*.6,x+inc,h-a);g.stroke()}
  for(let i=0;i<90;i++){const x=r()*w,a=14+r()*10;g.fillStyle='#5b3f24';g.fillRect(x-2,h-a-10,4,12)}suavizar(g,w,h)});
function capaArb(r,tex,a0,a1,rep,tint){const arco=r*(a1-a0)*Math.PI/180,alto=tex.height*(arco/rep)/tex.width;
  regTint(E('a-cylinder',{radius:r,height:alto,position:`0 ${-1.1+alto/2} 0`,'open-ended':true,'theta-start':a0,'theta-length':a1-a0}),tint||'#ffffff').setAttribute('material',{shader:'flat',transparent:true,src:tex,repeat:`${rep} 1`,side:'back',alphaTest:.05,color:tint||'#ffffff'})}
/* islas lejanas, cada vez más veladas, para que la costa llegue hasta el horizonte */
capaArb(250,arboleda(2048,256,PAL.far2,27,true,70,140,22,40,28,false),0,360,4,'#ffffff');
capaArb(190,arboleda(2048,256,PAL.far1,21,true,70,140,22,40,28,false),0,360,3,'#ffffff');
/* isla principal */
capaArb(130,arboleda(4096,512,PAL.back,3,true,70,140,22,40,26,true),ARC0,ARC1,1,'#f2dcd0');
capaArb(95,arboleda(4096,512,PAL.mid,8,true,60,128,20,38,24,true),ARC0,ARC1,1,'#ebd8cc');
capaArb(70,arboleda(4096,512,PAL.front,13,false,56,130,20,38,22,true),ARC0,ARC1,1,'#e2d2c8');
capaArb(66,JUNCOS,ARC0,ARC1,1,'#e6d6c4');
/* camalotes flotando y bancos de arena */
{const r=R(9);
 for(let i=0;i<80;i++){const a=ARC0+r()*ARC,t=a*Math.PI/180,rr=20+r()*(orilla(a)-27),rad=.6+r()*2.2,g=Math.floor(80+r()*45),col=`rgb(${Math.floor(45+r()*30)},${g},${Math.floor(40+r()*25)})`;
   regTint(E('a-circle',{radius:rad,position:`${rr*Math.sin(t)} -1.19 ${rr*Math.cos(t)}`,rotation:'-90 0 0',scale:'1 .6 1'}),col).setAttribute('material',{shader:'flat',color:col})}
 [[120,34,6],[152,28,8],[186,40,5],[216,31,7],[250,36,6]].forEach(b=>{const t=b[0]*Math.PI/180,x=b[1]*Math.sin(t),z=b[1]*Math.cos(t);
   regTint(E('a-circle',{radius:b[2],position:`${x} -1.17 ${z}`,rotation:'-90 0 0',scale:'1 .55 1'}),'#b3a37e').setAttribute('material',{shader:'flat',color:'#b3a37e'});
   for(let j=0;j<7;j++)regTint(E('a-cylinder',{radius:.04,height:1.3+r()*.9,position:`${x+(r()-.5)*b[2]*1.3} -.5 ${z+(r()-.5)*b[2]*.8}`,color:'#5f7a3a'}),'#5f7a3a');
   regTint(E('a-sphere',{radius:1.1,position:`${x+1} -.4 ${z}`,scale:'1.4 .8 1'}),'#3b5430').setAttribute('material',{shader:'flat',color:'#3b5430'})})}
/* canoa artesanal del Paraná (cachiveo) y pescador de alta densidad poligonal en Three.js */
{const T=AFRAME.THREE;
 const tex=(cv,rx=1,ry=1)=>{const t=new T.CanvasTexture(cv);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx,ry);if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;else t.encoding=T.sRGBEncoding;return t};
 /* Texturas procedurales en <canvas> (sin dependencias externas) */
 const MADERA_OSCURA=tex(lienzo(512,512,(g,w,h)=>{
   g.fillStyle='#4a2c19';g.fillRect(0,0,w,h);const r=R(73);
   for(let y=0;y<h;y+=64){
     g.fillStyle=`rgba(26,14,7,${.22+r()*.18})`;g.fillRect(0,y,w,3);
     g.fillStyle=`rgba(95,62,38,${.10+r()*.12})`;g.fillRect(0,y+3,w,3);
     for(let i=0;i<36;i++){
       g.strokeStyle=`rgba(${r()>.45?'112,72,42':'28,15,7'},${.10+r()*.16})`;g.lineWidth=.8+r()*1.8;
       const yy=y+5+r()*54;g.beginPath();g.moveTo(0,yy);g.bezierCurveTo(w*.33,yy+(r()-.5)*6,w*.66,yy+(r()-.5)*6,w,yy);g.stroke()
     }
     for(let k=0;k<3;k++){const kx=r()*w,ky=y+16+r()*32;g.strokeStyle='rgba(32,17,8,.22)';g.lineWidth=1.2;for(let a=1;a<5;a++){g.beginPath();g.ellipse(kx,ky,a*5,a*2.2,(r()-.5)*.2,0,7);g.stroke()}}
   }
   for(let i=0;i<1600;i++){g.fillStyle=`rgba(${r()>.5?'150,120,90':'20,12,6'},${r()*.08})`;g.fillRect(r()*w,r()*h,2+r()*6,1.5)}
 }),2,1);
 const MADERA_CLARA=tex(lienzo(256,256,(g,w,h)=>{
   g.fillStyle='#78502e';g.fillRect(0,0,w,h);const r=R(91);
   for(let i=0;i<90;i++){g.strokeStyle=`rgba(${r()>.5?'148,104,64':'48,28,14'},${.1+r()*.14})`;g.lineWidth=.8+r()*1.6;const y=r()*h;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(w*.3,y+(r()-.5)*5,w*.7,y+(r()-.5)*5,w,y);g.stroke()}
 }),2,1);
 const SOGA_TEX=tex(lienzo(128,128,(g,w,h)=>{
   g.fillStyle='#ab8d5c';g.fillRect(0,0,w,h);g.strokeStyle='#6e542e';g.lineWidth=5;
   for(let i=-w;i<w*2;i+=14){g.beginPath();g.moveTo(i,0);g.lineTo(i+w,h);g.stroke()}
   g.strokeStyle='rgba(225,202,155,.35)';g.lineWidth=2;
   for(let i=-w;i<w*2;i+=14){g.beginPath();g.moveTo(i+4,0);g.lineTo(i+w+4,h);g.stroke()}
 }),16,2);
 const CAMISA_TEX=tex(lienzo(256,256,(g,w,h)=>{
   g.fillStyle='#7b97a6';g.fillRect(0,0,w,h);const r=R(19);
   for(let i=0;i<w;i+=4){g.fillStyle='rgba(255,255,255,.04)';g.fillRect(i,0,1,h);g.fillRect(0,i,w,1)}
   for(let i=0;i<900;i++){g.fillStyle=`rgba(${r()>.5?'210,220,225':'45,60,70'},.05)`;g.fillRect(r()*w,r()*h,3,3)}
 }),2,2);
 const PANTALON_TEX=tex(lienzo(256,256,(g,w,h)=>{
   g.fillStyle='#2f363e';g.fillRect(0,0,w,h);const r=R(29);
   for(let i=0;i<w;i+=3){g.fillStyle='rgba(255,255,255,.03)';g.fillRect(i,0,1,h)}
   for(let i=0;i<800;i++){g.fillStyle=`rgba(${r()>.5?'90,100,110':'18,22,26'},.07)`;g.fillRect(r()*w,r()*h,2,2)}
 }),2,2);
 const PAJA_TEX=tex(lienzo(256,256,(g,w,h)=>{
   g.fillStyle='#d4b26a';g.fillRect(0,0,w,h);const r=R(53);
   for(let y=0;y<h;y+=6){g.strokeStyle=y%12?'#b59048':'#e4c784';g.lineWidth=2;g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
   for(let i=0;i<400;i++){g.fillStyle='rgba(95,70,28,.12)';g.fillRect(r()*w,r()*h,8,1.5)}
 }),4,4);

 /* Curvas paramétricas del cachiveo (L=4.2m, angosto, proa y popa afiladas y elevadas) */
 const CACHIVEO={
   L:4.2,
   w:t=>.33*Math.pow(Math.max(0,1-t*t),.78)+.003,
   yt:t=>.17+.05*t*t+.17*Math.pow(t,4),
   yb:t=>-.075+.03*t*t+.315*Math.pow(t,6),
   pow:t=>1.65-.65*t*t,
   y(t,f){return this.yb(t)+(this.yt(t)-this.yb(t))*(1-Math.pow(Math.sin(f),this.pow(t)))},
   z(t,f){const c=Math.cos(f);return -this.w(t)*Math.sign(c)*Math.pow(Math.abs(c),.92)},
   zEn(t,y){
     const yt=this.yt(t),yb=this.yb(t),u=Math.min(1,Math.max(0,(yt-y)/Math.max(.001,yt-yb)));
     const s=Math.pow(u,1/this.pow(t)),c=Math.sqrt(Math.max(0,1-s*s));
     return this.w(t)*Math.pow(c,.92);
   }
 };

 AFRAME.registerComponent('canoa-pescador',{
   init(){
     const matCasco=new T.MeshStandardMaterial({map:MADERA_OSCURA,roughness:.85,metalness:.03,side:T.DoubleSide});
     const matMadera=new T.MeshStandardMaterial({map:MADERA_CLARA,roughness:.85,metalness:.03});
     const matOsc=new T.MeshStandardMaterial({color:'#321d10',roughness:.88,metalness:.04});
     const matSoga=new T.MeshStandardMaterial({map:SOGA_TEX,roughness:.92});
     const matPiel=new T.MeshStandardMaterial({color:'#b87e58',roughness:.72,metalness:.02});
     const matCamisa=new T.MeshStandardMaterial({map:CAMISA_TEX,roughness:.88});
     const matPantalon=new T.MeshStandardMaterial({map:PANTALON_TEX,roughness:.9});
     const matBota=new T.MeshStandardMaterial({color:'#382518',roughness:.82});
     const matSuela=new T.MeshStandardMaterial({color:'#1d140e',roughness:.95});
     const matPaja=new T.MeshStandardMaterial({map:PAJA_TEX,roughness:.9,side:T.DoubleSide});
     const matCinta=new T.MeshStandardMaterial({color:'#3b2316',roughness:.85});
     const matMetal=new T.MeshStandardMaterial({color:'#8b9298',roughness:.35,metalness:.75});
     const matCorcho=new T.MeshStandardMaterial({color:'#b48a58',roughness:.9});
     const matCana=new T.MeshStandardMaterial({color:'#463423',roughness:.55,metalness:.1});

     const root=new T.Group(),canoa=new T.Group();
     root.add(canoa);
     this.canoa=canoa;

     const tubo=(pts,r,sL=32,sR=16,mat=matMadera)=>{
       const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts),sL,r,sR,false);
       g.computeVertexNormals();
       return new T.Mesh(g,mat);
     };
     const torno=(prof,sR=36,mat=matPiel)=>{
       const g=new T.LatheGeometry(prof.map(([r,y])=>new T.Vector2(r,y)),sR);
       g.computeVertexNormals();
       return new T.Mesh(g,mat);
     };

     /* 1. Casco exterior con 4 tablones superpuestos en relieve por banda (72x32 segs) */
     const NL=72,NT=4,SP=8,HL=CACHIVEO.L/2;
     {const pos=[],uv=[],idx=[];let v=0;
      for(let band=-1;band<=1;band+=2){
        for(let tr=0;tr<NT;tr++){
          const f0=band>0?Math.PI/2*(1-tr/NT):Math.PI/2*(1+tr/NT);
          const f1=band>0?Math.PI/2*(1-(tr+1)/NT):Math.PI/2*(1+(tr+1)/NT);
          const base=v;
          for(let i=0;i<=NL;i++){
            const t=i/NL*2-1,x=t*HL,endFade=Math.pow(Math.max(0,1-t*t),.45);
            for(let s=0;s<=SP;s++){
              const u=s/SP,f=f0+(f1-f0)*u;
              const lap=(.010*(1-u)+.002)*endFade;
              const y=CACHIVEO.y(t,f)-lap*.22*Math.sin(f);
              const z=CACHIVEO.z(t,f)-band*lap*Math.abs(Math.cos(f));
              pos.push(x,y,z);uv.push(i/NL*4,(tr+u)/NT);v++;
            }
          }
          for(let i=0;i<NL;i++)for(let s=0;s<SP;s++){
            const a=base+i*(SP+1)+s,b=a+(SP+1);
            if(band>0)idx.push(a,b,a+1,a+1,b,b+1);else idx.push(a,a+1,b,a+1,b+1,b);
          }
        }
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
      canoa.add(new T.Mesh(g,matCasco));
     }

     /* Casco interior suavizado (72x28 segs) para espesor real */
     {const NR=28,pos=[],uv=[],idx=[];
      for(let i=0;i<=NL;i++){
        const t=i/NL*2-1,x=t*HL,fade=Math.pow(Math.max(0,1-t*t),.4);
        for(let k=0;k<=NR;k++){
          const f=Math.PI*k/NR,s=Math.sin(f),c=Math.cos(f);
          const y=CACHIVEO.y(t,f)+.011*fade*s,z=CACHIVEO.z(t,f)*.96;
          pos.push(x,y,z);uv.push(i/NL*4,k/NR);
        }
      }
      for(let i=0;i<NL;i++)for(let k=0;k<NR;k++){const a=i*(NR+1)+k,b=a+(NR+1);idx.push(a,b,a+1,a+1,b,b+1)}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
      canoa.add(new T.Mesh(g,matCasco));
     }

     /* Bordas (regalas), quilla y remates afilados de proa/popa */
     [-1,1].forEach(sg=>{
       const pts=[];for(let i=0;i<=36;i++){const t=i/36*2-1;pts.push(new T.Vector3(t*HL,CACHIVEO.yt(t)+.006,sg*CACHIVEO.w(t)*.99))}
       canoa.add(tubo(pts,.016,72,14,matOsc));
       canoa.add(tubo([new T.Vector3(sg*(HL-.08),CACHIVEO.yb(.96),0),new T.Vector3(sg*(HL+.01),CACHIVEO.yt(1)+.03,0)],.018,16,14,matOsc));
     });
     {const qPts=[];for(let i=0;i<=36;i++){const t=-.98+1.96*i/36;qPts.push(new T.Vector3(t*HL,CACHIVEO.yb(t)-.008,0))}
      canoa.add(tubo(qPts,.014,64,12,matOsc))}

     /* 2. Interior: 6 cuadernas curvas en U, emjaretado y 3 bancadas transversales */
     [-1.28,-.78,-.30,.20,.70,1.20].forEach(x=>{
       const t=x/HL,pts=[];
       for(let k=0;k<=20;k++){const f=.14+k/20*(Math.PI-.28);pts.push(new T.Vector3(x,CACHIVEO.y(t,f)+.012*Math.sin(f),CACHIVEO.z(t,f)*.92))}
       canoa.add(tubo(pts,.015,28,12,matMadera));
     });
     [-.09,0,.09].forEach(z=>{
       const sl=new T.Mesh(new T.BoxGeometry(1.55,.014,.052,16,1,2),matMadera);
       sl.position.set(-.05,-.038,z);canoa.add(sl);
     });
     [[-1.08,.172,.20],[-.32,.158,.24],[.78,.165,.20]].forEach(([x,y,an])=>{
       const hz=CACHIVEO.zEn(x/HL,y)-.006;
       const ban=new T.Mesh(new T.BoxGeometry(an,.024,2*hz,4,2,12),matMadera);
       ban.position.set(x,y,0);canoa.add(ban);
       [-1,1].forEach(sg=>{
         const cl=new T.Mesh(new T.BoxGeometry(an*.92,.024,.026),matOsc);
         cl.position.set(x,y-.02,sg*(CACHIVEO.zEn(x/HL,y-.02)-.015));canoa.add(cl);
       });
     });

     /* Tacos y toletes en las bordas */
     [-1,1].forEach(sg=>{
       const x=.22,t=x/HL,y=CACHIVEO.yt(t)+.01,z=sg*CACHIVEO.w(t)*.98;
       const taco=new T.Mesh(new T.BoxGeometry(.16,.024,.044),matOsc);
       taco.position.set(x,y,z);canoa.add(taco);
       [-.048,.048].forEach(dx=>{
         const tol=torno([[0,0],[.011,0],[.010,.055],[.013,.075],[.008,.092],[0,.096]],24,matMadera);
         tol.position.set(x+dx,y+.008,z);canoa.add(tol);
       });
     });

     /* Soga enroscada en proa */
     {const sPts=[];
      for(let i=0;i<=84;i++){
        const u=i/84,ang=u*Math.PI*6.6,rad=.032+.076*u;
        sPts.push(new T.Vector3(1.38+Math.cos(ang)*rad,.002+.008*(1-u),Math.sin(ang)*rad));
      }
      sPts.push(new T.Vector3(1.64,.09,0),new T.Vector3(1.94,.30,0));
      canoa.add(tubo(sPts,.010,120,12,matSoga));
     }

     /* Remo largo de madera apoyado diagonalmente dentro del casco */
     {const pA=new T.Vector3(-1.42,.245,-.20),pB=new T.Vector3(.82,.182,-.21);
      const dir=new T.Vector3().subVectors(pB,pA),len=dir.length();
      const remoGrp=new T.Group();
      remoGrp.position.copy(pA).addScaledVector(dir,.5);
      remoGrp.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.clone().normalize());
      const mango=torno([[0,-len*.5],[.020,-len*.5],[.014,-len*.46],[.015,len*.18],[.019,len*.22],[0,len*.22]],32,matMadera);
      remoGrp.add(mango);
      const pala=new T.Mesh(new T.BoxGeometry(.115,len*.30,.016,6,12,2),matMadera);
      pala.position.set(0,len*.34,0);remoGrp.add(pala);
      const punta=new T.Mesh(new T.CylinderGeometry(.0575,.0575,.016,24),matMadera);
      punta.rotation.x=Math.PI/2;punta.scale.set(1,.45,1);punta.position.set(0,len*.49,0);remoGrp.add(punta);
      canoa.add(remoGrp);
     }

     /* 3. Pescador anatómico de alta subdivisión sentado en la bancada */
     const pescador=new T.Group();
     pescador.position.set(-.32,.17,0);
     pescador.rotation.y=-.26;
     canoa.add(pescador);

     const pelvis=torno([[0,0],[.125,0],[.138,.055],[.118,.11],[0,.12]],36,matPantalon);
     pelvis.scale.set(.85,1,1.15);pescador.add(pelvis);

     /* Piernas flexionadas con pantalón arremangado y botas en el piso */
     [-1,1].forEach(sg=>{
       const cad=new T.Vector3(.02,.055,sg*.095),rod=new T.Vector3(.35,.065,sg*.105),tob=new T.Vector3(.43,-.165,sg*.105);
       pescador.add(tubo([cad,new T.Vector3(.18,.07,sg*.10),rod],.064,28,32,matPantalon));
       const doblez=torno([[.058,-.025],[.072,-.025],[.073,.025],[.058,.025]],32,matPantalon);
       doblez.position.copy(rod);doblez.rotation.z=-Math.PI/2;pescador.add(doblez);
       const pant=torno([[0,-.23],[.035,-.23],[.041,-.15],[.052,-.07],[.049,0]],32,matPiel);
       pant.position.copy(rod);pant.rotation.z=.33;pescador.add(pant);
       const botaC=torno([[0,0],[.046,0],[.048,.075],[.045,.085],[0,.085]],32,matBota);
       botaC.position.set(tob.x,tob.y-.035,tob.z);pescador.add(botaC);
       const pie=tubo([new T.Vector3(tob.x-.01,tob.y-.015,tob.z),new T.Vector3(tob.x+.08,tob.y-.02,tob.z),new T.Vector3(tob.x+.14,tob.y-.022,tob.z)],.042,20,32,matBota);
       pie.scale.set(1,.72,1);pescador.add(pie);
       const suela=new T.Mesh(new T.BoxGeometry(.18,.014,.082,4,1,4),matSuela);
       suela.position.set(tob.x+.065,tob.y-.038,tob.z);pescador.add(suela);
     });

     /* Torso inclinado hacia adelante + camisa arremangada */
     const torsoGrp=new T.Group();
     torsoGrp.position.set(0,.08,0);
     torsoGrp.rotation.set(0,-.20,-.24);
     pescador.add(torsoGrp);
     this.torsoGrp=torsoGrp;

     const torso=torno([[0,0],[.118,0],[.116,.11],[.138,.26],[.152,.39],[.125,.455],[.058,.47],[0,.47]],36,matCamisa);
     torso.scale.set(.78,1,1.12);torsoGrp.add(torso);
     const cuello=torno([[0,0],[.052,0],[.046,.05],[.047,.095],[0,.095]],32,matPiel);
     cuello.position.set(.005,.455,0);torsoGrp.add(cuello);

     /* Cabeza con rasgos esculpidos (mentón, nariz, orejas) y sombrero de paja */
     const cabGrp=new T.Group();
     cabGrp.position.set(.02,.565,0);
     cabGrp.rotation.set(0,-.12,-.10);
     torsoGrp.add(cabGrp);

     const craneo=torno([[0,-.065],[.042,-.06],[.078,-.025],[.088,.025],[.086,.075],[.064,.118],[0,.13]],40,matPiel);
     craneo.scale.set(1.06,1,.92);cabGrp.add(craneo);
     const menton=torno([[0,-.03],[.036,-.025],[.044,.01],[.025,.035],[0,.04]],32,matPiel);
     menton.position.set(.056,-.042,0);menton.rotation.z=-.35;cabGrp.add(menton);
     const nariz=tubo([new T.Vector3(.082,.038,0),new T.Vector3(.104,.012,0),new T.Vector3(.095,-.006,0)],.013,16,24,matPiel);
     cabGrp.add(nariz);
     [-1,1].forEach(sg=>{
       const oreja=tubo([new T.Vector3(-.005,.035,sg*.078),new T.Vector3(-.018,.022,sg*.088),new T.Vector3(-.014,-.004,sg*.084),new T.Vector3(.002,-.008,sg*.076)],.010,18,20,matPiel);
       cabGrp.add(oreja);
       const ceja=tubo([new T.Vector3(.076,.042,sg*.016),new T.Vector3(.074,.044,sg*.046)],.008,10,16,matPiel);
       cabGrp.add(ceja);
     });

     /* Sombrero de ala ancha con copa y cinta */
     const somb=torno([[.001,.115],[.065,.118],[.088,.112],[.094,.045],[.098,.012],[.175,-.006],[.245,-.024]],48,matPaja);
     somb.position.set(-.004,.055,0);somb.rotation.z=.05;cabGrp.add(somb);
     const cinta=torno([[.091,.014],[.098,.014],[.096,.042],[.091,.042]],48,matCinta);
     cinta.position.copy(somb.position);cinta.rotation.copy(somb.rotation);cabGrp.add(cinta);

     /* Mangas arremangadas */
     [-1,1].forEach(sg=>{
       const mGrp=new T.Group();
       mGrp.position.set(.01,.40,sg*.155);
       mGrp.rotation.set(sg>0?-.22:.24,0,.52);
       const manga=torno([[0,-.14],[.044,-.14],[.046,-.02],[.054,0],[0,0]],32,matCamisa);
       const puno=torno([[.042,-.155],[.052,-.155],[.053,-.13],[.042,-.13]],32,matCamisa);
       mGrp.add(manga,puno);torsoGrp.add(mGrp);
     });

     /* Brazos, manos con dedos, caña arqueada (CatmullRomCurve3 + TubeGeometry) y reel */
     const brazosGrp=new T.Group();
     brazosGrp.position.set(.01,.40,0);
     torsoGrp.add(brazosGrp);
     this.brazosGrp=brazosGrp;

     const manoD=new T.Vector3(.21,-.17,.14),manoI=new T.Vector3(.25,-.13,.31);
     brazosGrp.add(tubo([new T.Vector3(0,-.02,.155),new T.Vector3(.08,-.16,.24),manoD],.034,28,32,matPiel));
     brazosGrp.add(tubo([new T.Vector3(0,-.02,-.155),new T.Vector3(.17,-.18,.02),manoI],.034,28,32,matPiel));

     const hacerMano=(pos,dir)=>{
       const g=new T.Group();g.position.copy(pos);
       g.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),dir.clone().normalize());
       const palma=torno([[0,-.028],[.024,-.028],[.026,.022],[0,.028]],24,matPiel);
       palma.rotation.z=Math.PI/2;palma.scale.set(1,1,.65);g.add(palma);
       [-.019,-.006,.007,.020].forEach(ox=>{
         g.add(tubo([new T.Vector3(ox,.018,-.008),new T.Vector3(ox,.026,.016),new T.Vector3(ox,.004,.025),new T.Vector3(ox,-.014,.014)],.0065,12,16,matPiel));
       });
       g.add(tubo([new T.Vector3(-.022,.005,-.016),new T.Vector3(-.014,-.014,-.022),new T.Vector3(.004,-.022,-.008)],.0075,10,16,matPiel));
       brazosGrp.add(g);
     };

     /* Caña larga arqueada + empuñadura de corcho + reel */
     const p0=new T.Vector3(.18,-.20,.02),p1=new T.Vector3(.26,-.12,.33),p2=new T.Vector3(.50,.18,.92),p3=new T.Vector3(.76,.46,1.56),p4=new T.Vector3(.96,.48,2.10);
     hacerMano(manoD,new T.Vector3().subVectors(p1,p0));hacerMano(manoI,new T.Vector3().subVectors(p2,p1));
     const curvaCana=new T.CatmullRomCurve3([p0,p1,p2,p3,p4]);
     const canaGeo=new T.TubeGeometry(curvaCana,64,.008,24,false);
     const cp=canaGeo.attributes.position,tv=new T.Vector3(),cvP=new T.Vector3();
     for(let i=0;i<=64;i++){
       const u=i/64,sc=1.25-.92*u;curvaCana.getPointAt(u,cvP);
       for(let k=0;k<=24;k++){
         const idx=i*25+k;tv.fromBufferAttribute(cp,idx).sub(cvP).multiplyScalar(sc).add(cvP);
         cp.setXYZ(idx,tv.x,tv.y,tv.z);
       }
     }
     canaGeo.computeVertexNormals();
     brazosGrp.add(new T.Mesh(canaGeo,matCana));

     const mangoCana=torno([[0,0],[.015,0],[.016,.34],[.013,.36],[0,.36]],32,matCorcho);
     mangoCana.position.copy(p0);mangoCana.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3().subVectors(p1,p0).normalize());
     brazosGrp.add(mangoCana);

     const reelGrp=new T.Group();
     reelGrp.position.set(.23,-.16,.24);
     const carrete=torno([[0,-.024],[.028,-.024],[.020,-.016],[.020,.016],[.028,.024],[0,.024]],32,matMetal);
     carrete.rotation.z=Math.PI/2;reelGrp.add(carrete);
     const pieR=new T.Mesh(new T.BoxGeometry(.012,.042,.018),matMetal);pieR.position.set(0,.022,0);reelGrp.add(pieR);
     const maniv=tubo([new T.Vector3(.028,0,0),new T.Vector3(.042,0,0),new T.Vector3(.042,.034,0)],.004,10,12,matMetal);
     reelGrp.add(maniv);brazosGrp.add(reelGrp);

     const tipMarker=new T.Object3D();tipMarker.position.copy(p4);brazosGrp.add(tipMarker);
     this.tipMarker=tipMarker;this.root=root;

     /* Boya flotando en el agua y línea tensa (THREE.Line) alineadas bajo la punta de la caña */
     root.updateMatrixWorld(true);
     const tipIni=new T.Vector3();tipMarker.getWorldPosition(tipIni);root.worldToLocal(tipIni);
     this.boyaBase={x:tipIni.x,z:tipIni.z};

     const boya=torno([[0,0],[.024,0],[.022,.024],[.006,.044],[.004,.065],[0,.068]],32,new T.MeshStandardMaterial({color:'#d8402f',roughness:.45}));
     boya.add(torno([[0,-.042],[.005,-.038],[.008,-.018],[.024,0],[0,0]],32,new T.MeshStandardMaterial({color:'#f2f0ea',roughness:.5})));
     boya.position.set(tipIni.x,-.013,tipIni.z);
     root.add(boya);this.boya=boya;

     const lineGeo=new T.BufferGeometry().setFromPoints([tipIni,new T.Vector3(tipIni.x,-.013,tipIni.z),new T.Vector3(tipIni.x,-.12,tipIni.z)]);
     this.lineGeo=lineGeo;
     root.add(new T.Line(lineGeo,new T.LineBasicMaterial({color:'#eaf2f6',transparent:true,opacity:.78})));

     const ondaGeo=new T.RingGeometry(.09,.11,36);ondaGeo.rotateX(-Math.PI/2);
     const ondaMesh=new T.Mesh(ondaGeo,new T.MeshBasicMaterial({color:'#ffe8c8',transparent:true,opacity:.42,depthWrite:false}));
     ondaMesh.position.set(tipIni.x,-.009,tipIni.z);
     root.add(ondaMesh);this.ondaMesh=ondaMesh;

     /* Farol cálido en la proa de la canoa para visibilidad nocturna */
     const farolGrp=new T.Group();
     farolGrp.position.set(1.22,.16,.19);
     farolGrp.add(tubo([new T.Vector3(0,-.04,0),new T.Vector3(.02,.32,0),new T.Vector3(.06,.34,-.03)],.011,16,12,matOsc));
     const fBase=torno([[0,0],[.032,0],[.030,.022],[.020,.028],[0,.028]],24,matOsc);
     fBase.position.set(.06,.21,-.03);farolGrp.add(fBase);
     const farolMat=new T.MeshBasicMaterial({color:'#c8b490'});
     const fVidrio=torno([[.020,.028],[.028,.055],[.025,.092],[.018,.105],[0,.105]],24,farolMat);
     fVidrio.position.set(.06,.21,-.03);farolGrp.add(fVidrio);
     const fTecho=torno([[0,.105],[.034,.105],[.022,.128],[.008,.142],[0,.145]],24,matOsc);
     fTecho.position.set(.06,.21,-.03);farolGrp.add(fTecho);
     const farolLuz=new T.PointLight('#ffaa50',0,18,1.4);
     farolLuz.position.set(.06,.28,-.03);farolGrp.add(farolLuz);
     canoa.add(farolGrp);
     window.__farolCanoa={luz:farolLuz,mat:farolMat};

     /* Cartel interactivo flotante para indicar que se puede hacer clic para jugar */
     const badgeTex=tex(lienzo(512,176,(g,w,h)=>{
       g.fillStyle='rgba(22,28,32,.92)';
       g.beginPath();g.roundRect(8,8,w-16,h-16,24);g.fill();
       g.strokeStyle='#c9a45c';g.lineWidth=6;g.stroke();
       /* Medallón con ícono de mando */
       g.fillStyle='#c9a45c';g.beginPath();g.arc(82,h/2,44,0,7);g.fill();
       g.fillStyle='#1d2428';g.beginPath();g.roundRect(56,h/2-16,52,32,12);g.fill();
       g.fillStyle='#c9a45c';g.fillRect(66,h/2-3,14,6);g.fillRect(70,h/2-7,6,14);
       g.beginPath();g.arc(92,h/2-4,3.5,0,7);g.arc(99,h/2+4,3.5,0,7);g.fill();
       /* Texto */
       g.textAlign='left';g.fillStyle='#ffffff';g.font='600 40px Georgia,serif';
       g.fillText('¡Vamos de pesca!',146,76);
       g.fillStyle='#e8c87d';g.font='600 28px Lato,Arial,sans-serif';
       g.fillText('Clic aquí para jugar',146,120);
     }));
     badgeTex.repeat.set(1,1);
     const badgeGrp=new T.Group();
     badgeGrp.position.set(-.15,1.42,0);
     const badgeMat=new T.MeshBasicMaterial({map:badgeTex,transparent:true,side:T.DoubleSide});
     const badgeMesh=new T.Mesh(new T.PlaneGeometry(1.45,.50),badgeMat);
     badgeGrp.add(badgeMesh);
     const haloGeo=new T.RingGeometry(.24,.28,40);
     const haloMesh=new T.Mesh(haloGeo,new T.MeshBasicMaterial({color:'#e8c87d',transparent:true,opacity:.55,side:T.DoubleSide,depthWrite:false}));
     haloMesh.position.set(0,-.34,0);haloMesh.rotation.x=-Math.PI/2;
     badgeGrp.add(haloMesh);
     root.add(badgeGrp);
     this.badgeGrp=badgeGrp;this.haloMesh=haloMesh;this.hovered=false;this.camW=new T.Vector3();

     const aroAgua=new T.Mesh(new T.RingGeometry(1.95,2.06,64).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:'#e8c87d',transparent:true,opacity:.22,depthWrite:false}));
     aroAgua.position.set(0,-.008,0);
     root.add(aroAgua);this.aroAgua=aroAgua;

     this.tipW=new T.Vector3();
     this.el.setObject3D('mesh',root);
   },
   tick(t){
     const s=t*.001;
     /* Balanceo suave sobre el agua y micro-movimiento natural del pescador */
     this.canoa.position.y=Math.sin(s*1.45)*.014+Math.sin(s*2.3)*.004;
     this.canoa.rotation.set(Math.sin(s*1.15+.4)*.022,Math.sin(s*.55)*.008,Math.sin(s*.88)*.014,'YXZ');
     this.torsoGrp.rotation.z=-.24+Math.sin(s*1.65)*.018;
     this.torsoGrp.rotation.y=-.20+Math.sin(s*.95)*.016;
     this.brazosGrp.rotation.x=Math.sin(s*1.9+.7)*.024;
     this.boya.position.y=-.012+Math.sin(s*2.7)*.005;
     this.boya.rotation.z=Math.sin(s*2.1)*.07;
     const ws=1+(s/3%1)*2.2;
     this.ondaMesh.scale.set(ws,1,ws);
     this.ondaMesh.material.opacity=.45*(1-(s/3%1));

     /* Indicador visual interactivo mirando hacia la cámara */
     this.el.object3D.updateMatrixWorld(true);
     this.badgeGrp.position.y=1.42+Math.sin(s*2.4)*.05;
     const scB=(this.hovered?1.12:1)+Math.sin(s*3.6)*.035;
     this.badgeGrp.scale.setScalar(scB);
     const hs=1+(s*1.1%1)*1.3;
     this.haloMesh.scale.set(hs,hs,1);
     this.haloMesh.material.opacity=(this.hovered?.85:.5)*(1-(s*1.1%1));
     this.aroAgua.material.opacity=this.hovered?.55:.18+.08*Math.sin(s*2.4);
     const camEl=document.getElementById('cam');
     if(camEl){camEl.object3D.getWorldPosition(this.camW);this.badgeGrp.lookAt(this.camW.x,this.badgeGrp.getWorldPosition(this.tipW).y,this.camW.z)}

     /* Actualiza la línea tensa desde la punta de la caña hasta la boya */
     this.tipMarker.getWorldPosition(this.tipW);
     this.root.worldToLocal(this.tipW);
     const pos=this.lineGeo.attributes.position;
     pos.setXYZ(0,this.tipW.x,this.tipW.y,this.tipW.z);
     pos.setXYZ(1,this.boya.position.x,this.boya.position.y+.055,this.boya.position.z);
     pos.setXYZ(2,this.boya.position.x,this.boya.position.y-.10,this.boya.position.z);
     pos.needsUpdate=true;
   }
 });

 E('a-entity',{id:'canoa-juego',position:'18.5 -1.18 -1.8',rotation:'0 -25 0',scale:'1.5 1.5 1.5','canoa-pescador':''});
}


/* Ciclo día/noche automático por hora real (amanecer 6:00-8:30, día 8:30-17:30, atardecer 17:30-20:00, noche 20:00-6:00) */
{const T=AFRAME.THREE;
 const KF=[
   {h:0.0,  ze:'#050a18',me:'#0b162e',ho:'#15233c',na:'#0a1120',fog:'#111c30',fn:40,ff:300,ag:'#1d2f40',rf:'#9cb8e8',ro:.38,nb:'#1c2b48',no:.16,is:'#344354',dc:'#8eaee0',di:.28,hs:'#2b426b',hg:'#121822',hi:.36,ia:.38,ip:.88,fa:1.0,noct:1.0,solG:.0},
   {h:5.4,  ze:'#070d20',me:'#101c38',ho:'#1f2a46',na:'#0e1424',fog:'#192238',fn:42,ff:310,ag:'#243849',rf:'#a6c0ea',ro:.34,nb:'#2a3758',no:.18,is:'#3e4c5e',dc:'#96b2de',di:.30,hs:'#354a72',hg:'#161c26',hi:.40,ia:.40,ip:.85,fa:1.0,noct:.92,solG:.05},
   {h:6.25, ze:'#1d3160',me:'#6f5880',ho:'#f0936a',na:'#6e4b4c',fog:'#c98b74',fn:44,ff:345,ag:'#627888',rf:'#ffbe8c',ro:.72,nb:'#f4a278',no:.38,is:'#c99e8e',dc:'#ffb078',di:.55,hs:'#889cc4',hg:'#4e423a',hi:.58,ia:.55,ip:.50,fa:.55,noct:.28,solG:.85},
   {h:7.6,  ze:'#376cb3',me:'#79a4d6',ho:'#ffd9a6',na:'#9a8c82',fog:'#e2ceb4',fn:56,ff:395,ag:'#88a8b8',rf:'#ffe2b4',ro:.55,nb:'#ffe8cc',no:.36,is:'#edd7c2',dc:'#ffe1b8',di:.85,hs:'#c4dcf2',hg:'#696858',hi:.82,ia:.76,ip:.12,fa:.08,noct:0.0,solG:.62},
   {h:8.8,  ze:'#2b6ac2',me:'#6aa4e4',ho:'#cbe6f6',na:'#8eb0c4',fog:'#c9e0ee',fn:72,ff:425,ag:'#7cb0c4',rf:'#ffffff',ro:.28,nb:'#ffffff',no:.32,is:'#f6f6f2',dc:'#fff5e4',di:.98,hs:'#d4ebff',hg:'#6e7862',hi:.92,ia:.82,ip:.0,fa:0.0,noct:0.0,solG:.36},
   {h:13.0, ze:'#2362be',me:'#65a2e6',ho:'#cce7f8',na:'#90b4c8',fog:'#cae2f0',fn:78,ff:435,ag:'#74acc2',rf:'#ffffff',ro:.22,nb:'#ffffff',no:.30,is:'#ffffff',dc:'#fff9ee',di:1.08,hs:'#dcf0ff',hg:'#727c64',hi:.96,ia:.84,ip:.0,fa:0.0,noct:0.0,solG:.30},
   {h:17.2, ze:'#305ea4',me:'#7898c8',ho:'#f2cb9e',na:'#968478',fog:'#d8c0a8',fn:60,ff:390,ag:'#8aa6b4',rf:'#ffdaa4',ro:.45,nb:'#ffe2be',no:.34,is:'#f0d8c4',dc:'#ffddb0',di:.84,hs:'#bed4ec',hg:'#62584a',hi:.78,ia:.74,ip:.18,fa:.15,noct:0.0,solG:.55},
   {h:18.75,ze:'#2f3f78',me:'#b77f9c',ho:'#ffbe82',na:'#7a5a58',fog:'#e0a382',fn:48,ff:350,ag:'#bcc6d2',rf:'#ffc68a',ro:.92,nb:'#ffc094',no:.42,is:'#e6bca4',dc:'#ffb07a',di:.66,hs:'#d6a08b',hg:'#4c423a',hi:.62,ia:.58,ip:.58,fa:.70,noct:.15,solG:.95},
   {h:19.8, ze:'#101a36',me:'#28345a',ho:'#7a5064',na:'#302938',fog:'#36354c',fn:42,ff:320,ag:'#3e4c5e',rf:'#d2a8b8',ro:.48,nb:'#6c5472',no:.22,is:'#5e5a6c',dc:'#a8a4cc',di:.38,hs:'#4d5c84',hg:'#22222c',hi:.44,ia:.44,ip:.82,fa:.95,noct:.75,solG:.25},
   {h:21.2, ze:'#050a18',me:'#0b162e',ho:'#15233c',na:'#0a1120',fog:'#111c30',fn:40,ff:300,ag:'#1d2f40',rf:'#9cb8e8',ro:.38,nb:'#1c2b48',no:.16,is:'#344354',dc:'#8eaee0',di:.28,hs:'#2b426b',hg:'#121822',hi:.36,ia:.38,ip:.88,fa:1.0,noct:1.0,solG:.0}
 ];
 const cTmp=new T.Color(),cTmp2=new T.Color(),cFog=new T.Color(),cAg=new T.Color(),cRf=new T.Color(),cIs=new T.Color(),cDc=new T.Color(),cHs=new T.Color(),cHg=new T.Color();
 const fOff=new T.Color('#cfc8bc'),fOn=new T.Color('#ffe8b0'),lApag=new T.Color('#b8a484'),lEnc=new T.Color('#ffcf78');
 function lerpKF(h){
   h=((h%24)+24)%24;
   let i=0;while(i<KF.length-1&&KF[i+1].h<=h)i++;
   const a=KF[i],b=KF[(i+1)%KF.length];
   const span=(b.h>a.h)?(b.h-a.h):(24-a.h+b.h);
   const u=span>0?Math.min(1,Math.max(0,(h>=a.h?h-a.h:24-a.h+h)/span)):0;
   const t=u*u*(3-2*u);
   const mc=(out,ka,kb)=>out.set(ka).lerp(cTmp.set(kb),t);
   const mn=(ka,kb)=>ka+(kb-ka)*t;
   mc(CIELO_SH.uCenit.value,a.ze,b.ze);
   mc(CIELO_SH.uMedio.value,a.me,b.me);
   mc(CIELO_SH.uHoriz.value,a.ho,b.ho);
   mc(CIELO_SH.uNadir.value,a.na,b.na);
   mc(CIELO_SH.uNubeCol.value,a.nb,b.nb);
   CIELO_SH.uNubeOp.value=mn(a.no,b.no);
   CIELO_SH.uSolGlow.value=mn(a.solG,b.solG);
   mc(cFog,a.fog,b.fog);mc(cAg,a.ag,b.ag);mc(cRf,a.rf,b.rf);mc(cIs,a.is,b.is);mc(cDc,a.dc,b.dc);mc(cHs,a.hs,b.hs);mc(cHg,a.hg,b.hg);
   return {fn:mn(a.fn,b.fn),ff:mn(a.ff,b.ff),ro:mn(a.ro,b.ro),di:mn(a.di,b.di),hi:mn(a.hi,b.hi),ia:mn(a.ia,b.ia),ip:mn(a.ip,b.ip),fa:mn(a.fa,b.fa),noct:mn(a.noct,b.noct)};
 }
 AFRAME.registerComponent('ciclo-dia',{
   init(){
     this.luzDir=new T.DirectionalLight('#ffb07a',.65);
     this.luzHemi=new T.HemisphereLight('#d6a08b','#4c423a',.6);
     this.el.object3D.add(this.luzDir,this.luzHemi);
     const d=new Date();
     this.hora=d.getHours()+d.getMinutes()/60;
     this.skyEl=document.querySelector('a-sky');
     this.relojEl=document.getElementById('tiempo-reloj');
     this.lastTxt='';
   },
   tick(t,dt){
     const d=new Date(),hReal=d.getHours()+d.getMinutes()/60;
     const obj=window.__horaPrueba!=null?window.__horaPrueba:hReal;
     let diff=((obj-this.hora+36)%24)-12;
     if(Math.abs(diff)<.015)this.hora=obj;else this.hora=((this.hora+diff*Math.min(1,(dt||16)*.005))%24+24)%24;
     const h=this.hora,st=lerpKF(h);

     /* Posición del sol (6:00-19:45) y de la luna (19:30-6:30) a lo largo de un arco en el cielo */
     const uSol=(h-6)/13.75,solVis=h>=5.8&&h<=19.9?Math.sin(Math.min(1,Math.max(0,uSol))*Math.PI):0;
     const angSol=Math.min(1,Math.max(0,uSol))*Math.PI;
     const sx=Math.cos(angSol)*418,sy=Math.sin(angSol)*310+18,sz=-Math.sin(angSol)*95-20;
     const sr=Math.hypot(sx,sy,sz),snx=sx/sr*415,sny=sy/sr*415,snz=sz/sr*415;
     SOL_GRP.object3D.position.set(snx,solVis>0?sny:-80,snz);
     SOL_GRP.object3D.lookAt(0,0,0);
     const sOp=Math.min(1,solVis*3.2);
     [SOL_DISC,SOL_HALO1,SOL_HALO2].forEach((el,k)=>{
       const m=el.getObject3D('mesh');if(!m)return;
       m.material.opacity=k===0?sOp:(k===1?.55*sOp:.75*sOp);
       if(k>0)m.material.color.copy(cRf);
     });

     const hn=h>=19.5?h-19.5:h+4.5,uLun=hn/11,lunVis=(h>=19.5||h<=6.5)?Math.sin(Math.min(1,Math.max(0,uLun))*Math.PI):0;
     const angLun=Math.min(1,Math.max(0,uLun))*Math.PI;
     const mx=Math.cos(angLun)*400,my=Math.sin(angLun)*245+26,mz=-Math.sin(angLun)*75+30;
     const mr=Math.hypot(mx,my,mz),mnx=mx/mr*410,mny=my/mr*410,mnz=mz/mr*410;
     LUNA_GRP.object3D.position.set(mnx,lunVis>0?mny:-80,mnz);
     LUNA_GRP.object3D.lookAt(0,0,0);
     const lOp=Math.min(1,lunVis*3)*st.noct;
     [LUNA_DISC,LUNA_HALO].forEach((el,k)=>{const m=el.getObject3D('mesh');if(m)m.material.opacity=k===0?lOp:.42*lOp});
     ESTRELLAS_MAT.opacity=st.noct*(.84+.12*Math.sin(t*.0014));

     /* Dirección de brillo en cielo y reflejo sobre el agua */
     const usarLuna=st.noct>.55;
     const ax=usarLuna?mnx:snx,ay=usarLuna?mny:sny,az=usarLuna?mnz:snz;
     CIELO_SH.uSolDir.value.set(ax,Math.max(-20,ay),az).normalize();
     CIELO_SH.uSolCol.value.copy(cRf);
     const sc=this.el.sceneEl;
     if(sc&&sc.object3D){
       if(!sc.object3D.fog)sc.object3D.fog=new T.Fog(cFog,st.fn,st.ff);
       else{sc.object3D.fog.color.copy(cFog);sc.object3D.fog.near=st.fn;sc.object3D.fog.far=st.ff}
     }
     if(this.skyEl){const sm=this.skyEl.getObject3D('mesh');if(sm&&sm.material)sm.material.color.copy(CIELO_SH.uCenit.value)}

     const agM=AGUA_EL.getObject3D('mesh');if(agM)agM.material.color.copy(cAg);
     const brM=BRUMA_EL.getObject3D('mesh');if(brM)brM.material.color.copy(cFog);
     const rfM=REFLEJO_EL.getObject3D('mesh');
     if(rfM){rfM.material.color.copy(cRf);rfM.material.opacity=st.ro}
     REFLEJO_PIV.object3D.rotation.y=Math.atan2(az,-ax);

     for(let i=0;i<ENT_TINT.length;i++){
       const it=ENT_TINT[i],m=it.el.getObject3D('mesh');
       if(m&&m.material)m.material.color.copy(it.base).multiply(cIs);
     }

     /* Luces direccional y hemisférica exteriores */
     this.luzDir.position.set(ax*.08,Math.max(4,ay*.08),az*.08);
     this.luzDir.color.copy(cDc);this.luzDir.intensity=st.di;
     this.luzHemi.color.copy(cHs);this.luzHemi.groundColor.copy(cHg);this.luzHemi.intensity=st.hi;

     /* Luces interiores del museo (encendidas al atardecer y la noche) */
     if(window.__lucesMuseo){
       const lm=window.__lucesMuseo,al=lm.amb.getObject3D('light');
       if(al)al.intensity=st.ia;
       lm.puntos.forEach(p=>{const pl=p.getObject3D('light');if(pl)pl.intensity=st.ip});
       cTmp2.copy(fOff).lerp(fOn,Math.min(1,st.ip*1.2));
       lm.focos.forEach(f=>{const fm=f.getObject3D('mesh');if(fm)fm.material.color.copy(cTmp2)});
     }

     /* Farol cálido en la canoa */
     if(window.__farolCanoa){
       const fc=window.__farolCanoa,parp=1+.045*Math.sin(t*.0073)+.025*Math.cos(t*.013);
       fc.luz.intensity=st.fa*1.85*parp;
       fc.mat.color.copy(lApag).lerp(lEnc,st.fa);
     }

     /* Actualiza el reloj discreto en pantalla */
     if(this.relojEl){
       const hh=Math.floor(h),mm=Math.floor((h-hh)*60);
       const franja=h>=6&&h<8.5?'Amanecer':h>=8.5&&h<17.5?'Día':h>=17.5&&h<20?'Atardecer':'Noche';
       const txt=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')} · ${franja}`;
       if(txt!==this.lastTxt){this.lastTxt=txt;this.relojEl.textContent=txt}
     }
   }
 });
 E('a-entity',{'ciclo-dia':''});
}

/* Peces del Paraná en 3D sobre la foto del río: giran en U, se ladean al doblar y ondulan el cuerpo */
function b64bmpT(str,t){const b=atob(str),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return createImageBitmap(new Blob([u],{type:t}))}
const FISH3D={};
function construirPez3D(sp,bm){
  const T=AFRAME.THREE,w=bm.width,h=bm.height,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.drawImage(bm,0,0);
  const d=g.getImageData(0,0,w,h).data,NC=64,M=14,cw=w/NC,top=[],bot=[],cl=j=>Math.min(NC-1,Math.max(0,j));
  for(let j=0;j<NC;j++){let t=h,b=-1;const x0=Math.floor(j*cw),x1=Math.floor((j+1)*cw);
    for(let x=x0;x<x1;x++)for(let y=0;y<h;y++){if(d[(y*w+x)*4+3]>128){if(y<t)t=y;if(y>b)b=y}}
    if(b<0){t=h/2;b=h/2}top.push(t);bot.push(b)}
  const hc=top.map((t,j)=>bot[j]-t),mid=top.map((t,j)=>(t+bot[j])/2);
  /* el cuerpo se calcula sin las aletas (apertura morfológica): las aletas quedan como láminas finas aparte */
  const er=hc.map((_,j)=>{let m=1e9;for(let k=-6;k<=6;k++)m=Math.min(m,hc[cl(j+k)]);return m});
  const core=er.map((_,j)=>{let m=0;for(let k=-6;k<=6;k++)m=Math.max(m,er[cl(j+k)]);return Math.max(4,Math.min(m,hc[j]))});
  const yc=mid.map((_,j)=>{const a=[];for(let k=-4;k<=4;k++)a.push(mid[cl(j+k)]);a.sort((x,y)=>x-y);return a[4]});
  const sm=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
  const pos=[],uv=[],ux=[],idx=[];
  for(let j=0;j<NC;j++){const u=(j+.5)/NC,cx=u*w,tail=sm(0,.22,u),head=u>.86?Math.sqrt(Math.max(0,1-Math.pow((u-.86)/.14,2)))*.9+.1:1,tk=.26*core[j]*Math.min(tail,head)+1.2,hh=core[j]/2+.5;
    for(let k=0;k<M;k++){const f=2*Math.PI*k/M,y=yc[j]+hh*Math.sin(f);pos.push((cx-w/2)/w,(h/2-y)/w,tk*Math.cos(f)/w);uv.push(cx/w,1-Math.min(h,Math.max(0,y))/h);ux.push(u)}}
  for(let j=0;j<NC-1;j++)for(let k=0;k<M;k++){const a=j*M+k,b=j*M+(k+1)%M,c=(j+1)*M+k,e=(j+1)*M+(k+1)%M;idx.push(a,c,b,b,c,e)}
  const ap=pos.length/3,jl=NC-1;pos.push((((jl+.5)/NC)*w+4-w/2)/w,(h/2-yc[jl])/w,0);uv.push(Math.min(1,((jl+.5)/NC)+.01),1-yc[jl]/h);ux.push(1);
  for(let k=0;k<M;k++)idx.push(jl*M+k,jl*M+(k+1)%M,ap);
  /* lámina plana con la imagen completa: aletas y cola, de espesor casi nulo */
  const NR=10,pp=[],uu=[],uxs=[],ii=[],nn=[];
  for(let a=0;a<=NC;a++)for(let b=0;b<=NR;b++){const xp=a/NC*w,yp=b/NR*h;pp.push((xp-w/2)/w,(h/2-yp)/w,0);uu.push(xp/w,1-yp/h);uxs.push(xp/w);nn.push(0,0,1)}
  for(let a=0;a<NC;a++)for(let b=0;b<NR;b++){const p0=a*(NR+1)+b,p1=p0+1,p2=p0+(NR+1),p3=p2+1;ii.push(p0,p2,p1,p1,p2,p3)}
  const tex=new T.CanvasTexture(cv);if(T.SRGBColorSpace)tex.colorSpace=T.SRGBColorSpace;else tex.encoding=T.sRGBEncoding;
  FISH3D[sp]={cuerpo:{base:new Float32Array(pos),uv:new Float32Array(uv),ux:new Float32Array(ux),idx:new Uint16Array(idx)},aletas:{base:new Float32Array(pp),uv:new Float32Array(uu),ux:new Float32Array(uxs),idx:new Uint16Array(ii),nor:new Float32Array(nn)},tex:tex}}
AFRAME.registerComponent('nadar3d',{
  schema:{sp:{default:'suru'},W:{default:1},xl:{default:-10.33},r:{default:.5},zmin:{default:-4.4},zmax:{default:3},y:{default:1},v:{default:.4},fase:{default:0}},
  init(){const d=this.data;this.Ls=d.zmax-d.zmin;this.Lp=2*this.Ls+2*Math.PI*d.r;this.s=d.fase*this.Lp;this.grp=null},
  tick(t,dt){const d=this.data,T=AFRAME.THREE;
    if(!this.grp){const F=FISH3D[d.sp];if(!F)return;
      const mk=(S,norm)=>{const geo=new T.BufferGeometry(),pos=new Float32Array(S.base);geo.setAttribute('position',new T.BufferAttribute(pos,3));geo.setAttribute('uv',new T.BufferAttribute(S.uv,2));geo.setIndex(new T.BufferAttribute(S.idx,1));
        if(S.nor)geo.setAttribute('normal',new T.BufferAttribute(S.nor,3));else geo.computeVertexNormals();return {geo:geo,pos:pos,S:S}};
      const mat=new T.MeshLambertMaterial({map:F.tex,emissiveMap:F.tex,emissive:new T.Color(0xffffff),emissiveIntensity:.55,alphaTest:.5,side:T.DoubleSide});
      this.parts=[mk(F.cuerpo),mk(F.aletas)];this.grp=new T.Group();this.parts.forEach(p=>{const m=new T.Mesh(p.geo,mat);m.frustumCulled=false;this.grp.add(m)});this.grp.scale.setScalar(d.W);this.el.setObject3D('mesh',this.grp)}
    this.s=(this.s+d.v*dt/1000)%this.Lp;let s=this.s,x,z,hx,hz,bank=0;const r=d.r;
    if(s<this.Ls){x=d.xl;z=d.zmax-s;hx=0;hz=-1}
    else if((s-=this.Ls)<Math.PI*r){const f=s/r;x=d.xl+r-r*Math.cos(f);z=d.zmin-r*Math.sin(f);hx=Math.sin(f);hz=-Math.cos(f);bank=.3}
    else if((s-=Math.PI*r)<this.Ls){x=d.xl+2*r;z=d.zmin+s;hx=0;hz=1}
    else{s-=this.Ls;const f=Math.PI+s/r;x=d.xl+r-r*Math.cos(f);z=d.zmax-r*Math.sin(f);hx=Math.sin(f);hz=-Math.cos(f);bank=.3}
    const o=this.el.object3D;o.position.set(x,d.y+Math.sin(t/800+d.fase*9)*.04,z);o.rotation.set(bank,Math.atan2(-hz,hx),0,'YXZ');
    const ph=t/1000*(2.2+d.v*4);
    this.parts.forEach(p=>{const B=p.S.base,U=p.S.ux,pos=p.pos;for(let i=0;i<U.length;i++){const u=U[i],A=.055*Math.pow(1-u,1.5),w=2*Math.PI*(1-u)*1.1-ph;pos[i*3+2]=B[i*3+2]+A*Math.sin(w);pos[i*3+1]=B[i*3+1]+.3*A*Math.cos(w)}p.geo.attributes.position.needsUpdate=true})}
});
[{sp:'suru',W:2.2,y:.65,xl:-10.33,r:.55,v:.28},{sp:'dorado',W:1.3,y:1.2,xl:-10.28,r:.45,v:.5},{sp:'pacu',W:.9,y:.85,xl:-10.3,r:.5,v:.38},{sp:'boga',W:1.1,y:1.3,xl:-10.25,r:.4,v:.46},
 {sp:'dorado',W:.8,y:.55,xl:-10.32,r:.35,v:.55},{sp:'suru',W:1.3,y:1.0,xl:-10.27,r:.5,v:.3},{sp:'pacu',W:1.15,y:1.3,xl:-10.3,r:.45,v:.34},{sp:'boga',W:.65,y:.8,xl:-10.34,r:.3,v:.42}].forEach((f,i)=>{
  const e=E('a-entity',{});e.setAttribute('nadar3d',{sp:f.sp,W:f.W,y:f.y,xl:f.xl,r:f.r,v:f.v,zmin:-4.4,zmax:3.0,fase:i/8})});
Object.keys(FISH_IMG).forEach(k=>b64bmpT(FISH_IMG[k],'image/webp').then(bm=>construirPez3D(k,bm)).catch(e=>console.log('pez3d',e)));
