/**
 * Capacidades terminales y criterios de evaluación del CFGM Cuidados Auxiliares de Enfermería (SAN23, LOGSE).
 * Cada capacidad terminal se carga como un RA (RA1 = capacidad N.1 del módulo N) y sus criterios llevan
 * letras a), b)… en el orden del RD. Los módulos no tienen código oficial: CAE1-CAE7 siguen la numeración del RD.
 * ES: anexo del RD 546/1995 (BOE-A-1995-13533), sin el módulo de FCT. CA: traducción al catalán (sin texto oficial).
 */
import type { CfgmRaData } from './ras_cfgm_peluqueria.data';

export const CFGM_CUIDADOS_AUXILIARES_ENFERMERIA_RAS_DATA: CfgmRaData[] = [
  {
    "id": "RA1",
    "module": "Operacions administratives i documentació sanitària",
    "module_es": "Operaciones administrativas y documentación sanitaria",
    "module_ca": "Operacions administratives i documentació sanitària",
    "moduleCode": "CAE1",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Relacionar els diferents tipus de documentació clínica amb les seves aplicacions, descrivint els canals de tramitació i maneig d'aquests en funció del tipus de servei o institució sanitària.",
    "description_es": "Relacionar los diferentes tipos de documentación clínica con sus aplicaciones, describiendo los cauces de tramitación y manejo de los mismos en función del tipo de servicio o institución sanitaria.",
    "description_ca": "Relacionar els diferents tipus de documentació clínica amb les seves aplicacions, descrivint els canals de tramitació i maneig d'aquests en funció del tipus de servei o institució sanitària.",
    "criterios_es": [
      "a) Interpretar documentos de citación señalando el procedimiento adecuado para realizarla, en función de los servicios o unidades de diagnóstico.",
      "b) Enumerar los items de identificación personal, de la institución y del servicio de referencia que son necesarios cumplimentar para citar o solicitar pruebas complementarias a los pacientes/clientes.",
      "c) Describir la estructura de los documentos y los códigos al uso para realizar el registro de documentos sanitarios, precisando los mecanismos de circulación de la documentación en instituciones sanitarias.",
      "d) Explicar el significado y estructura de una historia clínica tipo, describiendo la estructura y secuencia lógica de «guarda» de documentos y pruebas diagnósticas.",
      "e) Realizar esquemas de instituciones sanitarias, orgánica y jerárquicamente, describiendo sus relaciones y sus dependencias, tanto internas como generales o de contorno.",
      "f) Analizar manuales de normas internas identificando y describiendo las que hacen referencia al desarrollo de su actividad profesional."
    ],
    "criterios_ca": [
      "a) Interpretar documents de citació assenyalant el procediment adequat per fer-la, en funció dels serveis o unitats de diagnòstic.",
      "b) Enumerar els ítems d'identificació personal, de la institució i del servei de referència que cal emplenar per citar o sol·licitar proves complementàries als pacients/clients.",
      "c) Descriure l'estructura dels documents i els codis d'ús per fer el registre de documents sanitaris, precisant els mecanismes de circulació de la documentació en institucions sanitàries.",
      "d) Explicar el significat i l'estructura d'una història clínica tipus, descrivint l'estructura i la seqüència lògica de «guarda» de documents i proves diagnòstiques.",
      "e) Fer esquemes d'institucions sanitàries, orgànicament i jeràrquicament, descrivint les seves relacions i les seves dependències, tant internes com generals o de contorn.",
      "f) Analitzar manuals de normes internes identificant i descrivint les que fan referència al desenvolupament de la seva activitat professional."
    ]
  },
  {
    "id": "RA2",
    "module": "Operacions administratives i documentació sanitària",
    "module_es": "Operaciones administrativas y documentación sanitaria",
    "module_ca": "Operacions administratives i documentació sanitària",
    "moduleCode": "CAE1",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Seleccionar tècniques d'emmagatzematge, distribució i control d'existències de mitjans materials que permetin el funcionament correcte d'una unitat, gabinet o servei d'atenció a pacients/clients.",
    "description_es": "Seleccionar técnicas de almacenamiento, distribución y control de existencias de medios materiales que permitan el correcto funcionamiento de una unidad, gabinete o servicio de atención a pacientes/clientes.",
    "description_ca": "Seleccionar tècniques d'emmagatzematge, distribució i control d'existències de mitjans materials que permetin el funcionament correcte d'una unitat, gabinet o servei d'atenció a pacients/clients.",
    "criterios_es": [
      "a) Explicar los métodos de control de existencias y sus aplicaciones para la realización de inventarios de materiales.",
      "b) Explicar los documentos de control de existencias de almacén, asociando cada tipo con la función que desempeña en el funcionamiento del almacén.",
      "c) Describir las aplicaciones que los programas informáticos de gestión de consultas sanitarias tienen para el control y gestión del almacén.",
      "d) En un supuesto práctico de gestión de almacén sanitario (consulta/servicio), debidamente caracterizado: identificar las necesidades de reposición acordes al supuesto descrito, efectuar órdenes de pedido, precisando el tipo de material y el/la agente/unidad suministradora, introducir los datos necesarios para el control de existencias en la base de datos, especificar las condiciones de conservación del material, en función de sus características y necesidades de almacenamiento."
    ],
    "criterios_ca": [
      "a) Explicar els mètodes de control d'existències i les seves aplicacions per a la realització d'inventaris de materials.",
      "b) Explicar els documents de control d'existències de magatzem, associant cada tipus amb la funció que acompleix en el funcionament del magatzem.",
      "c) Descriure les aplicacions que els programes informàtics de gestió de consultes sanitàries tenen per al control i la gestió del magatzem.",
      "d) En un supòsit pràctic de gestió de magatzem sanitari (consulta/servei), degudament caracteritzat: identificar les necessitats de reposició d'acord amb el supòsit descrit, efectuar ordres de comanda, precisant el tipus de material i l'agent/unitat subministradora, introduir les dades necessàries per al control d'existències a la base de dades, especificar les condicions de conservació del material, en funció de les seves característiques i necessitats d'emmagatzematge."
    ]
  },
  {
    "id": "RA3",
    "module": "Operacions administratives i documentació sanitària",
    "module_es": "Operaciones administrativas y documentación sanitaria",
    "module_ca": "Operacions administratives i documentació sanitària",
    "moduleCode": "CAE1",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Elaborar pressuposts i factures detallades d'intervencions/actes sanitaris, relacionant el tipus d'acte sanitari amb la tarifa i tenint en compte les normes de funcionament definides.",
    "description_es": "Elaborar presupuestos y facturas detalladas de intervenciones/actos sanitarios, relacionando el tipo de acto sanitario con la tarifa y teniendo en cuenta las normas de funcionamiento definidas.",
    "description_ca": "Elaborar pressuposts i factures detallades d'intervencions/actes sanitaris, relacionant el tipus d'acte sanitari amb la tarifa i tenint en compte les normes de funcionament definides.",
    "criterios_es": [
      "a) Explicar que criterios mercantiles y elementos definen los documentos contables de uso común en clínicas de atención sanitaria.",
      "b) Describir el funcionamiento y las prestaciones básicas de los programas informáticos aplicados a la elaboración de presupuestos y facturas.",
      "c) Enumerar las normas fiscales que deben cumplir este tipo de documentos mercantiles.",
      "d) En un supuesto práctico de facturación, debidamente caracterizado: determinar las partidas que deben ser incluidas en el documento (presupuesto o factura), realizar los cálculos necesarios para determinar el importe total y el desglose correcto, cumpliendo las normas fiscales vigentes, confeccionar adecuadamente el documento, presupuesto o factura, según el supuesto definido."
    ],
    "criterios_ca": [
      "a) Explicar quins criteris mercantils i elements defineixen els documents comptables d'ús comú en clíniques d'atenció sanitària.",
      "b) Descriure el funcionament i les prestacions bàsiques dels programes informàtics aplicats a l'elaboració de pressuposts i factures.",
      "c) Enumerar les normes fiscals que han de complir aquest tipus de documents mercantils.",
      "d) En un supòsit pràctic de facturació, degudament caracteritzat: determinar les partides que s'han d'incloure en el document (pressupost o factura), fer els càlculs necessaris per determinar l'import total i el desglossament correcte, complint les normes fiscals vigents, confeccionar adequadament el document, pressupost o factura, segons el supòsit definit."
    ]
  },
  {
    "id": "RA1",
    "module": "Tècniques bàsiques d'infermeria",
    "module_es": "Técnicas básicas de enfermería",
    "module_ca": "Tècniques bàsiques d'infermeria",
    "moduleCode": "CAE2",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar els requeriments tècnics necessaris per fer la higiene personal d'un pacient/client en funció de l'estat i/o la situació d'aquest.",
    "description_es": "Analizar los requerimientos técnicos necesarios para realizar la higiene personal de un paciente/ cliente en función del estado y/o situación del mismo.",
    "description_ca": "Analitzar els requeriments tècnics necessaris per fer la higiene personal d'un pacient/client en funció de l'estat i/o la situació d'aquest.",
    "criterios_es": [
      "a) Explicar los productos, materiales y utensilios de uso común en las distintas técnicas de higiene personal.",
      "b) Precisar los cuidados higiénicos requeridos por un paciente/cliente, explicando los criterios de selección de las técnicas en función del estado y necesidades del mismo.",
      "c) Explicar los criterios que permiten clasificar a los pacientes/clientes en los grados de bajo y medio nivel de dependencia física.",
      "d) Describir los procedimientos de baño y lavado del paciente/cliente, precisando los materiales necesarios para su realización en función del estado y necesidades del mismo.",
      "e) Describir los procedimientos de recogida de excretas, precisando los materiales necesarios para su realización en función del estado y necesidades del mismo.",
      "f) Señalar la secuencia de actividades a realizar para que pueda ser trasladado, convenientemente, un cadáver al tanatorio.",
      "g) Describir los procedimientos de amortajamiento de cadáveres, precisando los materiales y productos necesarios para su correcta realización.",
      "h) Registrar en el soporte adecuado las incidencias acaecidas durante la ejecución de las técnicas.",
      "i) En un supuesto práctico de higiene personal convenientemente caracterizado: seleccionar los medios materiales que se van a utilizar en función del supuesto, realizar técnicas de baño parcial, baño total, lavado de cabello y de boca y dientes, efectuar la recogida de excretas con utilización de la cuña y/o de la botella, efectuar las técnicas de amortajamiento."
    ],
    "criterios_ca": [
      "a) Explicar els productes, materials i estris d'ús comú en les diferents tècniques d'higiene personal.",
      "b) Precisar les cures higièniques requerides per un pacient/client, explicant els criteris de selecció de les tècniques en funció de l'estat i les necessitats d'aquest.",
      "c) Explicar els criteris que permeten classificar els pacients/clients en els graus de baix i mitjà nivell de dependència física.",
      "d) Descriure els procediments de bany i rentat del pacient/client, precisant els materials necessaris per realitzar-los en funció de l'estat i les necessitats d'aquest.",
      "e) Descriure els procediments de recollida d'excretes, precisant els materials necessaris per realitzar-los en funció de l'estat i les necessitats d'aquest.",
      "f) Assenyalar la seqüència d'activitats que cal fer perquè un cadàver pugui ser traslladat, convenientment, al tanatori.",
      "g) Descriure els procediments d'amortallament de cadàvers, precisant els materials i productes necessaris per a la seva realització correcta.",
      "h) Registrar en el suport adequat les incidències esdevingudes durant l'execució de les tècniques.",
      "i) En un supòsit pràctic d'higiene personal convenientment caracteritzat: seleccionar els mitjans materials que s'han d'utilitzar en funció del supòsit, fer tècniques de bany parcial, bany total, rentat de cabell i de boca i dents, efectuar la recollida d'excretes amb utilització de la cunya i/o de l'ampolla d'orina, efectuar les tècniques d'amortallament."
    ]
  },
  {
    "id": "RA2",
    "module": "Tècniques bàsiques d'infermeria",
    "module_es": "Técnicas básicas de enfermería",
    "module_ca": "Tècniques bàsiques d'infermeria",
    "moduleCode": "CAE2",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Adaptar els protocols de trasllat, mobilització i deambulació d'un pacient/client en funció de l'estat i les necessitats d'aquest.",
    "description_es": "Adaptar los protocolos de traslado, movilización y deambulación de un paciente/cliente en función del estado y necesidades el mismo.",
    "description_ca": "Adaptar els protocols de trasllat, mobilització i deambulació d'un pacient/client en funció de l'estat i les necessitats d'aquest.",
    "criterios_es": [
      "a) Describir las características técnicas y las aplicaciones más frecuentes, de las técnicas de posicionamiento de pacientes/clientes encamados, en función del estado o condiciones del mismo.",
      "b) Explicar la técnica idónea de traslado de un paciente/cliente en función del estado y condiciones del mismo, explicando los criterios aplicados para su adaptación.",
      "c) Describir el contenido de la documentación clínica que debe acompañar al paciente/cliente en su traslado.",
      "d) Explicar la técnica idónea de movilización de un paciente/cliente en función del estado y condiciones del mismo, explicando los criterios aplicados para su adaptación.",
      "e) Explicar los mecanismos de producción de las úlceras por presión y los lugares anatómicos de aparición más frecuente.",
      "f) Explicar las principales medidas preventivas para evitar la aparición de úlceras por presión y señalar los productos sanitarios para su tratamiento y/o prevención.",
      "g) Describir los criterios que permitan detectar signos de cambio morboso en la piel de personas encamadas.",
      "h) En un supuesto práctico de movilización/traslado debidamente caracterizado: seleccionar los medios materiales y productos que se van a utilizar, informar al paciente/cliente sobre la técnica que se le va a realizar y su participación durante la misma. efectuar maniobras de: incorporación, acercamiento al borde de la cama, colocación en decúbito lateral y otras posiciones anatómicas, efectuar traslados en silla de ruedas, de cama a camilla y viceversa (con sábana de arrastre y varios asistentes) y de silla a cama."
    ],
    "criterios_ca": [
      "a) Descriure les característiques tècniques i les aplicacions més freqüents de les tècniques de posicionament de pacients/clients enllitats, en funció de l'estat o les condicions d'aquest.",
      "b) Explicar la tècnica idònia de trasllat d'un pacient/client en funció de l'estat i les condicions d'aquest, explicant els criteris aplicats per a la seva adaptació.",
      "c) Descriure el contingut de la documentació clínica que ha d'acompanyar el pacient/client en el seu trasllat.",
      "d) Explicar la tècnica idònia de mobilització d'un pacient/client en funció de l'estat i les condicions d'aquest, explicant els criteris aplicats per a la seva adaptació.",
      "e) Explicar els mecanismes de producció de les úlceres per pressió i els llocs anatòmics d'aparició més freqüent.",
      "f) Explicar les principals mesures preventives per evitar l'aparició d'úlceres per pressió i assenyalar els productes sanitaris per al seu tractament i/o prevenció.",
      "g) Descriure els criteris que permetin detectar signes de canvi morbós en la pell de persones enllitades.",
      "h) En un supòsit pràctic de mobilització/trasllat degudament caracteritzat: seleccionar els mitjans materials i productes que s'han d'utilitzar, informar el pacient/client sobre la tècnica que se li ha de fer i la seva participació durant aquesta, efectuar maniobres d'incorporació, d'acostament a la vora del llit, de col·locació en decúbit lateral i altres posicions anatòmiques, efectuar trasllats en cadira de rodes, de llit a llitera i viceversa (amb llençol travesser i diversos assistents) i de cadira a llit."
    ]
  },
  {
    "id": "RA3",
    "module": "Tècniques bàsiques d'infermeria",
    "module_es": "Técnicas básicas de enfermería",
    "module_ca": "Tècniques bàsiques d'infermeria",
    "moduleCode": "CAE2",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar els requeriments tècnics necessaris per facilitar l'observació i/o l'exploració mèdica d'un pacient/client en funció del seu estat o de les seves condicions físiques.",
    "description_es": "Analizar los requerimientos técnicos necesarios para facilitar la observación y/o exploración médica de un paciente/cliente en función de su estado o condiciones físicas.",
    "description_ca": "Analitzar els requeriments tècnics necessaris per facilitar l'observació i/o l'exploració mèdica d'un pacient/client en funció del seu estat o de les seves condicions físiques.",
    "criterios_es": [
      "a) Explicar las propiedades y las indicaciones de las posiciones anatómicas de uso más normalizadas para la observación y/o exploración de pacientes/clientes, en función del estado o condiciones del mismo.",
      "b) Explicar, y en su caso, realizar la preparación de los materiales utilizados en las distintas técnicas de exploración médica.",
      "c) Describir los medios materiales necesarios que hay que preparar para una exploración médica, teniendo en cuenta la posición anatómica en la que ésta se efectúa.",
      "d) Explicar las características fisiológicas de las constantes vitales (pulso, respiración, temperatura y presión arterial) efectuando, en su caso, su medición entre los alumnos.",
      "e) Delimitar los lugares anatómicos más frecuentes para la obtención de cada una de las constantes vitales y el material necesario para su correcta realización.",
      "f) En un supuesto práctico de medición de constantes vitales debidamente caracterizado: seleccionar los medios necesarios para la obtención de los valores de las constantes vitales a medir, obtener valores reales de temperatura, presión sanguínea, frecuencia cardiaca y respiratoria.",
      "g) Confeccionar la gráfica de registro de constantes vitales, medir y anotar los valores obtenidos para el balance hídrico, elaborando el registro gráfico oportuno."
    ],
    "criterios_ca": [
      "a) Explicar les propietats i les indicacions de les posicions anatòmiques d'ús més normalitzat per a l'observació i/o l'exploració de pacients/clients, en funció de l'estat o les condicions d'aquest.",
      "b) Explicar i, si escau, fer la preparació dels materials utilitzats en les diferents tècniques d'exploració mèdica.",
      "c) Descriure els mitjans materials necessaris que cal preparar per a una exploració mèdica, tenint en compte la posició anatòmica en què aquesta s'efectua.",
      "d) Explicar les característiques fisiològiques de les constants vitals (pols, respiració, temperatura i pressió arterial) efectuant, si escau, la seva mesura entre els alumnes.",
      "e) Delimitar els llocs anatòmics més freqüents per a l'obtenció de cadascuna de les constants vitals i el material necessari per a la seva realització correcta.",
      "f) En un supòsit pràctic de mesura de constants vitals degudament caracteritzat: seleccionar els mitjans necessaris per a l'obtenció dels valors de les constants vitals que s'han de mesurar, obtenir valors reals de temperatura, pressió sanguínia, freqüència cardíaca i respiratòria.",
      "g) Confeccionar el gràfic de registre de constants vitals, mesurar i anotar els valors obtinguts per al balanç hídric, elaborant el registre gràfic oportú."
    ]
  },
  {
    "id": "RA4",
    "module": "Tècniques bàsiques d'infermeria",
    "module_es": "Técnicas básicas de enfermería",
    "module_ca": "Tècniques bàsiques d'infermeria",
    "moduleCode": "CAE2",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Interpretar ordres de tractament, precisant la via d'administració i el material que s'ha d'utilitzar en funció de la tècnica demanada.",
    "description_es": "Interpretar órdenes de tratamiento, precisando la vía de administración y el material a utilizar en función de la técnica demandada.",
    "description_ca": "Interpretar ordres de tractament, precisant la via d'administració i el material que s'ha d'utilitzar en funció de la tècnica demanada.",
    "criterios_es": [
      "a) Describir las acciones terapéuticas del frío y del calor sobre el organismo humano, explicando sus indicaciones.",
      "b) Explicar las aplicaciones terapéuticas de las técnicas hidrotermales, relacionando las características de las aguas minero-medicinales con sus posibles indicaciones.",
      "c) Describir las características anatomofisiológicas de las vías más frecuentes de administración de fármacos.",
      "d) Explicar las características de los materiales necesarios para la administración de medicación por las distintas vías.",
      "e) Explicar los procedimientos de aplicación de técnicas en aerosolterapia y oxigenoterapia, así como los materiales necesarios para su correcta aplicación.",
      "f) Describir los principales riesgos asociados a la administración de medicamentos, en función del tipo de fármaco y de la vía de administración.",
      "g) En un supuesto práctico de tratamiento debidamente caracterizado: interpretar órdenes de tratamiento y seleccionar el equipo de material necesario para su administración, seleccionar el método de aplicación de frío y calor, específicado en el supuesto, preparar la medicación y hacer el cálculo de la dosis a administrar, realizar la administración de fármacos por vía oral, rectal y tópica, realizar la administración de enemas, aplicar técnicas de tratamiento de aerosolterapia y oxigenoterapia, cumplimentar, a su nivel, la hoja de medicación con datos supuestos."
    ],
    "criterios_ca": [
      "a) Descriure les accions terapèutiques del fred i de la calor sobre l'organisme humà, explicant-ne les indicacions.",
      "b) Explicar les aplicacions terapèutiques de les tècniques hidrotermals, relacionant les característiques de les aigües mineromedicinals amb les seves possibles indicacions.",
      "c) Descriure les característiques anatomofisiològiques de les vies més freqüents d'administració de fàrmacs.",
      "d) Explicar les característiques dels materials necessaris per a l'administració de medicació per les diferents vies.",
      "e) Explicar els procediments d'aplicació de tècniques en aerosolteràpia i oxigenoteràpia, així com els materials necessaris per a la seva aplicació correcta.",
      "f) Descriure els principals riscs associats a l'administració de medicaments, en funció del tipus de fàrmac i de la via d'administració.",
      "g) En un supòsit pràctic de tractament degudament caracteritzat: interpretar ordres de tractament i seleccionar l'equip de material necessari per a l'administració, seleccionar el mètode d'aplicació de fred i calor, especificat en el supòsit, preparar la medicació i fer el càlcul de la dosi que s'ha d'administrar, fer l'administració de fàrmacs per via oral, rectal i tòpica, fer l'administració d'enemes, aplicar tècniques de tractament d'aerosolteràpia i oxigenoteràpia, emplenar, al seu nivell, el full de medicació amb dades suposades."
    ]
  },
  {
    "id": "RA5",
    "module": "Tècniques bàsiques d'infermeria",
    "module_es": "Técnicas básicas de enfermería",
    "module_ca": "Tècniques bàsiques d'infermeria",
    "moduleCode": "CAE2",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar les indicacions quant a l'administració de dietes, proposant i aplicant, si escau, la tècnica de suport a la ingesta més adequada en funció del grau de dependència.",
    "description_es": "Analizar las indicaciones en cuanto a la administración de dietas, proponiendo y aplicando, en su caso, la técnica de apoyo a la ingesta más adecuada en función del grado de dependencia.",
    "description_ca": "Analitzar les indicacions quant a l'administració de dietes, proposant i aplicant, si escau, la tècnica de suport a la ingesta més adequada en funció del grau de dependència.",
    "criterios_es": [
      "a) Clasificar los tipos de alimentos por las características básicas de sus nutrientes, explicando sus principios inmediatos constitutivos.",
      "b) Describir las características nutritivas de los distintos tipos de dietas: normal y especiales (blanda, astringente, líquida, de exención o absoluta, hipo e hipercalórica).",
      "c) En supuestos prácticos de apoyo a la ingesta debidamente caracterizados: identificar los materiales necesarios para la administración de alimentación enteral y parenteral, posicionar al «paciente» en la postura anatómica adecuada en función de la vía de administración del alimento, especificar las medidas higiénico sanitarias que hay que tener en cuenta durante la realización de técnicas de alimentación parenteral, efectuar la administración de comidas en distintos tipos de pacientes, relacionando el tipo de dieta con cada paciente y grado de dependencia del mismo, efectuar la alimentación de un «paciente» a través de una sonda nasogástrica, cumplimentar plantillas de dietas según las necesidades de cada paciente, anotando su distribución y la necesidad o no apoyo."
    ],
    "criterios_ca": [
      "a) Classificar els tipus d'aliments per les característiques bàsiques dels seus nutrients, explicant-ne els principis immediats constitutius.",
      "b) Descriure les característiques nutritives dels diferents tipus de dietes: normal i especials (tova, astringent, líquida, d'exempció o absoluta, hipocalòrica i hipercalòrica).",
      "c) En supòsits pràctics de suport a la ingesta degudament caracteritzats: identificar els materials necessaris per a l'administració d'alimentació enteral i parenteral, posicionar el «pacient» en la postura anatòmica adequada en funció de la via d'administració de l'aliment, especificar les mesures higienicosanitàries que s'han de tenir en compte durant la realització de tècniques d'alimentació parenteral, efectuar l'administració de menjars en diferents tipus de pacients, relacionant el tipus de dieta amb cada pacient i el grau de dependència d'aquest, efectuar l'alimentació d'un «pacient» a través d'una sonda nasogàstrica, emplenar plantilles de dietes segons les necessitats de cada pacient, anotant-ne la distribució i la necessitat o no de suport."
    ]
  },
  {
    "id": "RA6",
    "module": "Tècniques bàsiques d'infermeria",
    "module_es": "Técnicas básicas de enfermería",
    "module_ca": "Tècniques bàsiques d'infermeria",
    "moduleCode": "CAE2",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar les tècniques d'assistència sanitària d'urgència determinant la més adequada en funció de la situació i el grau d'aplicabilitat.",
    "description_es": "Analizar las técnicas de asistencia sanitaria de urgencia determinando la más adecuada en función de la situación y grado de aplicabilidad.",
    "description_ca": "Analitzar les tècniques d'assistència sanitària d'urgència determinant la més adequada en funció de la situació i el grau d'aplicabilitat.",
    "criterios_es": [
      "a) Explicar lo signos y síntomas más comunes que producen los traumatismos: fracturas, esguinces y luxaciones, determinando las maniobras de inmovilización oportunas.",
      "b) Describir y poner a punto el material necesario para realizar vendajes y colocar/aplicar férulas.",
      "c) Explicar los contenidos y secuencias de aplicación de las técnicas de reanimación cardiopulmonar.",
      "d) Explicar los distintos tipos de quemaduras en función de su extensión y profundidad, describiendo las medidas de asistencia sanitaria de urgencia más adecuadas para cada una de ellas.",
      "e) Explicar los distintos tipos de heridas y clases de hemorragias, describiendo las maniobras de actuación inmediata en función del tipo y situación de las mismas.",
      "f) Precisar las variables que aconsejan la realización de un «torniquete» en una situación de emergencia.",
      "g) Describir el contenido mínimo y sus indicaciones de los elementos que debe contener generalmente un botiquín de urgencias.",
      "h) Diferenciar las principales clases de intoxicaciones por sus síntomas más representativos, enumerando las vías de penetración y métodos de eliminación.",
      "i) Explicar, la información que, sobre el suceso y aspecto del accidentado puede ser demandada por el facultativo en una consulta a distancia.",
      "j) En un supuesto práctico de primeros auxilios debidamente caracterizado: efectuar vendajes y colocar férulas simples, ejecutar maniobras básicas de RCP, efectuar maniobras de inmovilización de fracturas de diversa localización (columna vertebral, miembro superior, miembro inferior y politraumatizado), confeccionar el listado básico de material y productos sanitarios que debe contener un botiquín de urgencias, efectuar maniobras de inhibición de hemorragias."
    ],
    "criterios_ca": [
      "a) Explicar els signes i símptomes més comuns que produeixen els traumatismes: fractures, esquinços i luxacions, determinant les maniobres d'immobilització oportunes.",
      "b) Descriure i posar a punt el material necessari per fer embenats i col·locar/aplicar fèrules.",
      "c) Explicar els continguts i les seqüències d'aplicació de les tècniques de reanimació cardiopulmonar.",
      "d) Explicar els diferents tipus de cremades en funció de l'extensió i la profunditat, descrivint les mesures d'assistència sanitària d'urgència més adequades per a cadascuna.",
      "e) Explicar els diferents tipus de ferides i classes d'hemorràgies, descrivint les maniobres d'actuació immediata en funció del tipus i la situació d'aquestes.",
      "f) Precisar les variables que aconsellen la realització d'un «torniquet» en una situació d'emergència.",
      "g) Descriure el contingut mínim i les indicacions dels elements que ha de contenir generalment una farmaciola d'urgències.",
      "h) Diferenciar les principals classes d'intoxicacions pels seus símptomes més representatius, enumerant les vies de penetració i els mètodes d'eliminació.",
      "i) Explicar la informació que, sobre el succés i l'aspecte de l'accidentat, pot ser demanada pel facultatiu en una consulta a distància.",
      "j) En un supòsit pràctic de primers auxilis degudament caracteritzat: efectuar embenats i col·locar fèrules simples, executar maniobres bàsiques de RCP, efectuar maniobres d'immobilització de fractures de diversa localització (columna vertebral, membre superior, membre inferior i politraumatitzat), confeccionar el llistat bàsic de material i productes sanitaris que ha de contenir una farmaciola d'urgències, efectuar maniobres d'inhibició d'hemorràgies."
    ]
  },
  {
    "id": "RA1",
    "module": "Higiene del medi hospitalari i neteja de material",
    "module_es": "Higiene del medio hospitalario y limpieza de material",
    "module_ca": "Higiene del medi hospitalari i neteja de material",
    "moduleCode": "CAE3",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar les tècniques de neteja, desinfecció i esterilització que s'han d'aplicar als materials i instruments d'ús comú en l'assistència sanitària a pacients.",
    "description_es": "Analizar las técnicas de limpieza, desinfección y esterilización que deben aplicarse a los materiales e instrumentos de uso común en la asistencia sanitaria a pacientes.",
    "description_ca": "Analitzar les tècniques de neteja, desinfecció i esterilització que s'han d'aplicar als materials i instruments d'ús comú en l'assistència sanitària a pacients.",
    "criterios_es": [
      "a) Explicar el proceso de desinfección, describiendo los métodos a utilizar en función del las características de los medios materiales utilizables.",
      "b) Describir la secuencia de operaciones para efectuar la limpieza de los medios materiales de uso clínico.",
      "c) Enumerar los criterios que permiten clasificar el material en función de su origen, en séptico y no séptico.",
      "d) Explicar el proceso de esterilización, describiendo los métodos a emplear en función de las características y composición de los instrumentos.",
      "e) Explicar los diferentes métodos de control de la calidad de los procedimientos de esterilización, indicando en cada caso el más adecuado.",
      "f) En un caso práctico de higiene hospitalaria debidamente caracterizado: decidir la técnica de higiene adecuada a las características del caso, seleccionar los medios y productos de limpieza en función de la técnica, aplicar correctamente técnicas de limpieza adecuadas al tipo de material, aplicar correctamente técnicas de desinfección, aplicar correctamente técnicas de esterilización, comprobar la calidad de la esterilización efectuada."
    ],
    "criterios_ca": [
      "a) Explicar el procés de desinfecció, descrivint els mètodes que s'han d'utilitzar en funció de les característiques dels mitjans materials utilitzables.",
      "b) Descriure la seqüència d'operacions per efectuar la neteja dels mitjans materials d'ús clínic.",
      "c) Enumerar els criteris que permeten classificar el material en funció del seu origen, en sèptic i no sèptic.",
      "d) Explicar el procés d'esterilització, descrivint els mètodes que s'han d'emprar en funció de les característiques i la composició dels instruments.",
      "e) Explicar els diferents mètodes de control de la qualitat dels procediments d'esterilització, indicant en cada cas el més adequat.",
      "f) En un cas pràctic d'higiene hospitalària degudament caracteritzat: decidir la tècnica d'higiene adequada a les característiques del cas, seleccionar els mitjans i productes de neteja en funció de la tècnica, aplicar correctament tècniques de neteja adequades al tipus de material, aplicar correctament tècniques de desinfecció, aplicar correctament tècniques d'esterilització, comprovar la qualitat de l'esterilització efectuada."
    ]
  },
  {
    "id": "RA2",
    "module": "Higiene del medi hospitalari i neteja de material",
    "module_es": "Higiene del medio hospitalario y limpieza de material",
    "module_ca": "Higiene del medi hospitalari i neteja de material",
    "moduleCode": "CAE3",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar les condicions higienicosanitàries que ha de complir una unitat de pacient, descrivint els mètodes i les tècniques per aconseguir-les.",
    "description_es": "Analizar las condiciones higiénico-sanitarias que debe cumplir una unidad de paciente, describiendo los métodos y técnicas para conseguirlas.",
    "description_ca": "Analitzar les condicions higienicosanitàries que ha de complir una unitat de pacient, descrivint els mètodes i les tècniques per aconseguir-les.",
    "criterios_es": [
      "a) Describir los medios materiales y accesorios que integran las consultas y/o las unidades de paciente, describiendo la función que desempeñan en la misma.",
      "b) Explicar los tipos de camas y accesorios que son de uso más frecuente en ámbito hospitalario.",
      "c) Describir los diferentes tipos de colchones y ropa de cama, describiendo las técnicas de doblaje y de preparación para su posterior utilización.",
      "d) Describir los procedimientos de limpieza de camas y criterios de sustitución de accesorios en situaciones especiales.",
      "e) Explicar la secuencia de operaciones e informaciones a transmitir a los pacientes/clientes en el acto de recepción y alojamiento en la unidad de paciente.",
      "f) Explicar las técnicas de realización de los distintos tipos de cama, en función del estado del paciente, que garanticen las necesidades de «confort» del paciente/cliente.",
      "g) En un supuesto práctico de cuidado de una unidad de paciente, debidamente caracterizado: preparar la ropa de cama necesaria para ordenar y/o preparar distintos tipos de cama, limpiar y ordenar la unidad de paciente, realizar técnicas de preparación y de apertura de la cama en sus distintas modalidades."
    ],
    "criterios_ca": [
      "a) Descriure els mitjans materials i accessoris que integren les consultes i/o les unitats de pacient, descrivint la funció que acompleixen en aquesta.",
      "b) Explicar els tipus de llits i accessoris que són d'ús més freqüent en l'àmbit hospitalari.",
      "c) Descriure els diferents tipus de matalassos i roba de llit, descrivint les tècniques de plegat i de preparació per a la seva utilització posterior.",
      "d) Descriure els procediments de neteja de llits i els criteris de substitució d'accessoris en situacions especials.",
      "e) Explicar la seqüència d'operacions i informacions que s'han de transmetre als pacients/clients en l'acte de recepció i allotjament a la unitat de pacient.",
      "f) Explicar les tècniques de realització dels diferents tipus de llit, en funció de l'estat del pacient, que garanteixin les necessitats de «confort» del pacient/client.",
      "g) En un supòsit pràctic de cura d'una unitat de pacient, degudament caracteritzat: preparar la roba de llit necessària per ordenar i/o preparar diferents tipus de llit, netejar i ordenar la unitat de pacient, fer tècniques de preparació i d'obertura del llit en les seves diferents modalitats."
    ]
  },
  {
    "id": "RA3",
    "module": "Higiene del medi hospitalari i neteja de material",
    "module_es": "Higiene del medio hospitalario y limpieza de material",
    "module_ca": "Higiene del medi hospitalari i neteja de material",
    "moduleCode": "CAE3",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar els procediments d'aïllament, determinant-ne els usos concrets en el control/prevenció d'infeccions hospitalàries.",
    "description_es": "Analizar los procedimientos de aislamiento, determinando sus usos concretos en el control/prevención de infecciones hospitalarias.",
    "description_ca": "Analitzar els procediments d'aïllament, determinant-ne els usos concrets en el control/prevenció d'infeccions hospitalàries.",
    "criterios_es": [
      "a) Describir las características fisiopatológicas de las enfermedades transmisibles y enumerar las medidas generales de prevención.",
      "b) Explicar los métodos de aislamiento, indicando sus aplicaciones en pacientes con enfermedades transmisibles.",
      "c) Describir los principios a cumplir en relación a las técnicas de aislamiento, en función de la unidad/servicio y/o del estado del paciente/cliente.",
      "d) Describir los medios materiales al uso en la realización de las técnicas de aislamiento.",
      "e) En un supuesto práctico de aislamiento, debidamente caracterizado: determinar el procedimiento adecuado a la situación, seleccionar los medios materiales que son necesarios, realizar técnicas de lavado de manos básico y quirúrgico, realizar técnicas de puesta de: gorro, bata, calzas, guantes, etc, empleando el método adecuado."
    ],
    "criterios_ca": [
      "a) Descriure les característiques fisiopatològiques de les malalties transmissibles i enumerar les mesures generals de prevenció.",
      "b) Explicar els mètodes d'aïllament, indicant-ne les aplicacions en pacients amb malalties transmissibles.",
      "c) Descriure els principis que s'han de complir en relació amb les tècniques d'aïllament, en funció de la unitat/servei i/o de l'estat del pacient/client.",
      "d) Descriure els mitjans materials d'ús en la realització de les tècniques d'aïllament.",
      "e) En un supòsit pràctic d'aïllament, degudament caracteritzat: determinar el procediment adequat a la situació, seleccionar els mitjans materials que són necessaris, fer tècniques de rentat de mans bàsic i quirúrgic, fer tècniques de posada de: gorra, bata, peücs, guants, etc., emprant el mètode adequat."
    ]
  },
  {
    "id": "RA4",
    "module": "Higiene del medi hospitalari i neteja de material",
    "module_es": "Higiene del medio hospitalario y limpieza de material",
    "module_ca": "Higiene del medi hospitalari i neteja de material",
    "moduleCode": "CAE3",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Explicar els processos de recollida de mostres, precisant els mitjans i les tècniques precisos en funció del tipus de mostra que s'ha de recollir.",
    "description_es": "Explicar los procesos de recogida de muestras, precisando los medios y técnicas precisas en función del tipo de muestra a recoger.",
    "description_ca": "Explicar els processos de recollida de mostres, precisant els mitjans i les tècniques precisos en funció del tipus de mostra que s'ha de recollir.",
    "criterios_es": [
      "a) Describir los medios materiales a utilizar en función del origen de la muestra biológica a recoger.",
      "b) Definir los diferentes tipos de residuos clínicos explicando los procedimientos de eliminación.",
      "c) Explicar los requerimientos técnicos de los procedimientos de recogida de muestras en función de su origen biológico.",
      "d) Describir los riesgos sanitarios asociados a los residuos clínicos en el medio hospitalario.",
      "e) En un supuesto práctico de recogida y eliminación de residuos, debidamente caracterizado: escoger los medios necesarios para la recogida de muestras de sangre y de orina, efectuar técnicas de recogida de eliminaciones de orina y heces, limpiar y desinfectar los medios de recogida de muestras de orina y de heces."
    ],
    "criterios_ca": [
      "a) Descriure els mitjans materials que s'han d'utilitzar en funció de l'origen de la mostra biològica que s'ha de recollir.",
      "b) Definir els diferents tipus de residus clínics explicant-ne els procediments d'eliminació.",
      "c) Explicar els requeriments tècnics dels procediments de recollida de mostres en funció del seu origen biològic.",
      "d) Descriure els riscs sanitaris associats als residus clínics en el medi hospitalari.",
      "e) En un supòsit pràctic de recollida i eliminació de residus, degudament caracteritzat: escollir els mitjans necessaris per a la recollida de mostres de sang i d'orina, efectuar tècniques de recollida d'eliminacions d'orina i femta, netejar i desinfectar els mitjans de recollida de mostres d'orina i de femta."
    ]
  },
  {
    "id": "RA1",
    "module": "Promoció de la salut i suport psicològic al pacient",
    "module_es": "Promoción de la salud y apoyo psicológico al paciente",
    "module_ca": "Promoció de la salut i suport psicològic al pacient",
    "moduleCode": "CAE4",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar circumstàncies psicològiques que poden provocar disfuncions de comportament en pacients amb condicions especials.",
    "description_es": "Analizar circunstancias psicológicas que pueden provocar disfunciones de comportamiento en pacientes con condiciones especiales.",
    "description_ca": "Analitzar circumstàncies psicològiques que poden provocar disfuncions de comportament en pacients amb condicions especials.",
    "criterios_es": [
      "a) Explicar que es la ansiedad, enumerar sus causas etiológicas y precisar que factores la pueden generar durante la estancia en un hospital.",
      "b) Describir las etapas que definen el desarrollo evolutivo y afectivo del niño.",
      "c) Describir cual es el «rol» del enfermo y enunciar las reacciones anómalas que potencian esa sensación.",
      "d) Explicar el «rol» profesional del personal sanitario de este nivel de cualificación.",
      "e) Describir los principales mecanismos para evitar o disminuir el grado de ansiedad en los pacientes.",
      "f) Explicar las teorías psicológicas existentes sobre la formación y desarrollo de la personalidad.",
      "g) Explicar el sentido del concepto comunicación y describir los elementos que la constituyen.",
      "h) Describir las fases que se dan en la relación paciente-sanitario y que factores pueden alterar esta relación.",
      "i) Explicar los mecanismos de ayuda que pueden ser empleados en pacientes terminales o con enfermedades crónicas o de larga duración."
    ],
    "criterios_ca": [
      "a) Explicar què és l'ansietat, enumerar-ne les causes etiològiques i precisar quins factors la poden generar durant l'estada en un hospital.",
      "b) Descriure les etapes que defineixen el desenvolupament evolutiu i afectiu de l'infant.",
      "c) Descriure quin és el «rol» del malalt i enunciar les reaccions anòmales que potencien aquesta sensació.",
      "d) Explicar el «rol» professional del personal sanitari d'aquest nivell de qualificació.",
      "e) Descriure els principals mecanismes per evitar o disminuir el grau d'ansietat en els pacients.",
      "f) Explicar les teories psicològiques existents sobre la formació i el desenvolupament de la personalitat.",
      "g) Explicar el sentit del concepte comunicació i descriure els elements que la constitueixen.",
      "h) Descriure les fases que es donen en la relació pacient-sanitari i quins factors poden alterar aquesta relació.",
      "i) Explicar els mecanismes d'ajuda que poden ser emprats en pacients terminals o amb malalties cròniques o de llarga durada."
    ]
  },
  {
    "id": "RA2",
    "module": "Promoció de la salut i suport psicològic al pacient",
    "module_es": "Promoción de la salud y apoyo psicológico al paciente",
    "module_ca": "Promoció de la salut i suport psicològic al pacient",
    "moduleCode": "CAE4",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar les condicions psicològiques de pacients de grups de risc o amb característiques especials.",
    "description_es": "Analizar las condiciones psicológicas de pacientes de grupos de riesgo o con características especiales.",
    "description_ca": "Analitzar les condicions psicològiques de pacients de grups de risc o amb característiques especials.",
    "criterios_es": [
      "a) Especificar las características comunes de los ancianos y los modos de relacionarse con pacientes geriátricos.",
      "b) Explicar las peculiaridades psicológicas de los niños y adolescentes enfermos, precisando los modos adecuados de relación con ellos.",
      "c) En un supuesto práctico de relación con enfermos de características especiales, debidamente caracterizado: enumerar las variables psicológicas que hay que observar en un paciente con VIH y/o procesos neoformativos para mejorar su estado anímico, Afrontar diversas situaciones de relación con pacientes con características fisiopatológicas peculiares o patología especial, Elaborar un resumen sobre los factores de riesgo y conducta a seguir con pacientes portadores del VIH, enunciar las fases evolutivas de un enfermo moribundo y como relacionarse con los familiares en cada una de ellas."
    ],
    "criterios_ca": [
      "a) Especificar les característiques comunes de les persones grans i les maneres de relacionar-se amb pacients geriàtrics.",
      "b) Explicar les peculiaritats psicològiques dels infants i adolescents malalts, precisant les maneres adequades de relació amb ells.",
      "c) En un supòsit pràctic de relació amb malalts de característiques especials, degudament caracteritzat: enumerar les variables psicològiques que cal observar en un pacient amb VIH i/o processos neoformatius per millorar el seu estat d'ànim, Afrontar diverses situacions de relació amb pacients amb característiques fisiopatològiques peculiars o patologia especial, Elaborar un resum sobre els factors de risc i la conducta que cal seguir amb pacients portadors del VIH, enunciar les fases evolutives d'un malalt moribund i com relacionar-se amb els familiars en cadascuna d'elles."
    ]
  },
  {
    "id": "RA3",
    "module": "Promoció de la salut i suport psicològic al pacient",
    "module_es": "Promoción de la salud y apoyo psicológico al paciente",
    "module_ca": "Promoció de la salut i suport psicològic al pacient",
    "moduleCode": "CAE4",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Explicar els mètodes i mitjans materials usats en activitats d'educació sanitària, descrivint-ne les aplicacions en funció del tipus de programa.",
    "description_es": "Explicar los métodos y medios materiales usados en actividades de educación sanitaria, describiendo las aplicaciones de los mismos en función del tipo de programa.",
    "description_ca": "Explicar els mètodes i mitjans materials usats en activitats d'educació sanitària, descrivint-ne les aplicacions en funció del tipus de programa.",
    "criterios_es": [
      "a) Explicar las características fundamentales de los programas de promoción de la salud en estados fisiológicos.",
      "b) Describir las características elementales de los programas de prevención de enfermedades específicas.",
      "c) Enumerar los objetivos que debe reunir todo programa de promoción de la salud.",
      "d) Enumerar los colectivos organizados de pacientes con patologías específicas describiendo los rasgos básicos de sus actividades de ayuda.",
      "e) Explicar los métodos de transmisión de información de uso común en actividades de información sanitaria.",
      "f) En un supuesto práctico de información sanitaria, debidamente caracterizado: identificar las actividades a realizar, seleccionar los materiales de apoyo en función del colectivo al que se dirige, simular y ejemplificar ante los compañeros estrategias de transmisión de la información sanitaria descrita en el supuesto."
    ],
    "criterios_ca": [
      "a) Explicar les característiques fonamentals dels programes de promoció de la salut en estats fisiològics.",
      "b) Descriure les característiques elementals dels programes de prevenció de malalties específiques.",
      "c) Enumerar els objectius que ha de reunir tot programa de promoció de la salut.",
      "d) Enumerar els col·lectius organitzats de pacients amb patologies específiques descrivint els trets bàsics de les seves activitats d'ajuda.",
      "e) Explicar els mètodes de transmissió d'informació d'ús comú en activitats d'informació sanitària.",
      "f) En un supòsit pràctic d'informació sanitària, degudament caracteritzat: identificar les activitats que cal fer, seleccionar els materials de suport en funció del col·lectiu al qual s'adreça, simular i exemplificar davant els companys estratègies de transmissió de la informació sanitària descrita en el supòsit."
    ]
  },
  {
    "id": "RA1",
    "module": "Tècniques d'ajuda odontològica/estomatològica",
    "module_es": "Técnicas de ayuda odontológica/estomatológica",
    "module_ca": "Tècniques d'ajuda odontològica/estomatològica",
    "moduleCode": "CAE5",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar els procediments tècnics necessaris per a la preparació i la conservació de materials dentals que permetin la utilització/aplicació directa pel facultatiu.",
    "description_es": "Analizar los procedimientos técnicos necesarios para la preparación y conservación de materiales dentales que permitan la utilización/aplicación directa por el facultativo.",
    "description_ca": "Analitzar els procediments tècnics necessaris per a la preparació i la conservació de materials dentals que permetin la utilització/aplicació directa pel facultatiu.",
    "criterios_es": [
      "a) Describir las características físico-químicas de los materiales dentales de uso común en consultas odontológicas, describiendo sus indicaciones y procedimientos de preparación.",
      "b) Describir los procedimientos de conservación de los materiales dentales que permiten optimizar los rendimientos.",
      "c) Explicar las operaciones de preparación de materiales dentales, que hay que realizar, previas a la solicitud de dispensación por parte del facultativo.",
      "d) En un caso práctico de preparación de materiales dentales, debidamente caracterizado: identificar el tipo o tipos de material que se requieren, preparar las cantidades y proporciones adecuadas de material, mezclar, espatular y/o batir, tanto manual como mecánicamente, los componentes de material dental que hay que preparar, consiguiendo la textura óptima, en función del tipo de solicitaciones descritas, dispensar el material preparado utilizando los medios de soporte adecuados al tipo de material."
    ],
    "criterios_ca": [
      "a) Descriure les característiques fisicoquímiques dels materials dentals d'ús comú en consultes odontològiques, descrivint-ne les indicacions i els procediments de preparació.",
      "b) Descriure els procediments de conservació dels materials dentals que permeten optimitzar-ne els rendiments.",
      "c) Explicar les operacions de preparació de materials dentals que cal fer, prèvies a la sol·licitud de dispensació per part del facultatiu.",
      "d) En un cas pràctic de preparació de materials dentals, degudament caracteritzat: identificar el tipus o els tipus de material que es requereixen, preparar les quantitats i proporcions adequades de material, mesclar, espatular i/o batre, tant manualment com mecànicament, els components de material dental que cal preparar, aconseguint la textura òptima, en funció del tipus de sol·licitacions descrites, dispensar el material preparat utilitzant els mitjans de suport adequats al tipus de material."
    ]
  },
  {
    "id": "RA2",
    "module": "Tècniques d'ajuda odontològica/estomatològica",
    "module_es": "Técnicas de ayuda odontológica/estomatológica",
    "module_ca": "Tècniques d'ajuda odontològica/estomatològica",
    "moduleCode": "CAE5",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar les característiques dels equips i de l'instrumental dental, fent les operacions necessàries per a la preparació i la dispensació de l'instrumental dental i la prestació de suport durant l'actuació bucodental.",
    "description_es": "Analizar las características de los equipos e instrumental dental, realizando las operaciones necesarias para la preparación y dispensación del instrumental dental y la prestación de apoyo durante la actuación bucodental.",
    "description_ca": "Analitzar les característiques dels equips i de l'instrumental dental, fent les operacions necessàries per a la preparació i la dispensació de l'instrumental dental i la prestació de suport durant l'actuació bucodental.",
    "criterios_es": [
      "a) Describir el instrumental dental de mano, sus condiciones de preparación y su aplicación en las distintas técnicas operatorias.",
      "b) Explicar los soportes de anotación y registro en clínicas dentales, empleando la nomenclatura utilizada en anatomía dental.",
      "c) Describir las técnicas operatorias a «cuatro» y «seis manos», describiendo las operaciones que debe realizar cada miembro del equipo.",
      "d) Describir las técnicas de aislamiento absoluto y relativo del campo operatorio dental, enumerando los medios necesarios para cada operatoria dental.",
      "e) Describir las características, utilidades, mantenimiento preventivo y manejo del equipo dental y del instrumental rotatorio.",
      "f) Explicar los procedimientos de limpieza y desinfección específicos del medio bucodental, describiendo el adecuado en función de las características del material y del uso al que se destina.",
      "g) En un supuesto práctico de asistencia al odontoestomatólogo, debidamente caracterizado: preparar la historia clínica y comprobar que no le falta información imprescindible, efectuar, si no se ha definido, la ficha dental del caso sometido a estudio, seleccionar y preparar el material que se necesitará en función de la técnica que se quiere realizar, disponer el equipo dental y el instrumental rotatorio específico para la técnica indicada, asegurando el nivel de limpieza y esterilización del mismo, fijar el nivel de iluminación que requiere la técnica, dispensar el material e instrumental necesario en el tiempo y forma adecuados a la ejecución de la técnica, aspirar e iluminar adecuadamente el campo operatorio durante la intervención del facultativo, efectuar aislamientos del campo operatorio mediante la aplicación de diques de goma, efectuar técnicas de ayuda de cuatro y seis manos en diversas situaciones operatorias."
    ],
    "criterios_ca": [
      "a) Descriure l'instrumental dental de mà, les condicions de preparació i l'aplicació en les diferents tècniques operatòries.",
      "b) Explicar els suports d'anotació i registre en clíniques dentals, emprant la nomenclatura utilitzada en anatomia dental.",
      "c) Descriure les tècniques operatòries a «quatre» i «sis mans», descrivint les operacions que ha de fer cada membre de l'equip.",
      "d) Descriure les tècniques d'aïllament absolut i relatiu del camp operatori dental, enumerant els mitjans necessaris per a cada operatòria dental.",
      "e) Descriure les característiques, utilitats, manteniment preventiu i maneig de l'equip dental i de l'instrumental rotatori.",
      "f) Explicar els procediments de neteja i desinfecció específics del medi bucodental, descrivint l'adequat en funció de les característiques del material i de l'ús al qual es destina.",
      "g) En un supòsit pràctic d'assistència a l'odontoestomatòleg, degudament caracteritzat: preparar la història clínica i comprovar que no hi falta informació imprescindible, efectuar, si no s'ha definit, la fitxa dental del cas sotmès a estudi, seleccionar i preparar el material que caldrà en funció de la tècnica que es vol fer, disposar l'equip dental i l'instrumental rotatori específic per a la tècnica indicada, assegurant-ne el nivell de neteja i esterilització, fixar el nivell d'il·luminació que requereix la tècnica, dispensar el material i l'instrumental necessari en el temps i la forma adequats a l'execució de la tècnica, aspirar i il·luminar adequadament el camp operatori durant la intervenció del facultatiu, efectuar aïllaments del camp operatori mitjançant l'aplicació de dics de goma, efectuar tècniques d'ajuda de quatre i sis mans en diverses situacions operatòries."
    ]
  },
  {
    "id": "RA3",
    "module": "Tècniques d'ajuda odontològica/estomatològica",
    "module_es": "Técnicas de ayuda odontológica/estomatológica",
    "module_ca": "Tècniques d'ajuda odontològica/estomatològica",
    "moduleCode": "CAE5",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Explicar les característiques dels diferents tipus de pel·lícula radiogràfica utilitzats en equips de diagnòstic bucodental, precisant l'adequat en funció del tipus d'exploració.",
    "description_es": "Explicar las características de los diferentes tipos de película radiográfica utilizados en equipos de diagnóstico buco dental, precisando el adecuado en función del tipo de exploración.",
    "description_ca": "Explicar les característiques dels diferents tipus de pel·lícula radiogràfica utilitzats en equips de diagnòstic bucodental, precisant l'adequat en funció del tipus d'exploració.",
    "criterios_es": [
      "a) Explicar los procedimientos de revelado y archivo de exposiciones y registros radiográficos bucodentales.",
      "b) Escoger los elementos materiales necesarios para obtener registros radiográficos de la boca, enumerándolos en función del tipo de proyección y zona anatómica examinada.",
      "c) Precisar, y en su caso aplicar, las normas generales y personales de radioprotección en consultas bucodentales describiendo los elementos necesarios en función de los distintos tipos radiografías dentales.",
      "d) En un supuesto práctico de realización de varias proyecciones de radiografía dental, debidamente caracterizado: seleccionar el tipo de película en función de los casos propuestos, preparar los posicionadores y elementos auxiliares necesarios, preparar y colocar sobre el modelo los elementos de radioprotección protocolizados para cada técnica definida, revelar, fijar y secar correctamente una película radiográfica previamente impresionada, efectuar correctamente las medidas de identificación, de conservación y archivado que deben seguirse con los distintos tipos de radiografías."
    ],
    "criterios_ca": [
      "a) Explicar els procediments de revelatge i arxiu d'exposicions i registres radiogràfics bucodentals.",
      "b) Triar els elements materials necessaris per obtenir registres radiogràfics de la boca, enumerant-los en funció del tipus de projecció i zona anatòmica examinada.",
      "c) Precisar, i si escau aplicar, les normes generals i personals de radioprotecció en consultes bucodentals descrivint els elements necessaris en funció dels diferents tipus de radiografies dentals.",
      "d) En un supòsit pràctic de realització de diverses projeccions de radiografia dental, degudament caracteritzat: seleccionar el tipus de pel·lícula en funció dels casos proposats, preparar els posicionadors i els elements auxiliars necessaris, preparar i col·locar sobre el model els elements de radioprotecció protocol·litzats per a cada tècnica definida, revelar, fixar i assecar correctament una pel·lícula radiogràfica prèviament impressionada, efectuar correctament les mesures d'identificació, de conservació i d'arxivament que s'han de seguir amb els diferents tipus de radiografies."
    ]
  },
  {
    "id": "RA4",
    "module": "Tècniques d'ajuda odontològica/estomatològica",
    "module_es": "Técnicas de ayuda odontológica/estomatológica",
    "module_ca": "Tècniques d'ajuda odontològica/estomatològica",
    "moduleCode": "CAE5",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar les necessitats de cures físiques i psicològiques que cal tenir en compte durant el procés d'intervenció dental segons el tipus de pacient.",
    "description_es": "Analizar las necesidades de cuidados físicos y psicológicos que es preciso tener en cuenta durante el proceso de intervención dental según el tipo de paciente.",
    "description_ca": "Analitzar les necessitats de cures físiques i psicològiques que cal tenir en compte durant el procés d'intervenció dental segons el tipus de pacient.",
    "criterios_es": [
      "a) Describir las características anatomofisiológicas de la inervación del aparato estomatognático.",
      "b) Explicar las acciones e indicaciones que deben reunir los anestésicos de uso común en cavidad oral.",
      "c) Enumerar las principales complicaciones que pueden producirse durante la realización de una técnica de anestesia local.",
      "d) Describir técnicas de relajación y apoyo psicológico para disminuir la ansiedad previa y durante una intervención dental.",
      "e) Explicar los requisitos que deben cumplir las maniobras de acondicionamiento de pacientes en el sillón dental.",
      "f) Explicar los contenidos que deben suministrarse a los pacientes después de una intervención dental, para favorecer el proceso postoperatorio, en función del tipo de técnica dental aplicada."
    ],
    "criterios_ca": [
      "a) Descriure les característiques anatomofisiològiques de la innervació de l'aparell estomatognàtic.",
      "b) Explicar les accions i indicacions que han de reunir els anestèsics d'ús comú en la cavitat oral.",
      "c) Enumerar les principals complicacions que es poden produir durant la realització d'una tècnica d'anestèsia local.",
      "d) Descriure tècniques de relaxació i suport psicològic per disminuir l'ansietat prèvia i durant una intervenció dental.",
      "e) Explicar els requisits que han de complir les maniobres de condicionament de pacients a la cadira dental.",
      "f) Explicar els continguts que s'han de subministrar als pacients després d'una intervenció dental, per afavorir el procés postoperatori, en funció del tipus de tècnica dental aplicada."
    ]
  },
  {
    "id": "RA1",
    "module": "Relacions en l'equip de treball",
    "module_es": "Relaciones en el equipo de trabajo",
    "module_ca": "Relacions en l'equip de treball",
    "moduleCode": "CAE6",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Utilitzar eficaçment les tècniques de comunicació per rebre i transmetre instruccions i informació.",
    "description_es": "Utilizar eficazmente las técnicas de comunicación para recibir y transmitir instrucciones e información.",
    "description_ca": "Utilitzar eficaçment les tècniques de comunicació per rebre i transmetre instruccions i informació.",
    "criterios_es": [
      "a) Describir los elementos básicos de un proceso de comunicación.",
      "b) Clasificar y caracterizar las etapas del proceso de comunicación.",
      "c) Identificar las barreras e interferencias que dificultan la comunicación.",
      "d) En supuestos prácticos de recepción de instrucciones analizar su contenido distinguiendo: el objetivo fundamental de la instrucción, el grado de autonomía para su realización, los resultados que se deben obtener, las personas a las que se debe informar quién, cómo y cuándo se debe controlar el cumplimiento de la instrucción.",
      "e) Transmitir la ejecución práctica de ciertas tareas, operaciones o movimientos comprobando la eficacia de la comunicación.",
      "f) Demostrar interés por la descripción verbal precisa de situaciones y por la utilización correcta del lenguaje."
    ],
    "criterios_ca": [
      "a) Descriure els elements bàsics d'un procés de comunicació.",
      "b) Classificar i caracteritzar les etapes del procés de comunicació.",
      "c) Identificar les barreres i interferències que dificulten la comunicació.",
      "d) En supòsits pràctics de recepció d'instruccions analitzar-ne el contingut distingint: l'objectiu fonamental de la instrucció, el grau d'autonomia per a la realització, els resultats que s'han d'obtenir, les persones a les quals s'ha d'informar, qui, com i quan s'ha de controlar el compliment de la instrucció.",
      "e) Transmetre l'execució pràctica de certes tasques, operacions o moviments comprovant l'eficàcia de la comunicació.",
      "f) Demostrar interès per la descripció verbal precisa de situacions i per la utilització correcta del llenguatge."
    ]
  },
  {
    "id": "RA2",
    "module": "Relacions en l'equip de treball",
    "module_es": "Relaciones en el equipo de trabajo",
    "module_ca": "Relacions en l'equip de treball",
    "moduleCode": "CAE6",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Afrontar els conflictes i resoldre, en l'àmbit de les seves competències, problemes que s'originin en l'entorn d'un grup de treball.",
    "description_es": "Afrontar los conflictos y resolver, en el ámbito de sus competencias, problemas que se originen en el entorno de un grupo de trabajo.",
    "description_ca": "Afrontar els conflictes i resoldre, en l'àmbit de les seves competències, problemes que s'originin en l'entorn d'un grup de treball.",
    "criterios_es": [
      "a) En casos prácticos, identificar los problemas, factores y causas que generan un conflicto.",
      "b) Definir el concepto y los elementos de la negociación.",
      "c) Demostrar tenacidad y perseverancia en la búsqueda de soluciones a los problemas.",
      "d) Discriminar entre datos y opiniones.",
      "e) Exigir razones y argumentaciones en las tomas de postura propias y ajenas.",
      "f) Presentar ordenada y claramente el proceso seguido y los resultados obtenidos en la resolución de un problema.",
      "g) Identificar los tipos y la eficacia de los posibles comportamientos en una situación de negociación.",
      "h) Superar equilibrada y armónicamente las presiones e intereses entre los distintos miembros de un grupo.",
      "i) Explicar las diferentes posturas e intereses que pueden existir entre los trabajadores y la dirección de una organización.",
      "j) Respetar otras opiniones demostrando un comportamiento tolerante ante conductas, pensamientos o ideas no coincidentes con las propias.",
      "k) Comportarse en todo momento de manera responsable y coherente."
    ],
    "criterios_ca": [
      "a) En casos pràctics, identificar els problemes, factors i causes que generen un conflicte.",
      "b) Definir el concepte i els elements de la negociació.",
      "c) Demostrar tenacitat i perseverança en la cerca de solucions als problemes.",
      "d) Discriminar entre dades i opinions.",
      "e) Exigir raons i argumentacions en les preses de postura pròpies i alienes.",
      "f) Presentar ordenada i clarament el procés seguit i els resultats obtinguts en la resolució d'un problema.",
      "g) Identificar els tipus i l'eficàcia dels possibles comportaments en una situació de negociació.",
      "h) Superar equilibrada i harmònicament les pressions i interessos entre els diferents membres d'un grup.",
      "i) Explicar les diferents postures i interessos que poden existir entre els treballadors i la direcció d'una organització.",
      "j) Respectar altres opinions demostrant un comportament tolerant davant conductes, pensaments o idees no coincidents amb les pròpies.",
      "k) Comportar-se en tot moment de manera responsable i coherent."
    ]
  },
  {
    "id": "RA3",
    "module": "Relacions en l'equip de treball",
    "module_es": "Relaciones en el equipo de trabajo",
    "module_ca": "Relacions en l'equip de treball",
    "moduleCode": "CAE6",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Treballar en equip i, si escau, integrar i coordinar les necessitats del grup de treball en uns objectius, polítiques i/o directrius predeterminats.",
    "description_es": "Trabajar en equipo y, en su caso, integrar y coordinar las necesidades del grupo de trabajo en unos objetivos, políticas y/o directrices predeterminados.",
    "description_ca": "Treballar en equip i, si escau, integrar i coordinar les necessitats del grup de treball en uns objectius, polítiques i/o directrius predeterminats.",
    "criterios_es": [
      "a) Describir los elementos fundamentales de funcionamiento de un grupo y los factores que pueden modificar su dinámica.",
      "b) Explicar las ventajas del trabajo en equipo frente al individual.",
      "c) Analizar los estilos de trabajo en grupo.",
      "d) Describir las fases de desarrollo de un equipo de trabajo.",
      "e) Identificar la tipología de los integrantes de un grupo.",
      "f) Describir los problemas más habituales que surgen entre los equipos de trabajo a lo largo de su funcionamiento.",
      "g) Describir el proceso de toma de decisiones en equipo: la participación y el consenso.",
      "h) Adaptarse e integrarse en un equipo colaborando, dirigiendo o cumpliendo las órdenes según los casos.",
      "i) Aplicar técnicas de dinamización de grupos de trabajo.",
      "j) Participar en la realización de un trabajo o en la toma de decisiones que requieran un consenso.",
      "k) Demostrar conformidad con las normas aceptadas por el grupo."
    ],
    "criterios_ca": [
      "a) Descriure els elements fonamentals de funcionament d'un grup i els factors que poden modificar-ne la dinàmica.",
      "b) Explicar els avantatges del treball en equip enfront de l'individual.",
      "c) Analitzar els estils de treball en grup.",
      "d) Descriure les fases de desenvolupament d'un equip de treball.",
      "e) Identificar la tipologia dels integrants d'un grup.",
      "f) Descriure els problemes més habituals que sorgeixen entre els equips de treball al llarg del seu funcionament.",
      "g) Descriure el procés de presa de decisions en equip: la participació i el consens.",
      "h) Adaptar-se i integrar-se en un equip col·laborant, dirigint o complint les ordres segons els casos.",
      "i) Aplicar tècniques de dinamització de grups de treball.",
      "j) Participar en la realització d'un treball o en la presa de decisions que requereixin un consens.",
      "k) Demostrar conformitat amb les normes acceptades pel grup."
    ]
  },
  {
    "id": "RA4",
    "module": "Relacions en l'equip de treball",
    "module_es": "Relaciones en el equipo de trabajo",
    "module_ca": "Relacions en l'equip de treball",
    "moduleCode": "CAE6",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Participar i/o moderar reunions col·laborant activament o aconseguint la col·laboració dels participants.",
    "description_es": "Participar y/o moderar reuniones colaborando activamente o consiguiendo la colaboración de los participantes.",
    "description_ca": "Participar i/o moderar reunions col·laborant activament o aconseguint la col·laboració dels participants.",
    "criterios_es": [
      "a) Describir los diferentes tipos y funciones de las reuniones.",
      "b) Identificar la tipología de participantes en una reunión.",
      "c) Describir las etapas de desarrollo de una reunión.",
      "d) Aplicar técnicas de moderación de reuniones.",
      "e) Exponer las ideas propias de forma clara y concisa."
    ],
    "criterios_ca": [
      "a) Descriure els diferents tipus i funcions de les reunions.",
      "b) Identificar la tipologia de participants en una reunió.",
      "c) Descriure les etapes de desenvolupament d'una reunió.",
      "d) Aplicar tècniques de moderació de reunions.",
      "e) Exposar les idees pròpies de manera clara i concisa."
    ]
  },
  {
    "id": "RA5",
    "module": "Relacions en l'equip de treball",
    "module_es": "Relaciones en el equipo de trabajo",
    "module_ca": "Relacions en l'equip de treball",
    "moduleCode": "CAE6",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Analitzar el procés de motivació relacionant-lo amb la influència que té en el clima laboral.",
    "description_es": "Analizar el proceso de motivación relacionándolo con su influencia en el clima laboral.",
    "description_ca": "Analitzar el procés de motivació relacionant-lo amb la influència que té en el clima laboral.",
    "criterios_es": [
      "a) Describir las principales teorías de la motivación.",
      "b) Definir la motivación y su importancia en el entorno laboral.",
      "c) Identificar las técnicas de motivación aplicables en el entorno laboral.",
      "d) Definir el concepto de clima laboral y relacionarlo con la motivación."
    ],
    "criterios_ca": [
      "a) Descriure les principals teories de la motivació.",
      "b) Definir la motivació i la seva importància en l'entorn laboral.",
      "c) Identificar les tècniques de motivació aplicables en l'entorn laboral.",
      "d) Definir el concepte de clima laboral i relacionar-lo amb la motivació."
    ]
  },
  {
    "id": "RA1",
    "module": "Formació i orientació laboral",
    "module_es": "Formación y orientación laboral",
    "module_ca": "Formació i orientació laboral",
    "moduleCode": "CAE7",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Detectar les situacions de risc més habituals en l'àmbit laboral que puguin afectar la seva salut i aplicar les mesures de protecció i prevenció corresponents.",
    "description_es": "Detectar las situaciones de riesgo más habituales en el ámbito laboral que puedan afectar a su salud y aplicar las medidas de protección y prevención correspondientes.",
    "description_ca": "Detectar les situacions de risc més habituals en l'àmbit laboral que puguin afectar la seva salut i aplicar les mesures de protecció i prevenció corresponents.",
    "criterios_es": [
      "a) Identificar, en situaciones de trabajo tipo, los factores de riesgo existentes.",
      "b) Describir los daños a la salud en función de los factores de riesgo que los generan.",
      "c) Identificar las medidas de protección y prevención en función de la situación de riesgo."
    ],
    "criterios_ca": [
      "a) Identificar, en situacions de treball tipus, els factors de risc existents.",
      "b) Descriure els danys a la salut en funció dels factors de risc que els generen.",
      "c) Identificar les mesures de protecció i prevenció en funció de la situació de risc."
    ]
  },
  {
    "id": "RA2",
    "module": "Formació i orientació laboral",
    "module_es": "Formación y orientación laboral",
    "module_ca": "Formació i orientació laboral",
    "moduleCode": "CAE7",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Aplicar les mesures sanitàries bàsiques immediates en el lloc de l'accident en situacions simulades.",
    "description_es": "Aplicar las medidas sanitarias básicas inmediatas en el lugar del accidente en situaciones simuladas.",
    "description_ca": "Aplicar les mesures sanitàries bàsiques immediates en el lloc de l'accident en situacions simulades.",
    "criterios_es": [
      "a) Identificar la prioridad de intervención en el supuesto de varios lesionados o de múltiples lesionados, conforme al criterio de mayor riesgo vital intrínseco de lesiones.",
      "b) Identificar la secuencia de medidas que deben ser aplicadas en función de las lesiones existentes.",
      "c) Realizar la ejecución de las técnicas sanitarias (RCP, inmovilización, traslado...), aplicando los protocolos establecidos."
    ],
    "criterios_ca": [
      "a) Identificar la prioritat d'intervenció en el supòsit de diversos ferits o de múltiples ferits, conforme al criteri de més risc vital intrínsec de lesions.",
      "b) Identificar la seqüència de mesures que s'han d'aplicar en funció de les lesions existents.",
      "c) Realitzar l'execució de les tècniques sanitàries (RCP, immobilització, trasllat...), aplicant els protocols establerts."
    ]
  },
  {
    "id": "RA3",
    "module": "Formació i orientació laboral",
    "module_es": "Formación y orientación laboral",
    "module_ca": "Formació i orientació laboral",
    "moduleCode": "CAE7",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Diferenciar les formes i els procediments d'inserció en la realitat laboral com a treballador per compte d'altri o per compte propi.",
    "description_es": "Diferenciar las formas y procedimientos de inserción en la realidad laboral como trabajador por cuenta ajena o por cuenta propia.",
    "description_ca": "Diferenciar les formes i els procediments d'inserció en la realitat laboral com a treballador per compte d'altri o per compte propi.",
    "criterios_es": [
      "a) Identificar las distintas modalidades de contratación laboral existentes en su sector productivo que permite la legislación vigente.",
      "b) Describir el proceso que hay que seguir y elaborar la documentación necesaria para la obtención de un empleo, partiendo de una oferta de trabajo de acuerdo con su perfil profesional.",
      "c) Identificar y cumplimentar correctamente los documentos necesarios, de acuerdo con la legislación vigente para constituirse en trabajador por cuenta propia."
    ],
    "criterios_ca": [
      "a) Identificar les diferents modalitats de contractació laboral existents en el seu sector productiu que permet la legislació vigent.",
      "b) Descriure el procés que s'ha de seguir i elaborar la documentació necessària per a l'obtenció d'una feina, partint d'una oferta de treball d'acord amb el seu perfil professional.",
      "c) Identificar i emplenar correctament els documents necessaris, d'acord amb la legislació vigent, per constituir-se en treballador per compte propi."
    ]
  },
  {
    "id": "RA4",
    "module": "Formació i orientació laboral",
    "module_es": "Formación y orientación laboral",
    "module_ca": "Formació i orientació laboral",
    "moduleCode": "CAE7",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Orientar-se en el mercat de treball, identificant les capacitats i els interessos propis i l'itinerari professional més idoni.",
    "description_es": "Orientarse en el mercado de trabajo, identificando sus propias capacidades e intereses y el itinerario profesional más idóneo.",
    "description_ca": "Orientar-se en el mercat de treball, identificant les capacitats i els interessos propis i l'itinerari professional més idoni.",
    "criterios_es": [
      "a) Identificar y evaluar las capacidades, actitudes y conocimientos propios con valor profesionalizador.",
      "b) Definir los intereses individuales y sus motivaciones, evitando, en su caso, los condicionamientos por razón de sexo o de otra índole.",
      "c) Identificar la oferta formativa y la demanda laboral referida a sus intereses."
    ],
    "criterios_ca": [
      "a) Identificar i avaluar les capacitats, actituds i coneixements propis amb valor professionalitzador.",
      "b) Definir els interessos individuals i les motivacions, evitant, si escau, els condicionaments per raó de sexe o d'una altra índole.",
      "c) Identificar l'oferta formativa i la demanda laboral referida als seus interessos."
    ]
  },
  {
    "id": "RA5",
    "module": "Formació i orientació laboral",
    "module_es": "Formación y orientación laboral",
    "module_ca": "Formació i orientació laboral",
    "moduleCode": "CAE7",
    "tipoNivel": "CFGM_CUIDADOS_AUXILIARES_ENFERMERIA",
    "description": "Interpretar el marc legal del treball i distingir els drets i les obligacions que es deriven de les relacions laborals.",
    "description_es": "Interpretar el marco legal del trabajo y distinguir los derechos y obligaciones que se derivan de las relaciones laborales.",
    "description_ca": "Interpretar el marc legal del treball i distingir els drets i les obligacions que es deriven de les relacions laborals.",
    "criterios_es": [
      "a) Emplear las fuentes básicas de información del derecho laboral (Constitución, Estatuto de los trabajadores, Directivas de la Unión Europea, convenio colectivo.) distinguiendo los derechos y las obligaciones que le incumben.",
      "b) Interpretar los diversos conceptos que intervienen en una «liquidación de haberes».",
      "c) En un supuesto de negociación colectiva tipo: describir el proceso de negociación, identificar las variables (salariales, seguridad e higiene, productividad tecnológicas) objeto de negociación, describir las posibles consecuencias y medidas, resultado de la negociación.",
      "d) Identificar las prestaciones y obligaciones relativas a la Seguridad Social."
    ],
    "criterios_ca": [
      "a) Emprar les fonts bàsiques d'informació del dret laboral (Constitució, Estatut dels treballadors, Directives de la Unió Europea, conveni col·lectiu.) distingint els drets i les obligacions que li incumbeixen.",
      "b) Interpretar els diversos conceptes que intervenen en una «liquidació de havers».",
      "c) En un supòsit de negociació col·lectiva tipus: descriure el procés de negociació, identificar les variables (salarials, seguretat i higiene, productivitat tecnològiques) objecte de negociació, descriure les possibles conseqüències i mesures, resultat de la negociació.",
      "d) Identificar les prestacions i obligacions relatives a la Seguretat Social."
    ]
  }
];
