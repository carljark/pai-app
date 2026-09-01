import { FPBModule } from '../models/mapa-intermodular.model';

export const FPB_MODULES_SEED: FPBModule[] = [
  {
    code: '3060',
    name_es: 'Preparación del entorno profesional',
    name_ca: 'Preparació de l’entorn professional',
    type: 'especifico',
    color: '#0284c7',
    icon: 'wrench',
    learningOutcomes: [
      {
        id: '3060_RA1',
        code: 'RA1',
        text_es: 'Prepara las instalaciones, equipos, útiles y materiales de trabajo, reconociendo las condiciones higiénico-sanitarias y de seguridad.',
        text_ca: 'Prepara les instal·lacions, equips, estris i materials de treball, reconeixent les condicions higienicosanitàries i de seguretat.',
        importance_es: 'Fundamental para garantizar la seguridad, desinfección y prevención de riesgos biológicos y químicos en el salón.',
        importance_ca: 'Fonamental per garantir la seguretat, desinfecció i prevenció de riscos biològics i químics al saló.',
        connections: [
          {
            targetModuleCode: '3005',
            targetModuleName_es: 'Atención al cliente',
            targetModuleName_ca: 'Atenció al client',
            targetRaCode: 'RA1',
            targetRaText_es: 'Aplica técnicas de recepción, acomodación e información al cliente.',
            targetRaText_ca: 'Aplica tècniques de recepció, acomodació i informació al client.',
            relationType: 'cliente',
            justification_es: 'La primera impresión de un cliente depende directamente del orden, higiene y preparación impecable de la cabina y tocador antes de su recepción.',
            justification_ca: 'La primera impressió d’un client depèn directament de l’ordre, higiene i preparació impecable de la cabina i tocador abans de la seva recepció.',
            activities: [
              {
                id: 'act_escape_higiene',
                title_es: 'Escape Room: Protocolo de Cabina Segura',
                title_ca: 'Escape Room: Protocol de Cabina Segura',
                description_es: 'El alumnado trabaja en equipos resolviendo retos y pistas sobre esterilización de instrumental y preparación del tocador antes de recibir al cliente.',
                description_ca: 'L’alumnat treballa en equips resolent reptes i pistes sobre esterilització d’instrumental i preparació del tocador abans de rebre el client.',
                stepByStep_es: [
                  '1. Distribución de roles: Responsable de EPIs, Inspector de Esterilización, Coordinador de Atención.',
                  '2. Localización y desinfección de útiles con errores intencionados en el tocador.',
                  '3. Checklist digital con fotos de antes y después.',
                  '4. Simulación de bienvenida al primer cliente con cabina lista.'
                ],
                stepByStep_ca: [
                  '1. Distribució de rols: Responsable d’EPIs, Inspector d’Esterilització, Coordinador d’Atenció.',
                  '2. Localització i desinfecció d’estris amb errors intencionats al tocador.',
                  '3. Checklist digital amb fotos d’abans i després.',
                  '4. Simulació de benvinguda al primer client amb cabina llesta.'
                ],
                evidence_es: 'Ficha de checklist visual y vídeo corto demostrativo de apertura segura.',
                evidence_ca: 'Fitxa de checklist visual i vídeo curt demostratiu d’obertura segura.',
                diversitySupport_es: 'Pictogramas con el orden de desinfección, tarjetas de apoyo con fotos de instrumental limpio vs sucio y trabajo en parejas tutoriales.',
                diversitySupport_ca: 'Pictogrames amb l’ordre de desinfecció, targetes de suport amb fotos d’estris nets vs bruts i treball en parelles tutorials.',
                motivatingFactor_es: 'Dinámica de gamificación contra el cronómetro con insignias de Salón Seguro.',
                motivatingFactor_ca: 'Dinàmica de gamificació contra el cronòmetre amb insígnies de Saló Segur.'
              }
            ]
          },
          {
            targetModuleCode: '3009',
            targetModuleName_es: 'Ciencias aplicadas I',
            targetModuleName_ca: 'Ciències aplicades I',
            targetRaCode: 'RA2',
            targetRaText_es: 'Reconoce los efectos de los productos químicos y agentes físicos sobre la materia y el medio ambiente.',
            targetRaText_ca: 'Reconeix els efectes dels productes químics i agents físics sobre la matèria i el medi ambient.',
            relationType: 'ciencias',
            justification_es: 'La desinfección y el uso de biocidas, alcoholes y autoclaves en el salón requiere comprender la acción química y biológica sobre microorganismos.',
            justification_ca: 'La desinfecció i l’ús de biocides, alcohols i autoclau al saló requereix comprendre l’acció química i biològica sobre microorganismes.',
            activities: [
              {
                id: 'act_eco_saloon_lab',
                title_es: 'Laboratorio de Microorganismos y Eco-Desinfección',
                title_ca: 'Laboratori de Microorganismes i Eco-Desinfecció',
                description_es: 'Práctica comparativa del crecimiento bacteriano en útiles sin desinfectar vs esterilizados con autoclave/UV y preparación de diluciones seguras.',
                description_ca: 'Pràctica comparativa del creixement bacterian en estris sense desinfectar vs esterilitzats amb autoclau/UV i preparació de dilucions segures.',
                evidence_es: 'Mural visual de diluciones químicas seguras y tabla de tiempos de desinfección.',
                evidence_ca: 'Mural visual de dilucions químiques segures i taula de temps de desinfecció.',
                diversitySupport_es: 'Vasos medidores codificados por colores y proporciones marcadas visualmente con líneas guía.',
                diversitySupport_ca: 'Gots mesuradors codificats per colors i proporcions marcades visualment amb línies guia.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3061',
    name_es: 'Cuidados estéticos básicos de uñas',
    name_ca: 'Cures estètiques bàsiques d’ungles',
    type: 'especifico',
    color: '#ec4899',
    icon: 'hand',
    learningOutcomes: [
      {
        id: '3061_RA1',
        code: 'RA1',
        text_es: 'Aplica técnicas de manicura y pedicura básica preparando la lámina ungueal y cutículas.',
        text_ca: 'Aplica tècniques de manicura i pedicura bàsica preparant la làmina unguial i cutícules.',
        importance_es: 'Base de los servicios de manos y pies con enfoque de salud estética y pulcritud técnica.',
        importance_ca: 'Base dels serveis de mans i peus amb enfocament de salut estètica i pulcritud tècnica.',
        connections: [
          {
            targetModuleCode: '3011',
            targetModuleName_es: 'Comunicación y sociedad I',
            targetModuleName_ca: 'Comunicació i societat I',
            targetRaCode: 'RA3',
            targetRaText_es: 'Elabora mensajes orales y escritos aplicando normas gramaticales y vocabulario técnico.',
            targetRaText_ca: 'Elabora missatges orals i escrits aplicant normes gramaticals i vocabulari tècnic.',
            relationType: 'comunicacion',
            justification_es: 'La creación de un catálogo o menú de servicios de manicura para redes sociales requiere redacción persuasiva, ortografía cuidada y vocabulario técnico.',
            justification_ca: 'La creació d’un catàleg o menú de serveis de manicura per a xarxes socials requereix redacció persuasiva, ortografia cuidada i vocabulari tècnic.',
            activities: [
              {
                id: 'act_nail_menu',
                title_es: 'Diseño del Menú Nail Bar & Tendencias TikTok',
                title_ca: 'Disseny del Menú Nail Bar & Tendències TikTok',
                description_es: 'Creación de un catálogo visual de tratamientos de uñas con descripciones técnicas atractivas y consejos de cuidado domiciliario.',
                description_ca: 'Creació d’un catàleg visual de tractaments d’ungles amb descripcions tècniques atractives i consells de cura domiciliària.',
                evidence_es: 'Folleto/Menú digital en Canva o cartulina con códigos QR explicativos.',
                evidence_ca: 'Fullet/Menú digital a Canva o cartolina amb codis QR explicatius.',
                diversitySupport_es: 'Plantillas prediseñadas con frases modelo para rellenar (scaffolding lingüístico).',
                diversitySupport_ca: 'Plantilles predissenyades amb frases model per emplenar (bastida lingüística).'
              }
            ]
          },
          {
            targetModuleCode: '3009',
            targetModuleName_es: 'Ciencias aplicadas I',
            targetModuleName_ca: 'Ciències aplicades I',
            targetRaCode: 'RA1',
            targetRaText_es: 'Identifica la estructura anatómica del cuerpo humano y las alteraciones cutáneas.',
            targetRaText_ca: 'Identifica l’estructura anatòmica del cos humà i les alteracions cutànies.',
            relationType: 'ciencias',
            justification_es: 'Reconocer onicomicosis, padrastros y alteraciones de la lámina ungueal evita complicaciones patológicas y determina si se puede realizar el servicio.',
            justification_ca: 'Reconèixer onicomicosi, repelons i alteracions de la làmina unguial evita complicacions patològiques i determina si es pot fer el servei.',
            activities: [
              {
                id: 'act_nail_diagnosis',
                title_es: 'Guía de Diagnóstico Visual: ¿Tratar o Derivar?',
                title_ca: 'Guia de Diagnòstic Visual: Tractar o Derivar?',
                description_es: 'Tarjetas de casos clínicos con imágenes reales donde el alumnado clasifica alteraciones en "Seguras para Manicura" o "Derivar al Dermatólogo".',
                description_ca: 'Targetes de casos clínics amb imatges reals on l’alumnat classifica alteracions en "Segures per a Manicura" o "Derivar al Dermatòleg".',
                evidence_es: 'Semáforo de diagnóstico ungueal plastificado para el puesto de trabajo.',
                evidence_ca: 'Semàfor de diagnòstic unguial plastificat per al lloc de treball.',
                diversitySupport_es: 'Uso de código de colores (Verde / Ámbar / Rojo) y textos de lectura fácil.',
                diversitySupport_ca: 'Ús de codi de colors (Verd / Àmbre / Vermell) i textos de lectura fàcil.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3062',
    name_es: 'Depilación mecánica y decoloración del vello',
    name_ca: 'Depilació mecànica i decoloració del pèl',
    type: 'especifico',
    color: '#8b5cf6',
    icon: 'sparkles',
    learningOutcomes: [
      {
        id: '3062_RA1',
        code: 'RA1',
        text_es: 'Observa las características del vello y la piel seleccionando los cosméticos y ceras adecuados.',
        text_ca: 'Observa les característiques del pèl i la pell seleccionant els cosmètics i ceres adequats.',
        importance_es: 'Esencial para evitar quemaduras, foliculitis e irritaciones en pieles sensibles.',
        importance_ca: 'Essencial per evitar cremades, fol·liculitis i irritacions en pells sensibles.',
        connections: [
          {
            targetModuleCode: '3009',
            targetModuleName_es: 'Ciencias aplicadas I',
            targetModuleName_ca: 'Ciències aplicades I',
            targetRaCode: 'RA3',
            targetRaText_es: 'Analiza la temperatura, cambios de estado y propiedades termodinámicas de la materia.',
            targetRaText_ca: 'Analitza la temperatura, canvis d’estat i propietats termodinàmiques de la matèria.',
            relationType: 'ciencias',
            justification_es: 'El punto de fusión de las ceras tibias y calientes y la termorregulación de la piel fundamentan la prueba térmica en la muñeca antes de la aplicación.',
            justification_ca: 'El punt de fusió de les ceres tèbies i calentes i la termoregulació de la pell fonamenten la prova tèrmica al canell abans de l’aplicació.',
            activities: [
              {
                id: 'act_wax_safety',
                title_es: 'Taller Termo-Seguro de Ceras y Cosmética Pre/Post',
                title_ca: 'Taller Termo-Segur de Ceres i Cosmètica Pre/Post',
                description_es: 'Calibración de fundidores, medición con termómetros infrarrojos y formulación de una loción post-depilatoria calmante con aloe vera.',
                description_ca: 'Calibratge de fundidors, mesurament amb termòmetres infrarojos i formulació d’una loció postdepilatòria calmant amb àloe vera.',
                evidence_es: 'Registro térmico del fundidor y protocolo de prueba de sensibilidad en muñeca.',
                evidence_ca: 'Registre tèrmic del fundidor i protocol de prova de sensibilitat al canell.',
                diversitySupport_es: 'Termómetro digital con alarma sonora y fotos paso a paso de la prueba de calor.',
                diversitySupport_ca: 'Termòmetre digital amb alarma sonora i fotos pas a pas de la prova de calor.'
              }
            ]
          },
          {
            targetModuleCode: '3159',
            targetModuleName_es: 'Itinerario personal para la empleabilidad',
            targetModuleName_ca: 'Itinerari personal per a l’ocupabilitat',
            targetRaCode: 'RA2',
            targetRaText_es: 'Evalúa los riesgos derivados de la actividad profesional y propone medidas de prevención.',
            targetRaText_ca: 'Avalua els riscos derivats de l’activitat professional i proposa mesures de prevenció.',
            relationType: 'empleabilidad',
            justification_es: 'La postura ergonómica en camilla y el manejo de ceras calientes y espátulas desechables previene lesiones musculares y contagios cruzados.',
            justification_ca: 'La postura ergonòmica en llitera i el maneig de ceres calentes i espàtules d’un sol ús prevé lesions musculars i contagis creuats.',
            activities: [
              {
                id: 'act_ergo_wax',
                title_es: 'Auditoría Ergonómica en Cabina de Depilación',
                title_ca: 'Auditoria Ergonòmica a Cabina de Depilació',
                description_es: 'Grabación en vídeo corto de compañeros trabajando en camilla para detectar posturas forzadas y corregir alturas de taburete y camilla.',
                description_ca: 'Enregistrament en vídeo curt de companys treballant en llitera per detectar postures forçades i corregir altures de tamboret i llitera.',
                evidence_es: 'Ficha de coevaluación ergonómica y decálogo de salud postural.',
                evidence_ca: 'Fitxa de coavaluació ergonòmica i decàleg de salut postural.',
                diversitySupport_es: 'Uso de siluetas corporales para marcar con rotulador las zonas de tensión postural.',
                diversitySupport_ca: 'Ús de siluetes corporals per marcar amb retolador les zones de tensió postural.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3063',
    name_es: 'Maquillaje',
    name_ca: 'Maquillatge',
    type: 'especifico',
    color: '#d946ef',
    icon: 'brush',
    learningOutcomes: [
      {
        id: '3063_RA1',
        code: 'RA1',
        text_es: 'Selecciona cosméticos decorativos aplicando la teoría del color y las características del rostro.',
        text_ca: 'Selecciona cosmètics decoratius aplicant la teoria del color i les característiques del rostre.',
        importance_es: 'Permite diseñar maquillajes sociales y de caracterización armonizando volúmenes y tonalidades.',
        importance_ca: 'Permet dissenyar maquillatges socials i de caracterització harmonitzant volums i tonalitats.',
        connections: [
          {
            targetModuleCode: '3009',
            targetModuleName_es: 'Ciencias aplicadas I',
            targetModuleName_ca: 'Ciències aplicades I',
            targetRaCode: 'RA2',
            targetRaText_es: 'Aplica conceptos de óptica, descomposición de la luz y mezclas cromáticas.',
            targetRaText_ca: 'Aplica conceptes d’òptica, descomposició de la llum i mescles cromàtiques.',
            relationType: 'ciencias',
            justification_es: 'La rueda cromática, los colores complementarios y la neutralización de rojeces/ojeras se fundamentan en la física de la luz y la teoría del color.',
            justification_ca: 'La roda cromàtica, els colors complementaris i la neutralització de vermellors/ulleres es fonamenten en la física de la llum i la teoria del color.',
            activities: [
              {
                id: 'act_chromatic_correction',
                title_es: 'Taller de Neutralización Cromática: El Círculo Mágico',
                title_ca: 'Taller de Neutralització Cromàtica: El Cercle Màgic',
                description_es: 'Práctica con correctores verdes, naranjas y amarillos sobre manchas simuladas y rostros reales demostrando la neutralización de tonos opuestos.',
                description_ca: 'Pràctica amb correctors verds, taronges i grocs sobre taques simulades i rostres reals demostrant la neutralització de tons oposats.',
                evidence_es: 'Face-chart coloreado con la rueda de correctores y fotos antes/después.',
                evidence_ca: 'Face-chart acolorit amb la roda de correctors i fotos abans/després.',
                diversitySupport_es: 'Plantillas de rostros con zonas ya delimitadas y muestras físicas de pintura.',
                diversitySupport_ca: 'Plantilles de rostres amb zones ja delimitades i mostres físiques de pintura.'
              }
            ]
          },
          {
            targetModuleCode: '3011',
            targetModuleName_es: 'Comunicación y sociedad I',
            targetModuleName_ca: 'Comunicació i societat I',
            targetRaCode: 'RA2',
            targetRaText_es: 'Reconoce la evolución estética y social del maquillaje a lo largo de la historia.',
            targetRaText_ca: 'Reconeix l’evolució estètica i social del maquillatge al llarg de la història.',
            relationType: 'comunicacion',
            justification_es: 'El maquillaje refleja los movimientos sociales, feminismo, cine y tribus urbanas desde el Antiguo Egipto hasta la actualidad.',
            justification_ca: 'El maquillatge reflecteix els moviments socials, feminisme, cinema i tribus urbanes des de l’Antic Egipte fins a l’actualitat.',
            activities: [
              {
                id: 'act_history_makeup',
                title_es: 'Túnel del Tiempo: Décadas del Maquillaje (Años 20 a 90)',
                title_ca: 'Túnel del Temps: Dècades del Maquillatge (Anys 20 a 90)',
                description_es: 'Cada pareja investiga una década histórica, diseña el estilismo y maquilla a un compañero simulando un desfile o sesión de fotos de época.',
                description_ca: 'Cada parella investiga una dècada històrica, dissenya l’estilisme i maquilla un company simulant una desfilada o sessió de fotos d’època.',
                evidence_es: 'Exposición fotográfica en el centro con cartelas históricas redactadas por el alumnado.',
                evidence_ca: 'Exposició fotogràfica al centre amb cartel·les històriques redactades per l’alumnat.',
                diversitySupport_es: 'Banco de imágenes clasificadas por décadas y frases cortas guiadas para las cartelas.',
                diversitySupport_ca: 'Banc d’imatges classificades per dècades i frases curtes guiades per a les cartel·les.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3064',
    name_es: 'Lavado y cambios de forma del cabello',
    name_ca: 'Rentat i canvis de forma del cabell',
    type: 'especifico',
    color: '#06b6d4',
    icon: 'scissors',
    learningOutcomes: [
      {
        id: '3064_RA1',
        code: 'RA1',
        text_es: 'Aplica técnicas de higiene capilar y masajes del cuero cabelludo seleccionando cosméticos tratantes.',
        text_ca: 'Aplica tècniques d’higiene capil·lar i massatges del cuir cabellut seleccionant cosmètics tractants.',
        importance_es: 'Servicio transversal y cabecera de todo proceso de peluquería en el lavacabezas.',
        importance_ca: 'Servei transversal i capçalera de tot procés de perruqueria al rentacaps.',
        connections: [
          {
            targetModuleCode: '3009',
            targetModuleName_es: 'Ciencias aplicadas I',
            targetModuleName_ca: 'Ciències aplicades I',
            targetRaCode: 'RA2',
            targetRaText_es: 'Estudia el pH, los tensioactivos y la estructura queratínica del cabello.',
            targetRaText_ca: 'Estudia el pH, els tensioactius i l’estructura queratínica del cabell.',
            relationType: 'ciencias',
            justification_es: 'El pH de los champús (ácido vs alcalino) influye en el cierre de la cutícula capilar y en el estado hidrolipídico del cuero cabelludo.',
            justification_ca: 'El pH dels xampús (àcid vs alcalí) influeix en el tancament de la cutícula capil·lar i en l’estat hidrolipídic del cuir cabellut.',
            activities: [
              {
                id: 'act_ph_capilar',
                title_es: 'Laboratorio del Lavacabezas: Mide el pH de tus Champús',
                title_ca: 'Laboratori del Rentacaps: Mesura el pH dels teus Xampús',
                description_es: 'Medición con tiras reactivas de pH de diferentes champús (neutros, técnicos, anticaspa) y análisis microscópico de la cutícula.',
                description_ca: 'Mesurament amb tires reactives de pH de diferents xampús (neutres, tècnics, anticaspa) i anàlisi microscòpic de la cutícula.',
                evidence_es: 'Póster infográfico sobre la escala del pH capilar.',
                evidence_ca: 'Pòster infogràfic sobre l’escala del pH capil·lar.',
                diversitySupport_es: 'Tabla comparativa visual con emojis según el grado de acidez y fotos de cutícula sana vs abierta.',
                diversitySupport_ca: 'Taula comparativa visual amb emojis segons el grau d’acidesa i fotos de cutícula sana vs oberta.'
              }
            ]
          },
          {
            targetModuleCode: '3005',
            targetModuleName_es: 'Atención al cliente',
            targetModuleName_ca: 'Atenció al client',
            targetRaCode: 'RA2',
            targetRaText_es: 'Genera confort y bienestar en el cliente durante los servicios de cabina y tocador.',
            targetRaText_ca: 'Genera confort i benestar en el client durant els serveis de cabina i tocador.',
            relationType: 'cliente',
            justification_es: 'El momento del masaje en el lavacabezas es uno de los puntos clave para fidelizar al cliente y crear una experiencia relajante y positiva.',
            justification_ca: 'El moment del massatge al rentacaps és un dels punts clau per fidelitzar el client i crear una experiència relaxant i positiva.',
            activities: [
              {
                id: 'act_spa_capilar',
                title_es: 'Simulación "Head Spa Experience": Protocolo Sensorial',
                title_ca: 'Simulació "Head Spa Experience": Protocol Sensorial',
                description_es: 'Role-play donde los alumnos aplican toallas calientes aromáticas, masaje capilar y preguntas de cortesía al cliente en lavacabezas.',
                description_ca: 'Role-play on els alumnes apliquen tovalloles calentes aromàtiques, massatge capil·lar i preguntes de cortesia al client al rentacaps.',
                evidence_es: 'Rúbrica de autoevaluación y feedback del compañero cliente.',
                evidence_ca: 'Rúbrica d’autoavaluació i retorn del company client.',
                diversitySupport_es: 'Esquema con flechas numeradas de los movimientos del masaje craneal.',
                diversitySupport_ca: 'Esquema amb fletxes numerades dels moviments del massatge cranial.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3065',
    name_es: 'Cambios de color del cabello',
    name_ca: 'Canvis de color del cabell',
    type: 'especifico',
    color: '#f59e0b',
    icon: 'palette',
    learningOutcomes: [
      {
        id: '3065_RA1',
        code: 'RA1',
        text_es: 'Prepara y aplica tinturas y decoloraciones capilares calculando proporciones y tiempos de exposición.',
        text_ca: 'Prepara i aplica tintures i decoloracions capil·lars calculant proporcions i temps d’exposició.',
        importance_es: 'Técnica de alta demanda comercial que requiere exactitud matemática y química.',
        importance_ca: 'Tècnica d’alta demanda comercial que requereix exactitud matemàtica i química.',
        connections: [
          {
            targetModuleCode: '3009',
            targetModuleName_es: 'Ciencias aplicadas I',
            targetModuleName_ca: 'Ciències aplicades I',
            targetRaCode: 'RA3',
            targetRaText_es: 'Resuelve problemas de proporcionalidad, porcentajes y regla de tres aplicados a mezclas.',
            targetRaText_ca: 'Resol problemes de proporcionalitat, percentatges i regla de tres aplicats a mescles.',
            relationType: 'ciencias',
            justification_es: 'La proporción de tinte y oxidante (1:1, 1:1.5, 1:2) y los volúmenes del peróxido requieren cálculo directo con báscula gramera.',
            justification_ca: 'La proporció de tint i oxidant (1:1, 1:1.5, 1:2) i els volums del peròxid requereixen càlcul directe amb bàscula gramera.',
            activities: [
              {
                id: 'act_math_color',
                title_es: 'El Reto del Pesaje Perfecto: Mezclas de Color sin Errores',
                title_ca: 'El Repte del Pesatge Perfecte: Mescles de Color sense Errors',
                description_es: 'Prácticas de laboratorio con básculas digitales pesando tintes simulados (acondicionador con colorante) según fichas de clientes ficticios.',
                description_ca: 'Pràctiques de laboratori amb bàscules digitals pesant tints simulats (condicionador amb colorant) segons fitxes de clients ficticis.',
                evidence_es: 'Hoja de formulación matemática y foto de la mezcla en el bol.',
                evidence_ca: 'Full de formulació matemàtica i foto de la mescla al bol.',
                diversitySupport_es: 'Calculadora de proporciones en tabla visual y tarjetas de ayuda con ejemplos resueltos (1:1 -> 60g + 60g).',
                diversitySupport_ca: 'Calculadora de proporcions en taula visual i targetes d’ajuda amb exemples resolts (1:1 -> 60g + 60g).'
              }
            ]
          },
          {
            targetModuleCode: '3159',
            targetModuleName_es: 'Itinerario personal para la empleabilidad',
            targetModuleName_ca: 'Itinerari personal per a l’ocupabilitat',
            targetRaCode: 'RA1',
            targetRaText_es: 'Identifica la normativa sobre etiquetado de sustancias peligrosas y fichas de seguridad.',
            targetRaText_ca: 'Identifica la normativa sobre etiquetatge de substàncies perilloses i fitxes de seguretat.',
            relationType: 'empleabilidad',
            justification_es: 'Los persulfatos de la decoloración y el amoniaco exigen el uso estricto de guantes de nitrilo, ventilación y mascarilla para evitar sensibilización alérgica.',
            justification_ca: 'Els persulfats de la decoloració i l’amoníac exigeixen l’ús estricte de guants de nitril, ventilació i mascareta per evitar sensibilització al·lèrgica.',
            activities: [
              {
                id: 'act_safety_color',
                title_es: 'Detective de Etiquetas CLP en el Laboratorio de Color',
                title_ca: 'Detectiu d’Etiquetes CLP al Laboratori de Color',
                description_es: 'Búsqueda de pictogramas de peligro en botes reales de oxidantes y polvos decolorantes para crear el mapa de seguridad del laboratorio.',
                description_ca: 'Cerca de pictogrames de perill en pots reals d’oxidants i pols decolorants per crear el mapa de seguretat del laboratori.',
                evidence_es: 'Panel de seguridad con muestras de EPIs adecuados para coloración.',
                evidence_ca: 'Panell de seguretat amb mostres d’EPIs adequats per a coloració.',
                diversitySupport_es: 'Juego de cartas emparejando pictograma de peligro con su significado y EPI obligatorio.',
                diversitySupport_ca: 'Joc de cartes aparellant pictograma de perill amb el seu significat i EPI obligatori.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3005',
    name_es: 'Atención al cliente',
    name_ca: 'Atenció al client',
    type: 'comun',
    color: '#10b981',
    icon: 'user-check',
    learningOutcomes: [
      {
        id: '3005_RA1',
        code: 'RA1',
        text_es: 'Aplica técnicas de comunicación asertiva, escucha activa y resolución de quejas en el salón.',
        text_ca: 'Aplica tècniques de comunicació assertiva, escolta activa i resolució de queixes al saló.',
        importance_es: 'Habilidad blanda crucial para la fidelización y resolución de conflictos en atención directa.',
        importance_ca: 'Habilitat tova crucial per a la fidelització i resolució de conflictes en atenció directa.',
        connections: [
          {
            targetModuleCode: '3011',
            targetModuleName_es: 'Comunicación y sociedad I',
            targetModuleName_ca: 'Comunicació i societat I',
            targetRaCode: 'RA1',
            targetRaText_es: 'Utiliza el lenguaje no verbal y técnicas de empatía en situaciones comunicativas cotidianas.',
            targetRaText_ca: 'Utilitza el llenguatge no verbal i tècniques d’empatia en situacions comunicatives quotidianes.',
            relationType: 'comunicacion',
            justification_es: 'La postura corporal, el contacto visual y la sonrisa profesional refuerzan el mensaje oral y reducen tensiones ante un cliente insatisfecho.',
            justification_ca: 'La postura corporal, el contacte visual i el somriure professional reforcen el missatge oral i redueixen tensions davant un client insatisfet.',
            activities: [
              {
                id: 'act_roleplay_quejas',
                title_es: 'Teatro del Salón: Cómo Resolver una Queja Difícil',
                title_ca: 'Teatre del Saló: Com Resoldre una Queixa Difícil',
                description_es: 'Simulación grabada en vídeo de situaciones de conflicto (retrasos, color no deseado) aplicando la técnica del "bocadillo" y alternativas amables.',
                description_ca: 'Simulació enregistrada en vídeo de situacions de conflicte (retards, color no desitjat) aplicant la tècnica del "sandvitx" i alternatives amables.',
                evidence_es: 'Vídeo corto analizado en clase con rúbrica de asertividad.',
                evidence_ca: 'Vídeo curt analitzat a classe amb rúbrica d’assertivitat.',
                diversitySupport_es: 'Guiones con opciones de respuesta de opción múltiple (A: enfadarse, B: escuchar y ofrecer solución).',
                diversitySupport_ca: 'Guions amb opcions de resposta d’opció múltiple (A: enfadar-se, B: escoltar i oferir solució).'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3009',
    name_es: 'Ciencias aplicadas I',
    name_ca: 'Ciències aplicades I',
    type: 'comun',
    color: '#3b82f6',
    icon: 'flask',
    learningOutcomes: [
      {
        id: '3009_RA1',
        code: 'RA1',
        text_es: 'Aplica conceptos matemáticos de proporcionalidad, medidas y conversión de unidades en el taller.',
        text_ca: 'Aplica conceptes matemàtics de proporcionalitat, mesures i conversió d’unitats al taller.',
        importance_es: 'Fundamento cuantitativo para la preparación de cosméticos, inventario y control de costes.',
        importance_ca: 'Fonament quantitatiu per a la preparació de cosmètics, inventari i control de costos.',
        connections: [
          {
            targetModuleCode: '3065',
            targetModuleName_es: 'Cambios de color del cabello',
            targetModuleName_ca: 'Canvis de color del cabell',
            targetRaCode: 'RA1',
            targetRaText_es: 'Prepara mezclas de tinte y decolorante respetando proporciones en gramos y mililitros.',
            targetRaText_ca: 'Prepara mescles de tint i decolorant respectant proporcions en grams i mil·lilitres.',
            relationType: 'tecnica',
            justification_es: 'El pesaje en gramos y la conversión de mililitros a gramos según densidad asegura la uniformidad y el rendimiento económico del producto.',
            justification_ca: 'El pesatge en grams i la conversió de mil·lilitres a grams segons densitat assegura la uniformitat i el rendiment econòmic del producte.',
            activities: [
              {
                id: 'act_escandallo_color',
                title_es: 'El Escandallo de la Peluquería: ¿Cuánto Cuesta una Mecha?',
                title_ca: 'L’Escandall de la Perruqueria: Quant Costa una Metxa?',
                description_es: 'Cálculo del coste exacto de producto gastado en un servicio de mechas balayage y propuesta de precio final para el cliente.',
                description_ca: 'Càlcul del cost exacte de producte gastat en un servei de metxes balayage i proposta de preu final per al client.',
                evidence_es: 'Hoja de cálculo sencilla o plantilla en papel con el coste desglosado.',
                evidence_ca: 'Full de càlcul senzill o plantilla en paper amb el cost desglossat.',
                diversitySupport_es: 'Uso de monedas didácticas y calculadoras con botones grandes.',
                diversitySupport_ca: 'Ús de monedes didàctiques i calculadores amb botons grans.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3042',
    name_es: 'Ciencias aplicadas II',
    name_ca: 'Ciències aplicades II',
    type: 'comun',
    color: '#6366f1',
    icon: 'atom',
    learningOutcomes: [
      {
        id: '3042_RA1',
        code: 'RA1',
        text_es: 'Analiza el impacto medioambiental de los residuos y propone medidas de economía circular y reciclaje.',
        text_ca: 'Analitza l’impacte mediambiental dels residus i proposa mesures d’economia circular i reciclatge.',
        importance_es: 'Conciencia ecológica y gestión responsable de residuos de envases, aluminio y aguas.',
        importance_ca: 'Consciència ecològica i gestió responsable de residus d’envasos, alumini i aigües.',
        connections: [
          {
            targetModuleCode: '3060',
            targetModuleName_es: 'Preparación del entorno profesional',
            targetModuleName_ca: 'Preparació de l’entorn professional',
            targetRaCode: 'RA1',
            targetRaText_es: 'Gestiona la retirada y reciclaje de envases y residuos según normativa medioambiental.',
            targetRaText_ca: 'Gestiona la retirada i reciclatge d’envasos i residus segons normativa mediambiental.',
            relationType: 'sostenibilidad',
            justification_es: 'La separación correcta de botes de aerosol, tubos de aluminio y toallas desechables convierte el salón en un espacio sostenible y eco-responsable.',
            justification_ca: 'La separació correcta de pots d’aerosol, tubs d’alumini i tovalloles d’un sol ús converteix el saló en un espai sostenible i eco-responsable.',
            activities: [
              {
                id: 'act_eco_saloon_challenge',
                title_es: 'Reto Eco-Salón: Cero Plásticos y Reciclaje de Cabello',
                title_ca: 'Repte Eco-Saló: Zero Plàstics i Reciclatge de Cabell',
                description_es: 'Diseño de un punto verde en el aula-taller y propuesta para donar cabello cortado para filtración de vertidos marinos.',
                description_ca: 'Disseny d’un punt verd a l’aula-taller i proposta per donar cabell tallat per a filtració d’abocaments marins.',
                evidence_es: 'Contenedores señalizados en el taller y cartel de compromiso ecológico.',
                evidence_ca: 'Contenidors senyalitzats al taller i cartell de compromís ecològic.',
                diversitySupport_es: 'Contenedores con colores vivos y fotos de los residuos admitidos en cada uno.',
                diversitySupport_ca: 'Contenidors amb colors vius i fotos dels residus admesos a cadascun.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3011',
    name_es: 'Comunicación y sociedad I',
    name_ca: 'Comunicació i societat I',
    type: 'comun',
    color: '#84cc16',
    icon: 'message-circle',
    learningOutcomes: [
      {
        id: '3011_RA1',
        code: 'RA1',
        text_es: 'Comprende textos informativos y redacta comunicaciones profesionales sencillas en lengua castellana y catalana.',
        text_ca: 'Comprèn textos informatius i redacta comunicacions professionals senzilles en llengua castellana i catalana.',
        importance_es: 'Comunicación funcional escrita para citas, consentimientos informados y atención por mensajería.',
        importance_ca: 'Comunicació funcional escrita per a cites, consentiments informats i atenció per missatgeria.',
        connections: [
          {
            targetModuleCode: '3063',
            targetModuleName_es: 'Maquillaje',
            targetModuleName_ca: 'Maquillatge',
            targetRaCode: 'RA1',
            targetRaText_es: 'Elabora fichas de cliente y consentimientos para maquillaje y tratamientos estéticos.',
            targetRaText_ca: 'Elabora fitxes de client i consentiments per a maquillatge i tractaments estètics.',
            relationType: 'comunicacion',
            justification_es: 'Redactar con claridad preguntas sobre alergias o preferencias estéticas evita malos entendidos y asegura validez legal.',
            justification_ca: 'Redactar amb claredat preguntes sobre al·lèrgies o preferències estètiques evita malentesos i assegura validesa legal.',
            activities: [
              {
                id: 'act_ficha_cliente_app',
                title_es: 'Creación del Cuestionario Digital de Consulta Estética',
                title_ca: 'Creació del Qüestionari Digital de Consulta Estètica',
                description_es: 'Diseño en Google Forms o papel de la ficha de diagnóstico para clientes del taller de imagen personal.',
                description_ca: 'Disseny a Google Forms o paper de la fitxa de diagnòstic per a clients del taller d’imatge personal.',
                evidence_es: 'Formulario funcional con preguntas claras y vocabulario técnico.',
                evidence_ca: 'Formulari funcional amb preguntes clares i vocabulari tècnic.',
                diversitySupport_es: 'Preguntas con opciones cerradas Sí/No y pictogramas de partes de la cara.',
                diversitySupport_ca: 'Preguntes amb opcions tancades Sí/No i pictogrames de parts de la cara.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3012',
    name_es: 'Comunicación y sociedad II',
    name_ca: 'Comunicació i societat II',
    type: 'comun',
    color: '#14b8a6',
    icon: 'globe',
    learningOutcomes: [
      {
        id: '3012_RA1',
        code: 'RA1',
        text_es: 'Analiza el impacto de la publicidad, redes sociales y estereotipos de imagen en la sociedad contemporánea.',
        text_ca: 'Analitza l’impacte de la publicitat, xarxes socials i estereotips d’imatge en la societat contemporània.',
        importance_es: 'Desarrollo del pensamiento crítico ante estándares de belleza poco realistas y filtros digitales.',
        importance_ca: 'Desenvolupament del pensament crític davant d’estàndards de bellesa poc realistes i filtres digitals.',
        connections: [
          {
            targetModuleCode: '3063',
            targetModuleName_es: 'Maquillaje',
            targetModuleName_ca: 'Maquillatge',
            targetRaCode: 'RA1',
            targetRaText_es: 'Promueve una imagen personal saludable, inclusiva y libre de estereotipos discriminatorios.',
            targetRaText_ca: 'Promou una imatge personal saludable, inclusiva i lliure d’estereotips discriminatoris.',
            relationType: 'digital',
            justification_es: 'El análisis de filtros en TikTok/Instagram ayuda al alumnado a valorar la belleza real y la técnica profesional frente a ilusiones digitales.',
            justification_ca: 'L’anàlisi de filtres a TikTok/Instagram ajuda l’alumnat a valorar la bellesa real i la tècnica professional enfront d’il·lusions digitals.',
            activities: [
              {
                id: 'act_real_beauty_campaign',
                title_es: 'Campaña "Belleza Real vs Filtro": Desmontando las Redes',
                title_ca: 'Campanya "Bellesa Real vs Filtre": Desmuntant les Xarxes',
                description_es: 'Grabación de vídeos cortos comparando el efecto de un filtro digital con un maquillaje profesional real explicando la técnica.',
                description_ca: 'Enregistrament de vídeos curts comparant l’efecte d’un filtre digital amb un maquillatge professional real explicant la tècnica.',
                evidence_es: 'Reel/TikTok educativo con mensaje positivo de autoaceptación e higiene.',
                evidence_ca: 'Reel/TikTok educatiu amb missatge positiu d’autoacceptació i higiene.',
                diversitySupport_es: 'Guion estructurado en 3 pasos: Introducción, Demostración y Consejo final.',
                diversitySupport_ca: 'Guió estructurat en 3 passos: Introducció, Demostració i Consell final.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3067',
    name_es: 'Formación en Centros de Trabajo',
    name_ca: 'Formació en Centres de Treball',
    type: 'transversal',
    color: '#a855f7',
    icon: 'briefcase',
    learningOutcomes: [
      {
        id: '3067_RA1',
        code: 'RA1',
        text_es: 'Se integra en el equipo de trabajo de la empresa colaboradora cumpliendo normas de puntualidad y profesionalidad.',
        text_ca: 'S’integra en l’equip de treball de l’empresa col·laboradora complint normes de puntualitat i professionalitat.',
        importance_es: 'Culminación del ciclo formativo en contacto directo con el sector productivo real.',
        importance_ca: 'Culminació del cicle formatiu en contacte directe amb el sector productiu real.',
        connections: [
          {
            targetModuleCode: '3159',
            targetModuleName_es: 'Itinerario personal para la empleabilidad',
            targetModuleName_ca: 'Itinerari personal per a l’ocupabilitat',
            targetRaCode: 'RA3',
            targetRaText_es: 'Elabora el cuaderno de prácticas y autoevalúa el desempeño laboral.',
            targetRaText_ca: 'Elabora el quadern de pràctiques i autoavalua l’acompliment laboral.',
            relationType: 'empleabilidad',
            justification_es: 'El registro diario de tareas en la empresa consolida el aprendizaje autónomo y facilita el seguimiento del tutor del centro.',
            justification_ca: 'El registre diari de tasques a l’empresa consolida l’aprenentatge autònom i facilita el seguiment del tutor del centre.',
            activities: [
              {
                id: 'act_fct_diary',
                title_es: 'Mi Diario Visual de FCT: Portafolio de Evidencias en Empresa',
                title_ca: 'El Meu Diari Visual d’FCT: Portafoli d’Evidències a l’Empresa',
                description_es: 'Registro semanal con fotos (sin rostros de clientes) de montajes, recogidos, manicuras y protocolos ejecutados durante las prácticas.',
                description_ca: 'Registre setmanal amb fotos (sense rostres de clients) de muntatges, recollits, manicures i protocols executats durant les pràctiques.',
                evidence_es: 'Dossier visual encuadernado o en presentación digital para la evaluación final.',
                evidence_ca: 'Dossier visual enquadernat o en presentació digital per a l’avaluació final.',
                diversitySupport_es: 'Plantilla de diario tipo ficha con casillas para marcar tareas con ticks y espacio para una foto semanal.',
                diversitySupport_ca: 'Plantilla de diari tipus fitxa amb caselles per marcar tasques amb tics i espai per a una foto setmanal.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: '3159',
    name_es: 'Itinerario personal para la empleabilidad',
    name_ca: 'Itinerari personal per a l’ocupabilitat',
    type: 'transversal',
    color: '#e11d48',
    icon: 'target',
    learningOutcomes: [
      {
        id: '3159_RA1',
        code: 'RA1',
        text_es: 'Diseña su itinerario formativo y profesional elaborando un currículum vitae adaptado al sector de imagen personal.',
        text_ca: 'Dissenya el seu itinerari formatiu i professional elaborant un currículum vitae adaptat al sector d’imatge personal.',
        importance_es: 'Capacita al alumno para acceder al mercado laboral o continuar estudios en Grado Medio.',
        importance_ca: 'Capacita l’alumne per accedir al mercat laboral o continuar estudis a Grau Mitjà.',
        connections: [
          {
            targetModuleCode: '3060',
            targetModuleName_es: 'Preparación del entorno profesional',
            targetModuleName_ca: 'Preparació de l’entorn professional',
            targetRaCode: 'RA1',
            targetRaText_es: 'Destaca habilidades técnicas y de mantenimiento del salón en el perfil profesional.',
            targetRaText_ca: 'Destaca habilitats tècniques i de manteniment del saló en el perfil professional.',
            relationType: 'empleabilidad',
            justification_es: 'Las empresas de peluquería valoran especialmente la capacidad de mantener el salón limpio, ordenado y preparado de forma autónoma.',
            justification_ca: 'Les empreses de perruqueria valoren especialment la capacitat de mantenir el saló net, ordenat i preparat de manera autònoma.',
            activities: [
              {
                id: 'act_cv_video',
                title_es: 'Vídeo-CV en el Salón: "Mi Primera Entrevista"',
                title_ca: 'Vídeo-CV al Saló: "La Meva Primera Entrevista"',
                description_es: 'Simulación de entrevista de trabajo de 1 minuto donde cada estudiante presenta sus puntos fuertes y destrezas prácticas en el taller.',
                description_ca: 'Simulació d’entrevista de feina d’1 minut on cada estudiant presenta els seus punts forts i destreses pràctiques al taller.',
                evidence_es: 'Vídeo-presentación de 60 segundos y CV en Canva de una página.',
                evidence_ca: 'Vídeo-presentació de 60 segons i CV a Canva d’una pàgina.',
                diversitySupport_es: 'Guion con estructura de respuesta guiada: Saludo, Qué sé hacer, Por qué me gusta esta profesión.',
                diversitySupport_ca: 'Guió amb estructura de resposta guiada: Salutació, Què sé fer, Per què m’agrada aquesta professió.'
              }
            ]
          }
        ]
      }
    ]
  }
];