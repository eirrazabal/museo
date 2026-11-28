/* 02-arquitectura.js: el edificio. Piso, muros gruesos, puerta, ventana grande, cielorraso, vigas, rieles, luces,
   paños de color por sector, balcón con barandas, fachada, techo y la pared oeste (la foto del río la pone 03).
   Usa: E, R, lienzo, grano, MUSEO, TINTE, VERDE, H. */
/* Texturas */
function tablas(){return lienzo(1024,512,(g,w,h)=>{
  const r=R(11),t=['#5a4030','#4b3426','#664a36','#43301f','#583d2b','#6b4f3a'];
  for(let y=0;y<h;y+=26){let x=-r()*200;while(x<w){const L=110+r()*330;g.fillStyle=t[Math.floor(r()*6)];g.fillRect(x+1,y+1,L-2,24);
    g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=1;for(let k=0;k<3;k++){g.beginPath();const yy=y+5+r()*16;g.moveTo(x+3,yy);g.lineTo(x+L-3,yy+(r()-.5)*2);g.stroke()}x+=L}}
  grano(g,w,h,3500,.05)})}
function yeso(col){return lienzo(256,256,(g,w,h)=>{g.fillStyle=col;g.fillRect(0,0,w,h);grano(g,w,h,5000,.045);
  for(let i=0;i<40;i++){g.fillStyle='rgba(255,255,255,.025)';g.beginPath();g.arc(Math.random()*w,Math.random()*h,10+Math.random()*30,0,7);g.fill()}})}

/* Estructura de la sala */
function plano(at,mat){const e=E('a-plane',at);e.setAttribute('material',mat);return e}
plano({rotation:'-90 0 0',width:21,height:11},{src:tablas(),repeat:'5.25 5.5',roughness:.8});
plano({position:`0 ${H} 0`,rotation:'90 0 0',width:21,height:11},{src:yeso('#f2f2f0'),repeat:'10.5 5.5',roughness:1});
plano({position:`0 ${H/2} -5.5`,width:21,height:H},{src:yeso('#f5f5f5'),repeat:'10.5 1.7',roughness:1});
plano({position:'10.5 1.7 -2.75',rotation:'0 -90 0',width:5.5,height:H},{src:yeso('#f5f5f5'),repeat:'2.75 1.7',roughness:1});
plano({position:`-5.9 ${H/2} 5.5`,rotation:'0 180 0',width:9.2,height:H},{src:yeso('#f5f5f5'),repeat:'4.6 1.7',roughness:1});
plano({position:`5.9 ${H/2} 5.5`,rotation:'0 180 0',width:9.2,height:H},{src:yeso('#f5f5f5'),repeat:'4.6 1.7',roughness:1});
plano({position:`0 2.95 5.5`,rotation:'0 180 0',width:2.6,height:.9},{src:yeso('#f5f5f5'),repeat:'1.3 .45',roughness:1});



[[0,-5.47,21,.05],[ -5.9,5.47,9.2,.05],[5.9,5.47,9.2,.05]].forEach(b=>E('a-box',{position:`${b[0]} .09 ${b[1]}`,width:b[2],height:.18,depth:.05,color:'#d4d4d1'}));
E('a-box',{position:'10.47 .09 -2.5',width:.05,height:.18,depth:6,color:'#d4d4d1'});E('a-box',{position:'10.47 .09 5.25',width:.05,height:.18,depth:.5,color:'#d4d4d1'});
[-8.4,-4.2,0,4.2,8.4].forEach(x=>E('a-box',{position:`${x} ${H-.17} 0`,width:.3,height:.34,depth:10.9,color:'#efeeea'}));
[-4.47,4.47].forEach(z=>E('a-box',{position:`0 3.25 ${z}`,width:19,height:.05,depth:.07,color:'#1c1c1e'}));
[-9.47,9.47].forEach(x=>E('a-box',{position:`${x} 3.25 0`,width:.07,height:.05,depth:9,color:'#1c1c1e'}));
const luzAmb=E('a-light',{id:'luz-amb',type:'ambient',color:'#ffffff',intensity:.8});
const puntosLuz=[],focosLuz=[];
[-7,0,7].forEach(x=>[-3,3].forEach(z=>{
  puntosLuz.push(E('a-light',{type:'point',position:`${x} 3 ${z}`,intensity:.26,distance:13,decay:1.4,color:'#ffe6b8'}));
  const f=E('a-cylinder',{radius:.11,height:.04,position:`${x} ${H-.03} ${z}`});
  f.setAttribute('material',{shader:'flat',color:'#d6cfc2'});
  focosLuz.push(f);
}));
window.__lucesMuseo={
  amb:luzAmb,puntos:puntosLuz,focos:focosLuz,
  aplicar(ia,ip,colFoco,colAmb){
    const al=luzAmb.getObject3D('light');
    if(al){al.intensity=ia;if(colAmb)al.color.copy(colAmb)}
    puntosLuz.forEach(p=>{const pl=p.getObject3D('light');if(pl)pl.intensity=ip});
    if(colFoco)focosLuz.forEach(f=>{const fm=f.getObject3D('mesh');if(fm)fm.material.color.copy(colFoco)});
  }
};

/* Exterior: balcón con barandas grises, fachada y el río Paraná */
plano({position:`0 ${H/2} -5.92`,rotation:'0 180 0',width:21.8,height:H},{src:yeso(VERDE),repeat:'10.9 1.7',roughness:1});
plano({position:`-6.1 ${H/2} 5.92`,width:9.6,height:H},{src:yeso(VERDE),repeat:'4.8 1.7',roughness:1});
plano({position:`6.1 ${H/2} 5.92`,width:9.6,height:H},{src:yeso(VERDE),repeat:'4.8 1.7',roughness:1});
plano({position:`0 2.95 5.92`,width:2.6,height:.9},{src:yeso(VERDE),repeat:'1.3 .45',roughness:1});
/* Muros gruesos: jambas de la puerta y ventanas del muro este que dan hacia afuera */
const VENT=[2.75],VHW=2.25,Y0=0,Y1=2.8;
function yesoS(col){return lienzo(128,128,(g,w,h)=>{g.fillStyle=col;g.fillRect(0,0,w,h);grano(g,w,h,1200,.045)})}
function tramoE(x,ry,z0,z1,y0,y1,col){const w=z1-z0,h=y1-y0;if(w<=.001||h<=.001)return;plano({position:`${x} ${(y0+y1)/2} ${(z0+z1)/2}`,rotation:`0 ${ry} 0`,width:w,height:h},{src:yesoS(col),repeat:`${w/2} ${h/2}`,roughness:1})}
function muroE(x,ry,zFin,col){let prev=0;VENT.forEach(c=>{tramoE(x,ry,prev,c-VHW,0,H,col);tramoE(x,ry,c-VHW,c+VHW,0,Y0,col);tramoE(x,ry,c-VHW,c+VHW,Y1,H,col);prev=c+VHW});tramoE(x,ry,prev,zFin,0,H,col)}
muroE(10.5,-90,5.5,TINTE.s4);
tramoE(10.92,90,-5.9,0,0,H,VERDE);muroE(10.92,90,5.9,VERDE);
VENT.forEach(c=>{
  const cm='#f2f2f0',mc='#4a3020',hh=Y1-Y0,cy=(Y0+Y1)/2;
  E('a-box',{position:`10.7 ${cy} ${c-VHW+.03}`,width:.4,height:hh,depth:.06,color:cm});
  E('a-box',{position:`10.7 ${cy} ${c+VHW-.03}`,width:.4,height:hh,depth:.06,color:cm});
  E('a-box',{position:`10.7 ${Y1} ${c}`,width:.4,height:.06,depth:2*VHW,color:cm});
  [-1,1].forEach(sg=>E('a-box',{position:`10.72 ${cy} ${c+sg*.75}`,width:.05,height:hh,depth:.05,color:mc}));
  E('a-box',{position:`10.72 2.2 ${c}`,width:.05,height:.05,depth:2*VHW,color:mc});
  E('a-box',{position:`10.72 ${Y1-.035} ${c}`,width:.07,height:.07,depth:2*VHW,color:mc});
  E('a-box',{position:`10.72 .035 ${c}`,width:.07,height:.07,depth:2*VHW,color:mc});
  [-1,1].forEach(sg=>E('a-box',{position:`10.72 ${cy} ${c+sg*(VHW-.03)}`,width:.07,height:hh,depth:.07,color:mc}));
  E('a-plane',{position:`10.72 ${cy} ${c}`,rotation:'0 -90 0',width:2*VHW,height:hh}).setAttribute('material',{shader:'flat',color:'#bfdcec',transparent:true,opacity:.1,side:'double',depthWrite:false});
});
E('a-box',{position:'-1.27 1.25 5.7',width:.06,height:2.5,depth:.4,color:'#f2f2f0'});
E('a-box',{position:'1.27 1.25 5.7',width:.06,height:2.5,depth:.4,color:'#f2f2f0'});
E('a-box',{position:'0 2.47 5.7',width:2.6,height:.06,depth:.4,color:'#f2f2f0'});

plano({position:`-10.92 ${H/2} 0`,rotation:'0 -90 0',width:11.8,height:H},{src:yeso(VERDE),repeat:'5.9 1.7',roughness:1});
E('a-box',{position:`0 ${H+.2} 0`,width:22.2,height:.34,depth:12.2,color:'#5b5f63'});
function cubierta(){return lienzo(512,512,(g,w,h)=>{const r=R(23),t=['#9a968d','#8b877e','#a29e95','#847f76','#948f86'];
  for(let y=0;y<h;y+=32){let x=-r()*200;while(x<w){const L=150+r()*320;g.fillStyle=t[Math.floor(r()*5)];g.fillRect(x+1,y+1,L-2,30);g.strokeStyle='rgba(0,0,0,.16)';g.lineWidth=1;for(let k=0;k<2;k++){g.beginPath();const yy=y+7+r()*16;g.moveTo(x+3,yy);g.lineTo(x+L-3,yy);g.stroke()}x+=L}}
  grano(g,w,h,2500,.05)})}
plano({position:'0 -.01 0',rotation:'-90 0 0',width:27,height:17},{src:cubierta(),repeat:'13.5 8.5',roughness:.9});
const BAR=lienzo(256,128,g=>{g.fillStyle='#8f979b';g.fillRect(0,6,256,12);g.fillRect(0,58,256,6);g.fillRect(0,110,256,8);for(let x=32;x<256;x+=32)g.fillRect(x-1,18,3,92);g.fillRect(0,0,12,128);g.fillStyle='#6f777b';g.fillRect(0,16,256,2);g.fillRect(0,116,256,2)});
function baranda(x,z,L,ry){
  E('a-plane',{position:`${x} .5 ${z}`,rotation:`0 ${ry} 0`,width:L,height:1}).setAttribute('material',{shader:'flat',transparent:true,src:BAR,repeat:`${L/2} 1`,side:'double',alphaTest:.3});
  E('a-box',{position:`${x} 1.03 ${z}`,rotation:`0 ${ry} 0`,width:L,height:.06,depth:.07,color:'#7b8185'})}
baranda(0,-8.5,27,0);baranda(0,8.5,27,0);baranda(-13.5,0,17,90);baranda(13.5,0,17,90);
[[-13.5,-8.5],[13.5,-8.5],[-13.5,8.5],[13.5,8.5]].forEach(c=>E('a-box',{position:`${c[0]} .53 ${c[1]}`,width:.09,height:1.06,depth:.09,color:'#7b8185'}));

/* Paños de color suave por sector */
function paño(x,z,ry,w,col){plano({position:`${x} ${H/2} ${z}`,rotation:`0 ${ry} 0`,width:w,height:H},{src:yeso(col),repeat:`${w/2} 1.7`,roughness:1})}
paño(-5.9,5.488,180,9.2,TINTE.s1);
paño(-2.05,-5.488,0,16.9,TINTE.s2);paño(8.45,-5.488,0,4.1,TINTE.b);
paño(10.488,-2.75,-90,5.5,TINTE.s3);
paño(5.9,5.488,180,9.2,TINTE.s4);

/* Pared del río: mural de pared completa (pieza 3) y peces del Paraná */
plano({position:`-10.5 ${H/2} 0`,rotation:'0 90 0',width:11,height:H},{src:yeso('#f5f5f5'),repeat:'5.5 1.7',roughness:1});
E('a-box',{position:'-10.47 .09 0',width:.05,height:.18,depth:11,color:'#d4d4d1'});
const BANCO_PECES=E('a-entity',{id:'peces-rio',position:'-10.3 0 0'});
