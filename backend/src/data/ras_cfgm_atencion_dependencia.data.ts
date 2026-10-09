/**
 * RA y criterios de evaluación del CFGM Atención a Personas en Situación de Dependencia (SSC21).
 * ES: RD 1593/2011 (BOE núm. 301) para los módulos propios y Primeros auxilios; RD 659/2023
 * (texto consolidado) para 1664, 1708, 1709, 1710 y 0156; RD 499/2024 (anexo II) para 1713.
 * CA: traducción al catalán; denominaciones de los módulos según FP Illes Balears.
 */
import type { CfgmRaData } from './ras_cfgm_peluqueria.data';

export const CFGM_ATENCION_DEPENDENCIA_RAS_DATA: CfgmRaData[] = [
  {
    "id": "RA1",
    "module": "Primers auxilis",
    "module_es": "Primeros auxilios",
    "module_ca": "Primers auxilis",
    "moduleCode": "0020",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Fa la valoració inicial de l'assistència en una urgència, descrivint riscs, recursos disponibles i tipus d'ajuda necessària.",
    "description_es": "Realiza la valoración inicial de la asistencia en una urgencia, describiendo riesgos, recursos disponibles y tipo de ayuda necesaria.",
    "description_ca": "Fa la valoració inicial de l'assistència en una urgència, descrivint riscs, recursos disponibles i tipus d'ajuda necessària.",
    "criterios_es": [
      "a) Se ha asegurado la zona según el procedimiento oportuno.",
      "b) Se han identificado las técnicas de autoprotección en la manipulación de personas accidentadas.",
      "c) Se ha descrito el contenido mínimo de un botiquín de urgencias y las indicaciones de los productos y medicamentos.",
      "d) Se han establecido las prioridades de actuación en múltiples víctimas.",
      "e) Se han descrito los procedimientos para verificar la permeabilidad de las vías aéreas.",
      "f) Se han identificado las condiciones de funcionamiento adecuadas de la ventilación-oxigenación.",
      "g) Se han descrito y ejecutado los procedimientos de actuación en caso de hemorragias.",
      "h) Se han descrito procedimientos para comprobar el nivel de consciencia.",
      "i) Se han tomado las constantes vitales.",
      "j) Se ha identificado la secuencia de actuación según el protocolo establecido por el ILCOR (Comité de Coordinación Internacional sobre la Resucitación)."
    ],
    "criterios_ca": [
      "a) S'ha assegurat la zona segons el procediment oportú.",
      "b) S'han identificat les tècniques d'autoprotecció en la manipulació de persones accidentades.",
      "c) S'ha descrit el contingut mínim d'una farmaciola d'urgències i les indicacions dels productes i els medicaments.",
      "d) S'han establert les prioritats d'actuació en múltiples víctimes.",
      "e) S'han descrit els procediments per verificar la permeabilitat de les vies aèries.",
      "f) S'han identificat les condicions de funcionament adequades de la ventilació-oxigenació.",
      "g) S'han descrit i executat els procediments d'actuació en cas d'hemorràgies.",
      "h) S'han descrit procediments per comprovar el nivell de consciència.",
      "i) S'han pres les constants vitals.",
      "j) S'ha identificat la seqüència d'actuació segons el protocol establert per l'ILCOR (Comitè de Coordinació Internacional sobre la Ressuscitació)."
    ]
  },
  {
    "id": "RA2",
    "module": "Primers auxilis",
    "module_es": "Primeros auxilios",
    "module_ca": "Primers auxilis",
    "moduleCode": "0020",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques de suport vital bàsic, descrivint-les i relacionant-les amb l'objectiu que s'ha d'aconseguir.",
    "description_es": "Aplica técnicas de soporte vital básico, describiéndolas y relacionándolas con el objetivo que hay que conseguir.",
    "description_ca": "Aplica tècniques de suport vital bàsic, descrivint-les i relacionant-les amb l'objectiu que s'ha d'aconseguir.",
    "criterios_es": [
      "a) Se han descrito los fundamentos de la resucitación cardio-pulmonar.",
      "b) Se han aplicado técnicas de apertura de la vía aérea.",
      "c) Se han aplicado técnicas de soporte ventilatorio y circulatorio.",
      "d) Se ha realizado desfibrilación externa semiautomática (DEA).",
      "e) Se han aplicado medidas post-reanimación.",
      "f) Se han indicado las lesiones, patologías o traumatismos más frecuentes.",
      "g) Se ha descrito la valoración primaria y secundaria del accidentado.",
      "h) Se han aplicado primeros auxilios ante lesiones por agentes físicos, químicos y biológicos.",
      "i) Se han aplicado primeros auxilios ante patologías orgánicas de urgencia.",
      "j) Se han especificado casos o circunstancias en los que no se debe intervenir."
    ],
    "criterios_ca": [
      "a) S'han descrit els fonaments de la ressuscitació cardiopulmonar.",
      "b) S'han aplicat tècniques d'obertura de la via aèria.",
      "c) S'han aplicat tècniques de suport ventilatori i circulatori.",
      "d) S'ha fet una desfibril·lació externa semiautomàtica (DEA).",
      "e) S'han aplicat mesures postreanimació.",
      "f) S'han indicat les lesions, patologies o traumatismes més freqüents.",
      "g) S'ha descrit la valoració primària i secundària de l'accidentat.",
      "h) S'han aplicat primers auxilis davant lesions per agents físics, químics i biològics.",
      "i) S'han aplicat primers auxilis davant patologies orgàniques d'urgència.",
      "j) S'han especificat casos o circumstàncies en què no s'ha d'intervenir."
    ]
  },
  {
    "id": "RA3",
    "module": "Primers auxilis",
    "module_es": "Primeros auxilios",
    "module_ca": "Primers auxilis",
    "moduleCode": "0020",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica procediments d'immobilització i mobilització de víctimes, seleccionant els mitjans materials i les tècniques.",
    "description_es": "Aplica procedimientos de inmovilización y movilización de víctimas, seleccionando los medios materiales y las técnicas.",
    "description_ca": "Aplica procediments d'immobilització i mobilització de víctimes, seleccionant els mitjans materials i les tècniques.",
    "criterios_es": [
      "a) Se han efectuado las maniobras necesarias para acceder a la víctima.",
      "b) Se han identificado los medios materiales de inmovilización y movilización.",
      "c) Se han caracterizado las medidas posturales ante una persona lesionada.",
      "d) Se han descrito las repercusiones de una movilización y traslado inadecuados.",
      "e) Se han confeccionado sistemas para la inmovilización y movilización de enfermos/accidentados con materiales convencionales e inespecíficos o medios de fortuna.",
      "f) Se han aplicado normas y protocolos de seguridad y de autoprotección personal."
    ],
    "criterios_ca": [
      "a) S'han efectuat les maniobres necessàries per accedir a la víctima.",
      "b) S'han identificat els mitjans materials d'immobilització i mobilització.",
      "c) S'han caracteritzat les mesures posturals davant una persona lesionada.",
      "d) S'han descrit les repercussions d'una mobilització i un trasllat inadequats.",
      "e) S'han confeccionat sistemes per a la immobilització i la mobilització de malalts o accidentats amb materials convencionals i inespecífics o mitjans de fortuna.",
      "f) S'han aplicat normes i protocols de seguretat i d'autoprotecció personal."
    ]
  },
  {
    "id": "RA4",
    "module": "Primers auxilis",
    "module_es": "Primeros auxilios",
    "module_ca": "Primers auxilis",
    "moduleCode": "0020",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques de suport psicològic i d'autocontrol a la persona accidentada i als acompanyants, descrivint i aplicant les estratègies de comunicació adequades.",
    "description_es": "Aplica técnicas de apoyo psicológico y de autocontrol a la persona accidentada y acompañantes, describiendo y aplicando las estrategias de comunicación adecuadas.",
    "description_ca": "Aplica tècniques de suport psicològic i d'autocontrol a la persona accidentada i als acompanyants, descrivint i aplicant les estratègies de comunicació adequades.",
    "criterios_es": [
      "a) Se han descrito las estrategias básicas de comunicación con la persona accidentada y sus acompañantes.",
      "b) Se han detectado las necesidades psicológicas de la persona accidentada.",
      "c) Se han aplicado técnicas básicas de soporte psicológico para mejorar el estado emocional de la persona accidentada.",
      "d) Se ha valorado la importancia de infundir confianza y optimismo al accidentado durante toda la actuación.",
      "e) Se han identificado los factores que predisponen a la ansiedad en las situaciones de accidente, emergencia y duelo.",
      "f) Se han especificado las técnicas que hay que emplear para controlar una situación de duelo, ansiedad, angustia o agresividad.",
      "g) Se han especificado las técnicas que hay que emplear para superar psicológicamente el fracaso en la prestación del auxilio.",
      "h) Se ha valorado la importancia de autocontrolarse ante situaciones de estrés."
    ],
    "criterios_ca": [
      "a) S'han descrit les estratègies bàsiques de comunicació amb la persona accidentada i els seus acompanyants.",
      "b) S'han detectat les necessitats psicològiques de la persona accidentada.",
      "c) S'han aplicat tècniques bàsiques de suport psicològic per millorar l'estat emocional de la persona accidentada.",
      "d) S'ha valorat la importància d'infondre confiança i optimisme a l'accidentat durant tota l'actuació.",
      "e) S'han identificat els factors que predisposen a l'ansietat en les situacions d'accident, emergència i dol.",
      "f) S'han especificat les tècniques que s'han d'emprar per controlar una situació de dol, ansietat, angoixa o agressivitat.",
      "g) S'han especificat les tècniques que s'han d'emprar per superar psicològicament el fracàs en la prestació de l'auxili.",
      "h) S'ha valorat la importància d'autocontrolar-se davant situacions d'estrès."
    ]
  },
  {
    "id": "RA1",
    "module": "Organització de l'atenció a les persones en situació de dependència",
    "module_es": "Organización de la atención a las personas en situación de dependencia",
    "module_ca": "Organització de l'atenció a les persones en situació de dependència",
    "moduleCode": "0210",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Interpreta programes d'atenció a les persones en situació de dependència, relacionant el model organitzatiu i de funcionament amb el marc legal vigent.",
    "description_es": "Interpreta programas de atención a las personas en situación de dependencia, relacionando el modelo organizativo y de funcionamiento con el marco legal vigente.",
    "description_ca": "Interpreta programes d'atenció a les persones en situació de dependència, relacionant el model organitzatiu i de funcionament amb el marc legal vigent.",
    "criterios_es": [
      "a) Se han comparado las normativas en materia de atención a las personas en situación de dependencia en el ámbito europeo, estatal, autonómico y local.",
      "b) Se han descrito los diferentes modelos y servicios de atención a las personas en situación de dependencia.",
      "c) Se han identificado los requisitos y las características organizativas y funcionales que deben reunir los servicios de atención a las personas en situación de dependencia.",
      "d) Se han descrito las estructuras organizativas y las relaciones funcionales tipo de los equipamientos residenciales dirigidos a personas en situación de dependencia.",
      "e) Se han descrito las funciones, niveles y procedimientos de coordinación de los equipos interdisciplinares de los servicios de atención a las personas en situación de dependencia.",
      "f) Se han identificado los recursos humanos necesarios para garantizar la atención integral de las personas en situación de dependencia.",
      "g) Se han identificado las funciones del técnico en Atención a Personas en Situación de Dependencia en el equipo interdisciplinar de las diversas instituciones y servicios para la atención a las personas en situación de dependencia.",
      "h) Se ha argumentado la importancia de un equipo interdisciplinar en la atención a las personas en situación de dependencia."
    ],
    "criterios_ca": [
      "a) S'han comparat les normatives en matèria d'atenció a les persones en situació de dependència en l'àmbit europeu, estatal, autonòmic i local.",
      "b) S'han descrit els diferents models i serveis d'atenció a les persones en situació de dependència.",
      "c) S'han identificat els requisits i les característiques organitzatives i funcionals que han de reunir els serveis d'atenció a les persones en situació de dependència.",
      "d) S'han descrit les estructures organitzatives i les relacions funcionals tipus dels equipaments residencials adreçats a persones en situació de dependència.",
      "e) S'han descrit les funcions, els nivells i els procediments de coordinació dels equips interdisciplinaris dels serveis d'atenció a les persones en situació de dependència.",
      "f) S'han identificat els recursos humans necessaris per garantir l'atenció integral de les persones en situació de dependència.",
      "g) S'han identificat les funcions del tècnic en Atenció a Persones en Situació de Dependència en l'equip interdisciplinari de les diverses institucions i serveis per a l'atenció a les persones en situació de dependència.",
      "h) S'ha argumentat la importància d'un equip interdisciplinari en l'atenció a les persones en situació de dependència."
    ]
  },
  {
    "id": "RA2",
    "module": "Organització de l'atenció a les persones en situació de dependència",
    "module_es": "Organización de la atención a las personas en situación de dependencia",
    "module_ca": "Organització de l'atenció a les persones en situació de dependència",
    "moduleCode": "0210",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza la intervenció amb les persones en situació de dependència, seleccionant les estratègies en funció de les seves característiques i les directrius del programa d'intervenció.",
    "description_es": "Organiza la intervención con las personas en situación de dependencia, seleccionando las estrategias en función de sus características y las directrices del programa de intervención.",
    "description_ca": "Organitza la intervenció amb les persones en situació de dependència, seleccionant les estratègies en funció de les seves característiques i les directrius del programa d'intervenció.",
    "criterios_es": [
      "a) Se han descrito las estrategias de intervención para el desarrollo de las actividades de atención a las personas en situación de dependencia.",
      "b) Se han interpretado correctamente las directrices, criterios y estrategias establecidos en un plan de atención individualizado.",
      "c) Se han determinado las intervenciones que se deben realizar para la atención a las personas en situación de dependencia a partir de los protocolos de actuación de la institución correspondiente.",
      "d) Se han seleccionado estrategias para la atención a las personas en situación de dependencia a partir de sus características y del plan de atención individualizado.",
      "e) Se han seleccionado métodos de trabajo, adaptándolos a los recursos disponibles y a las especificaciones del plan de trabajo o de atención individualizado.",
      "f) Se han temporalizado las actividades y tareas, atendiendo a las necesidades de la persona en situación de dependencia y a la organización racional del trabajo.",
      "g) Se han descrito los principios metodológicos y pautas de actuación del técnico en las tareas de apoyo para la vida independiente.",
      "h) Se ha argumentado la importancia de respetar los principios de promoción de la vida independiente y las decisiones de las personas usuarias."
    ],
    "criterios_ca": [
      "a) S'han descrit les estratègies d'intervenció per al desenvolupament de les activitats d'atenció a les persones en situació de dependència.",
      "b) S'han interpretat correctament les directrius, els criteris i les estratègies establerts en un pla d'atenció individualitzat.",
      "c) S'han determinat les intervencions que s'han de fer per a l'atenció a les persones en situació de dependència a partir dels protocols d'actuació de la institució corresponent.",
      "d) S'han seleccionat estratègies per a l'atenció a les persones en situació de dependència a partir de les seves característiques i del pla d'atenció individualitzat.",
      "e) S'han seleccionat mètodes de treball, adaptant-los als recursos disponibles i a les especificacions del pla de treball o d'atenció individualitzat.",
      "f) S'han temporalitzat les activitats i les tasques, atenent les necessitats de la persona en situació de dependència i l'organització racional del treball.",
      "g) S'han descrit els principis metodològics i les pautes d'actuació del tècnic en les tasques de suport per a la vida independent.",
      "h) S'ha argumentat la importància de respectar els principis de promoció de la vida independent i les decisions de les persones usuàries."
    ]
  },
  {
    "id": "RA3",
    "module": "Organització de l'atenció a les persones en situació de dependència",
    "module_es": "Organización de la atención a las personas en situación de dependencia",
    "module_ca": "Organització de l'atenció a les persones en situació de dependència",
    "moduleCode": "0210",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza els recursos necessaris per a la intervenció, relacionant el context on desenvolupa la seva activitat amb les característiques de les persones en situació de dependència.",
    "description_es": "Organiza los recursos necesarios para la intervención, relacionando el contexto donde desarrolla su actividad con las características de las personas en situación de dependencia.",
    "description_ca": "Organitza els recursos necessaris per a la intervenció, relacionant el context on desenvolupa la seva activitat amb les característiques de les persones en situació de dependència.",
    "criterios_es": [
      "a) Se han identificado los factores del entorno que favorecen o inhiben la autonomía de las personas en su vida cotidiana.",
      "b) Se ha reconocido el mobiliario y los instrumentos de trabajo propios de cada contexto de intervención.",
      "c) Se ha acondicionado el entorno para favorecer la movilidad y los desplazamientos de las personas en situación de dependencia, así como su uso y utilidad.",
      "d) Se ha identificado la normativa legal vigente en materia de prevención y seguridad para organizar los recursos.",
      "e) Se han aplicado los criterios que se deben seguir en la organización de espacios, equipamientos y materiales para favorecer la autonomía de las personas.",
      "f) Se han identificado las ayudas técnicas necesarias para favorecer la autonomía y comunicación de la persona.",
      "g) Se han descrito los recursos existentes en el contexto para optimizar la intervención.",
      "h) Se ha argumentado la importancia de informar a las personas en situación de dependencia y a sus familias o cuidadores no formales sobre las actividades programadas, para favorecer su participación."
    ],
    "criterios_ca": [
      "a) S'han identificat els factors de l'entorn que afavoreixen o inhibeixen l'autonomia de les persones en la seva vida quotidiana.",
      "b) S'ha reconegut el mobiliari i els instruments de treball propis de cada context d'intervenció.",
      "c) S'ha condicionat l'entorn per afavorir la mobilitat i els desplaçaments de les persones en situació de dependència, així com el seu ús i la seva utilitat.",
      "d) S'ha identificat la normativa legal vigent en matèria de prevenció i seguretat per organitzar els recursos.",
      "e) S'han aplicat els criteris que s'han de seguir en l'organització d'espais, equipaments i materials per afavorir l'autonomia de les persones.",
      "f) S'han identificat les ajudes tècniques necessàries per afavorir l'autonomia i la comunicació de la persona.",
      "g) S'han descrit els recursos existents en el context per optimitzar la intervenció.",
      "h) S'ha argumentat la importància d'informar les persones en situació de dependència i les seves famílies o els cuidadors no formals sobre les activitats programades, per afavorir-ne la participació."
    ]
  },
  {
    "id": "RA4",
    "module": "Organització de l'atenció a les persones en situació de dependència",
    "module_es": "Organización de la atención a las personas en situación de dependencia",
    "module_ca": "Organització de l'atenció a les persones en situació de dependència",
    "moduleCode": "0210",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Gestiona la documentació bàsica de l'atenció a persones en situació de dependència, relacionant-la amb els objectius de la intervenció.",
    "description_es": "Gestiona la documentación básica de la atención a personas en situación de dependencia, relacionándola con los objetivos de la intervención.",
    "description_ca": "Gestiona la documentació bàsica de l'atenció a persones en situació de dependència, relacionant-la amb els objectius de la intervenció.",
    "criterios_es": [
      "a) Se han identificado los elementos que debe recoger la documentación básica de la persona usuaria.",
      "b) Se han aplicado protocolos de recogida de la información precisa para conocer los cambios de las personas en situación de dependencia y su grado de satisfacción.",
      "c) Se ha justificado la utilidad y la importancia de documentar por escrito la intervención realizada.",
      "d) Se han identificado los canales de comunicación de las incidencias detectadas.",
      "e) Se ha integrado toda la documentación, organizándola y actualizándola, para confeccionar un modelo de expediente individual.",
      "f) Se han aplicado criterios de actuación que garanticen la protección de datos de las personas usuarias.",
      "g) Se han utilizado equipos y aplicaciones informáticas para la gestión de la documentación y los expedientes.",
      "h) Se ha valorado la importancia de respetar la confidencialidad de la información."
    ],
    "criterios_ca": [
      "a) S'han identificat els elements que ha de recollir la documentació bàsica de la persona usuària.",
      "b) S'han aplicat protocols de recollida de la informació precisa per conèixer els canvis de les persones en situació de dependència i el seu grau de satisfacció.",
      "c) S'ha justificat la utilitat i la importància de documentar per escrit la intervenció feta.",
      "d) S'han identificat els canals de comunicació de les incidències detectades.",
      "e) S'ha integrat tota la documentació, organitzant-la i actualitzant-la, per confeccionar un model d'expedient individual.",
      "f) S'han aplicat criteris d'actuació que garanteixin la protecció de dades de les persones usuàries.",
      "g) S'han utilitzat equips i aplicacions informàtics per a la gestió de la documentació i els expedients.",
      "h) S'ha valorat la importància de respectar la confidencialitat de la informació."
    ]
  },
  {
    "id": "RA1",
    "module": "Característiques i necessitats de les persones en situació de dependència",
    "module_es": "Características y necesidades de las personas en situación de dependencia",
    "module_ca": "Característiques i necessitats de les persones en situació de dependència",
    "moduleCode": "0212",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Caracteritza el concepte d'autonomia personal, analitzant els factors que intervenen tant en la seva prevenció i promoció com en el seu deteriorament.",
    "description_es": "Caracteriza el concepto de autonomía personal, analizando los factores que intervienen tanto en su prevención y promoción como en su deterioro.",
    "description_ca": "Caracteritza el concepte d'autonomia personal, analitzant els factors que intervenen tant en la seva prevenció i promoció com en el seu deteriorament.",
    "criterios_es": [
      "a) Se han descrito los procesos básicos asociados a la promoción de la autonomía personal y la vida independiente.",
      "b) Se han caracterizado las habilidades de autonomía personal.",
      "c) Se han identificado los factores que favorecen o inhiben el mantenimiento de la autonomía personal y la vida independiente.",
      "d) Se han descrito las principales alteraciones emocionales y conductuales asociadas a la pérdida de autonomía personal.",
      "e) Se han identificado los indicadores generales de la pérdida de autonomía.",
      "f) Se ha justificado la necesidad de respetar la capacidad de elección de la persona en situación de dependencia.",
      "g) Se ha argumentado la importancia de la prevención para retrasar las situaciones de dependencia.",
      "h) Se ha valorado la importancia de la familia y del entorno del sujeto en el mantenimiento de su autonomía personal y su bienestar físico y psicosocial."
    ],
    "criterios_ca": [
      "a) S'han descrit els processos bàsics associats a la promoció de l'autonomia personal i la vida independent.",
      "b) S'han caracteritzat les habilitats d'autonomia personal.",
      "c) S'han identificat els factors que afavoreixen o inhibeixen el manteniment de l'autonomia personal i la vida independent.",
      "d) S'han descrit les principals alteracions emocionals i conductuals associades a la pèrdua d'autonomia personal.",
      "e) S'han identificat els indicadors generals de la pèrdua d'autonomia.",
      "f) S'ha justificat la necessitat de respectar la capacitat d'elecció de la persona en situació de dependència.",
      "g) S'ha argumentat la importància de la prevenció per retardar les situacions de dependència.",
      "h) S'ha valorat la importància de la família i de l'entorn del subjecte en el manteniment de la seva autonomia personal i el seu benestar físic i psicosocial."
    ]
  },
  {
    "id": "RA2",
    "module": "Característiques i necessitats de les persones en situació de dependència",
    "module_es": "Características y necesidades de las personas en situación de dependencia",
    "module_ca": "Característiques i necessitats de les persones en situació de dependència",
    "moduleCode": "0212",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Classifica els nivells de dependència i les ajudes requerides associats al procés d'envelliment, analitzant els canvis i els deterioraments produïts per aquest.",
    "description_es": "Clasifica los niveles de dependencia y las ayudas requeridas asociados al proceso de envejecimiento, analizando los cambios y deterioros producidos por el mismo.",
    "description_ca": "Classifica els nivells de dependència i les ajudes requerides associats al procés d'envelliment, analitzant els canvis i els deterioraments produïts per aquest.",
    "criterios_es": [
      "a) Se han relacionado los cambios biológicos, psicológicos y sociales propios del envejecimiento con las dificultades que implican en la vida diaria de la persona.",
      "b) Se han identificado las patologías más frecuentes en la persona mayor.",
      "c) Se han descrito las principales características y necesidades de las personas mayores.",
      "d) Se han identificado las principales manifestaciones de deterioro personal y social propio de las personas mayores.",
      "e) Se han relacionado los niveles de deterioro físico, psicológico y social con los grados de dependencia y el tipo de apoyo requerido.",
      "f) Se han descrito las conductas y comportamientos característicos de las personas mayores durante el período de adaptación al servicio de atención a la dependencia y al profesional de referencia.",
      "g) Se han identificado las necesidades de orientación y apoyo de los cuidadores familiares y no profesionales de la persona mayor.",
      "h) Se ha valorado la importancia de respetar las decisiones e intereses de las personas mayores."
    ],
    "criterios_ca": [
      "a) S'han relacionat els canvis biològics, psicològics i socials propis de l'envelliment amb les dificultats que impliquen en la vida diària de la persona.",
      "b) S'han identificat les patologies més freqüents en la persona gran.",
      "c) S'han descrit les principals característiques i necessitats de les persones grans.",
      "d) S'han identificat les principals manifestacions de deteriorament personal i social propi de les persones grans.",
      "e) S'han relacionat els nivells de deteriorament físic, psicològic i social amb els graus de dependència i el tipus de suport requerit.",
      "f) S'han descrit les conductes i els comportaments característics de les persones grans durant el període d'adaptació al servei d'atenció a la dependència i al professional de referència.",
      "g) S'han identificat les necessitats d'orientació i suport dels cuidadors familiars i no professionals de la persona gran.",
      "h) S'ha valorat la importància de respectar les decisions i els interessos de les persones grans."
    ]
  },
  {
    "id": "RA3",
    "module": "Característiques i necessitats de les persones en situació de dependència",
    "module_es": "Características y necesidades de las personas en situación de dependencia",
    "module_ca": "Característiques i necessitats de les persones en situació de dependència",
    "moduleCode": "0212",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Reconeix les característiques de les persones amb discapacitat, relacionant-les amb els nivells de dependència i l'ajuda requerida.",
    "description_es": "Reconoce las características de las personas con discapacidad, relacionándolas con los niveles de dependencia y la ayuda requerida.",
    "description_ca": "Reconeix les característiques de les persones amb discapacitat, relacionant-les amb els nivells de dependència i l'ajuda requerida.",
    "criterios_es": [
      "a) Se ha relacionado la evolución del concepto de discapacidad con los cambios sociales, culturales, económicos y científico-tecnológicos.",
      "b) Se han relacionado los diferentes tipos de discapacidad con las dificultades que implican en la vida cotidiana de las personas.",
      "c) Se han descrito las principales necesidades psicológicas y sociales de las personas con discapacidad.",
      "d) Se han relacionado diferentes tipologías y niveles de discapacidad con el grado de dependencia y tipo de apoyo precisado.",
      "e) Se han identificado los principios de la vida independiente.",
      "f) Se han descrito las necesidades de orientación y apoyo a los cuidadores no profesionales de la persona con discapacidad.",
      "g) Se ha argumentado la importancia de la eliminación de barreras físicas para favorecer la autonomía de las personas con discapacidad física o sensorial.",
      "h) Se ha argumentado la importancia de respetar las decisiones e intereses de las personas con discapacidad."
    ],
    "criterios_ca": [
      "a) S'ha relacionat l'evolució del concepte de discapacitat amb els canvis socials, culturals, econòmics i cientificotecnològics.",
      "b) S'han relacionat els diferents tipus de discapacitat amb les dificultats que impliquen en la vida quotidiana de les persones.",
      "c) S'han descrit les principals necessitats psicològiques i socials de les persones amb discapacitat.",
      "d) S'han relacionat diferents tipologies i nivells de discapacitat amb el grau de dependència i el tipus de suport necessari.",
      "e) S'han identificat els principis de la vida independent.",
      "f) S'han descrit les necessitats d'orientació i suport als cuidadors no professionals de la persona amb discapacitat.",
      "g) S'ha argumentat la importància de l'eliminació de barreres físiques per afavorir l'autonomia de les persones amb discapacitat física o sensorial.",
      "h) S'ha argumentat la importància de respectar les decisions i els interessos de les persones amb discapacitat."
    ]
  },
  {
    "id": "RA4",
    "module": "Característiques i necessitats de les persones en situació de dependència",
    "module_es": "Características y necesidades de las personas en situación de dependencia",
    "module_ca": "Característiques i necessitats de les persones en situació de dependència",
    "moduleCode": "0212",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Descriu les malalties generadores de dependència, determinant-ne els efectes sobre les persones que les pateixen.",
    "description_es": "Describe las enfermedades generadoras de dependencia, determinando sus efectos sobre las personas que las padecen.",
    "description_ca": "Descriu les malalties generadores de dependència, determinant-ne els efectes sobre les persones que les pateixen.",
    "criterios_es": [
      "a) Se han caracterizado las enfermedades agudas, crónicas y terminales por su influencia en la autonomía personal de la persona enferma.",
      "b) Se han identificado las principales características y necesidades psicológicas y sociales de los pacientes con enfermedades generadoras de dependencia.",
      "c) Se han definido las principales características de las enfermedades mentales más frecuentes.",
      "d) Se ha descrito la influencia de las enfermedades mentales en la autonomía personal y social de las personas que las padecen.",
      "e) Se han identificado las necesidades de apoyo asistencial y psicosocial de las personas enfermas en función de la tipología de enfermedad que padecen.",
      "f) Se han descrito las principales pautas de atención a las necesidades psicológicas y sociales de las personas enfermas.",
      "g) Se han descrito las necesidades de orientación y apoyo a los cuidadores no profesionales de la persona enferma.",
      "h) Se ha sensibilizado sobre la influencia de la enfermedad en la conducta de la persona enferma."
    ],
    "criterios_ca": [
      "a) S'han caracteritzat les malalties agudes, cròniques i terminals per la seva influència en l'autonomia personal de la persona malalta.",
      "b) S'han identificat les principals característiques i necessitats psicològiques i socials dels pacients amb malalties generadores de dependència.",
      "c) S'han definit les principals característiques de les malalties mentals més freqüents.",
      "d) S'ha descrit la influència de les malalties mentals en l'autonomia personal i social de les persones que les pateixen.",
      "e) S'han identificat les necessitats de suport assistencial i psicosocial de les persones malaltes en funció de la tipologia de malaltia que pateixen.",
      "f) S'han descrit les principals pautes d'atenció a les necessitats psicològiques i socials de les persones malaltes.",
      "g) S'han descrit les necessitats d'orientació i suport als cuidadors no professionals de la persona malalta.",
      "h) S'ha sensibilitzat sobre la influència de la malaltia en la conducta de la persona malalta."
    ]
  },
  {
    "id": "RA1",
    "module": "Atenció i suport psicosocial",
    "module_es": "Atención y apoyo psicosocial",
    "module_ca": "Atenció i suport psicosocial",
    "moduleCode": "0213",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza l'entorn on desenvolupa la seva tasca, relacionant les necessitats psicosocials de les persones en situació de dependència amb les característiques de la institució o el domicili.",
    "description_es": "Organiza el entorno donde desarrolla su labor, relacionando las necesidades psicosociales de las personas en situación de dependencia con las características de la institución o el domicilio.",
    "description_ca": "Organitza l'entorn on desenvolupa la seva tasca, relacionant les necessitats psicosocials de les persones en situació de dependència amb les característiques de la institució o el domicili.",
    "criterios_es": [
      "a) Se han identificado las características organizativas y funcionales de la institución o el domicilio que inciden en la situación psicosocial de las personas en situación de dependencia.",
      "b) Se han descrito los factores ambientales y los elementos espaciales y materiales que inciden en la relación social.",
      "c) Se han respetado las orientaciones recibidas, las necesidades y características de las personas, sus costumbres y gustos, así como las normas de seguridad e higiene en el mantenimiento de los espacios y el mobiliario.",
      "d) Se ha orientado sobre los espacios y materiales al usuario y cuidadores informales para favorecer el desenvolvimiento autónomo, la comunicación y la convivencia de las personas en situación de dependencia.",
      "e) Se han decorado los espacios, adaptándolos a las necesidades de la persona en situación de dependencia, así como al calendario, al entorno cultural y al programa de actividades de la institución.",
      "f) Se han confeccionado los elementos de señalización y simbolización para organizar los materiales y enseres de un aula taller o un domicilio, y de esta manera facilitar la autonomía de la persona en situación de dependencia.",
      "g) Se han justificado las ventajas de organizar el espacio de cara a la mejora de la calidad de vida de las personas en situación de dependencia.",
      "h) Se ha mostrado iniciativa en la organización del espacio de intervención dentro de la institución y del domicilio."
    ],
    "criterios_ca": [
      "a) S'han identificat les característiques organitzatives i funcionals de la institució o el domicili que incideixen en la situació psicosocial de les persones en situació de dependència.",
      "b) S'han descrit els factors ambientals i els elements espacials i materials que incideixen en la relació social.",
      "c) S'han respectat les orientacions rebudes, les necessitats i les característiques de les persones, els seus costums i gustos, així com les normes de seguretat i higiene en el manteniment dels espais i el mobiliari.",
      "d) S'ha orientat sobre els espais i materials l'usuari i els cuidadors informals per afavorir el desenvolupament autònom, la comunicació i la convivència de les persones en situació de dependència.",
      "e) S'han decorat els espais, adaptant-los a les necessitats de la persona en situació de dependència, així com al calendari, a l'entorn cultural i al programa d'activitats de la institució.",
      "f) S'han confeccionat els elements de senyalització i simbolització per organitzar els materials i estris d'una aula taller o un domicili, i d'aquesta manera facilitar l'autonomia de la persona en situació de dependència.",
      "g) S'han justificat els avantatges d'organitzar l'espai de cara a la millora de la qualitat de vida de les persones en situació de dependència.",
      "h) S'ha mostrat iniciativa en l'organització de l'espai d'intervenció dins la institució i el domicili."
    ]
  },
  {
    "id": "RA2",
    "module": "Atenció i suport psicosocial",
    "module_es": "Atención y apoyo psicosocial",
    "module_ca": "Atenció i suport psicosocial",
    "moduleCode": "0213",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Selecciona estratègies de suport psicosocial i habilitats de relació social, analitzant les necessitats i les característiques de les persones en situació de dependència i el pla de treball establert.",
    "description_es": "Selecciona estrategias de apoyo psicosocial y habilidades de relación social, analizando las necesidades y características de las personas en situación de dependencia y el plan de trabajo establecido.",
    "description_ca": "Selecciona estratègies de suport psicosocial i habilitats de relació social, analitzant les necessitats i les característiques de les persones en situació de dependència i el pla de treball establert.",
    "criterios_es": [
      "a) Se han descrito las características y necesidades fundamentales de las relaciones sociales de las personas en situación de dependencia.",
      "b) Se han analizado los criterios y estrategias para organizar la intervención referida al apoyo psicosocial a las personas en situación de dependencia y la creación de nuevas relaciones.",
      "c) Se han identificado los recursos, medios, técnicas y estrategias de apoyo y desarrollo de las habilidades sociales de las personas en situación de dependencia.",
      "d) Se han seleccionado los medios y recursos expresivos y comunicativos que favorecen el mantenimiento de las capacidades relacionales de las personas en situación de dependencia.",
      "e) Se han seleccionado técnicas y estrategias de apoyo para colaborar en el mantenimiento y desarrollo de habilidades sociales adaptadas a las situaciones cotidianas.",
      "f) Se han aplicado las tecnologías de información y comunicación para el mantenimiento de la relación social con el entorno.",
      "g) Se han aplicado técnicas de modificación de conducta y de resolución de conflictos para la atención social a personas con necesidades especiales.",
      "h) Se ha justificado la necesidad de respetar las pautas de comunicación y el uso de las habilidades de relación social de cada usuario."
    ],
    "criterios_ca": [
      "a) S'han descrit les característiques i les necessitats fonamentals de les relacions socials de les persones en situació de dependència.",
      "b) S'han analitzat els criteris i les estratègies per organitzar la intervenció referida al suport psicosocial a les persones en situació de dependència i la creació de noves relacions.",
      "c) S'han identificat els recursos, mitjans, tècniques i estratègies de suport i desenvolupament de les habilitats socials de les persones en situació de dependència.",
      "d) S'han seleccionat els mitjans i recursos expressius i comunicatius que afavoreixen el manteniment de les capacitats relacionals de les persones en situació de dependència.",
      "e) S'han seleccionat tècniques i estratègies de suport per col·laborar en el manteniment i desenvolupament d'habilitats socials adaptades a les situacions quotidianes.",
      "f) S'han aplicat les tecnologies de la informació i la comunicació per al manteniment de la relació social amb l'entorn.",
      "g) S'han aplicat tècniques de modificació de conducta i de resolució de conflictes per a l'atenció social a persones amb necessitats especials.",
      "h) S'ha justificat la necessitat de respectar les pautes de comunicació i l'ús de les habilitats de relació social de cada usuari."
    ]
  },
  {
    "id": "RA3",
    "module": "Atenció i suport psicosocial",
    "module_es": "Atención y apoyo psicosocial",
    "module_ca": "Atenció i suport psicosocial",
    "moduleCode": "0213",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques i exercicis de manteniment i entrenament psicològic, rehabilitador i ocupacional amb les persones en situació de dependència, seguint el pla d'intervenció establert.",
    "description_es": "Aplica técnicas y ejercicios de mantenimiento y entrenamiento psicológico, rehabilitador y ocupacional con las personas en situación de dependencia, siguiendo el plan de intervención establecido.",
    "description_ca": "Aplica tècniques i exercicis de manteniment i entrenament psicològic, rehabilitador i ocupacional amb les persones en situació de dependència, seguint el pla d'intervenció establert.",
    "criterios_es": [
      "a) Se han descrito las características específicas que presentan la motivación y el aprendizaje de las personas mayores, discapacitadas y enfermas.",
      "b) Se han identificado estrategias de intervención adecuadas a la realización de ejercicios y actividades dirigidas al mantenimiento y mejora de las capacidades cognitivas.",
      "c) Se han aplicado las diversas actividades, adaptándolas a las necesidades específicas de los usuarios y a la programación.",
      "d) Se han utilizado materiales, con iniciativa y creatividad, para la realización de ejercicios y actividades dirigidos al mantenimiento y mejora de las capacidades cognitivas.",
      "e) Se han realizado actividades para el mantenimiento y mejora de la autonomía personal.",
      "f) Se ha colaborado con la persona en situación de dependencia en la realización de los ejercicios de mantenimiento y entrenamiento cognitivo.",
      "g) Se han respetado las limitaciones de las personas en situación de dependencia, no sólo físicas sino también culturales, a la hora de realizar las actividades y ejercicios de mantenimiento y entrenamiento psicológico, rehabilitador y ocupacional.",
      "h) Se han aplicado técnicas de motivación para personas en situación de dependencia en la planificación de los ejercicios y actividades de mantenimiento y entrenamiento psicológico, rehabilitador y ocupacional."
    ],
    "criterios_ca": [
      "a) S'han descrit les característiques específiques que presenten la motivació i l'aprenentatge de les persones grans, discapacitades i malaltes.",
      "b) S'han identificat estratègies d'intervenció adequades a la realització d'exercicis i activitats dirigides al manteniment i la millora de les capacitats cognitives.",
      "c) S'han aplicat les diverses activitats, adaptant-les a les necessitats específiques dels usuaris i a la programació.",
      "d) S'han utilitzat materials, amb iniciativa i creativitat, per a la realització d'exercicis i activitats dirigits al manteniment i la millora de les capacitats cognitives.",
      "e) S'han fet activitats per al manteniment i la millora de l'autonomia personal.",
      "f) S'ha col·laborat amb la persona en situació de dependència en la realització dels exercicis de manteniment i entrenament cognitiu.",
      "g) S'han respectat les limitacions de les persones en situació de dependència, no només físiques sinó també culturals, a l'hora de fer les activitats i els exercicis de manteniment i entrenament psicològic, rehabilitador i ocupacional.",
      "h) S'han aplicat tècniques de motivació per a persones en situació de dependència en la planificació dels exercicis i les activitats de manteniment i entrenament psicològic, rehabilitador i ocupacional."
    ]
  },
  {
    "id": "RA4",
    "module": "Atenció i suport psicosocial",
    "module_es": "Atención y apoyo psicosocial",
    "module_ca": "Atenció i suport psicosocial",
    "moduleCode": "0213",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Caracteritza les tècniques d'acompanyament per a activitats de relació social i de gestió de la vida quotidiana relacionant els recursos comunitaris amb les necessitats de les persones en situació de dependència.",
    "description_es": "Caracteriza las técnicas de acompañamiento para actividades de relación social y de gestión de la vida cotidiana relacionando los recursos comunitarios con las necesidades de las personas en situación de dependencia.",
    "description_ca": "Caracteritza les tècniques d'acompanyament per a activitats de relació social i de gestió de la vida quotidiana relacionant els recursos comunitaris amb les necessitats de les persones en situació de dependència.",
    "criterios_es": [
      "a) Se ha obtenido información del equipo interdisciplinar para identificar las necesidades de acompañamiento de la persona en situación de dependencia.",
      "b) Se han identificado las actividades de acompañamiento que se han de hacer, tanto en una institución como en el domicilio, respetando los derechos de las personas implicadas.",
      "c) Se han seleccionado criterios y estrategias que favorezcan la autonomía personal de las personas en situación de dependencia en las situaciones de acompañamiento.",
      "d) Se han adaptado los recursos comunitarios de las personas en situación de dependencia al acompañamiento para el disfrute del ocio y el acceso a los recursos, de acuerdo con sus características e intereses personales.",
      "e) Se ha registrado el desarrollo de las actividades de acompañamiento así como las incidencias surgidas durante las mismas.",
      "f) Se han respetado los intereses de las personas en situación de dependencia en la realización de actividades de ocio y tiempo libre.",
      "g) Se ha valorado el respeto a las directrices, orientaciones y protocolos establecidos en las tareas de acompañamiento."
    ],
    "criterios_ca": [
      "a) S'ha obtingut informació de l'equip interdisciplinari per identificar les necessitats d'acompanyament de la persona en situació de dependència.",
      "b) S'han identificat les activitats d'acompanyament que s'han de fer, tant en una institució com en el domicili, respectant els drets de les persones implicades.",
      "c) S'han seleccionat criteris i estratègies que afavoreixin l'autonomia personal de les persones en situació de dependència en les situacions d'acompanyament.",
      "d) S'han adaptat els recursos comunitaris de les persones en situació de dependència a l'acompanyament per al gaudi de l'oci i l'accés als recursos, d'acord amb les seves característiques i els seus interessos personals.",
      "e) S'ha registrat el desenvolupament de les activitats d'acompanyament així com les incidències sorgides durant aquestes.",
      "f) S'han respectat els interessos de les persones en situació de dependència en la realització d'activitats d'oci i temps lliure.",
      "g) S'ha valorat el respecte a les directrius, les orientacions i els protocols establerts en les tasques d'acompanyament."
    ]
  },
  {
    "id": "RA5",
    "module": "Atenció i suport psicosocial",
    "module_es": "Atención y apoyo psicosocial",
    "module_ca": "Atenció i suport psicosocial",
    "moduleCode": "0213",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Descriu estratègies i tècniques d'animació grupal a la institució, analitzant les necessitats de les persones en situació de dependència.",
    "description_es": "Describe estrategias y técnicas de animación grupal en la institución, analizando las necesidades de las personas en situación de dependencia.",
    "description_ca": "Descriu estratègies i tècniques d'animació grupal a la institució, analitzant les necessitats de les persones en situació de dependència.",
    "criterios_es": [
      "a) Se han definido las técnicas de animación para dinamizar las actividades de ocio de las personas en situación de dependencia.",
      "b) Se han descrito las estrategias de animación y motivación que potencien la participación en las actividades que se realizan en una institución concreta.",
      "c) Se han seleccionado recursos específicos de ocio adecuados a las personas en situación de dependencia.",
      "d) Se han analizado los materiales de carácter lúdico adecuados a los usuarios, determinando sus características y sus utilidades.",
      "e) Se han descrito actividades de ocio y tiempo libre, dentro y fuera de la institución, teniendo en cuenta las necesidades de los usuarios.",
      "f) Se ha dispuesto el mantenimiento y control de los recursos de ocio y culturales dentro de la institución.",
      "g) Se han hecho propuestas creativas en el diseño de actividades de animación y eventos especiales en la institución.",
      "h) Se ha justificado el respeto a los intereses de los usuarios y los principios de autodeterminación de la persona dependiente a la hora de ocupar su tiempo libre y participar en actividades de animación de ocio y tiempo libre."
    ],
    "criterios_ca": [
      "a) S'han definit les tècniques d'animació per dinamitzar les activitats d'oci de les persones en situació de dependència.",
      "b) S'han descrit les estratègies d'animació i motivació que potenciïn la participació en les activitats que es duen a terme en una institució concreta.",
      "c) S'han seleccionat recursos específics d'oci adequats a les persones en situació de dependència.",
      "d) S'han analitzat els materials de caràcter lúdic adequats als usuaris, determinant-ne les característiques i les utilitats.",
      "e) S'han descrit activitats d'oci i temps lliure, dins i fora de la institució, tenint en compte les necessitats dels usuaris.",
      "f) S'ha disposat el manteniment i el control dels recursos d'oci i culturals dins la institució.",
      "g) S'han fet propostes creatives en el disseny d'activitats d'animació i esdeveniments especials a la institució.",
      "h) S'ha justificat el respecte als interessos dels usuaris i els principis d'autodeterminació de la persona dependent a l'hora d'ocupar el seu temps lliure i participar en activitats d'animació d'oci i temps lliure."
    ]
  },
  {
    "id": "RA6",
    "module": "Atenció i suport psicosocial",
    "module_es": "Atención y apoyo psicosocial",
    "module_ca": "Atenció i suport psicosocial",
    "moduleCode": "0213",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Prepara informació per als cuidadors no formals, relacionant-ne les demandes i les necessitats amb els recursos comunitaris.",
    "description_es": "Prepara información para los cuidadores no formales, relacionando sus demandas y necesidades con los recursos comunitarios.",
    "description_ca": "Prepara informació per als cuidadors no formals, relacionant-ne les demandes i les necessitats amb els recursos comunitaris.",
    "criterios_es": [
      "a) Se han definido los diferentes recursos comunitarios dirigidos a personas en situación de dependencia.",
      "b) Se ha elaborado un fichero de recursos de apoyo social, ocupacional, de ocio y tiempo libre, y las prestaciones económicas.",
      "c) Se han identificando las vías de acceso y las gestiones necesarias para que los cuidadores informales soliciten las prestaciones más frecuentes.",
      "d) Se han identificado diferentes formatos y modelos de solicitud de ayudas, prestaciones y servicios.",
      "e) Se han utilizado las tecnologías de la información y la comunicación para localizar recursos comunitarios.",
      "f) Se ha justificado el establecimiento de relaciones con las familias y las personas que se encargan de los usuarios.",
      "g) Se ha expresado adecuadamente en el proceso de comunicación con las familias y cuidadores no formales."
    ],
    "criterios_ca": [
      "a) S'han definit els diferents recursos comunitaris adreçats a persones en situació de dependència.",
      "b) S'ha elaborat un fitxer de recursos de suport social, ocupacional, d'oci i temps lliure, i de les prestacions econòmiques.",
      "c) S'han identificat les vies d'accés i les gestions necessàries perquè els cuidadors informals sol·licitin les prestacions més freqüents.",
      "d) S'han identificat diferents formats i models de sol·licitud d'ajudes, prestacions i serveis.",
      "e) S'han utilitzat les tecnologies de la informació i la comunicació per localitzar recursos comunitaris.",
      "f) S'ha justificat l'establiment de relacions amb les famílies i les persones que s'encarreguen dels usuaris.",
      "g) S'ha expressat adequadament en el procés de comunicació amb les famílies i els cuidadors no formals."
    ]
  },
  {
    "id": "RA7",
    "module": "Atenció i suport psicosocial",
    "module_es": "Atención y apoyo psicosocial",
    "module_ca": "Atenció i suport psicosocial",
    "moduleCode": "0213",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Valora el seguiment de les intervencions i les activitats, relacionant la informació extreta de diferents fonts amb els instruments i els protocols d'avaluació.",
    "description_es": "Valora el seguimiento de las intervenciones y actividades, relacionando la información extraída de diferentes fuentes con los instrumentos y protocolos de evaluación.",
    "description_ca": "Valora el seguiment de les intervencions i les activitats, relacionant la informació extreta de diferents fonts amb els instruments i els protocols d'avaluació.",
    "criterios_es": [
      "a) Se han identificado las fuentes de información implicadas en la atención psicosocial de la persona en situación de dependencia.",
      "b) Se han definido los diferentes instrumentos de recogida de información para su uso en el proceso de evaluación de la intervención y valoración de la persona en situación de dependencia.",
      "c) Se han cumplimentado los protocolos específicos de cada intervención y del proceso de evaluación, tanto en el domicilio como en la institución.",
      "d) Se han aplicado instrumentos de registro y transmisión de las observaciones realizadas en el desarrollo de las actividades.",
      "e) Se ha valorado la importancia de los procesos de evaluación en el desarrollo de su labor profesional.",
      "f) Se ha justificado la importancia de la transmisión de la información al equipo interdisciplinar.",
      "g) Se ha argumentado la importancia de la obtención, registro y transmisión de la información para mejorar la calidad del trabajo realizado."
    ],
    "criterios_ca": [
      "a) S'han identificat les fonts d'informació implicades en l'atenció psicosocial de la persona en situació de dependència.",
      "b) S'han definit els diferents instruments de recollida d'informació per a l'ús en el procés d'avaluació de la intervenció i valoració de la persona en situació de dependència.",
      "c) S'han emplenat els protocols específics de cada intervenció i del procés d'avaluació, tant en el domicili com a la institució.",
      "d) S'han aplicat instruments de registre i transmissió de les observacions fetes en el desenvolupament de les activitats.",
      "e) S'ha valorat la importància dels processos d'avaluació en el desenvolupament de la seva tasca professional.",
      "f) S'ha justificat la importància de la transmissió de la informació a l'equip interdisciplinari.",
      "g) S'ha argumentat la importància de l'obtenció, el registre i la transmissió de la informació per millorar la qualitat del treball fet."
    ]
  },
  {
    "id": "RA1",
    "module": "Suport domiciliari",
    "module_es": "Apoyo domiciliario",
    "module_ca": "Suport domiciliari",
    "moduleCode": "0215",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza el pla de treball al domicili de persones en situació de dependència, interpretant les directrius establertes.",
    "description_es": "Organiza el plan de trabajo en el domicilio de personas en situación de dependencia, interpretando las directrices establecidas.",
    "description_ca": "Organitza el pla de treball al domicili de persones en situació de dependència, interpretant les directrius establertes.",
    "criterios_es": [
      "a) Se han identificado las características del plan de trabajo.",
      "b) Se ha descrito la importancia de la adaptación del plan de trabajo a la realidad de la persona en situación de dependencia.",
      "c) Se han identificado las tareas que se han de realizar en el domicilio.",
      "d) Se han secuenciado las tareas domésticas diarias que hay que realizar en el domicilio, en función del plan de trabajo y de las adaptaciones realizadas, si fuera necesario.",
      "e) Se han analizado las necesidades y demandas que se deben cubrir en el domicilio.",
      "f) Se han respetado las características culturales propias de la unidad de convivencia.",
      "g) Se han identificado los diferentes tipos de planes de atención a la persona en situación de dependencia en el domicilio.",
      "h) Se ha valorado la importancia de ajustar la secuencia de la ejecución de actividades, a fin de rentabilizar tiempo y esfuerzos."
    ],
    "criterios_ca": [
      "a) S'han identificat les característiques del pla de treball.",
      "b) S'ha descrit la importància de l'adaptació del pla de treball a la realitat de la persona en situació de dependència.",
      "c) S'han identificat les tasques que s'han de fer al domicili.",
      "d) S'han seqüenciat les tasques domèstiques diàries que s'han de fer al domicili, en funció del pla de treball i de les adaptacions fetes, si fos necessari.",
      "e) S'han analitzat les necessitats i les demandes que s'han de cobrir al domicili.",
      "f) S'han respectat les característiques culturals pròpies de la unitat de convivència.",
      "g) S'han identificat els diferents tipus de plans d'atenció a la persona en situació de dependència al domicili.",
      "h) S'ha valorat la importància d'ajustar la seqüència de l'execució d'activitats, a fi de rendibilitzar temps i esforços."
    ]
  },
  {
    "id": "RA2",
    "module": "Suport domiciliari",
    "module_es": "Apoyo domiciliario",
    "module_ca": "Suport domiciliari",
    "moduleCode": "0215",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Planifica la gestió de la despesa, relacionant les tècniques bàsiques d'administració amb les necessitats de la unitat de convivència.",
    "description_es": "Planifica la gestión del gasto, relacionando las técnicas básicas de administración con las necesidades de la unidad de convivencia.",
    "description_ca": "Planifica la gestió de la despesa, relacionant les tècniques bàsiques d'administració amb les necessitats de la unitat de convivència.",
    "criterios_es": [
      "a) Se ha analizado la documentación relacionada con los gastos de la unidad de convivencia.",
      "b) Se ha reconocido la necesidad de saber interpretar los documentos de gestión domiciliaria.",
      "c) Se ha elaborado un dossier de las partidas de gasto general mensual.",
      "d) Se ha elaborado un dossier de gastos extraordinarios de una unidad de convivencia.",
      "e) Se han enumerado los factores que condicionan la distribución del presupuesto mensual de una unidad de convivencia.",
      "f) Se han enumerado y clasificado los gastos ordinarios y de aprovisionamiento de existencias en una unidad de convivencia tipo.",
      "g) Se han analizado los gastos mensuales de diferentes unidades de convivencia.",
      "h) Se ha valorado la necesidad de equilibrio entre ingresos y gastos."
    ],
    "criterios_ca": [
      "a) S'ha analitzat la documentació relacionada amb les despeses de la unitat de convivència.",
      "b) S'ha reconegut la necessitat de saber interpretar els documents de gestió domiciliària.",
      "c) S'ha elaborat un dossier de les partides de despesa general mensual.",
      "d) S'ha elaborat un dossier de despeses extraordinàries d'una unitat de convivència.",
      "e) S'han enumerat els factors que condicionen la distribució del pressupost mensual d'una unitat de convivència.",
      "f) S'han enumerat i classificat les despeses ordinàries i d'aprovisionament d'existències en una unitat de convivència tipus.",
      "g) S'han analitzat les despeses mensuals de diferents unitats de convivència.",
      "h) S'ha valorat la necessitat d'equilibri entre ingressos i despeses."
    ]
  },
  {
    "id": "RA3",
    "module": "Suport domiciliari",
    "module_es": "Apoyo domiciliario",
    "module_ca": "Suport domiciliari",
    "moduleCode": "0215",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza l'abastiment de la unitat de convivència, descrivint les característiques dels productes.",
    "description_es": "Organiza el abastecimiento de la unidad de convivencia, describiendo las características de los productos.",
    "description_ca": "Organitza l'abastiment de la unitat de convivència, descrivint les característiques dels productes.",
    "criterios_es": [
      "a) Se han analizado diferentes tipos de documentación publicitaria, seleccionando productos.",
      "b) Se han valorado las tecnologías como fuente de información.",
      "c) Se ha determinado la lista de la compra.",
      "d) Se ha analizado el etiquetaje de diferentes productos de consumo y alimentos.",
      "e) Se han identificado los lugares apropiados para el correcto almacenaje de los productos, teniendo en cuenta sus características.",
      "f) Se han enumerado los tipos de establecimientos y servicios destinados a la venta de productos de alimentación, limpieza, higiene y mantenimiento del domicilio.",
      "g) Se han establecido criterios para la colocación de los diferentes productos, atendiendo a criterios de organización, seguridad e higiene."
    ],
    "criterios_ca": [
      "a) S'han analitzat diferents tipus de documentació publicitària, seleccionant productes.",
      "b) S'han valorat les tecnologies com a font d'informació.",
      "c) S'ha determinat la llista de la compra.",
      "d) S'ha analitzat l'etiquetatge de diferents productes de consum i aliments.",
      "e) S'han identificat els llocs apropiats per a l'emmagatzematge correcte dels productes, tenint en compte les seves característiques.",
      "f) S'han enumerat els tipus d'establiments i serveis destinats a la venda de productes d'alimentació, neteja, higiene i manteniment del domicili.",
      "g) S'han establert criteris per a la col·locació dels diferents productes, atenent criteris d'organització, seguretat i higiene."
    ]
  },
  {
    "id": "RA4",
    "module": "Suport domiciliari",
    "module_es": "Apoyo domiciliario",
    "module_ca": "Suport domiciliari",
    "moduleCode": "0215",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Prepara el manteniment del domicili de persones en situació de dependència, seleccionant les tècniques i els productes amb criteris de qualitat, seguretat i higiene.",
    "description_es": "Prepara el mantenimiento del domicilio de personas en situación de dependencia, seleccionando las técnicas y productos con criterios de calidad, seguridad e higiene.",
    "description_ca": "Prepara el manteniment del domicili de persones en situació de dependència, seleccionant les tècniques i els productes amb criteris de qualitat, seguretat i higiene.",
    "criterios_es": [
      "a) Se han analizado diferentes tipos de residuos y basuras que se generan en el domicilio.",
      "b) Se han identificado los tipos, manejo, riesgos y mantenimiento de uso de los electrodomésticos utilizados en el domicilio: lavadora, secadora, plancha, aspiradora y otros.",
      "c) Se han recopilado en un dossier las técnicas de limpieza de suelos, enseres, mobiliario, ventanas y sanitarios.",
      "d) Se han identificado los productos de limpieza y desinfección que hay que utilizar, describiendo sus aplicaciones, riesgos de uso y su ubicación en el domicilio.",
      "e) Se han descrito los riesgos derivados del manejo y uso de las instalaciones eléctricas en el domicilio.",
      "f) Se han descrito las técnicas de lavado de ropa a máquina y a mano, en función de las características de la prenda, del tipo de mancha y del grado de suciedad de la misma.",
      "g) Se ha valorado el cumplimiento de las normas de seguridad, higiene, prevención y eliminación de productos, establecidas para el desarrollo de las actividades de mantenimiento del hogar.",
      "h) Se han descrito las pautas de interpretación del etiquetado de las prendas, clasificando la ropa en función de su posterior proceso de lavado."
    ],
    "criterios_ca": [
      "a) S'han analitzat diferents tipus de residus i fems que es generen al domicili.",
      "b) S'han identificat els tipus, el maneig, els riscs i el manteniment d'ús dels electrodomèstics utilitzats al domicili: rentadora, assecadora, planxa, aspiradora i altres.",
      "c) S'han recopilat en un dossier les tècniques de neteja de sòls, estris, mobiliari, finestres i sanitaris.",
      "d) S'han identificat els productes de neteja i desinfecció que s'han d'utilitzar, descrivint-ne les aplicacions, els riscs d'ús i la ubicació al domicili.",
      "e) S'han descrit els riscs derivats del maneig i l'ús de les instal·lacions elèctriques al domicili.",
      "f) S'han descrit les tècniques de rentat de roba a màquina i a mà, en funció de les característiques de la peça, del tipus de taca i del grau de brutícia.",
      "g) S'ha valorat el compliment de les normes de seguretat, higiene, prevenció i eliminació de productes, establertes per al desenvolupament de les activitats de manteniment de la llar.",
      "h) S'han descrit les pautes d'interpretació de l'etiquetatge de les peces, classificant la roba en funció del procés de rentat posterior."
    ]
  },
  {
    "id": "RA5",
    "module": "Suport domiciliari",
    "module_es": "Apoyo domiciliario",
    "module_ca": "Suport domiciliari",
    "moduleCode": "0215",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Selecciona aliments del menú, relacionant-ne les característiques i les proporcions amb les prescripcions establertes.",
    "description_es": "Selecciona alimentos del menú, relacionando sus características y proporciones con las prescripciones establecidas.",
    "description_ca": "Selecciona aliments del menú, relacionant-ne les característiques i les proporcions amb les prescripcions establertes.",
    "criterios_es": [
      "a) Se han analizado los conceptos básicos relacionados con la alimentación y la nutrición.",
      "b) Se han clasificado los alimentos en función de sus características.",
      "c) Se han identificado las características de una dieta saludable, así como los tipos de alimentos que debe incluir.",
      "d) Se han identificado las raciones y medidas caseras.",
      "e) Se ha analizado el etiquetado nutricional de alimentos envasados.",
      "f) Se han seleccionado los alimentos que deben formar parte de la ingesta diaria, teniendo en cuenta las prescripciones establecidas.",
      "g) Se ha valorado la importancia de una dieta saludable."
    ],
    "criterios_ca": [
      "a) S'han analitzat els conceptes bàsics relacionats amb l'alimentació i la nutrició.",
      "b) S'han classificat els aliments en funció de les seves característiques.",
      "c) S'han identificat les característiques d'una dieta saludable, així com els tipus d'aliments que ha d'incloure.",
      "d) S'han identificat les racions i mesures casolanes.",
      "e) S'ha analitzat l'etiquetatge nutricional d'aliments envasats.",
      "f) S'han seleccionat els aliments que han de formar part de la ingesta diària, tenint en compte les prescripcions establertes.",
      "g) S'ha valorat la importància d'una dieta saludable."
    ]
  },
  {
    "id": "RA6",
    "module": "Suport domiciliari",
    "module_es": "Apoyo domiciliario",
    "module_ca": "Suport domiciliari",
    "moduleCode": "0215",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques bàsiques de cuina en el procés de preparació amb tècniques bàsiques de cuina, relacionant-lo amb les necessitats de la persona usuària i els protocols establerts.",
    "description_es": "Aplica técnicas básicas de cocina en el proceso de preparación con técnicas básicas de cocina, relacionándolo con las necesidades de la persona usuaria y los protocolos establecidos.",
    "description_ca": "Aplica tècniques bàsiques de cuina en el procés de preparació amb tècniques bàsiques de cuina, relacionant-lo amb les necessitats de la persona usuària i els protocols establerts.",
    "criterios_es": [
      "a) Se ha reconocido la necesidad de aplicar medidas de higiene, prevención de riesgos y eliminación de productos, en la preparación de los alimentos.",
      "b) Se han identificado las técnicas culinarias básicas de aplicación en la cocina familiar, indicando en cada caso las fases de aplicación, procedimientos, tiempos y menaje.",
      "c) Se han recopilado recetas de cocina, ajustando las cantidades y los tiempos en función del número de comensales y sus necesidades específicas.",
      "d) Se han identificado los procedimientos previos al cocinado: descongelado, cortado, pelado, troceado y lavado de los diferentes productos.",
      "e) Se han clasificado los materiales, utensilios y electrodomésticos necesarios para proceder a la preelaboración de los alimentos: descongelar, cortar, pelar y lavar.",
      "f) Se han aplicado técnicas básicas de cocina para la elaboración de primeros platos, segundos platos y postres adecuados a la dieta de los miembros de la unidad de convivencia.",
      "g) Se ha reconocido la necesidad de cumplir las normas de seguridad e higiene establecidas para la manipulación y procesado de alimentos.",
      "h) Se ha valorado la importancia de la presentación de los alimentos."
    ],
    "criterios_ca": [
      "a) S'ha reconegut la necessitat d'aplicar mesures d'higiene, prevenció de riscs i eliminació de productes, en la preparació dels aliments.",
      "b) S'han identificat les tècniques culinàries bàsiques d'aplicació a la cuina familiar, indicant en cada cas les fases d'aplicació, els procediments, els temps i els estris.",
      "c) S'han recopilat receptes de cuina, ajustant les quantitats i els temps en funció del nombre de comensals i les seves necessitats específiques.",
      "d) S'han identificat els procediments previs al cuinat: descongelat, tallat, pelat, trossejat i rentat dels diferents productes.",
      "e) S'han classificat els materials, utensilis i electrodomèstics necessaris per procedir a la preelaboració dels aliments: descongelar, tallar, pelar i rentar.",
      "f) S'han aplicat tècniques bàsiques de cuina per a l'elaboració de primers plats, segons plats i postres adequats a la dieta dels membres de la unitat de convivència.",
      "g) S'ha reconegut la necessitat de complir les normes de seguretat i higiene establertes per a la manipulació i el processament d'aliments.",
      "h) S'ha valorat la importància de la presentació dels aliments."
    ]
  },
  {
    "id": "RA7",
    "module": "Suport domiciliari",
    "module_es": "Apoyo domiciliario",
    "module_ca": "Suport domiciliari",
    "moduleCode": "0215",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Fa el seguiment del pla de treball al domicili de persones en situació de dependència, descrivint el protocol establert.",
    "description_es": "Realiza el seguimiento del plan de trabajo en el domicilio de personas en situación de dependencia, describiendo el protocolo establecido.",
    "description_ca": "Fa el seguiment del pla de treball al domicili de persones en situació de dependència, descrivint el protocol establert.",
    "criterios_es": [
      "a) Se han identificado las fuentes de información, las técnicas de seguimiento y la detección de situaciones de riesgo.",
      "b) Se han analizado los distintos recursos, seleccionándolos según las necesidades de las personas en situación de dependencia.",
      "c) Se han registrado los datos en el soporte establecido.",
      "d) Se ha interpretado correctamente la información recogida.",
      "e) Se han identificado las situaciones en las que es necesaria la colaboración de otros profesionales.",
      "f) Se ha valorado la importancia de la evaluación para mejorar la calidad del servicio."
    ],
    "criterios_ca": [
      "a) S'han identificat les fonts d'informació, les tècniques de seguiment i la detecció de situacions de risc.",
      "b) S'han analitzat els diferents recursos, seleccionant-los segons les necessitats de les persones en situació de dependència.",
      "c) S'han registrat les dades en el suport establert.",
      "d) S'ha interpretat correctament la informació recollida.",
      "e) S'han identificat les situacions en què és necessària la col·laboració d'altres professionals.",
      "f) S'ha valorat la importància de l'avaluació per millorar la qualitat del servei."
    ]
  },
  {
    "id": "RA1",
    "module": "Atenció higiènica",
    "module_es": "Atención higiénica",
    "module_ca": "Atenció higiènica",
    "moduleCode": "0217",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza les activitats d'higiene de les persones en situació de dependència i el seu entorn relacionant-les amb les característiques i les necessitats d'aquestes.",
    "description_es": "Organiza las actividades de higiene de las personas en situación de dependencia y su entorno relacionándolas con las características y necesidades de las mismas.",
    "description_ca": "Organitza les activitats d'higiene de les persones en situació de dependència i el seu entorn relacionant-les amb les característiques i les necessitats d'aquestes.",
    "criterios_es": [
      "a) Se ha interpretado el plan de cuidados individualizado de la persona en situación de dependencia.",
      "b) Se han identificado las atenciones higiénicas requeridas por una persona, teniendo en cuenta su estado de salud y nivel de dependencia.",
      "c) Se han relacionado las circunstancias de la persona en situación de dependencia con las dificultades que implican en su vida cotidiana.",
      "d) Se han identificado las características del entorno que favorecen o dificultan la autonomía de la persona y su estado de higiene personal.",
      "e) Se ha comprobado que las condiciones ambientales son adecuadas para atender a las necesidades específicas de la persona.",
      "f) Se ha argumentado la necesidad de conocer las posibilidades de autonomía y participación de la persona en las actividades higiénico-sanitarias y de mantenimiento de sus capacidades físicas.",
      "g) Se han seleccionado los recursos necesarios indicados en el plan de cuidados individualizado o en el plan de vida independiente.",
      "h) Se han propuesto ayudas técnicas adecuadas para facilitar la autonomía de la persona en la satisfacción de sus necesidades de higiene."
    ],
    "criterios_ca": [
      "a) S'ha interpretat el pla de cures individualitzat de la persona en situació de dependència.",
      "b) S'han identificat les atencions higièniques requerides per una persona, tenint en compte el seu estat de salut i nivell de dependència.",
      "c) S'han relacionat les circumstàncies de la persona en situació de dependència amb les dificultats que impliquen en la seva vida quotidiana.",
      "d) S'han identificat les característiques de l'entorn que afavoreixen o dificulten l'autonomia de la persona i el seu estat d'higiene personal.",
      "e) S'ha comprovat que les condicions ambientals són adequades per atendre les necessitats específiques de la persona.",
      "f) S'ha argumentat la necessitat de conèixer les possibilitats d'autonomia i participació de la persona en les activitats higienicosanitàries i de manteniment de les seves capacitats físiques.",
      "g) S'han seleccionat els recursos necessaris indicats en el pla de cures individualitzat o en el pla de vida independent.",
      "h) S'han proposat ajudes tècniques adequades per facilitar l'autonomia de la persona en la satisfacció de les seves necessitats d'higiene."
    ]
  },
  {
    "id": "RA2",
    "module": "Atenció higiènica",
    "module_es": "Atención higiénica",
    "module_ca": "Atenció higiènica",
    "moduleCode": "0217",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques d'higiene i neteja personal, analitzant les necessitats i les condicions de la persona en situació de dependència i el seu entorn.",
    "description_es": "Aplica técnicas de higiene y aseo personal, analizando las necesidades y condiciones de la persona en situación de dependencia y su entorno.",
    "description_ca": "Aplica tècniques d'higiene i neteja personal, analitzant les necessitats i les condicions de la persona en situació de dependència i el seu entorn.",
    "criterios_es": [
      "a) Se han explicado las principales medidas preventivas de las úlceras por presión así como los productos sanitarios para su prevención y tratamiento.",
      "b) Se han aplicado los procedimientos de aseo e higiene personal, total o parcial, en función del estado y necesidades de la persona.",
      "c) Se han realizado técnicas de vestido y calzado, teniendo en cuenta las necesidades y nivel de autonomía de la persona.",
      "d) Se ha mostrado sensibilidad hacia la necesidad de potenciar la autonomía de la persona.",
      "e) Se han descrito las técnicas de recogida de muestras y eliminaciones, teniendo en cuenta las características de la persona en situación de dependencia.",
      "f) Se han aplicado los procedimientos básicos postmorten siguiendo el protocolo establecido.",
      "g) Se han adoptado medidas de prevención y seguridad así como de protección individual en el transcurso de las actividades de higiene.",
      "h) Se ha informado a las personas en situación de dependencia y cuidadores no profesionales con respecto a los hábitos higiénicos saludables así como sobre los productos y materiales necesarios y su correcta utilización."
    ],
    "criterios_ca": [
      "a) S'han explicat les principals mesures preventives de les nafres per pressió així com els productes sanitaris per a la seva prevenció i tractament.",
      "b) S'han aplicat els procediments de neteja i higiene personal, total o parcial, en funció de l'estat i les necessitats de la persona.",
      "c) S'han fet tècniques de vestit i calçat, tenint en compte les necessitats i el nivell d'autonomia de la persona.",
      "d) S'ha mostrat sensibilitat envers la necessitat de potenciar l'autonomia de la persona.",
      "e) S'han descrit les tècniques de recollida de mostres i eliminacions, tenint en compte les característiques de la persona en situació de dependència.",
      "f) S'han aplicat els procediments bàsics postmòrtem seguint el protocol establert.",
      "g) S'han adoptat mesures de prevenció i seguretat així com de protecció individual durant les activitats d'higiene.",
      "h) S'ha informat les persones en situació de dependència i els cuidadors no professionals respecte als hàbits higiènics saludables així com sobre els productes i materials necessaris i la seva correcta utilització."
    ]
  },
  {
    "id": "RA3",
    "module": "Atenció higiènica",
    "module_es": "Atención higiénica",
    "module_ca": "Atenció higiènica",
    "moduleCode": "0217",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques d'higiene de l'entorn, seleccionant els procediments i materials amb criteris d'eficàcia, prevenció i seguretat.",
    "description_es": "Aplica técnicas de higiene del entorno, seleccionando los procedimientos y materiales con criterios de eficacia, prevención y seguridad.",
    "description_ca": "Aplica tècniques d'higiene de l'entorn, seleccionant els procediments i materials amb criteris d'eficàcia, prevenció i seguretat.",
    "criterios_es": [
      "a) Se han descrito las condiciones higiénico-sanitarias y de orden de la habitación de la persona usuaria.",
      "b) Se han aplicado distintas técnicas de realización y limpieza de la cama de la persona usuaria, adaptándolas al estado y condiciones de la misma, para favorecer su comodidad y confort.",
      "c) Se han descrito las medidas generales de prevención de las enfermedades transmisibles.",
      "d) Se han descrito los principios de las técnicas de aislamiento en función del estado de la persona.",
      "e) Se han aplicado los métodos y técnicas de limpieza, desinfección y esterilización de materiales de uso común respetando los controles de calidad de dichos procesos y la normativa en el tratamiento de residuos.",
      "f) Se han adoptado medidas de prevención y seguridad así como de protección individual en el transcurso de las actividades de higiene.",
      "g) Se ha informado a la persona usuaria, la familia o cuidadores informales con respecto a las condiciones higiénicas que debe reunir el entorno.",
      "h) Se ha informado a la persona usuaria y a los cuidadores no profesionales con respecto a la utilización de los productos y materiales necesarios para la higiene del entorno."
    ],
    "criterios_ca": [
      "a) S'han descrit les condicions higienicosanitàries i d'ordre de l'habitació de la persona usuària.",
      "b) S'han aplicat diferents tècniques de realització i neteja del llit de la persona usuària, adaptant-les a l'estat i les condicions d'aquesta, per afavorir-ne la comoditat i el confort.",
      "c) S'han descrit les mesures generals de prevenció de les malalties transmissibles.",
      "d) S'han descrit els principis de les tècniques d'aïllament en funció de l'estat de la persona.",
      "e) S'han aplicat els mètodes i tècniques de neteja, desinfecció i esterilització de materials d'ús comú respectant els controls de qualitat d'aquests processos i la normativa en el tractament de residus.",
      "f) S'han adoptat mesures de prevenció i seguretat així com de protecció individual durant les activitats d'higiene.",
      "g) S'ha informat la persona usuària, la família o els cuidadors informals respecte a les condicions higièniques que ha de reunir l'entorn.",
      "h) S'ha informat la persona usuària i els cuidadors no professionals respecte a la utilització dels productes i materials necessaris per a la higiene de l'entorn."
    ]
  },
  {
    "id": "RA4",
    "module": "Atenció higiènica",
    "module_es": "Atención higiénica",
    "module_ca": "Atenció higiènica",
    "moduleCode": "0217",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Fa el control i el seguiment de les activitats d'atenció higiènica, analitzant els protocols d'observació i registre establerts.",
    "description_es": "Realiza el control y seguimiento de las actividades de atención higiénica, analizando los protocolos de observación y registro establecidos.",
    "description_ca": "Fa el control i el seguiment de les activitats d'atenció higiènica, analitzant els protocols d'observació i registre establerts.",
    "criterios_es": [
      "a) Se han identificado las características que deben reunir los protocolos de observación, control y seguimiento del estado de higiene personal de las personas usuarias y de su entorno.",
      "b) Se ha recogido información sobre las actividades relativas a la higiene de la persona usuaria y de su entorno y a las contingencias que se hayan presentado.",
      "c) Se han cumplimentado protocolos de observación, manuales e informatizados, siguiendo las pautas establecidas en cada caso.",
      "d) Se ha obtenido información de la persona o personas a su cargo mediante diferentes instrumentos.",
      "e) Se han aplicado las técnicas e instrumentos de observación previstos para realizar el seguimiento de la evolución de la persona, registrando los datos obtenidos según el procedimiento establecido.",
      "f) Se ha transmitido la información por los procedimientos establecidos y en el momento oportuno.",
      "g) Se ha argumentado la importancia del control y seguimiento de la atención higiénica de la persona usuaria para mejorar su bienestar."
    ],
    "criterios_ca": [
      "a) S'han identificat les característiques que han de reunir els protocols d'observació, control i seguiment de l'estat d'higiene personal de les persones usuàries i del seu entorn.",
      "b) S'ha recollit informació sobre les activitats relatives a la higiene de la persona usuària i del seu entorn i a les contingències que s'hagin presentat.",
      "c) S'han emplenat protocols d'observació, manuals i informatitzats, seguint les pautes establertes en cada cas.",
      "d) S'ha obtingut informació de la persona o les persones a càrrec seu mitjançant diferents instruments.",
      "e) S'han aplicat les tècniques i els instruments d'observació previstos per fer el seguiment de l'evolució de la persona, registrant les dades obtingudes segons el procediment establert.",
      "f) S'ha transmès la informació pels procediments establerts i en el moment oportú.",
      "g) S'ha argumentat la importància del control i el seguiment de l'atenció higiènica de la persona usuària per millorar-ne el benestar."
    ]
  },
  {
    "id": "RA1",
    "module": "Digitalització aplicada als sectors productius",
    "module_es": "Digitalización aplicada a los sectores productivos",
    "module_ca": "Digitalització aplicada als sectors productius",
    "moduleCode": "1664",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Estableix les diferències entre l'Economia Lineal (EL) i l'Economia Circular (EC), identificant els avantatges de la EC en relació amb el medi ambient i el desenvolupament sostenible.",
    "description_es": "Establece las diferencias entre la Economía Lineal (EL) y la Economía Circular (EC), identificando las ventajas de la EC en relación con el medioambiente y el desarrollo sostenible.",
    "description_ca": "Estableix les diferències entre l'Economia Lineal (EL) i l'Economia Circular (EC), identificant els avantatges de la EC en relació amb el medi ambient i el desenvolupament sostenible.",
    "criterios_es": [
      "a) Se han identificado las etapas «típicas» de los modelos basados en EL y modelos basados en EC.",
      "b) Se ha analizado cada etapa de los modelos EL y EC y su repercusión en el medio ambiente.",
      "c) Se ha valorado la importancia del reciclaje en los modelos económicos.",
      "d) Se han identificado procesos reales basados en EL.",
      "e) Se han identificado procesos reales basados en EC.",
      "f) Se han comparado los modelos anteriores en relación con su impacto medioambiental y los ODS (Objetivos de Desarrollo Sostenible)."
    ],
    "criterios_ca": [
      "a) S'han identificat les etapes «típiques» dels models basats en EL i models basats en EC.",
      "b) S'ha analitzat cada etapa dels models EL i EC i la seva repercussió en el medi ambient.",
      "c) S'ha valorat la importància del reciclatge en els models econòmics.",
      "d) S'han identificat processos reals basats en EL.",
      "e) S'han identificat processos reals basats en EC.",
      "f) S'han comparat els models anteriors en relació amb el seu impacte mediambiental i els ODS (Objectius de Desenvolupament Sostenible)."
    ]
  },
  {
    "id": "RA2",
    "module": "Digitalització aplicada als sectors productius",
    "module_es": "Digitalización aplicada a los sectores productivos",
    "module_ca": "Digitalització aplicada als sectors productius",
    "moduleCode": "1664",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Caracteritza els principals aspectes de la 4a Revolució Industrial indicant els canvis i els avantatges que es produeixen tant des del punt de vista dels clients com de les empreses.",
    "description_es": "Caracteriza los principales aspectos de la 4.ª Revolución Industrial indicando los cambios y las ventajas que se producen tanto desde el punto de vista de los clientes como de las empresas.",
    "description_ca": "Caracteritza els principals aspectes de la 4a Revolució Industrial indicant els canvis i els avantatges que es produeixen tant des del punt de vista dels clients com de les empreses.",
    "criterios_es": [
      "a) Se han relacionado los sistemas ciber físicos con la evolución industrial.",
      "b) Se ha analizado el cambio producido en los sistemas automatizados.",
      "c) Se ha descrito la combinación de la parte física de las industrias con el software, IoT (Internet de las cosas), comunicaciones, entre otros.",
      "d) Se ha descrito la interrelación entre el mundo físico y el virtual.",
      "e) Se ha relacionado la migración a entornos 4.0 con la mejora de los resultados de las empresas.",
      "f) Se han identificado las ventajas para clientes y empresas."
    ],
    "criterios_ca": [
      "a) S'han relacionat els sistemes ciberfísics amb l'evolució industrial.",
      "b) S'ha analitzat el canvi produït en els sistemes automatitzats.",
      "c) S'ha descrit la combinació de la part física de les indústries amb el programari, IoT (Internet de les coses), comunicacions, entre d'altres.",
      "d) S'ha descrit la interrelació entre el món físic i el virtual.",
      "e) S'ha relacionat la migració a entorns 4.0 amb la millora dels resultats de les empreses.",
      "f) S'han identificat els avantatges per a clients i empreses."
    ]
  },
  {
    "id": "RA3",
    "module": "Digitalització aplicada als sectors productius",
    "module_es": "Digitalización aplicada a los sectores productivos",
    "module_ca": "Digitalització aplicada als sectors productius",
    "moduleCode": "1664",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Identifica l'estructura dels sistemes basats en cloud/núvol descrivint la seva tipologia i camp d'aplicació.",
    "description_es": "Identifica la estructura de los sistemas basados en cloud/nube describiendo su tipología y campo de aplicación.",
    "description_ca": "Identifica l'estructura dels sistemes basats en cloud/núvol descrivint la seva tipologia i camp d'aplicació.",
    "criterios_es": [
      "a) Se han identificado los diferentes niveles de la cloud/nube.",
      "b) Se han identificado las principales funciones de la cloud/nube (procesamiento de datos, intercambio de información, ejecución de aplicaciones, entre otros).",
      "c) Se ha descrito el concepto de edge computing y su relación con la cloud/nube.",
      "d) Se han definido los conceptos de fog y mist y sus zonas de aplicación en el conjunto.",
      "e) Se han identificado las ventajas que proporciona la utilización de la cloud/nube en los sistemas conectados."
    ],
    "criterios_ca": [
      "a) S'han identificat els diferents nivells del cloud/núvol.",
      "b) S'han identificat les principals funcions del cloud/núvol (processament de dades, intercanvi d'informació, execució d'aplicacions, entre d'altres).",
      "c) S'ha descrit el concepte d'edge computing i la seva relació amb el cloud/núvol.",
      "d) S'han definit els conceptes de fog i mist i les seves zones d'aplicació en el conjunt.",
      "e) S'han identificat els avantatges que proporciona la utilització del cloud/núvol en els sistemes connectats."
    ]
  },
  {
    "id": "RA4",
    "module": "Digitalització aplicada als sectors productius",
    "module_es": "Digitalización aplicada a los sectores productivos",
    "module_ca": "Digitalització aplicada als sectors productius",
    "moduleCode": "1664",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Compara els sistemes de producció/prestació de serveis digitalitzats amb els sistemes clàssics identificant les millores introduïdes.",
    "description_es": "Compara los sistemas de producción/prestación de servicios digitalizados con los sistemas clásicos identificando las mejoras introducidas.",
    "description_ca": "Compara els sistemes de producció/prestació de serveis digitalitzats amb els sistemes clàssics identificant les millores introduïdes.",
    "criterios_es": [
      "a) Se han identificado las tecnologías habilitadoras (THD) actuales que definen un sistema digitalizado.",
      "b) Se han descrito las características y aplicaciones del IoT, IA (Inteligencia Artificial), Big Data, tecnología 5G, la robótica colaborativa, Blockchain, Ciberseguridad, fabricación aditiva, realidad virtual, gemelos digitales, entre otras.",
      "c) Se ha descrito la contribución de las THD a la mejora de la productividad y la eficiencia de los sistemas productivos o de prestación de servicios.",
      "d) Se ha relacionado la alineación entre las unidades funcionales de las empresas que conforman el sistema y el objetivo del mismo.",
      "e) Se ha relacionado la implantación de las tecnologías habilitadoras (sensórica, tratamiento de datos, automatización y comunicaciones, entre otras) con la reducción de costes y la mejora de la competitividad.",
      "f) Se han relacionado las tecnologías disruptivas con aplicaciones concretas en los sectores productivos.",
      "g) Se han definido los sistemas de almacenamiento de datos no convencionales y el acceso a los mismos desde cada unidad.",
      "h) Se han descrito las mejoras producidas en el sistema y en cada una de sus etapas."
    ],
    "criterios_ca": [
      "a) S'han identificat les tecnologies habilitadores (THD) actuals que defineixen un sistema digitalitzat.",
      "b) S'han descrit les característiques i aplicacions de l'IoT, IA (Intel·ligència Artificial), Big Data, tecnologia 5G, la robòtica col·laborativa, Blockchain, Ciberseguretat, fabricació additiva, realitat virtual, bessons digitals, entre d'altres.",
      "c) S'ha descrit la contribució de les THD a la millora de la productivitat i l'eficiència dels sistemes productius o de prestació de serveis.",
      "d) S'ha relacionat l'alineació entre les unitats funcionals de les empreses que conformen el sistema i l'objectiu del mateix.",
      "e) S'ha relacionat la implantació de les tecnologies habilitadores (sensòrica, tractament de dades, automatització i comunicacions, entre d'altres) amb la reducció de costos i la millora de la competitivitat.",
      "f) S'han relacionat les tecnologies disruptives amb aplicacions concretes en els sectors productius.",
      "g) S'han definit els sistemes d'emmagatzematge de dades no convencionals i l'accés als mateixos des de cada unitat.",
      "h) S'han descrit les millores produïdes en el sistema i en cadascuna de les seves etapes."
    ]
  },
  {
    "id": "RA5",
    "module": "Digitalització aplicada als sectors productius",
    "module_es": "Digitalización aplicada a los sectores productivos",
    "module_ca": "Digitalització aplicada als sectors productius",
    "moduleCode": "1664",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Elabora un pla de transformació d'una empresa clàssica del sector en què s'emmarca el títol, basada en una EL, al concepte 4.0, determinant els canvis a introduir en les principals fases del sistema i indicant com afectaria els recursos humans.",
    "description_es": "Elabora un plan de transformación de una empresa clásica del sector en el que se enmarca el título, basada en una EL, al concepto 4.0, determinando los cambios a introducir en las principales fases del sistema e indicando como afectaría a los recursos humanos.",
    "description_ca": "Elabora un pla de transformació d'una empresa clàssica del sector en què s'emmarca el títol, basada en una EL, al concepte 4.0, determinant els canvis a introduir en les principals fases del sistema i indicant com afectaria els recursos humans.",
    "criterios_es": [
      "a) Se ha definido a nivel de bloques el diagrama de funcionamiento de la empresa clásica.",
      "b) Se han identificado las etapas susceptibles de ser digitalizadas.",
      "c) Se han definido las tecnologías implicadas en cada una de las etapas.",
      "d) Se ha establecido la conexión de las etapas digitalizadas con el resto del sistema.",
      "e) Se ha elaborado un diagrama de bloques del sistema digitalizado.",
      "f) Se ha elaborado un informe de viabilidad y de las mejoras introducidas.",
      "g) Se ha analizado la mejora en la producción y gestión de residuos, entre otras.",
      "h) Se ha elaborado un documento con la secuencia del plan de transformación y los recursos empleados."
    ],
    "criterios_ca": [
      "a) S'ha definit a nivell de blocs el diagrama de funcionament de l'empresa clàssica.",
      "b) S'han identificat les etapes susceptibles de ser digitalitzades.",
      "c) S'han definit les tecnologies implicades en cadascuna de les etapes.",
      "d) S'ha establert la connexió de les etapes digitalitzades amb la resta del sistema.",
      "e) S'ha elaborat un diagrama de blocs del sistema digitalitzat.",
      "f) S'ha elaborat un informe de viabilitat i de les millores introduïdes.",
      "g) S'ha analitzat la millora en la producció i gestió de residus, entre d'altres.",
      "h) S'ha elaborat un document amb la seqüència del pla de transformació i els recursos emprats."
    ]
  },
  {
    "id": "RA1",
    "module": "Itinerari personal per a l'ocupabilitat I",
    "module_es": "Itinerario personal para la empleabilidad I",
    "module_ca": "Itinerari personal per a l'ocupabilitat I",
    "moduleCode": "1709",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Distingeix les característiques del sector productiu i defineix els llocs de treball relacionant-los amb les competències professionals expressades en el títol.",
    "description_es": "Distingue las características del sector productivo y define los puestos de trabajo relacionándolos con las competencias profesionales expresadas en el título.",
    "description_ca": "Distingeix les característiques del sector productiu i defineix els llocs de treball relacionant-los amb les competències professionals expressades en el títol.",
    "criterios_es": [
      "a) Se han analizado las principales oportunidades de empleo y de inserción laboral en el sector profesional, identificando las posibilidades de empleo y analizado sus requerimientos actuales para el perfil profesional.",
      "b) Se ha comparado los diferentes requerimientos exigidos por el mercado laboral con las exigencias para el trabajo en la función pública relacionados con el sector privado.",
      "c) Se ha reflexionado sobre las actitudes y aptitudes requeridas actualmente para la actividad profesional relacionadas con el título, así como las competencias personales y sociales más relevantes para el sector identificando nuestra zona de desarrollo próximo."
    ],
    "criterios_ca": [
      "a) S'han analitzat les principals oportunitats d'ocupació i d'inserció laboral en el sector professional, identificant les possibilitats d'ocupació i analitzat els seus requeriments actuals per al perfil professional.",
      "b) S'han comparat els diferents requeriments exigits pel mercat laboral amb les exigències per al treball en la funció pública relacionats amb el sector privat.",
      "c) S'ha reflexionat sobre les actituds i aptituds requerides actualment per a l'activitat professional relacionades amb el títol, així com les competències personals i socials més rellevants per al sector identificant la nostra zona de desenvolupament proper."
    ]
  },
  {
    "id": "RA2",
    "module": "Itinerari personal per a l'ocupabilitat I",
    "module_es": "Itinerario personal para la empleabilidad I",
    "module_ca": "Itinerari personal per a l'ocupabilitat I",
    "moduleCode": "1709",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Adquireix les competències necessàries per a l'acompliment de les funcions de nivell bàsic en Prevenció de Riscos Laborals.",
    "description_es": "Adquiere las competencias necesarias para el desempeño de las funciones de nivel básico en Prevención de Riesgos Laborales.",
    "description_ca": "Adquireix les competències necessàries per a l'acompliment de les funcions de nivell bàsic en Prevenció de Riscos Laborals.",
    "criterios_es": [
      "a) Se ha valorado la importancia de la cultura preventiva en todos los ámbitos actividades de la empresa u organismo equiparado relacionado las condiciones laborales con la salud de la persona trabajadora identificando y clasificando los factores de riesgo en la actividad y los daños derivados de los mismos, especialmente las situaciones de riesgo más habituales en los entornos de trabajo del sector profesional relacionado con el título.",
      "b) Se han clasificado y descrito los tipos de daños profesionales, con especial referencia a accidentes de trabajo y enfermedades profesionales, relacionados con el perfil profesional del título.",
      "c) Se ha determinado la evaluación de riesgos en la empresa u organismo equiparado y definido las técnicas de prevención y de protección que deben aplicarse para evitar los daños en su origen y minimizar sus consecuencias.",
      "d) Se han analizado los protocolos de actuación en caso de emergencia.",
      "e) Se han determinado los principales derechos y deberes en materia de prevención de riesgos laborales.",
      "f) Se han clasificado las distintas formas de gestión de la prevención en la empresa u organismo equiparado, en función de los distintos criterios establecidos en la normativa sobre prevención de riesgos laborales y determinado las formas de representación de las personas trabajadoras en la empresa u organismo equiparado en materia de prevención de riesgos.",
      "g) Se ha valorado la importancia de la existencia de un plan preventivo en la empresa u organismo equiparado que incluya la secuenciación de actuaciones a realizar en caso de emergencia y reflexionado sobre el contenido del mismo.",
      "h) Se han determinado los requisitos y condiciones para la vigilancia de la salud de la persona trabajadora y su importancia como medida de prevención.",
      "i) Se han identificado las técnicas básicas de primeros auxilios que han de ser aplicadas en el lugar del accidente ante distintos tipos de daños y la composición y uso del botiquín."
    ],
    "criterios_ca": [
      "a) S'ha valorat la importància de la cultura preventiva en tots els àmbits d'activitats de l'empresa o organisme equiparat relacionant les condicions laborals amb la salut de la persona treballadora identificant i classificant els factors de risc en l'activitat i els danys derivats d'aquests, especialment les situacions de risc més habituals en els entorns de treball del sector professional relacionat amb el títol.",
      "b) S'han classificat i descrit els tipus de danys professionals, amb especial referència a accidents de treball i malalties professionals, relacionats amb el perfil professional del títol.",
      "c) S'ha determinat l'avaluació de riscos en l'empresa o organisme equiparat i definit les tècniques de prevenció i de protecció que s'han d'aplicar per evitar els danys en el seu origen i minimitzar les seves conseqüències.",
      "d) S'han analitzat els protocols d'actuació en cas d'emergència.",
      "e) S'han determinat els principals drets i deures en matèria de prevenció de riscos laborals.",
      "f) S'han classificat les diferents formes de gestió de la prevenció en l'empresa o organisme equiparat, en funció dels diferents criteris establerts en la normativa sobre prevenció de riscos laborals i determinat les formes de representació de les persones treballadores en l'empresa o organisme equiparat en matèria de prevenció de riscos.",
      "g) S'ha valorat la importància de l'existència d'un pla preventiu en l'empresa o organisme equiparat que inclogui la seqüenciació d'actuacions a realitzar en cas d'emergència i reflexionat sobre el contingut del mateix.",
      "h) S'han determinat els requisits i condicions per a la vigilància de la salut de la persona treballadora i la seva importància com a mesura de prevenció.",
      "i) S'han identificat les tècniques bàsiques de primers auxilis que han de ser aplicades en el lloc de l'accident davant diferents tipus de danys i la composició i ús de la farmaciola."
    ]
  },
  {
    "id": "RA3",
    "module": "Itinerari personal per a l'ocupabilitat I",
    "module_es": "Itinerario personal para la empleabilidad I",
    "module_ca": "Itinerari personal per a l'ocupabilitat I",
    "moduleCode": "1709",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Analitza les seves condicions laborals com a persona treballadora per compte aliè identificant-les en els principals tipus de canvis i vicissituds rellevants que es poden presentar en la relació laboral en la normativa laboral i especialment en el conveni col·lectiu del sector.",
    "description_es": "Analiza sus condiciones laborales como persona trabajadora por cuenta ajena identificándolas en los principales tipos de cambios y vicisitudes relevantes que se pueden presentar en la relación laboral en la normativa laboral y especialmente en el convenio colectivo del sector.",
    "description_ca": "Analitza les seves condicions laborals com a persona treballadora per compte aliè identificant-les en els principals tipus de canvis i vicissituds rellevants que es poden presentar en la relació laboral en la normativa laboral i especialment en el conveni col·lectiu del sector.",
    "criterios_es": [
      "a) Se han analizado los derechos y obligaciones derivados de la relación laboral, así como las condiciones de trabajo pactadas en un convenio colectivo aplicable al sector profesional relacionado con el título.",
      "b) Se han comparado las principales modalidades de contratación, localizando los diferentes modelos en las fuentes oficiales.",
      "c) Se han identificado las características definitorias de los nuevos entornos de organización del trabajo y los derechos que conlleva.",
      "d) Se han identificado los diferentes componentes del recibo de salario.",
      "e) Se han identificado los recursos laborales existentes ante las diferentes vicisitudes que se pueden dar en la relación laboral.",
      "f) Se ha valorado el papel de la Seguridad Social como pilar esencial para la mejora de la calidad de vida de los ciudadanos.",
      "g) Se han analizado las principales prestaciones derivadas de la suspensión y extinción de la relación laboral."
    ],
    "criterios_ca": [
      "a) S'han analitzat els drets i obligacions derivats de la relació laboral, així com les condicions de treball pactades en un conveni col·lectiu aplicable al sector professional relacionat amb el títol.",
      "b) S'han comparat les principals modalitats de contractació, localitzant els diferents models en les fonts oficials.",
      "c) S'han identificat les característiques definitòries dels nous entorns d'organització del treball i els drets que comporta.",
      "d) S'han identificat els diferents components del rebut de salari.",
      "e) S'han identificat els recursos laborals existents davant les diferents vicissituds que es poden donar en la relació laboral.",
      "f) S'ha valorat el paper de la Seguretat Social com a pilar essencial per a la millora de la qualitat de vida dels ciutadans.",
      "g) S'han analitzat les principals prestacions derivades de la suspensió i extinció de la relació laboral."
    ]
  },
  {
    "id": "RA4",
    "module": "Itinerari personal per a l'ocupabilitat I",
    "module_es": "Itinerario personal para la empleabilidad I",
    "module_ca": "Itinerari personal per a l'ocupabilitat I",
    "moduleCode": "1709",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Analitza i avalua el seu potencial professional i els seus interessos per guiar-se en el procés d'autoorientació i elabora un full de ruta per a la inserció professional d'acord amb l'anàlisi de les competències, interessos i destreses personals.",
    "description_es": "Analiza y evalúa su potencial profesional y sus intereses para guiarse en el proceso de autoorientación y elabora una hoja de ruta para la inserción profesional en base al análisis de las competencias, intereses y destrezas personales.",
    "description_ca": "Analitza i avalua el seu potencial professional i els seus interessos per guiar-se en el procés d'autoorientació i elabora un full de ruta per a la inserció professional d'acord amb l'anàlisi de les competències, interessos i destreses personals.",
    "criterios_es": [
      "a) Se han evaluado los propios intereses, motivaciones, habilidades y destrezas en el marco de un proceso de autoconocimiento.",
      "b) Se han analizado las cualidades y competencias personales afines a la actividad profesional relacionada con el perfil del título.",
      "c) Se han determinado las competencias personales y sociales con valor para el empleo.",
      "d) Se han señalado las preferencias profesionales, intereses y metas en el marco de un proyecto profesional.",
      "e) Se ha valorado el concepto de autoestima en el proceso de búsqueda de empleo.",
      "f) Se han identificado las fortalezas, debilidades, amenazas y oportunidades propias para la inserción profesional.",
      "g) Se han identificado expectativas de futuro para inserción profesional analizando competencias, intereses y destrezas personales.",
      "h) Se han valorado hitos importantes en la trayectoria vital con valor profesionalizador.",
      "i) Se han identificado los itinerarios formativos profesionales relacionados con el perfil profesional.",
      "j) Se han formulado objetivos profesionales y se ha determinado metas personales y profesionales para la mejora de la empleabilidad y las condiciones de inserción laboral.",
      "k) Se ha trazado un plan de acción para desarrollar las áreas de mejora y potenciar las fortalezas personales con valor para el empleo."
    ],
    "criterios_ca": [
      "a) S'han avaluat els propis interessos, motivacions, habilitats i destreses en el marc d'un procés d'autoconeixement.",
      "b) S'han analitzat les qualitats i competències personals afins a l'activitat professional relacionada amb el perfil del títol.",
      "c) S'han determinat les competències personals i socials amb valor per a l'ocupació.",
      "d) S'han assenyalat les preferències professionals, interessos i metes en el marc d'un projecte professional.",
      "e) S'ha valorat el concepte d'autoestima en el procés de recerca d'ocupació.",
      "f) S'han identificat les fortaleses, debilitats, amenaces i oportunitats pròpies per a la inserció professional.",
      "g) S'han identificat expectatives de futur per a inserció professional analitzant competències, interessos i destreses personals.",
      "h) S'han valorat fites importants en la trajectòria vital amb valor professionalitzador.",
      "i) S'han identificat els itineraris formatius professionals relacionats amb el perfil professional.",
      "j) S'han formulat objectius professionals i s'han determinat metes personals i professionals per a la millora de l'ocupabilitat i les condicions d'inserció laboral.",
      "k) S'ha traçat un pla d'acció per desenvolupar les àrees de millora i potenciar les fortaleses personals amb valor per a l'ocupació."
    ]
  },
  {
    "id": "RA5",
    "module": "Itinerari personal per a l'ocupabilitat I",
    "module_es": "Itinerario personal para la empleabilidad I",
    "module_ca": "Itinerari personal per a l'ocupabilitat I",
    "moduleCode": "1709",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica les estratègies per a l'aprenentatge autònom reconeixent el seu valor professionalitzador, dissenyant i optimitzant el seu propi entorn d'aprenentatge fent ús de les tecnologies digitals com a eines d'aprenentatge autònom, sent coherent amb la seva identitat digital i els seus propis objectius professionals plantejats en el seu pla de desenvolupament individual.",
    "description_es": "Aplica las estrategias para el aprendizaje autónomo reconociendo su valor profesionalizador, diseñando y optimizando su propio entorno de aprendizaje haciendo uso de las tecnologías digitales como herramientas de aprendizaje autónomo, siendo coherente con su identidad digital y sus propios objetivos profesionales planteados en su plan de desarrollo individual.",
    "description_ca": "Aplica les estratègies per a l'aprenentatge autònom reconeixent el seu valor professionalitzador, dissenyant i optimitzant el seu propi entorn d'aprenentatge fent ús de les tecnologies digitals com a eines d'aprenentatge autònom, sent coherent amb la seva identitat digital i els seus propis objectius professionals plantejats en el seu pla de desenvolupament individual.",
    "criterios_es": [
      "a) Se ha tomado conciencia de la responsabilidad individual en el desarrollo profesional valorando la actitud de aprendizaje permanente para el desarrollo de propias y nuevas competencias.",
      "b) Se ha identificado la empleabilidad como capacidad de adaptación al entorno laboral.",
      "c) Se han conocido y utilizado herramientas, fuentes de información, conexiones y actividades para la configuración de un entorno personal de aprendizaje para la empleabilidad.",
      "d) Se ha puesto en práctica la competencia digital para configurar un entorno personal de aprendizaje para la empleabilidad.",
      "e) Se ha analizado el concepto de identidad digital y su impacto en la empleabilidad.",
      "f) Se ha justificado el diseño de su entorno de aprendizaje basado en cómo este mejora la empleabilidad.",
      "g) Se ha elaborado su plan de desarrollo individual como herramienta para la mejora de la empleabilidad.",
      "h) Se han aplicado las herramientas de aprendizaje autónomo para su desarrollo personal y profesional.",
      "i) Se ha diseñado el entorno de aprendizaje que permite alcanzar el plan de desarrollo individual."
    ],
    "criterios_ca": [
      "a) S'ha pres consciència de la responsabilitat individual en el desenvolupament professional valorant l'actitud d'aprenentatge permanent per al desenvolupament de pròpies i noves competències.",
      "b) S'ha identificat l'ocupabilitat com a capacitat d'adaptació a l'entorn laboral.",
      "c) S'han conegut i utilitzat eines, fonts d'informació, connexions i activitats per a la configuració d'un entorn personal d'aprenentatge per a l'ocupabilitat.",
      "d) S'ha posat en pràctica la competència digital per configurar un entorn personal d'aprenentatge per a l'ocupabilitat.",
      "e) S'ha analitzat el concepte d'identitat digital i el seu impacte en l'ocupabilitat.",
      "f) S'ha justificat el disseny del seu entorn d'aprenentatge basat en com aquest millora l'ocupabilitat.",
      "g) S'ha elaborat el seu pla de desenvolupament individual com a eina per a la millora de l'ocupabilitat.",
      "h) S'han aplicat les eines d'aprenentatge autònom per al seu desenvolupament personal i professional.",
      "i) S'ha dissenyat l'entorn d'aprenentatge que permet assolir el pla de desenvolupament individual."
    ]
  },
  {
    "id": "RA1",
    "module": "Destreses socials",
    "module_es": "Destrezas sociales",
    "module_ca": "Destreses socials",
    "moduleCode": "0211",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Caracteritza estratègies i tècniques per afavorir la comunicació i la relació social amb el seu entorn, analitzant els principis de la intel·ligència emocional i social.",
    "description_es": "Caracteriza estrategias y técnicas para favorecer la comunicación y relación social con su entorno, analizando los principios de la inteligencia emocional y social.",
    "description_ca": "Caracteritza estratègies i tècniques per afavorir la comunicació i la relació social amb el seu entorn, analitzant els principis de la intel·ligència emocional i social.",
    "criterios_es": [
      "a) Se han descrito los principios de la inteligencia emocional y social.",
      "b) Se ha valorado la importancia de las habilidades sociales y comunicativas en el desempeño de la labor profesional y en las relaciones interpersonales.",
      "c) Se han identificado los diferentes estilos de comunicación, sus ventajas y limitaciones.",
      "d) Se han identificado las principales barreras e interferencias que dificultan la comunicación.",
      "e) Se ha establecido una eficaz comunicación para recibir instrucciones e intercambiar ideas o información.",
      "f) Se han utilizado las habilidades sociales adecuadas a la situación.",
      "g) Se ha demostrado interés por no juzgar a las personas y respetar sus elementos diferenciadores personales: emociones, sentimientos y personalidad.",
      "h) Se ha demostrado una actitud positiva hacia el cambio y el aprendizaje."
    ],
    "criterios_ca": [
      "a) S'han descrit els principis de la intel·ligència emocional i social.",
      "b) S'ha valorat la importància de les habilitats socials i comunicatives en l'acompliment de la tasca professional i en les relacions interpersonals.",
      "c) S'han identificat els diferents estils de comunicació, els seus avantatges i limitacions.",
      "d) S'han identificat les principals barreres i interferències que dificulten la comunicació.",
      "e) S'ha establert una comunicació eficaç per rebre instruccions i intercanviar idees o informació.",
      "f) S'han utilitzat les habilitats socials adequades a la situació.",
      "g) S'ha demostrat interès per no jutjar les persones i respectar-ne els elements diferenciadors personals: emocions, sentiments i personalitat.",
      "h) S'ha demostrat una actitud positiva envers el canvi i l'aprenentatge."
    ]
  },
  {
    "id": "RA2",
    "module": "Destreses socials",
    "module_es": "Destrezas sociales",
    "module_ca": "Destreses socials",
    "moduleCode": "0211",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques de treball en grup, adequant-les al rol que exerceix en cada moment.",
    "description_es": "Aplica técnicas de trabajo en grupo, adecuándolas al rol que desempeñe en cada momento.",
    "description_ca": "Aplica tècniques de treball en grup, adequant-les al rol que exerceix en cada moment.",
    "criterios_es": [
      "a) Se han descrito los elementos fundamentales de un grupo y los factores que pueden modificar su dinámica.",
      "b) Se han analizado y seleccionado las diferentes técnicas de dinamización y funcionamiento de grupos.",
      "c) Se han explicado las ventajas del trabajo en equipo frente al individual.",
      "d) Se han diferenciado los diversos roles y la tipología de los integrantes de un grupo.",
      "e) Se han respetado las diferencias individuales en el trabajo en grupo.",
      "f) Se han identificado las principales barreras de comunicación grupal.",
      "g) Se ha definido el reparto de tareas como procedimiento para el trabajo en grupo.",
      "h) Se ha colaborado en la creación de un ambiente de trabajo relajado y cooperativo."
    ],
    "criterios_ca": [
      "a) S'han descrit els elements fonamentals d'un grup i els factors que poden modificar-ne la dinàmica.",
      "b) S'han analitzat i seleccionat les diferents tècniques de dinamització i funcionament de grups.",
      "c) S'han explicat els avantatges del treball en equip enfront del treball individual.",
      "d) S'han diferenciat els diversos rols i la tipologia dels integrants d'un grup.",
      "e) S'han respectat les diferències individuals en el treball en grup.",
      "f) S'han identificat les principals barreres de comunicació grupal.",
      "g) S'ha definit el repartiment de tasques com a procediment per al treball en grup.",
      "h) S'ha col·laborat en la creació d'un ambient de treball relaxat i cooperatiu."
    ]
  },
  {
    "id": "RA3",
    "module": "Destreses socials",
    "module_es": "Destrezas sociales",
    "module_ca": "Destreses socials",
    "moduleCode": "0211",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques de gestió de conflictes i resolució de problemes, interpretant les pautes d'actuació establertes.",
    "description_es": "Aplica técnicas de gestión de conflictos y resolución de problemas, interpretando las pautas de actuación establecidas.",
    "description_ca": "Aplica tècniques de gestió de conflictes i resolució de problemes, interpretant les pautes d'actuació establertes.",
    "criterios_es": [
      "a) Se han analizado las fuentes del origen de los problemas y conflictos.",
      "b) Se han relacionado los recursos técnicos utilizados con los tipos de problemas estándar.",
      "c) Se ha presentado, ordenada y claramente, el proceso seguido y los resultados obtenidos en la resolución de un problema.",
      "d) Se han planificado las tareas que se deben realizar con previsión de las dificultades y el modo de superarlas.",
      "e) Se han respetado las opiniones de los demás acerca de las posibles vías de solución de problemas.",
      "f) Se ha definido el concepto y los elementos de la negociación en la resolución de conflictos.",
      "g) Se han identificado los posibles comportamientos en una situación de negociación y la eficacia de los mismos.",
      "h) Se ha discriminado entre datos y opiniones."
    ],
    "criterios_ca": [
      "a) S'han analitzat les fonts de l'origen dels problemes i conflictes.",
      "b) S'han relacionat els recursos tècnics utilitzats amb els tipus de problemes estàndard.",
      "c) S'ha presentat, de manera ordenada i clara, el procés seguit i els resultats obtinguts en la resolució d'un problema.",
      "d) S'han planificat les tasques que s'han de fer amb previsió de les dificultats i de la manera de superar-les.",
      "e) S'han respectat les opinions dels altres sobre les possibles vies de solució de problemes.",
      "f) S'ha definit el concepte i els elements de la negociació en la resolució de conflictes.",
      "g) S'han identificat els possibles comportaments en una situació de negociació i l'eficàcia d'aquests.",
      "h) S'ha discriminat entre dades i opinions."
    ]
  },
  {
    "id": "RA4",
    "module": "Destreses socials",
    "module_es": "Destrezas sociales",
    "module_ca": "Destreses socials",
    "moduleCode": "0211",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Valora el seu grau de competència social per al desenvolupament de les seves funcions professionals, analitzant-ne la incidència en les relacions interpersonals i grupals.",
    "description_es": "Valora su grado de competencia social para el desarrollo de sus funciones profesionales, analizando su incidencia en las relaciones interpersonales y grupales.",
    "description_ca": "Valora el seu grau de competència social per al desenvolupament de les seves funcions professionals, analitzant-ne la incidència en les relacions interpersonals i grupals.",
    "criterios_es": [
      "a) Se han identificado los indicadores de evaluación de la competencia social.",
      "b) Se ha registrado la situación personal y social de partida del profesional.",
      "c) Se han registrado los datos en soportes establecidos.",
      "d) Se han interpretado los datos recogidos.",
      "e) Se han identificado las actuaciones realizadas que es preciso mejorar.",
      "f) Se han marcado las pautas que hay que seguir en la mejora.",
      "g) Se ha efectuado la valoración final del proceso."
    ],
    "criterios_ca": [
      "a) S'han identificat els indicadors d'avaluació de la competència social.",
      "b) S'ha registrat la situació personal i social de partida del professional.",
      "c) S'han registrat les dades en suports establerts.",
      "d) S'han interpretat les dades recollides.",
      "e) S'han identificat les actuacions realitzades que cal millorar.",
      "f) S'han marcat les pautes que cal seguir en la millora.",
      "g) S'ha efectuat la valoració final del procés."
    ]
  },
  {
    "id": "RA1",
    "module": "Suport a la comunicació",
    "module_es": "Apoyo a la comunicación",
    "module_ca": "Suport a la comunicació",
    "moduleCode": "0214",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Relaciona els sistemes alternatius i augmentatius de comunicació amb la persona en situació de dependència, valorant-ne les dificultats específiques.",
    "description_es": "Relaciona los sistemas alternativos y aumentativos de comunicación con la persona en situación de dependencia, valorando sus dificultades específicas.",
    "description_ca": "Relaciona els sistemes alternatius i augmentatius de comunicació amb la persona en situació de dependència, valorant-ne les dificultats específiques.",
    "criterios_es": [
      "a) Se ha argumentado la influencia de la comunicación en el desenvolvimiento diario de las personas.",
      "b) Se han definido los conceptos de comunicación alternativa y aumentativa.",
      "c) Se han descrito las características de los principales sistemas alternativos y aumentativos de comunicación.",
      "d) Se han identificado los principales factores que dificultan o favorecen la comunicación con la persona en situación de dependencia.",
      "e) Se han interpretado las informaciones, sobre el apoyo a la comunicación, recibidas en el plan/proyecto de atención individualizado.",
      "f) Se han seleccionado técnicas para favorecer la implicación familiar y del entorno social en la comunicación con la persona usuaria.",
      "g) Se ha justificado la necesidad de adoptar medidas de prevención y seguridad en el uso de sistemas alternativos de comunicación."
    ],
    "criterios_ca": [
      "a) S'ha argumentat la influència de la comunicació en el desenvolupament diari de les persones.",
      "b) S'han definit els conceptes de comunicació alternativa i augmentativa.",
      "c) S'han descrit les característiques dels principals sistemes alternatius i augmentatius de comunicació.",
      "d) S'han identificat els principals factors que dificulten o afavoreixen la comunicació amb la persona en situació de dependència.",
      "e) S'han interpretat les informacions, sobre el suport a la comunicació, rebudes en el pla/projecte d'atenció individualitzat.",
      "f) S'han seleccionat tècniques per afavorir la implicació familiar i de l'entorn social en la comunicació amb la persona usuària.",
      "g) S'ha justificat la necessitat d'adoptar mesures de prevenció i seguretat en l'ús de sistemes alternatius de comunicació."
    ]
  },
  {
    "id": "RA2",
    "module": "Suport a la comunicació",
    "module_es": "Apoyo a la comunicación",
    "module_ca": "Suport a la comunicació",
    "moduleCode": "0214",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Realitza activitats de suport a la comunicació, descrivint sistemes alternatius i augmentatius de comunicació amb ajuda.",
    "description_es": "Realiza actividades de apoyo a la comunicación, describiendo sistemas alternativos y aumentativos de comunicación con ayuda.",
    "description_ca": "Realitza activitats de suport a la comunicació, descrivint sistemes alternatius i augmentatius de comunicació amb ajuda.",
    "criterios_es": [
      "a) Se han descrito las características y utilizaciones básicas de los principales sistemas alternativos de comunicación con ayuda.",
      "b) Se han creado mensajes sencillos con los diferentes sistemas de comunicación con ayuda, facilitando la comunicación y atención a la persona usuaria.",
      "c) Se han descrito otros sistemas y elementos facilitadores de la comunicación con ayuda.",
      "d) Se han comprendido mensajes expresados mediante sistemas de comunicación con ayuda.",
      "e) Se han aplicado los ajustes necesarios en función de las características particulares de las personas usuarias.",
      "f) Se han utilizado las ayudas técnicas necesarias para el apoyo a la comunicación.",
      "g) Se ha justificado la importancia del uso de las tecnologías de la información y la comunicación en las actividades de apoyo a la comunicación."
    ],
    "criterios_ca": [
      "a) S'han descrit les característiques i les utilitzacions bàsiques dels principals sistemes alternatius de comunicació amb ajuda.",
      "b) S'han creat missatges senzills amb els diferents sistemes de comunicació amb ajuda, facilitant la comunicació i l'atenció a la persona usuària.",
      "c) S'han descrit altres sistemes i elements facilitadors de la comunicació amb ajuda.",
      "d) S'han comprès missatges expressats mitjançant sistemes de comunicació amb ajuda.",
      "e) S'han aplicat els ajustaments necessaris en funció de les característiques particulars de les persones usuàries.",
      "f) S'han utilitzat les ajudes tècniques necessàries per al suport a la comunicació.",
      "g) S'ha justificat la importància de l'ús de les tecnologies de la informació i la comunicació en les activitats de suport a la comunicació."
    ]
  },
  {
    "id": "RA3",
    "module": "Suport a la comunicació",
    "module_es": "Apoyo a la comunicación",
    "module_ca": "Suport a la comunicació",
    "moduleCode": "0214",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Realitza activitats de suport a la comunicació, descrivint sistemes alternatius i augmentatius de comunicació sense ajuda.",
    "description_es": "Realiza actividades de apoyo a la comunicación, describiendo sistemas alternativos y aumentativos de comunicación sin ayuda.",
    "description_ca": "Realitza activitats de suport a la comunicació, descrivint sistemes alternatius i augmentatius de comunicació sense ajuda.",
    "criterios_es": [
      "a) Se han descrito estructuras básicas de los sistemas alternativos sin ayuda.",
      "b) Se han descrito los principales signos utilizados en situaciones habituales de atención a personas en situación de dependencia.",
      "c) Se han creado mensajes sencillos con los diferentes sistemas de comunicación sin ayuda, facilitando la comunicación y la atención a la persona en situación de dependencia.",
      "d) Se han aplicado los ajustes necesarios en función de las características particulares de las personas en situación de dependencia.",
      "e) Se han descrito otros sistemas y elementos facilitadores de la comunicación sin ayuda.",
      "f) Se han comprendido mensajes expresados mediante sistemas de comunicación sin ayuda."
    ],
    "criterios_ca": [
      "a) S'han descrit estructures bàsiques dels sistemes alternatius sense ajuda.",
      "b) S'han descrit els principals signes utilitzats en situacions habituals d'atenció a persones en situació de dependència.",
      "c) S'han creat missatges senzills amb els diferents sistemes de comunicació sense ajuda, facilitant la comunicació i l'atenció a la persona en situació de dependència.",
      "d) S'han aplicat els ajustaments necessaris en funció de les característiques particulars de les persones en situació de dependència.",
      "e) S'han descrit altres sistemes i elements facilitadors de la comunicació sense ajuda.",
      "f) S'han comprès missatges expressats mitjançant sistemes de comunicació sense ajuda."
    ]
  },
  {
    "id": "RA4",
    "module": "Suport a la comunicació",
    "module_es": "Apoyo a la comunicación",
    "module_ca": "Suport a la comunicació",
    "moduleCode": "0214",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Realitza el seguiment de les actuacions de suport a la comunicació, emplenant els protocols de registre establerts.",
    "description_es": "Realiza el seguimiento de las actuaciones de apoyo a la comunicación, cumplimentando los protocolos de registro establecidos.",
    "description_ca": "Realitza el seguiment de les actuacions de suport a la comunicació, emplenant els protocols de registre establerts.",
    "criterios_es": [
      "a) Se han cumplimentado los protocolos de registro como medio de evaluación de la competencia comunicativa de la persona usuaria.",
      "b) Se ha argumentado la importancia de transmitir la información registrada al equipo interdisciplinar.",
      "c) Se han establecido criterios para verificar el grado de cumplimiento de las instrucciones de apoyo a la comunicación en el ámbito familiar.",
      "d) Se ha comprobado la correcta utilización de los elementos que componen el sistema de comunicación elegido.",
      "e) Se han identificado protocolos de transmisión al equipo sobre la adecuación del sistema de comunicación elegido.",
      "f) Se han identificado criterios e indicadores para detectar cambios en las necesidades de comunicación.",
      "g) Se ha argumentado la importancia de la obtención, registro y transmisión de la información para mejorar la calidad del trabajo realizado."
    ],
    "criterios_ca": [
      "a) S'han emplenat els protocols de registre com a mitjà d'avaluació de la competència comunicativa de la persona usuària.",
      "b) S'ha argumentat la importància de transmetre la informació registrada a l'equip interdisciplinari.",
      "c) S'han establert criteris per verificar el grau de compliment de les instruccions de suport a la comunicació en l'àmbit familiar.",
      "d) S'ha comprovat la utilització correcta dels elements que componen el sistema de comunicació triat.",
      "e) S'han identificat protocols de transmissió a l'equip sobre l'adequació del sistema de comunicació triat.",
      "f) S'han identificat criteris i indicadors per detectar canvis en les necessitats de comunicació.",
      "g) S'ha argumentat la importància de l'obtenció, registre i transmissió de la informació per millorar la qualitat del treball realitzat."
    ]
  },
  {
    "id": "RA1",
    "module": "Atenció sanitària",
    "module_es": "Atención sanitaria",
    "module_ca": "Atenció sanitària",
    "moduleCode": "0216",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza les activitats d'atenció sanitària a persones en situació de dependència, relacionant-les amb les característiques i necessitats d'aquestes.",
    "description_es": "Organiza las actividades de atención sanitaria a personas en situación de dependencia, relacionándolas con las características y necesidades de las mismas.",
    "description_ca": "Organitza les activitats d'atenció sanitària a persones en situació de dependència, relacionant-les amb les característiques i necessitats d'aquestes.",
    "criterios_es": [
      "a) Se han descrito las características anatomo-fisiológicas básicas y las alteraciones más frecuentes de los sistemas cardiovascular, respiratorio, digestivo y reproductor.",
      "b) Se han descrito las principales características y necesidades de atención física de las personas en situación de dependencia.",
      "c) Se han identificado los principales signos de deterioro físico y sanitario asociados a situaciones de dependencia.",
      "d) Se han identificado las características del entorno que favorecen o dificultan el estado físico y de salud de la persona usuaria.",
      "e) Se han interpretado las prescripciones de atención sanitaria establecidas en el plan de cuidados.",
      "f) Se han definido las condiciones ambientales favorables para la atención sanitaria.",
      "g) Se ha argumentado la importancia de la participación de la persona en las actividades sanitarias.",
      "h) Se ha valorado la importancia de promover el autocuidado."
    ],
    "criterios_ca": [
      "a) S'han descrit les característiques anatomofisiològiques bàsiques i les alteracions més freqüents dels sistemes cardiovascular, respiratori, digestiu i reproductor.",
      "b) S'han descrit les principals característiques i necessitats d'atenció física de les persones en situació de dependència.",
      "c) S'han identificat els principals signes de deteriorament físic i sanitari associats a situacions de dependència.",
      "d) S'han identificat les característiques de l'entorn que afavoreixen o dificulten l'estat físic i de salut de la persona usuària.",
      "e) S'han interpretat les prescripcions d'atenció sanitària establertes en el pla de cures.",
      "f) S'han definit les condicions ambientals favorables per a l'atenció sanitària.",
      "g) S'ha argumentat la importància de la participació de la persona en les activitats sanitàries.",
      "h) S'ha valorat la importància de promoure l'autocura."
    ]
  },
  {
    "id": "RA2",
    "module": "Atenció sanitària",
    "module_es": "Atención sanitaria",
    "module_ca": "Atenció sanitària",
    "moduleCode": "0216",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica tècniques de mobilització, trasllat i deambulació, analitzant les característiques de la persona en situació de dependència.",
    "description_es": "Aplica técnicas de movilización, traslado y deambulación, analizando las características de la persona en situación de dependencia.",
    "description_ca": "Aplica tècniques de mobilització, trasllat i deambulació, analitzant les característiques de la persona en situació de dependència.",
    "criterios_es": [
      "a) Se han aplicado las técnicas más frecuentes de posicionamiento de personas encamadas, adecuándolas al estado y condiciones de las mismas.",
      "b) Se han aplicado técnicas de movilización, deambulación y traslado de personas en situación de dependencia, adaptándolas a su estado y condiciones.",
      "c) Se han aplicado procedimientos que garanticen una carga segura y la prevención de aparición de posibles lesiones en el profesional.",
      "d) Se han utilizado las ayudas técnicas de movilización, transporte, deambulación y posicionamiento en cama de personas en situación de dependencia más adecuadas a su estado y condiciones.",
      "e) Se han adoptado medidas de prevención y seguridad.",
      "f) Se han descrito las técnicas de limpieza y conservación de prótesis, precisando los materiales y productos adecuados en función del estado y necesidades de la persona usuaria.",
      "g) Se han proporcionado pautas de actuación a la persona en situación de dependencia y su entorno, que favorecen su autonomía en relación con la movilidad y el mantenimiento de las ayudas técnicas.",
      "h) Se ha mostrado sensibilidad hacia la necesidad de potenciar la autonomía de la persona usuaria."
    ],
    "criterios_ca": [
      "a) S'han aplicat les tècniques més freqüents de posicionament de persones enllitades, adequant-les a l'estat i les condicions d'aquestes.",
      "b) S'han aplicat tècniques de mobilització, deambulació i trasllat de persones en situació de dependència, adaptant-les al seu estat i condicions.",
      "c) S'han aplicat procediments que garanteixin una càrrega segura i la prevenció de l'aparició de possibles lesions en el professional.",
      "d) S'han utilitzat les ajudes tècniques de mobilització, transport, deambulació i posicionament al llit de persones en situació de dependència més adequades al seu estat i condicions.",
      "e) S'han adoptat mesures de prevenció i seguretat.",
      "f) S'han descrit les tècniques de neteja i conservació de pròtesis, precisant els materials i productes adequats en funció de l'estat i les necessitats de la persona usuària.",
      "g) S'han proporcionat pautes d'actuació a la persona en situació de dependència i al seu entorn, que afavoreixen la seva autonomia en relació amb la mobilitat i el manteniment de les ajudes tècniques.",
      "h) S'ha mostrat sensibilitat envers la necessitat de potenciar l'autonomia de la persona usuària."
    ]
  },
  {
    "id": "RA3",
    "module": "Atenció sanitària",
    "module_es": "Atención sanitaria",
    "module_ca": "Atenció sanitària",
    "moduleCode": "0216",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Caracteritza activitats d'assistència sanitària, relacionant les necessitats i característiques de la persona usuària amb allò establert en el pla de cures.",
    "description_es": "Caracteriza actividades de asistencia sanitaria, relacionando las necesidades y características de la persona usuaria con lo establecido en el plan de cuidados.",
    "description_ca": "Caracteritza activitats d'assistència sanitària, relacionant les necessitats i característiques de la persona usuària amb allò establert en el pla de cures.",
    "criterios_es": [
      "a) Se han seleccionado las posiciones anatómicas más adecuadas para facilitar la exploración de las personas usuarias.",
      "b) Se ha preparado y previsto la administración de los medicamentos, cumpliendo las pautas establecidas en el plan de cuidados individualizado y las prescripciones específicas para cada vía y producto.",
      "c) Se han identificado los principales riesgos asociados a la administración de medicamentos.",
      "d) Se han seleccionado tratamientos locales de frío y calor atendiendo a las pautas de un plan de cuidados individualizado.",
      "e) Se han identificado los signos de posibles alteraciones en el estado general de la persona durante la administración de medicamentos.",
      "f) Se han tomado las constantes vitales de la persona, utilizando los materiales adecuados y siguiendo las prescripciones establecidas.",
      "g) Se ha valorado la importancia de favorecer la participación de la persona usuaria y su entorno en las actividades sanitarias.",
      "h) Se han empleado las medidas de protección, higiene y seguridad establecidas tanto para el personal como para la persona usuaria."
    ],
    "criterios_ca": [
      "a) S'han seleccionat les posicions anatòmiques més adequades per facilitar l'exploració de les persones usuàries.",
      "b) S'ha preparat i previst l'administració dels medicaments, complint les pautes establertes en el pla de cures individualitzat i les prescripcions específiques per a cada via i producte.",
      "c) S'han identificat els principals riscs associats a l'administració de medicaments.",
      "d) S'han seleccionat tractaments locals de fred i calor atenent les pautes d'un pla de cures individualitzat.",
      "e) S'han identificat els signes de possibles alteracions en l'estat general de la persona durant l'administració de medicaments.",
      "f) S'han pres les constants vitals de la persona, utilitzant els materials adequats i seguint les prescripcions establertes.",
      "g) S'ha valorat la importància d'afavorir la participació de la persona usuària i el seu entorn en les activitats sanitàries.",
      "h) S'han emprat les mesures de protecció, higiene i seguretat establertes tant per al personal com per a la persona usuària."
    ]
  },
  {
    "id": "RA4",
    "module": "Atenció sanitària",
    "module_es": "Atención sanitaria",
    "module_ca": "Atenció sanitària",
    "moduleCode": "0216",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza activitats d'alimentació i suport a la ingesta, seleccionant les tècniques, instruments i ajudes necessàries.",
    "description_es": "Organiza actividades de alimentación y apoyo a la ingesta, seleccionando las técnicas, instrumentos y ayudas necesarias.",
    "description_ca": "Organitza activitats d'alimentació i suport a la ingesta, seleccionant les tècniques, instruments i ajudes necessàries.",
    "criterios_es": [
      "a) Se ha organizado la distribución y servicio de las comidas en la institución, siguiendo las prescripciones de la hoja de dietas.",
      "b) Se han aplicado diferentes técnicas de apoyo a la ingesta, en función de las características y necesidades de la persona.",
      "c) Se ha informado a la persona en situación de dependencia y a las familias acerca de la correcta administración de alimentos.",
      "d) Se ha comprobado que la ingesta de las personas se ajusta al plan de cuidados.",
      "e) Se ha asesorado a la persona y a la familia sobre la utilización de los materiales de recogida de excretas y su posterior eliminación.",
      "f) Se ha mostrado sensibilidad hacia la importancia de que la hora de la comida sea un momento agradable para la persona.",
      "g) Se han identificado los posibles riesgos asociados a las situaciones de ingesta.",
      "h) Se han adoptado medidas de seguridad y prevención de riesgos."
    ],
    "criterios_ca": [
      "a) S'ha organitzat la distribució i el servei dels àpats a la institució, seguint les prescripcions del full de dietes.",
      "b) S'han aplicat diferents tècniques de suport a la ingesta, en funció de les característiques i necessitats de la persona.",
      "c) S'ha informat la persona en situació de dependència i les famílies sobre l'administració correcta d'aliments.",
      "d) S'ha comprovat que la ingesta de les persones s'ajusta al pla de cures.",
      "e) S'ha assessorat la persona i la família sobre la utilització dels materials de recollida d'excretes i la seva eliminació posterior.",
      "f) S'ha mostrat sensibilitat envers la importància que l'hora de menjar sigui un moment agradable per a la persona.",
      "g) S'han identificat els possibles riscs associats a les situacions d'ingesta.",
      "h) S'han adoptat mesures de seguretat i prevenció de riscs."
    ]
  },
  {
    "id": "RA5",
    "module": "Atenció sanitària",
    "module_es": "Atención sanitaria",
    "module_ca": "Atenció sanitària",
    "moduleCode": "0216",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Realitza el control i seguiment de les activitats d'atenció sanitària, analitzant els protocols d'observació i registre establerts.",
    "description_es": "Realiza el control y seguimiento de las actividades de atención sanitaria, analizando los protocolos de observación y registro establecidos.",
    "description_ca": "Realitza el control i seguiment de les activitats d'atenció sanitària, analitzant els protocols d'observació i registre establerts.",
    "criterios_es": [
      "a) Se han identificado las características que deben reunir los protocolos de observación, control y seguimiento del estado físico y sanitario de las personas usuarias.",
      "b) Se han cumplimentado protocolos de observación y registro, manuales e informatizados, siguiendo las pautas establecidas en cada caso.",
      "c) Se ha recogido información correcta y completa sobre las actividades realizadas y las contingencias que se presentaron.",
      "d) Se ha obtenido información de la persona o personas a su cargo mediante diferentes instrumentos.",
      "e) Se han aplicado las técnicas e instrumentos de observación previstos para realizar el seguimiento de la evolución física de la persona, registrando los datos obtenidos según el procedimiento establecido.",
      "f) Se han registrado los datos para su comunicación responsable del plan de cuidados individualizados.",
      "g) Se ha transmitido la información por los procedimientos establecidos y en el momento oportuno.",
      "h) Se ha argumentado la importancia del control y seguimiento de la evolución física y sanitaria de la persona para mejorar su bienestar."
    ],
    "criterios_ca": [
      "a) S'han identificat les característiques que han de reunir els protocols d'observació, control i seguiment de l'estat físic i sanitari de les persones usuàries.",
      "b) S'han emplenat protocols d'observació i registre, manuals i informatitzats, seguint les pautes establertes en cada cas.",
      "c) S'ha recollit informació correcta i completa sobre les activitats realitzades i les contingències que es van presentar.",
      "d) S'ha obtingut informació de la persona o persones al seu càrrec mitjançant diferents instruments.",
      "e) S'han aplicat les tècniques i instruments d'observació previstos per fer el seguiment de l'evolució física de la persona, registrant les dades obtingudes segons el procediment establert.",
      "f) S'han registrat les dades per a la seva comunicació responsable del pla de cures individualitzat.",
      "g) S'ha transmès la informació pels procediments establerts i en el moment oportú.",
      "h) S'ha argumentat la importància del control i seguiment de l'evolució física i sanitària de la persona per millorar-ne el benestar."
    ]
  },
  {
    "id": "RA1",
    "module": "Teleassistència",
    "module_es": "Teleasistencia",
    "module_ca": "Teleassistència",
    "moduleCode": "0831",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Organitza la pròpia intervenció en el servei de teleassistència, tenint en compte les característiques i l'equipament tècnic del lloc de treball.",
    "description_es": "Organiza la propia intervención en el servicio de teleasistencia, teniendo en cuenta las características y el equipamiento técnico del puesto de trabajo.",
    "description_ca": "Organitza la pròpia intervenció en el servei de teleassistència, tenint en compte les característiques i l'equipament tècnic del lloc de treball.",
    "criterios_es": [
      "a) Se han descrito las características, funciones y estructura del servicio de teleasistencia.",
      "b) Se ha organizado el espacio físico de la persona operadora con criterios de limpieza, orden y prevención de riesgos.",
      "c) Se han descrito las normas de higiene, ergonomía y comunicación que previenen riesgos sobre la salud de cada profesional.",
      "d) Se ha argumentado la necesidad de seguir los protocolos establecidos para optimizar la calidad del servicio en los diferentes turnos.",
      "e) Se han utilizado aplicaciones informáticas y herramientas telemáticas propias del servicio de teleasistencia.",
      "f) Se han comprobado los terminales y dispositivos auxiliares de los servicios de teleasistencia.",
      "g) Se han descrito las contingencias más habituales en el uso de las herramientas telemáticas.",
      "h) Se ha justificado la importancia de garantizar la confidencialidad de la información y el derecho a la intimidad de las personas."
    ],
    "criterios_ca": [
      "a) S'han descrit les característiques, funcions i estructura del servei de teleassistència.",
      "b) S'ha organitzat l'espai físic de la persona operadora amb criteris de neteja, ordre i prevenció de riscs.",
      "c) S'han descrit les normes d'higiene, ergonomia i comunicació que prevenen riscs sobre la salut de cada professional.",
      "d) S'ha argumentat la necessitat de seguir els protocols establerts per optimitzar la qualitat del servei en els diferents torns.",
      "e) S'han utilitzat aplicacions informàtiques i eines telemàtiques pròpies del servei de teleassistència.",
      "f) S'han comprovat els terminals i dispositius auxiliars dels serveis de teleassistència.",
      "g) S'han descrit les contingències més habituals en l'ús de les eines telemàtiques.",
      "h) S'ha justificat la importància de garantir la confidencialitat de la informació i el dret a la intimitat de les persones."
    ]
  },
  {
    "id": "RA2",
    "module": "Teleassistència",
    "module_es": "Teleasistencia",
    "module_ca": "Teleassistència",
    "moduleCode": "0831",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica procediments de gestió de les trucades sortints utilitzant aplicacions informàtiques i eines telemàtiques.",
    "description_es": "Aplica procedimientos de gestión de las llamadas salientes utilizando aplicaciones informáticas y herramientas telemáticas.",
    "description_ca": "Aplica procediments de gestió de les trucades sortints utilitzant aplicacions informàtiques i eines telemàtiques.",
    "criterios_es": [
      "a) Se ha accedido a la aplicación informática mediante la contraseña asignada.",
      "b) Se han seleccionado en la aplicación informática las agendas que hay que realizar durante el turno de trabajo.",
      "c) Se han programado las llamadas en función del número, tipo y prioridad establecida en el protocolo.",
      "d) Se ha seleccionado correctamente la llamada de agenda en la aplicación informática.",
      "e) Se ha aplicado un protocolo de presentación personalizado.",
      "f) Se ha ajustado la conversación al objetivo de la agenda y a las características de la persona usuaria.",
      "g) Se han seguido los protocolos establecidos para la despedida.",
      "h) Se ha argumentado la valoración del uso de un lenguaje apropiado a la persona que recibe la llamada saliente."
    ],
    "criterios_ca": [
      "a) S'ha accedit a l'aplicació informàtica mitjançant la contrasenya assignada.",
      "b) S'han seleccionat a l'aplicació informàtica les agendes que s'han de fer durant el torn de treball.",
      "c) S'han programat les trucades en funció del nombre, tipus i prioritat establerta en el protocol.",
      "d) S'ha seleccionat correctament la trucada d'agenda a l'aplicació informàtica.",
      "e) S'ha aplicat un protocol de presentació personalitzat.",
      "f) S'ha ajustat la conversa a l'objectiu de l'agenda i a les característiques de la persona usuària.",
      "g) S'han seguit els protocols establerts per a l'acomiadament.",
      "h) S'ha argumentat la valoració de l'ús d'un llenguatge apropiat a la persona que rep la trucada sortint."
    ]
  },
  {
    "id": "RA3",
    "module": "Teleassistència",
    "module_es": "Teleasistencia",
    "module_ca": "Teleassistència",
    "moduleCode": "0831",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica procediments de gestió de les trucades entrants seguint el protocol i les pautes d'actuació establerts.",
    "description_es": "Aplica procedimientos de gestión de las llamadas entrantes siguiendo el protocolo y pautas de actuación establecidos.",
    "description_ca": "Aplica procediments de gestió de les trucades entrants seguint el protocol i les pautes d'actuació establerts.",
    "criterios_es": [
      "a) Se han seguido los protocolos establecidos para la presentación, desarrollo y despedida.",
      "b) Se ha verificado el alta de la persona en el servicio.",
      "c) Se ha adecuado la explicación sobre las características y prestaciones del servicio, así como sobre el funcionamiento del terminal y los dispositivos auxiliares, a las características de la persona usuaria.",
      "d) Se han actualizado los datos de la persona en la aplicación informática.",
      "e) Se han utilizado estrategias facilitadoras de la comunicación y un trato personalizado.",
      "f) Se ha respondido correctamente ante situaciones de crisis y emergencias.",
      "g) Se han puesto en marcha los recursos adecuados para responder a la demanda planteada.",
      "h) Se ha argumentado la importancia de respetar las opiniones y decisiones de la persona usuaria."
    ],
    "criterios_ca": [
      "a) S'han seguit els protocols establerts per a la presentació, el desenvolupament i l'acomiadament.",
      "b) S'ha verificat l'alta de la persona en el servei.",
      "c) S'ha adequat l'explicació sobre les característiques i prestacions del servei, així com sobre el funcionament del terminal i dels dispositius auxiliars, a les característiques de la persona usuària.",
      "d) S'han actualitzat les dades de la persona a l'aplicació informàtica.",
      "e) S'han utilitzat estratègies facilitadores de la comunicació i un tracte personalitzat.",
      "f) S'ha respost correctament davant situacions de crisi i emergències.",
      "g) S'han posat en marxa els recursos adequats per respondre a la demanda plantejada.",
      "h) S'ha argumentat la importància de respectar les opinions i decisions de la persona usuària."
    ]
  },
  {
    "id": "RA4",
    "module": "Teleassistència",
    "module_es": "Teleasistencia",
    "module_ca": "Teleassistència",
    "moduleCode": "0831",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Realitza el seguiment de les trucades entrants i sortints registrant les incidències i actuacions realitzades, i elaborant l'informe corresponent.",
    "description_es": "Realiza el seguimiento de las llamadas entrantes y salientes registrando las incidencias y actuaciones realizadas, y elaborando el informe correspondiente.",
    "description_ca": "Realitza el seguiment de les trucades entrants i sortints registrant les incidències i actuacions realitzades, i elaborant l'informe corresponent.",
    "criterios_es": [
      "a) Se han explicado los medios técnicos que favorecen la transmisión de información entre turnos.",
      "b) Se han aplicado técnicas y procedimientos de registro de información.",
      "c) Se han descrito los tipos de informes del servicio de teleasistencia.",
      "d) Se han elaborado informes de seguimiento.",
      "e) Se han identificado los aspectos de su práctica laboral susceptibles de mejora.",
      "f) Se han identificado las situaciones en las que es necesaria la intervención de otros profesionales.",
      "g) Se han transmitido las incidencias y propuestas de mejora a los profesionales competentes.",
      "h) Se ha valorado la importancia de adecuar su competencia profesional a nuevas necesidades en el campo de la teleasistencia."
    ],
    "criterios_ca": [
      "a) S'han explicat els mitjans tècnics que afavoreixen la transmissió d'informació entre torns.",
      "b) S'han aplicat tècniques i procediments de registre d'informació.",
      "c) S'han descrit els tipus d'informes del servei de teleassistència.",
      "d) S'han elaborat informes de seguiment.",
      "e) S'han identificat els aspectes de la seva pràctica laboral susceptibles de millora.",
      "f) S'han identificat les situacions en què cal la intervenció d'altres professionals.",
      "g) S'han transmès les incidències i propostes de millora als professionals competents.",
      "h) S'ha valorat la importància d'adequar la seva competència professional a noves necessitats en el camp de la teleassistència."
    ]
  },
  {
    "id": "RA1",
    "module": "Anglès professional",
    "module_es": "Inglés profesional",
    "module_ca": "Anglès professional",
    "moduleCode": "0156",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Comprèn informació, d'índole professional i quotidiana, continguda en discursos orals senzills, emesos en llengua estàndard, desxifrant el contingut global del missatge, i relacionant-lo amb els recursos lingüístics corresponents.",
    "description_es": "Comprende información, de índole profesional y cotidiana, contenida en discursos orales sencillos, emitidos en lengua estándar, descifrando el contenido global del mensaje, y relacionándolo con los recursos lingüísticos correspondientes.",
    "description_ca": "Comprèn informació, d'índole professional i quotidiana, continguda en discursos orals senzills, emesos en llengua estàndard, desxifrant el contingut global del missatge, i relacionant-lo amb els recursos lingüístics corresponents.",
    "criterios_es": [
      "a) Se ha situado el mensaje en su contexto por medio del análisis de sus características textuales y contextuales.",
      "b) Se ha identificado el hilo argumental de mensajes orales y determinado los roles que aparecen en los mismos.",
      "c) Se ha reconocido la finalidad del mensaje, ya se trate de un mensaje directo, telefónico o en cualquier otro medio auditivo.",
      "d) Se ha extraído información específica contenida en discursos orales, en lengua estándar, relacionados con la vida social, profesional o académica.",
      "e) Se han secuenciado los elementos constituyentes del mensaje.",
      "f) Se han identificado y resumido con claridad las ideas principales de un discurso sobre temas conocidos, transmitido por los medios de comunicación y emitido en lengua estándar.",
      "g) Se han reconocido las instrucciones orales y se han seguido las indicaciones siendo capaz de concluir si precisan de una respuesta verbal o de una no verbal.",
      "h) Se ha tomado conciencia de la importancia de comprender globalmente un mensaje, sin necesidad de entender todos y cada uno de los elementos del mismo.",
      "i) Se ha servido del análisis de la entonación y de los elementos visuales para identificar los diversos significados e intenciones comunicativas del emisor."
    ],
    "criterios_ca": [
      "a) S'ha situat el missatge en el seu context per mitjà de l'anàlisi de les seves característiques textuals i contextuals.",
      "b) S'ha identificat el fil argumental de missatges orals i determinat els rols que hi apareixen.",
      "c) S'ha reconegut la finalitat del missatge, ja es tracti d'un missatge directe, telefònic o en qualsevol altre medi auditiu.",
      "d) S'ha extret informació específica continguda en discursos orals, en llengua estàndard, relacionats amb la vida social, professional o acadèmica.",
      "e) S'han seqüenciat els elements constituents del missatge.",
      "f) S'han identificat i resumit amb claredat les idees principals d'un discurs sobre temes coneguts, transmès pels mitjans de comunicació i emès en llengua estàndard.",
      "g) S'han reconegut les instruccions orals i s'han seguit les indicacions sent capaç de concloure si precisen d'una resposta verbal o d'una no verbal.",
      "h) S'ha pres consciència de la importància de comprendre globalment un missatge, sense necessitat d'entendre tots i cadascun dels elements del mateix.",
      "i) S'ha servit de l'anàlisi de l'entonació i dels elements visuals per identificar els diversos significats i intencions comunicatives de l'emissor."
    ]
  },
  {
    "id": "RA2",
    "module": "Anglès professional",
    "module_es": "Inglés profesional",
    "module_ca": "Anglès professional",
    "moduleCode": "0156",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Comprèn informació professional continguda en textos escrits senzills, analitzant de forma comprensiva el seu contingut.",
    "description_es": "Comprende información profesional contenida en textos escritos sencillos, analizando de forma comprensiva su contenido.",
    "description_ca": "Comprèn informació professional continguda en textos escrits senzills, analitzant de forma comprensiva el seu contingut.",
    "criterios_es": [
      "a) Se han seleccionado los materiales de consulta y diccionarios técnicos. para la comprensión del texto.",
      "b) Se han leído de forma comprensiva textos claros en lengua estándar.",
      "c) Se ha relacionado el texto con el ámbito del sector a que se refiere.",
      "d) Se han reconocido las ideas principales de un texto escrito identificando la información relevante, sin necesidad de entender todos y cada uno de los elementos de dicho texto.",
      "e) Se ha identificado la terminología utilizada, así como las estructuras gramaticales y demás elementos característicos de cada tipología discursiva.",
      "f) Se han realizado traducciones de textos en lengua estándar utilizando material de apoyo en caso necesario.",
      "g) Se ha interpretado el mensaje recibido a través de soportes telemáticos o cualquier otro tipo de soporte.",
      "h) Se ha reconocido la finalidad de distintos textos escritos en cualquier soporte, en lengua estándar y relacionados con la actividad profesional.",
      "i) Se ha extraído información específica de textos de diferente naturaleza, relativos a su profesión y contenidos en distintos soportes."
    ],
    "criterios_ca": [
      "a) S'han seleccionat els materials de consulta i diccionaris tècnics per a la comprensió del text.",
      "b) S'han llegit de forma comprensiva textos clars en llengua estàndard.",
      "c) S'ha relacionat el text amb l'àmbit del sector a què es refereix.",
      "d) S'han reconegut les idees principals d'un text escrit identificant la informació rellevant, sense necessitat d'entendre tots i cadascun dels elements d'aquest text.",
      "e) S'ha identificat la terminologia utilitzada, així com les estructures gramaticals i altres elements característics de cada tipologia discursiva.",
      "f) S'han realitzat traduccions de textos en llengua estàndard utilitzant material de suport en cas necessari.",
      "g) S'ha interpretat el missatge rebut a través de suports telemàtics o qualsevol altre tipus de suport.",
      "h) S'ha reconegut la finalitat de diferents textos escrits en qualsevol suport, en llengua estàndard i relacionats amb l'activitat professional.",
      "i) S'ha extret informació específica de textos de diferent naturalesa, relatius a la seva professió i continguts en diferents suports."
    ]
  },
  {
    "id": "RA3",
    "module": "Anglès professional",
    "module_es": "Inglés profesional",
    "module_ca": "Anglès professional",
    "moduleCode": "0156",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Produeix missatges orals senzills, clars i estructurats, participant com a agent actiu en converses professionals.",
    "description_es": "Produce mensajes orales sencillos, claros y estructurados, participando como agente activo en conversaciones profesionales.",
    "description_ca": "Produeix missatges orals senzills, clars i estructurats, participant com a agent actiu en converses professionals.",
    "criterios_es": [
      "a) Se han determinado los registros más adecuados para la emisión del mensaje.",
      "b) Se ha comunicado utilizando fórmulas, nexos de unión, marcadores discursivos y estrategias de interacción acordes a la situación de comunicación.",
      "c) Se han descrito hechos breves e imprevistos relacionados con su profesión.",
      "d) Se ha utilizado correctamente la terminología de la profesión.",
      "e) Se han expresado sentimientos, ideas u opiniones.",
      "f) Se han enumerado las actividades propias de la tarea profesional.",
      "g) Se ha descrito y secuenciado un proceso de trabajo de su competencia.",
      "h) Se ha justificado la aceptación o no de propuestas realizadas haciendo uso de normas de cortesía y de modales apropiados.",
      "i) Se ha intercambiado, con relativa fluidez, información específica y detallada utilizando frases de estructura sencilla y diferentes soportes telemáticos.",
      "j) Se han realizado, de manera clara, presentaciones breves y preparadas sobre un tema dentro de su especialidad, haciendo uso de los protocolos adecuados.",
      "k) Se ha comunicado espontáneamente adoptando un nivel de formalidad adecuado a las circunstancias.",
      "l) Se han respondido preguntas relativas a su vida socio-profesional, incluidas las propias de una entrevista de trabajo.",
      "m) Se ha solicitado la reformulación del discurso o la aclaración de parte del mismo cuando se ha considerado necesario para una mejor comprensión."
    ],
    "criterios_ca": [
      "a) S'han determinat els registres més adequats per a l'emissió del missatge.",
      "b) S'ha comunicat utilitzant fórmules, nexes d'unió, marcadors discursius i estratègies d'interacció d'acord amb la situació de comunicació.",
      "c) S'han descrit fets breus i imprevistos relacionats amb la seva professió.",
      "d) S'ha utilitzat correctament la terminologia de la professió.",
      "e) S'han expressat sentiments, idees o opinions.",
      "f) S'han enumerat les activitats pròpies de la tasca professional.",
      "g) S'ha descrit i seqüenciat un procés de treball de la seva competència.",
      "h) S'ha justificat l'acceptació o no de propostes realitzades fent ús de normes de cortesia i de maneres apropiades.",
      "i) S'ha intercanviat, amb relativa fluïdesa, informació específica i detallada utilitzant frases d'estructura senzilla i diferents suports telemàtics.",
      "j) S'han realitzat, de manera clara, presentacions breus i preparades sobre un tema dins de la seva especialitat, fent ús dels protocols adequats.",
      "k) S'ha comunicat espontàniament adoptant un nivell de formalitat adequat a les circumstàncies.",
      "l) S'han respost preguntes relatives a la seva vida socioprofessional, incloses les pròpies d'una entrevista de treball.",
      "m) S'ha sol·licitat la reformulació del discurs o l'aclariment de part del mateix quan s'ha considerat necessari per a una millor comprensió."
    ]
  },
  {
    "id": "RA4",
    "module": "Anglès professional",
    "module_es": "Inglés profesional",
    "module_ca": "Anglès professional",
    "moduleCode": "0156",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Redacta textos senzills en llengua estàndard, relacionant les regles gramaticals amb la finalitat dels mateixos.",
    "description_es": "Redacta textos sencillos en lengua estándar, relacionando las reglas gramaticales con la finalidad de los mismos.",
    "description_ca": "Redacta textos senzills en llengua estàndard, relacionant les regles gramaticals amb la finalitat dels mateixos.",
    "criterios_es": [
      "a) Se han seleccionado las estrategias, estructuras, vocabulario y convenciones más adecuadas para el tipo de texto que se va a crear (fax, nota, carta o correo electrónico, entre otros).",
      "b) Se han redactado textos breves relacionados con aspectos cotidianos y/o profesionales.",
      "c) Se ha organizado la información de manera coherente y cohesionada.",
      "d) Se han realizado resúmenes de textos relacionados con su entorno profesional, identificando las ideas principales de los mismos.",
      "e) Se ha cumplimentado documentación específica de su campo profesional, aplicando las fórmulas establecidas y el vocabulario específico.",
      "f) Se ha cumplimentado un texto dado con apoyos visuales y claves lingüísticas aportadas.",
      "g) Se han utilizado las fórmulas de cortesía propias del documento que se va a elaborar.",
      "h) Se ha escrito correspondencia formal básica en formato físico o digital destinada principalmente a pedir información, solicitar un servicio o llevar a cabo una reclamación u otra gestión sencilla, siempre atendiendo a las convenciones de la tipología textual.",
      "i) Se han tomado notas, y mensajes, con información sencilla sobre aspectos propios de su labor profesional.",
      "j) Se ha solicitado, de forma escrita, información referente a aspectos relacionados con su campo profesional (página web y correo electrónico, entre otros)."
    ],
    "criterios_ca": [
      "a) S'han seleccionat les estratègies, estructures, vocabulari i convencions més adequades per al tipus de text que es crearà (fax, nota, carta o correu electrònic, entre d'altres).",
      "b) S'han redactat textos breus relacionats amb aspectes quotidians i/o professionals.",
      "c) S'ha organitzat la informació de manera coherent i cohesionada.",
      "d) S'han realitzat resums de textos relacionats amb el seu entorn professional, identificant les idees principals dels mateixos.",
      "e) S'ha emplenat documentació específica del seu camp professional, aplicant les fórmules establertes i el vocabulari específic.",
      "f) S'ha emplenat un text donat amb suports visuals i claus lingüístiques aportades.",
      "g) S'han utilitzat les fórmules de cortesia pròpies del document que s'elaborarà.",
      "h) S'ha escrit correspondència formal bàsica en format físic o digital destinada principalment a demanar informació, sol·licitar un servei o dur a terme una reclamació o altra gestió senzilla, sempre atenent a les convencions de la tipologia textual.",
      "i) S'han pres notes, i missatges, amb informació senzilla sobre aspectes propis de la seva tasca professional.",
      "j) S'ha sol·licitat, de forma escrita, informació referent a aspectes relacionats amb el seu camp professional (pàgina web i correu electrònic, entre d'altres)."
    ]
  },
  {
    "id": "RA5",
    "module": "Anglès professional",
    "module_es": "Inglés profesional",
    "module_ca": "Anglès professional",
    "moduleCode": "0156",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica actituds i comportaments professionals en situacions de comunicació, descrivint les relacions típiques característiques del país de la llengua estrangera.",
    "description_es": "Aplica actitudes y comportamientos profesionales en situaciones de comunicación, describiendo las relaciones típicas características del país de la lengua extranjera.",
    "description_ca": "Aplica actituds i comportaments professionals en situacions de comunicació, descrivint les relacions típiques característiques del país de la llengua estrangera.",
    "criterios_es": [
      "a) Se han definido los rasgos más significativos de las costumbres y usos de la comunidad donde se habla la lengua extranjera.",
      "b) Se han descrito los protocolos y normas de relación social propios del país.",
      "c) Se han identificado los valores y creencias propios de la comunidad donde se habla la lengua extranjera.",
      "d) Se han identificado los aspectos socio-profesionales propios del sector, en cualquier tipo de texto.",
      "e) Se han aplicado los protocolos y normas de relación social propios del país de la lengua extranjera."
    ],
    "criterios_ca": [
      "a) S'han definit els trets més significatius dels costums i usos de la comunitat on es parla la llengua estrangera.",
      "b) S'han descrit els protocols i normes de relació social propis del país.",
      "c) S'han identificat els valors i creences propis de la comunitat on es parla la llengua estrangera.",
      "d) S'han identificat els aspectes socioprofessionals propis del sector, en qualsevol tipus de text.",
      "e) S'han aplicat els protocols i normes de relació social propis del país de la llengua estrangera."
    ]
  },
  {
    "id": "RA1",
    "module": "Sostenibilitat aplicada al sistema productiu",
    "module_es": "Sostenibilidad aplicada al sistema productivo",
    "module_ca": "Sostenibilitat aplicada al sistema productiu",
    "moduleCode": "1708",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Identifica els aspectes ambientals, socials i de governança (ASG) relatius a la sostenibilitat tenint en compte el concepte de desenvolupament sostenible i els marcs internacionals que contribueixen a assolir-lo.",
    "description_es": "Identifica los aspectos ambientales, sociales y de gobernanza (ASG) relativos a la sostenibilidad teniendo en cuenta el concepto de desarrollo sostenible y los marcos internacionales que contribuyen a su consecución.",
    "description_ca": "Identifica els aspectes ambientals, socials i de governança (ASG) relatius a la sostenibilitat tenint en compte el concepte de desenvolupament sostenible i els marcs internacionals que contribueixen a assolir-lo.",
    "criterios_es": [
      "a) Se ha descrito el concepto de sostenibilidad, estableciendo los marcos internacionales asociados al desarrollo sostenible.",
      "b) Se han identificado los asuntos ambientales, sociales y de gobernanza que influyen en el desarrollo sostenible de las organizaciones empresariales.",
      "c) Se han relacionado los Objetivos de Desarrollo Sostenible (ODS) con su importancia para la consecución de la Agenda 2030.",
      "d) Se ha analizado la importancia de identificar los aspectos ASG más relevantes para los grupos de interés de las organizaciones relacionándolos con los riesgos y oportunidades que suponen para la propia organización.",
      "e) Se han identificado los principales estándares de métricas para la evaluación del desempeño en sostenibilidad y su papel en la rendición de cuentas que marca la legislación vigente y las futuras regulaciones en desarrollo.",
      "f) Se ha descrito la inversión socialmente responsable y el papel de los analistas, inversores, agencias e índices de sostenibilidad en el fomento de la sostenibilidad."
    ],
    "criterios_ca": [
      "a) S'ha descrit el concepte de sostenibilitat, establint els marcs internacionals associats al desenvolupament sostenible.",
      "b) S'han identificat les qüestions ambientals, socials i de governança que influeixen en el desenvolupament sostenible de les organitzacions empresarials.",
      "c) S'han relacionat els Objectius de Desenvolupament Sostenible (ODS) amb la seva importància per assolir l'Agenda 2030.",
      "d) S'ha analitzat la importància d'identificar els aspectes ASG més rellevants per als grups d'interès de les organitzacions, relacionant-los amb els riscs i les oportunitats que suposen per a la mateixa organització.",
      "e) S'han identificat els principals estàndards de mètriques per a l'avaluació de l'acompliment en sostenibilitat i el seu paper en la rendició de comptes que marca la legislació vigent i les futures regulacions en desenvolupament.",
      "f) S'ha descrit la inversió socialment responsable i el paper dels analistes, inversors, agències i índexs de sostenibilitat en el foment de la sostenibilitat."
    ]
  },
  {
    "id": "RA2",
    "module": "Sostenibilitat aplicada al sistema productiu",
    "module_es": "Sostenibilidad aplicada al sistema productivo",
    "module_ca": "Sostenibilitat aplicada al sistema productiu",
    "moduleCode": "1708",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Caracteritza els reptes ambientals i socials a què s'enfronta la societat, descrivint els impactes sobre les persones i els sectors productius i proposant accions per minimitzar-los.",
    "description_es": "Caracteriza los retos ambientales y sociales a los que se enfrenta la sociedad, describiendo los impactos sobre las personas y los sectores productivos y proponiendo acciones para minimizarlos.",
    "description_ca": "Caracteritza els reptes ambientals i socials a què s'enfronta la societat, descrivint els impactes sobre les persones i els sectors productius i proposant accions per minimitzar-los.",
    "criterios_es": [
      "a) Se han identificado los principales retos ambientales y sociales.",
      "b) Se han relacionado los retos ambientales y sociales con el desarrollo de la actividad económica.",
      "c) Se ha analizado el efecto de los impactos ambientales y sociales sobre las personas y los sectores productivos.",
      "d) Se han identificado las medidas y acciones encaminadas a minimizar los impactos ambientales y sociales.",
      "e) Se ha analizado la importancia de establecer alianzas y trabajar de manera transversal y coordinada para abordar con éxito los retos ambientales y sociales."
    ],
    "criterios_ca": [
      "a) S'han identificat els principals reptes ambientals i socials.",
      "b) S'han relacionat els reptes ambientals i socials amb el desenvolupament de l'activitat econòmica.",
      "c) S'ha analitzat l'efecte dels impactes ambientals i socials sobre les persones i els sectors productius.",
      "d) S'han identificat les mesures i les accions encaminades a minimitzar els impactes ambientals i socials.",
      "e) S'ha analitzat la importància d'establir aliances i de treballar de manera transversal i coordinada per abordar amb èxit els reptes ambientals i socials."
    ]
  },
  {
    "id": "RA3",
    "module": "Sostenibilitat aplicada al sistema productiu",
    "module_es": "Sostenibilidad aplicada al sistema productivo",
    "module_ca": "Sostenibilitat aplicada al sistema productiu",
    "moduleCode": "1708",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Estableix l'aplicació de criteris de sostenibilitat en l'acompliment professional i personal, identificant-ne els elements necessaris.",
    "description_es": "Establece la aplicación de criterios de sostenibilidad en el desempeño profesional y personal, identificando los elementos necesarios.",
    "description_ca": "Estableix l'aplicació de criteris de sostenibilitat en l'acompliment professional i personal, identificant-ne els elements necessaris.",
    "criterios_es": [
      "a) Se han identificado los ODS más relevantes para la actividad profesional que realiza.",
      "b) Se han analizado los riesgos y oportunidades que representan los ODS.",
      "c) Se han identificado las acciones necesarias para atender algunos de los retos ambientales y sociales desde la actividad profesional y el entorno personal."
    ],
    "criterios_ca": [
      "a) S'han identificat els ODS més rellevants per a l'activitat professional que duu a terme.",
      "b) S'han analitzat els riscs i les oportunitats que representen els ODS.",
      "c) S'han identificat les accions necessàries per atendre alguns dels reptes ambientals i socials des de l'activitat professional i l'entorn personal."
    ]
  },
  {
    "id": "RA4",
    "module": "Sostenibilitat aplicada al sistema productiu",
    "module_es": "Sostenibilidad aplicada al sistema productivo",
    "module_ca": "Sostenibilitat aplicada al sistema productiu",
    "moduleCode": "1708",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Proposa productes i serveis responsables tenint en compte els principis de l'economia circular.",
    "description_es": "Propón productos y servicios responsables teniendo en cuenta los principios de la economía circular.",
    "description_ca": "Proposa productes i serveis responsables tenint en compte els principis de l'economia circular.",
    "criterios_es": [
      "a) Se ha caracterizado el modelo de producción y consumo actual.",
      "b) Se han identificado los principios de la economía verde y circular.",
      "c) Se han contrastado los beneficios de la economía verde y circular frente al modelo clásico de producción.",
      "d) Se han aplicado principios de ecodiseño.",
      "e) Se ha analizado el ciclo de vida del producto.",
      "f) Se han identificado los procesos de producción y los criterios de sostenibilidad aplicados."
    ],
    "criterios_ca": [
      "a) S'ha caracteritzat el model de producció i consum actual.",
      "b) S'han identificat els principis de l'economia verda i circular.",
      "c) S'han contrastat els beneficis de l'economia verda i circular enfront del model clàssic de producció.",
      "d) S'han aplicat principis d'ecodisseny.",
      "e) S'ha analitzat el cicle de vida del producte.",
      "f) S'han identificat els processos de producció i els criteris de sostenibilitat aplicats."
    ]
  },
  {
    "id": "RA5",
    "module": "Sostenibilitat aplicada al sistema productiu",
    "module_es": "Sostenibilidad aplicada al sistema productivo",
    "module_ca": "Sostenibilitat aplicada al sistema productiu",
    "moduleCode": "1708",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Duu a terme activitats sostenibles minimitzant-ne l'impacte en el medi ambient.",
    "description_es": "Realiza actividades sostenibles minimizando el impacto de las mismas en el medio ambiente.",
    "description_ca": "Duu a terme activitats sostenibles minimitzant-ne l'impacte en el medi ambient.",
    "criterios_es": [
      "a) Se ha caracterizado el modelo de producción y consumo actual.",
      "b) Se han identificado los principios de la economía verde y circular.",
      "c) Se han contrastado los beneficios de la economía verde y circular frente al modelo clásico de producción.",
      "d) Se ha evaluado el impacto de las actividades personales y profesionales.",
      "e) Se han aplicado principios de ecodiseño.",
      "f) Se han aplicado estrategias sostenibles.",
      "g) Se ha analizado el ciclo de vida del producto.",
      "h) Se han identificado los procesos de producción y los criterios de sostenibilidad aplicados.",
      "i) Se ha aplicado la normativa ambiental."
    ],
    "criterios_ca": [
      "a) S'ha caracteritzat el model de producció i consum actual.",
      "b) S'han identificat els principis de l'economia verda i circular.",
      "c) S'han contrastat els beneficis de l'economia verda i circular enfront del model clàssic de producció.",
      "d) S'ha avaluat l'impacte de les activitats personals i professionals.",
      "e) S'han aplicat principis d'ecodisseny.",
      "f) S'han aplicat estratègies sostenibles.",
      "g) S'ha analitzat el cicle de vida del producte.",
      "h) S'han identificat els processos de producció i els criteris de sostenibilitat aplicats.",
      "i) S'ha aplicat la normativa ambiental."
    ]
  },
  {
    "id": "RA6",
    "module": "Sostenibilitat aplicada al sistema productiu",
    "module_es": "Sostenibilidad aplicada al sistema productivo",
    "module_ca": "Sostenibilitat aplicada al sistema productiu",
    "moduleCode": "1708",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Analitza un pla de sostenibilitat d'una empresa del sector, identificant-ne els grups d'interès i els aspectes ASG materials i justificant accions per gestionar-los i mesurar-los.",
    "description_es": "Analiza un plan de sostenibilidad de una empresa del sector, identificando sus grupos de interés, los aspectos ASG materiales y justificando acciones para su gestión y medición.",
    "description_ca": "Analitza un pla de sostenibilitat d'una empresa del sector, identificant-ne els grups d'interès i els aspectes ASG materials i justificant accions per gestionar-los i mesurar-los.",
    "criterios_es": [
      "a) Se han identificado los principales grupos de interés de la empresa.",
      "b) Se han analizado los aspectos ASG materiales, las expectativas de los grupos de interés y la importancia de los aspectos ASG en relación con los objetivos empresariales.",
      "c) Se han definido acciones encaminadas a minimizar los impactos negativos y aprovechar las oportunidades que plantean los principales aspectos ASG identificados.",
      "d) Se han determinado las métricas de evaluación del desempeño de la empresa de acuerdo con los estándares de sostenibilidad más ampliamente utilizados.",
      "e) Se ha elaborado un informe de sostenibilidad con el plan y los indicadores propuestos."
    ],
    "criterios_ca": [
      "a) S'han identificat els principals grups d'interès de l'empresa.",
      "b) S'han analitzat els aspectes ASG materials, les expectatives dels grups d'interès i la importància dels aspectes ASG en relació amb els objectius empresarials.",
      "c) S'han definit accions encaminades a minimitzar els impactes negatius i aprofitar les oportunitats que plantegen els principals aspectes ASG identificats.",
      "d) S'han determinat les mètriques d'avaluació de l'acompliment de l'empresa d'acord amb els estàndards de sostenibilitat més utilitzats.",
      "e) S'ha elaborat un informe de sostenibilitat amb el pla i els indicadors proposats."
    ]
  },
  {
    "id": "RA1",
    "module": "Itinerari personal per a l'ocupabilitat II",
    "module_es": "Itinerario personal para la empleabilidad II",
    "module_ca": "Itinerari personal per a l'ocupabilitat II",
    "moduleCode": "1710",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Planifica i posa en marxa estratègies en els diferents processos selectius d'ocupació que li permeten millorar les seves possibilitats d'inserció laboral.",
    "description_es": "Planifica y pone en marcha estrategias en los diferentes procesos selectivos de empleo que le permiten mejorar sus posibilidades de inserción laboral.",
    "description_ca": "Planifica i posa en marxa estratègies en els diferents processos selectius d'ocupació que li permeten millorar les seves possibilitats d'inserció laboral.",
    "criterios_es": [
      "a) Se han determinado las técnicas utilizadas actualmente en el sector para el proceso de selección de personal.",
      "b) Se han desarrollado estrategias para la búsqueda de empleo relacionadas con las técnicas actuales más utilizadas contextualizadas al sector.",
      "c) Se han valorado las actitudes y aptitudes que permiten superar procesos selectivos en el sector privado y en el sector público.",
      "d) Se ha construido una marca personal identificando las necesidades del mercado actual, sus habilidades, destrezas y su aporte de valor."
    ],
    "criterios_ca": [
      "a) S'han determinat les tècniques utilitzades actualment en el sector per al procés de selecció de personal.",
      "b) S'han desenvolupat estratègies per a la cerca de feina relacionades amb les tècniques actuals més utilitzades, contextualitzades al sector.",
      "c) S'han valorat les actituds i les aptituds que permeten superar processos selectius en el sector privat i en el sector públic.",
      "d) S'ha construït una marca personal identificant les necessitats del mercat actual, les seves habilitats i destreses i la seva aportació de valor."
    ]
  },
  {
    "id": "RA2",
    "module": "Itinerari personal per a l'ocupabilitat II",
    "module_es": "Itinerario personal para la empleabilidad II",
    "module_ca": "Itinerari personal per a l'ocupabilitat II",
    "moduleCode": "1710",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Aplica estratègies relacionades amb les competències personals, socials i emocionals per a l'ocupació amb l'objectiu de millorar la seva ocupabilitat.",
    "description_es": "Aplica estrategias relacionadas con las competencias personales, sociales y emocionales para el empleo en búsqueda de la mejora de su empleabilidad.",
    "description_ca": "Aplica estratègies relacionades amb les competències personals, socials i emocionals per a l'ocupació amb l'objectiu de millorar la seva ocupabilitat.",
    "criterios_es": [
      "a) Se ha valorado la importancia de las competencias personales y sociales en la empleabilidad en el sector de referencia.",
      "b) Se ha participado activamente en el establecimiento de los objetivos del equipo y en la toma de decisiones del mismo y asumido la responsabilidad de las acciones y decisiones del grupo, participando activamente en el logro de unos objetivos compartidos cooperando con otras personas y compartiendo el liderazgo.",
      "c) Se han incorporado al propio proceso de aprendizaje las técnicas y recursos de presentación y comunicación, tanto orales como escritos, adecuados para una comunicación efectiva y afectiva siendo capaz de adaptarlos a cada situación y circunstancias, valorando las oportunidades y dificultades que ofrece cada una de ellas.",
      "d) Se han aplicado técnicas y estrategias para la gestión del tiempo disponible para alcanzar los objetivos tanto individuales como del equipo y programado las actividades necesarias.",
      "e) Se han aplicado estrategias para canalizar las emociones mostrando una actitud flexible en las relaciones con otras personas.",
      "f) Se han desarrollado estrategias para la programación de actividades atendiendo a criterios de organización eficiente y previendo las posibles dificultades.",
      "g) Se ha reaccionado de forma flexible y positiva ante conflictos y situaciones nuevas, aprovechando las oportunidades y gestionando las dificultades haciendo uso de estrategias relacionadas con la inteligencia emocional."
    ],
    "criterios_ca": [
      "a) S'ha valorat la importància de les competències personals i socials en l'ocupabilitat en el sector de referència.",
      "b) S'ha participat activament en l'establiment dels objectius de l'equip i en la seva presa de decisions, s'ha assumit la responsabilitat de les accions i les decisions del grup i s'ha participat activament en l'assoliment d'uns objectius compartits, cooperant amb altres persones i compartint el lideratge.",
      "c) S'han incorporat al propi procés d'aprenentatge les tècniques i els recursos de presentació i comunicació, tant orals com escrits, adequats per a una comunicació efectiva i afectiva, adaptant-los a cada situació i circumstància i valorant les oportunitats i les dificultats que ofereix cadascuna.",
      "d) S'han aplicat tècniques i estratègies per a la gestió del temps disponible per assolir els objectius tant individuals com de l'equip i s'han programat les activitats necessàries.",
      "e) S'han aplicat estratègies per canalitzar les emocions mostrant una actitud flexible en les relacions amb altres persones.",
      "f) S'han desenvolupat estratègies per a la programació d'activitats atenent criteris d'organització eficient i preveient les possibles dificultats.",
      "g) S'ha reaccionat de manera flexible i positiva davant conflictes i situacions noves, aprofitant les oportunitats i gestionant les dificultats amb estratègies relacionades amb la intel·ligència emocional."
    ]
  },
  {
    "id": "RA3",
    "module": "Itinerari personal per a l'ocupabilitat II",
    "module_es": "Itinerario personal para la empleabilidad II",
    "module_ca": "Itinerari personal per a l'ocupabilitat II",
    "moduleCode": "1710",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Posa en pràctica les habilitats emprenedores necessàries per al desenvolupament de processos d'innovació i investigació aplicades que promoguin la modernització del sector productiu cap a un model sostenible.",
    "description_es": "Pone en práctica las habilidades emprendedoras necesarias para el desarrollo de procesos de innovación e investigación aplicadas que promuevan la modernización del sector productivo hacia un modelo sostenible.",
    "description_ca": "Posa en pràctica les habilitats emprenedores necessàries per al desenvolupament de processos d'innovació i investigació aplicades que promoguin la modernització del sector productiu cap a un model sostenible.",
    "criterios_es": [
      "a) Se ha identificado el concepto de innovación y su relación con la construcción de una sociedad más sostenible que mejore en el bienestar de los individuos.",
      "b) Se han analizado las distintas metodologías para emprender y su importancia para favorecer la innovación y como fuente de creación de empleo y bienestar social.",
      "c) Se han aplicado las habilidades emprendedoras necesarias para promover el emprendimiento y el intraemprendimiento.",
      "d) Se ha puesto en práctica el trabajo colaborativo como requisito para el desarrollo de procesos de innovación.",
      "e) Se ha desarrollado la competencia digital necesaria para la mejora de los procesos de innovación e investigación aplicadas que promuevan la modernización del sector productivo.",
      "f) Se han incorporado los objetivos de las políticas e iniciativas relacionadas con la sostenibilidad y el medio ambiente a la estrategia empresarial enfocada al desarrollo de un modelo económico y social sostenible."
    ],
    "criterios_ca": [
      "a) S'ha identificat el concepte d'innovació i la seva relació amb la construcció d'una societat més sostenible que millori el benestar de les persones.",
      "b) S'han analitzat les diferents metodologies per emprendre i la seva importància per afavorir la innovació i com a font de creació d'ocupació i benestar social.",
      "c) S'han aplicat les habilitats emprenedores necessàries per promoure l'emprenedoria i la intraemprenedoria.",
      "d) S'ha posat en pràctica el treball col·laboratiu com a requisit per al desenvolupament de processos d'innovació.",
      "e) S'ha desenvolupat la competència digital necessària per a la millora dels processos d'innovació i investigació aplicades que promoguin la modernització del sector productiu.",
      "f) S'han incorporat els objectius de les polítiques i les iniciatives relacionades amb la sostenibilitat i el medi ambient a l'estratègia empresarial enfocada al desenvolupament d'un model econòmic i social sostenible."
    ]
  },
  {
    "id": "RA4",
    "module": "Itinerari personal per a l'ocupabilitat II",
    "module_es": "Itinerario personal para la empleabilidad II",
    "module_ca": "Itinerari personal per a l'ocupabilitat II",
    "moduleCode": "1710",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Identifica, defineix i valida idees d'emprenedoria generadores de noves oportunitats a partir d'estratègies d'anàlisi de l'entorn socioproductiu, utilitzant metodologies àgils per a l'emprenedoria.",
    "description_es": "Identifica, define y valida ideas de emprendimiento generadoras de nuevas oportunidades a partir de estrategias de análisis del entorno socio productivo utilizando metodologías ágiles para el emprendimiento.",
    "description_ca": "Identifica, defineix i valida idees d'emprenedoria generadores de noves oportunitats a partir d'estratègies d'anàlisi de l'entorn socioproductiu, utilitzant metodologies àgils per a l'emprenedoria.",
    "criterios_es": [
      "a) Se han identificado los problemas de las personas destinatarias potenciales del proyecto emprendedor como paso previo a la propuesta de soluciones que se conviertan en oportunidades.",
      "b) Se ha puesto en práctica el proceso creativo con el fin de conseguir una idea emprendedora que aporte valor económico, social y/o cultural.",
      "c) Se ha diseñado un modelo de negocio y/o gestión derivado de la idea emprendedora.",
      "d) Se han incorporado valores éticos y sociales a la idea emprendedora analizando modelos de balance social.",
      "e) Se ha analizado la contribución de la Economía Circular y la Economía del Bien Común al desarrollo de un modelo económico y social basado en la equidad, la justicia social y la sostenibilidad.",
      "f) Se han analizado los principales componentes del entorno general y específico, y su impacto en la idea emprendedora.",
      "g) Se han realizado entrevistas de problema para validar el perfil y el problema de las personas destinatarias de la idea emprendedora.",
      "h) Se ha validado la solución mediante la creación de prototipos buscando el encaje problema-solución.",
      "i) Se ha experimentado con la puesta en práctica de estrategias de marketing para desarrollar destrezas en técnicas de comunicación y venta."
    ],
    "criterios_ca": [
      "a) S'han identificat els problemes de les persones destinatàries potencials del projecte emprenedor com a pas previ a la proposta de solucions que es converteixin en oportunitats.",
      "b) S'ha posat en pràctica el procés creatiu amb la finalitat d'aconseguir una idea emprenedora que aporti valor econòmic, social o cultural.",
      "c) S'ha dissenyat un model de negoci o de gestió derivat de la idea emprenedora.",
      "d) S'han incorporat valors ètics i socials a la idea emprenedora analitzant models de balanç social.",
      "e) S'ha analitzat la contribució de l'economia circular i de l'economia del bé comú al desenvolupament d'un model econòmic i social basat en l'equitat, la justícia social i la sostenibilitat.",
      "f) S'han analitzat els principals components de l'entorn general i específic i el seu impacte en la idea emprenedora.",
      "g) S'han fet entrevistes de problema per validar el perfil i el problema de les persones destinatàries de la idea emprenedora.",
      "h) S'ha validat la solució mitjançant la creació de prototips cercant l'encaix problema-solució.",
      "i) S'ha experimentat amb la posada en pràctica d'estratègies de màrqueting per desenvolupar destreses en tècniques de comunicació i venda."
    ]
  },
  {
    "id": "RA5",
    "module": "Itinerari personal per a l'ocupabilitat II",
    "module_es": "Itinerario personal para la empleabilidad II",
    "module_ca": "Itinerari personal per a l'ocupabilitat II",
    "moduleCode": "1710",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Desenvolupa un projecte emprenedor d'innovació social o tecnològica aplicada en col·laboració amb l'entorn.",
    "description_es": "Desarrolla un proyecto emprendedor de innovación social y/o tecnológica aplicada en colaboración con el entorno.",
    "description_ca": "Desenvolupa un projecte emprenedor d'innovació social o tecnològica aplicada en col·laboració amb l'entorn.",
    "criterios_es": [
      "a) Se han analizado los conceptos básicos del emprendimiento y la innovación social.",
      "b) Se ha reflexionado sobre la necesidad del liderazgo ético y sostenible en las organizaciones.",
      "c) Se ha reflexionado sobre la tecnología como base para el cambio del modelo productivo.",
      "d) Se han puesto en marcha las estrategias propias del pensamiento de diseño para detectar necesidades sociales y medioambientales.",
      "e) Se han analizado los elementos del diseño de modelos de negocio ecosociales y/o de base tecnológica.",
      "f) Se han alineado metas de desarrollo sostenible con el diseño de modelos de negocio ecosociales y/o de base tecnológica.",
      "g) Se han aplicado las estrategias necesarias para analizar la viabilidad del proyecto emprendedor.",
      "h) Se han investigado las opciones financieras socialmente responsables.",
      "i) Se han definido los agentes implicados en el proyecto, así como su participación en el mismo."
    ],
    "criterios_ca": [
      "a) S'han analitzat els conceptes bàsics de l'emprenedoria i la innovació social.",
      "b) S'ha reflexionat sobre la necessitat del lideratge ètic i sostenible en les organitzacions.",
      "c) S'ha reflexionat sobre la tecnologia com a base per al canvi del model productiu.",
      "d) S'han posat en marxa les estratègies pròpies del pensament de disseny per detectar necessitats socials i mediambientals.",
      "e) S'han analitzat els elements del disseny de models de negoci ecosocials o de base tecnològica.",
      "f) S'han alineat metes de desenvolupament sostenible amb el disseny de models de negoci ecosocials o de base tecnològica.",
      "g) S'han aplicat les estratègies necessàries per analitzar la viabilitat del projecte emprenedor.",
      "h) S'han investigat les opcions financeres socialment responsables.",
      "i) S'han definit els agents implicats en el projecte, així com la seva participació."
    ]
  },
  {
    "id": "RA1",
    "module": "Projecte intermodular",
    "module_es": "Proyecto intermodular",
    "module_ca": "Projecte intermodular",
    "moduleCode": "1713",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Caracteritza les empreses del sector atenent la seva organització i el tipus de producte o servei que ofereixen.",
    "description_es": "Caracteriza las empresas del sector atendiendo a su organización y al tipo de producto o servicio que ofrecen.",
    "description_ca": "Caracteritza les empreses del sector atenent la seva organització i el tipus de producte o servei que ofereixen.",
    "criterios_es": [
      "a) Se han identificado las empresas tipo más representativas del sector.",
      "b) Se ha descrito la estructura organizativa de las empresas.",
      "c) Se han caracterizado los principales departamentos.",
      "d) Se han determinado las funciones de cada departamento.",
      "e) Se ha evaluado el volumen de negocio de acuerdo a las necesidades de los clientes.",
      "f) Se ha definido la estrategia para dar respuesta a las demandas.",
      "g) Se han valorado los recursos humanos y materiales necesarios.",
      "h) Se ha realizado el seguimiento de los resultados de acuerdo a la estrategia aplicada.",
      "i) Se han relacionado los productos o servicios con su posible contribución a los ODS (Objetivos de Desarrollo Sostenible)."
    ],
    "criterios_ca": [
      "a) S'han identificat les empreses tipus més representatives del sector.",
      "b) S'ha descrit l'estructura organitzativa de les empreses.",
      "c) S'han caracteritzat els departaments principals.",
      "d) S'han determinat les funcions de cada departament.",
      "e) S'ha avaluat el volum de negoci d'acord amb les necessitats dels clients.",
      "f) S'ha definit l'estratègia per donar resposta a les demandes.",
      "g) S'han valorat els recursos humans i materials necessaris.",
      "h) S'ha fet el seguiment dels resultats d'acord amb l'estratègia aplicada.",
      "i) S'han relacionat els productes o serveis amb la seva possible contribució als ODS (Objectius de Desenvolupament Sostenible)."
    ]
  },
  {
    "id": "RA2",
    "module": "Projecte intermodular",
    "module_es": "Proyecto intermodular",
    "module_ca": "Projecte intermodular",
    "moduleCode": "1713",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Planteja solucions a les necessitats del sector tenint en compte la viabilitat de les mateixes, els costos associats i elaborant un petit projecte.",
    "description_es": "Plantea soluciones a las necesidades del sector teniendo en cuenta la viabilidad de las mismas, los costes asociados y elaborando un pequeño proyecto.",
    "description_ca": "Planteja solucions a les necessitats del sector tenint en compte la viabilitat de les mateixes, els costos associats i elaborant un petit projecte.",
    "criterios_es": [
      "a) Se han identificado las necesidades.",
      "b) Se han planteado en grupo posibles soluciones.",
      "c) Se ha obtenido la información relativa a las soluciones planteadas.",
      "d) Se han identificado aspectos innovadores que puedan ser de aplicación.",
      "e) Se ha realizado el estudio de viabilidad técnica.",
      "f) Se han identificado las partes que componen el proyecto.",
      "g) Se han previsto los recursos materiales y humanos para realizarlo.",
      "h) Se ha realizado el presupuesto económico correspondiente.",
      "i) Se ha definido y elaborado la documentación para su diseño.",
      "j) Se han identificado los aspectos relacionados con la calidad del proyecto.",
      "k) Se han presentado en público las ideas más relevantes de los proyectos propuestos."
    ],
    "criterios_ca": [
      "a) S'han identificat les necessitats.",
      "b) S'han plantejat possibles solucions en grup.",
      "c) S'ha obtingut la informació relativa a les solucions plantejades.",
      "d) S'han identificat aspectes innovadors que es puguin aplicar.",
      "e) S'ha fet l'estudi de viabilitat tècnica.",
      "f) S'han identificat les parts que componen el projecte.",
      "g) S'han previst els recursos materials i humans per fer-ho.",
      "h) S'ha fet el pressupost econòmic corresponent.",
      "i) S'ha definit i elaborat la documentació per al seu disseny.",
      "j) S'han identificat els aspectes relacionats amb la qualitat del projecte.",
      "k) S'han presentat en públic les idees més rellevants dels projectes proposats."
    ]
  },
  {
    "id": "RA3",
    "module": "Projecte intermodular",
    "module_es": "Proyecto intermodular",
    "module_ca": "Projecte intermodular",
    "moduleCode": "1713",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Planifica l'execució de les activitats proposades a la solució plantejada, determinant el pla d'intervenció i elaborant la documentació corresponent.",
    "description_es": "Planifica la ejecución de las actividades propuestas a la solución planteada, determinando el plan de intervención y elaborando la documentación correspondiente.",
    "description_ca": "Planifica l'execució de les activitats proposades a la solució plantejada, determinant el pla d'intervenció i elaborant la documentació corresponent.",
    "criterios_es": [
      "a) Se han temporizado las secuencias de las actividades.",
      "b) Se han determinado los recursos y la logística de cada actividad.",
      "c) Se han identificado permisos y autorizaciones en caso de ser necesarios.",
      "d) Se han identificado las actividades que implican riesgos en su ejecución.",
      "e) Se ha tenido en cuenta el plan de prevención de riesgos y los medios y equipos necesarios.",
      "f) Se han asignado recursos materiales y humanos a cada actividad.",
      "g) Se han tenido en cuenta posibles imprevistos.",
      "h) Se han propuesto soluciones a los posibles imprevistos.",
      "i) Se ha elaborado la documentación necesaria."
    ],
    "criterios_ca": [
      "a) S'han temporitzat les seqüències de les activitats.",
      "b) S'han determinat els recursos i la logística de cada activitat.",
      "c) S'han identificat permisos i autoritzacions en cas que siguin necessaris.",
      "d) S'han identificat les activitats que impliquen riscos en la seva execució.",
      "e) S'ha tingut en compte el pla de prevenció de riscos i els mitjans i els equips necessaris.",
      "f) S'han assignat recursos materials i humans a cada activitat.",
      "g) S'han tingut en compte possibles imprevistos.",
      "h) S'han proposat solucions als possibles imprevistos.",
      "i) S'ha elaborat la documentació necessària."
    ]
  },
  {
    "id": "RA4",
    "module": "Projecte intermodular",
    "module_es": "Proyecto intermodular",
    "module_ca": "Projecte intermodular",
    "moduleCode": "1713",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Realitza el seguiment de l'execució de les activitats plantejades, verificant que es compleix amb la planificació.",
    "description_es": "Realiza el seguimiento de la ejecución de las actividades planteadas, verificando que se cumple con la planificación.",
    "description_ca": "Realitza el seguiment de l'execució de les activitats plantejades, verificant que es compleix amb la planificació.",
    "criterios_es": [
      "a) Se ha definido el procedimiento de seguimiento de las actividades.",
      "b) Se ha verificado la calidad de los resultados de las actividades.",
      "c) Se han identificado posibles desviaciones de la planificación y/o los resultados esperados.",
      "d) Se ha informado de las desviaciones en caso de ser necesario.",
      "e) Se han solucionado las desviaciones y se han documentado las intervenciones.",
      "f) Se ha definido y elaborado la documentación necesaria para la evaluación de las actividades y del proyecto en su conjunto."
    ],
    "criterios_ca": [
      "a) S'ha definit el procediment de seguiment de les activitats.",
      "b) S'ha verificat la qualitat dels resultats de les activitats.",
      "c) S'han identificat possibles desviacions de la planificació i dels resultats esperats.",
      "d) S'ha informat de les desviacions en cas que sigui necessari.",
      "e) S'han solucionat les desviacions i se n'han documentat les intervencions.",
      "f) S'ha definit i elaborat la documentació necessària per a l'avaluació de les activitats i del projecte en conjunt."
    ]
  },
  {
    "id": "RA5",
    "module": "Projecte intermodular",
    "module_es": "Proyecto intermodular",
    "module_ca": "Projecte intermodular",
    "moduleCode": "1713",
    "tipoNivel": "CFGM_ATENCION_DEPENDENCIA",
    "description": "Transmet informació amb claredat, de manera ordenada i estructurada.",
    "description_es": "Transmite información con claridad, de manera ordenada y estructurada.",
    "description_ca": "Transmet informació amb claredat, de manera ordenada i estructurada.",
    "criterios_es": [
      "a) Se ha mantenido una actitud ordenada y metódica en la transmisión de la información.",
      "b) Se ha transmitido información verbal tanto horizontal como verticalmente.",
      "c) Se ha transmitido información entre los miembros del grupo utilizando medios informáticos.",
      "d) Se han conocido los términos técnicos en otras lenguas que sean estándares del sector."
    ],
    "criterios_ca": [
      "a) S'ha mantingut una actitud ordenada i metòdica en la transmissió de la informació.",
      "b) S'ha transmès informació verbal tant horitzontalment com verticalment.",
      "c) S'ha transmès informació entre els membres del grup fent servir mitjans informàtics.",
      "d) S'han conegut els termes tècnics en altres llengües que siguin estàndards del sector."
    ]
  }
];
