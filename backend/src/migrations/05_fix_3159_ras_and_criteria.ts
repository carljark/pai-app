import { RA } from '../models/RA';

export const up = async () => {
  console.log('🔄 Sincronizando módulo 3159 (Itinerari personal per a l\'ocupabilitat) con currículo oficial...');

  // Eliminar cualquier versión previa errónea (incluyendo supuestos RA6)
  await RA.deleteMany({
    $or: [
      { module: { $regex: /ocupabilitat|empleabilidad/i } },
      { module_ca: { $regex: /ocupabilitat/i } },
      { module_es: { $regex: /empleabilidad/i } },
      { moduleCode: '3159' }
    ]
  });

  const ras3159 = [
    {
      id: 'RA1',
      module: "Itinerari per l'ocupabilitat",
      module_es: 'Itinerario personal para la empleabilidad',
      module_ca: "Itinerari per l'ocupabilitat",
      moduleCode: '3159',
      tipoNivel: 'FP_BASICA',
      description: 'Desenvolupa activitats d’autoconeixement que li permeten orientar-se cap a camps professionals motivadors en els quals pot desplegar totes les seves capacitats.',
      description_ca: 'Desenvolupa activitats d’autoconeixement que li permeten orientar-se cap a camps professionals motivadors en els quals pot desplegar totes les seves capacitats.',
      description_es: 'Desarrolla actividades de autoconocimiento que le permiten orientarse hacia campos profesionales motivadores en los que puede desplegar todas sus capacidades.',
      criterios_ca: [
        'a) S’han avaluat els propis interessos, motivacions, habilitats i destreses en el marc d’un procés d’autoconeixement.',
        'b) S’han determinat les competències personals i socials amb valor per a l’ocupació.',
        'c) S’ha valorat el concepte d’autoestima en el procés de recerca de feina.',
        'd) S’han identificat les fortaleses, debilitats, amenaces i oportunitats pròpies per a la inserció professional, així com les estratègies per treure’n el màxim profit.',
        'e) S’han identificat expectatives de futur per a la inserció professional, analitzant competències, interessos i destreses personals.'
      ],
      criterios_es: [
        'a) Se han evaluado los propios intereses, motivaciones, habilidades y destrezas en el marco de un proceso de autoconocimiento.',
        'b) Se han determinado las competencias personales y sociales con valor para el empleo.',
        'c) Se ha valorado el concepto de autoestima en el proceso de búsqueda de empleo.',
        'd) Se han identificado las fortalezas, debilidades, amenazas y oportunidades propias para la inserción profesional, así como las estrategias para sacarles el mayor aprovechamiento.',
        'e) Se han identificado expectativas de futuro para la inserción profesional analizando competencias, intereses y destrezas personales.'
      ]
    },
    {
      id: 'RA2',
      module: "Itinerari per l'ocupabilitat",
      module_es: 'Itinerario personal para la empleabilidad',
      module_ca: "Itinerari per l'ocupabilitat",
      moduleCode: '3159',
      tipoNivel: 'FP_BASICA',
      description: 'Desenvolupa habilitats socials concretes que s’han demostrat fonamentals a l’hora de trobar una feina i mantenir-la.',
      description_ca: 'Desenvolupa habilitats socials concretes que s’han demostrat fonamentals a l’hora de trobar una feina i mantenir-la.',
      description_es: 'Desarrolla habilidades sociales concretas que se han demostrado fundamentales a la hora de encontrar un empleo y mantenerlo.',
      criterios_ca: [
        'a) S’ha valorat la importància de les competències personals i socials en l’ocupabilitat.',
        'b) S’han aplicat estratègies per canalitzar les emocions de manera assertiva en les relacions amb altres persones, diferenciant-les de conductes agressives i/o passives.',
        'c) S’han posat en pràctica tècniques de presentació, orals i escrites, per a una comunicació efectiva i afectiva, valorant-ne la importància com a recurs personal per a l’ocupabilitat.',
        'd) S’han identificat els beneficis del treball en equip, així com les diferents formes de dur-lo a terme.',
        'e) S’ha reaccionat de manera flexible i positiva davant conflictes i situacions noves, aprofitant les oportunitats i gestionant les dificultats mitjançant estratègies relacionades amb la intel·ligència emocional.'
      ],
      criterios_es: [
        'a) Se ha valorado la importancia de las competencias personales y sociales en la empleabilidad.',
        'b) Se han aplicado estrategias para canalizar las emociones de manera asertiva en las relaciones con otras personas, diferenciándolas de conductas agresivas y/o pasivas.',
        'c) Se han puesto en práctica técnicas de presentación, orales y escritas, para una comunicación efectiva y afectiva valorando su importancia como recurso personal para la empleabilidad.',
        'd) Se han identificado los beneficios del trabajo en equipo, así como las diferentes formas de llevarlo a cabo.',
        'e) Se ha reaccionado de forma flexible y positiva ante conflictos y situaciones nuevas, aprovechando las oportunidades y gestionando las dificultades haciendo uso de estrategias relacionadas con la inteligencia emocional.'
      ]
    },
    {
      id: 'RA3',
      module: "Itinerari per l'ocupabilitat",
      module_es: 'Itinerario personal para la empleabilidad',
      module_ca: "Itinerari per l'ocupabilitat",
      moduleCode: '3159',
      tipoNivel: 'FP_BASICA',
      description: 'Accedeix a la informació dels possibles itineraris acadèmics i/o professionals que té al seu abast a través de la investigació i la reflexió lliure d’estereotips vocacionals.',
      description_ca: 'Accedeix a la informació dels possibles itineraris acadèmics i/o professionals que té al seu abast a través de la investigació i la reflexió lliure d’estereotips vocacionals.',
      description_es: 'Accede a la información de los posibles itinerarios académicos y/o profesionales que tiene a su alcance a través de la investigación y la reflexión libre de estereotipos vocacionales.',
      criterios_ca: [
        'a) S’ha determinat la realitat de l’entorn sociolaboral actual.',
        'b) S’han identificat els itineraris acadèmics i professionals afins als seus interessos i s’han valorat les opcions que millor s’ajusten als seus perfils professionals i a les seves preferències.',
        'c) S’ha valorat la importància de la formació permanent com a factor clau per a l’ocupació i l’adaptació al canvi.'
      ],
      criterios_es: [
        'a) Se ha determinado la realidad del entorno sociolaboral actual.',
        'b) Se han identificado los itinerarios académicos y profesionales afines a sus intereses y se han valorado las opciones que mejor se ajustan a sus perfiles profesionales y sus preferencias.',
        'c) Se ha valorado la importancia de la formación permanente como factor clave para el empleo y la adaptación al cambio.'
      ]
    },
    {
      id: 'RA4',
      module: "Itinerari per l'ocupabilitat",
      module_es: 'Itinerario personal para la empleabilidad',
      module_ca: "Itinerari per l'ocupabilitat",
      moduleCode: '3159',
      tipoNivel: 'FP_BASICA',
      description: 'Posa en marxa un itinerari propi analitzant les diferents opcions educatives i professionals, valorant els avantatges i inconvenients de cadascuna i examinant aquelles que millor s’ajusten a les seves possibilitats i preferències.',
      description_ca: 'Posa en marxa un itinerari propi analitzant les diferents opcions educatives i professionals, valorant els avantatges i inconvenients de cadascuna i examinant aquelles que millor s’ajusten a les seves possibilitats i preferències.',
      description_es: 'Pone en marcha un itinerario propio analizando las diferentes opciones educativas y profesionales, valorando las ventajas e inconvenientes de cada una y examinando aquellas que mejor se ajustan a sus posibilidades y preferencias.',
      criterios_ca: [
        'a) S’han valorat els avantatges i inconvenients de cadascuna de les opcions possibles.',
        'b) S’han analitzat i seleccionat les opcions que millor s’ajusten als seus perfils professionals.',
        'c) S’ha realitzat un procés de presa de decisions identificant l’itinerari acadèmic i professional personal, a partir de les seves preferències professionals, interessos i metes en el marc d’un projecte professional.'
      ],
      criterios_es: [
        'a) Se han valorado las ventajas e inconvenientes de cada una de las opciones posibles.',
        'b) Se han analizado y seleccionado las opciones que más se ajustan a sus perfiles profesionales.',
        'c) Se ha realizado un proceso de toma de decisiones identificando el itinerario académico y profesional personal, a partir de sus preferencias profesionales, intereses y metas en el marco de un proyecto profesional.'
      ]
    },
    {
      id: 'RA5',
      module: "Itinerari per l'ocupabilitat",
      module_es: 'Itinerario personal para la empleabilidad',
      module_ca: "Itinerari per l'ocupabilitat",
      moduleCode: '3159',
      tipoNivel: 'FP_BASICA',
      description: 'Coneix les estratègies d’accés al mercat de treball per compte d’altri i utilitza les eines necessàries per al procés d’inserció laboral.',
      description_ca: 'Coneix les estratègies d’accés al mercat de treball per compte d’altri i utilitza les eines necessàries per al procés d’inserció laboral.',
      description_es: 'Conoce las estrategias de acceso al mercado de trabajo por cuenta ajena y utiliza las herramientas necesarias para el proceso de inserción laboral.',
      criterios_ca: [
        'a) S’ha analitzat la recerca de feina com un procés.',
        'b) S’han identificat les diferents fonts d’informació d’accés a l’ocupació.',
        'c) S’han analitzat les diferents tècniques utilitzades per a la recerca de feina per compte d’altri.',
        'd) S’han posat en pràctica les diferents eines que permeten una recerca de feina òptima.'
      ],
      criterios_es: [
        'a) Se ha analizado la búsqueda de empleo como un proceso.',
        'b) Se han identificado las diferentes fuentes de información de acceso al empleo.',
        'c) Se han analizado las distintas técnicas utilizadas para la búsqueda de empleo por cuenta ajena.',
        'd) Se han puesto en práctica las diferentes herramientas que permitan una búsqueda de empleo óptima.'
      ]
    }
  ];

  await RA.insertMany(ras3159);
  console.log(`✅ Insertados los 5 RAs y 20 criterios oficiales del módulo 3159.`);
};
