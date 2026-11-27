/* 00-config.js: valores únicos del museo (medidas en metros). Se carga primero.
   Quien necesite una medida, un color o un parámetro la lee de acá en vez de repetir el número. */
const MUSEO={
  sala:{ancho:21,fondo:11,alto:3.4,espesor:.4},          // interior 21 x 11 m, muros de 40 cm
  puerta:{semiancho:1.3,alto:2.5},                        // en el muro sur, centrada
  ventana:{zc:2.75,semiancho:2.25,y0:0,y1:2.8},           // ventana grande del muro este
  balcon:{ancho:27,fondo:17},                             // cubierta de madera que rodea el edificio
  limites:{                                                // zonas por donde se puede caminar (colisiones)
    interior:{x:10.15,z:5.15},
    muro:{x:11.25,z:6.25},
    cubierta:{x:13.1,z:8.1},
    bloque:{x:3.3,z:.75},                                  // bloque central de vitrinas
    puertaX:1.1},
  velocidad:2.6,                                           // m/s con el botón Avanzar
  colores:{s1:'#0f4c6a',s2:'#8a5a2b',s3:'#2f5f52',s4:'#6a3347',b:'#a8742f',verde:'#cbd8c3'},
  tintes:{s1:'#e4edf1',s2:'#f4eadc',s3:'#e3ece7',s4:'#f1e2e6',b:'#efdfc3'},
  audio:{distMax:3,distMin:1,gainBosque:.3,gainRio:.3},    // el sonido empieza a oírse a distMax y llega al máximo a distMin
  clima:{
    url:'https://api.open-meteo.com/v1/forecast?latitude=-29.14&longitude=-59.26&current=weather_code,is_day',
    intervaloMs:900000                                     // actualización cada 15 minutos
  }
};
