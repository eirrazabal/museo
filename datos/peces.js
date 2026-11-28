/* Fichas de las especies del río Paraná y sus ilustraciones locales. */
const FICHAS_PECES={
  boga:{
    nombre:'Boga',
    cientifico:'Megaleporinus obtusidens',
    descripcion:'Pez omnívoro de ríos, lagunas y planicies de inundación. Se desplaza en cardúmenes y cumple un papel importante en la dispersión de semillas y en la alimentación de grandes peces.',
    imagen:'assets/fichas/Boga_HabitatCL.png',
    caracteristicas:[
      {titulo:'Hábitat',texto:'Ríos con corriente, lagunas y planicies de inundación; también encuentra refugio entre la vegetación acuática, las orillas y las zonas de piedras.'},
      {titulo:'Alimentación',texto:'Omnívora: consume algas, plantas, semillas, frutos e insectos.'},
      {titulo:'Movimiento',texto:'Nada en cardúmenes y migra río arriba para desovar.'},
      {titulo:'Rol en el ecosistema',texto:'Dispersa semillas y sirve de alimento a depredadores como el surubí y el dorado.'}
    ]
  },
  dorado:{
    nombre:'Dorado',
    cientifico:'Salminus brasiliensis',
    descripcion:'Nadador veloz y potente de las aguas correntosas del Paraná. Es un depredador tope que captura peces y realiza grandes migraciones río arriba para reproducirse.',
    imagen:'assets/fichas/Dorado_HabitatCL.jpg',
    caracteristicas:[
      {titulo:'Hábitat',texto:'Aguas rápidas, correderas y zonas rocosas oxigenadas; la planicie de inundación funciona como zona de cría.'},
      {titulo:'Alimentación',texto:'Peces medianos y pequeños, entre ellos sábalos, bogas y mojarras.'},
      {titulo:'Movimiento',texto:'Nadador veloz y potente; realiza grandes migraciones río arriba para reproducirse.'},
      {titulo:'Adaptación',texto:'Su mandíbula potente y sus dientes afilados le permiten atrapar presas.'},
      {titulo:'Rol en el ecosistema',texto:'Depredador tope que regula las poblaciones de peces.'}
    ]
  },
  pacu:{
    nombre:'Pacú',
    cientifico:'Piaractus mesopotamicus',
    descripcion:'Pez de cuerpo alto y comprimido, adaptado a moverse entre ramas y vegetación de aguas cálidas. Al alimentarse de frutos y semillas, ayuda a dispersar árboles nativos.',
    imagen:'assets/fichas/Pacu_HabitatCL.jpg',
    caracteristicas:[
      {titulo:'Hábitat',texto:'Aguas cálidas, lagunas y bosques inundados; la vegetación ribereña ofrece refugio y alimento, y la planicie de inundación es zona de cría.'},
      {titulo:'Alimentación',texto:'Frutos, semillas, flores, insectos y pequeños crustáceos.'},
      {titulo:'Movimiento',texto:'Su cuerpo alto y comprimido le permite maniobrar entre ramas; migra para desovar.'},
      {titulo:'Adaptación',texto:'Sus dientes molariformes trituran semillas y frutos duros.'},
      {titulo:'Rol en el ecosistema',texto:'Dispersa semillas de árboles nativos.'}
    ]
  },
  sabalo:{
    nombre:'Sábalo',
    cientifico:'Prochilodus lineatus',
    descripcion:'Pez de fondo que se alimenta filtrando sedimentos orgánicos. Forma grandes cardúmenes, recicla nutrientes y constituye una presa fundamental para peces de mayor tamaño.',
    imagen:'assets/fichas/Sabalo_HabitatCL.jpg',
    sprite:'assets/fichas/sabalo-pez.png',
    caracteristicas:[
      {titulo:'Hábitat',texto:'Fondos fangosos, lagunas y el cauce principal; la planicie de inundación es zona de cría.'},
      {titulo:'Alimentación',texto:'Detritívora: consume barro orgánico, algas y microorganismos del fondo.'},
      {titulo:'Movimiento',texto:'Nada en grandes cardúmenes y migra río arriba para desovar.'},
      {titulo:'Adaptación',texto:'Su boca protráctil y sus labios carnosos le permiten succionar sedimentos.'},
      {titulo:'Rol en el ecosistema',texto:'Recicla nutrientes y es una de las principales presas de grandes peces, como el dorado y el surubí.'}
    ]
  },
  surubi:{
    nombre:'Surubí',
    cientifico:'Pseudoplatystoma corruscans',
    descripcion:'Gran bagre de aguas profundas y fondo corriente, reconocible por sus manchas y largas barbillas. Es un depredador tope que controla poblaciones de peces y migra para reproducirse.',
    imagen:'assets/fichas/Surubi_HabitatCL.png',
    caracteristicas:[
      {titulo:'Hábitat',texto:'Aguas profundas y fondo del río con corriente; los troncos sumergidos y los pozones brindan refugio, y la planicie de inundación es zona de cría.'},
      {titulo:'Alimentación',texto:'Peces pequeños —como sábalos y bogas— y crustáceos.'},
      {titulo:'Movimiento',texto:'Nada con la cola y el cuerpo; migra río arriba para reproducirse.'},
      {titulo:'Adaptación',texto:'Sus barbillas son sensores que le ayudan a encontrar comida en aguas turbias.'},
      {titulo:'Rol en el ecosistema',texto:'Depredador tope que controla las poblaciones de peces.'}
    ]
  }
};
