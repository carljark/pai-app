/**
 * Currículo de FP Básica (CFGB Peluquería y Estética, IMP11) para el plan de los matriculados desde 2026/27
 * (tarea 250). Lo carga la migración 52 en la colección `ras` y es la fuente de la herramienta del mapa
 * intermodular (`scripts/mapa-intermodular`).
 *
 * Fuentes:
 * - Módulos profesionales (3060-3065, 3005): textos del mapa intermodular revisados en la tarea 211.
 * - 3159 Itinerario personal para la empleabilidad: anexo III del RD 659/2023 (ES) y apéndice 6 de la
 *   resolución DGFPIOE 03/2024 de la CAIB (CA).
 * - 3160 Proyecto intermodular de aprendizaje colaborativo: RA de Baleares ya cargados en la aplicación.
 * - Ámbitos 3161/3162 (Comunicación y Ciencias Sociales) y 3163/3164 (Ciencias Aplicadas): competencias
 *   específicas (`CE1`…`CE8`) y criterios de evaluación (`1.1`…), no RA. CA: apéndices 5 y 4 de la
 *   resolución de la CAIB; ES: anexo V del RD 217/2022 con las adaptaciones de Baleares de la CAIB.
 *   La norma no distingue I y II, así que los dos cursos comparten competencias y criterios.
 *
 * Generado a partir de las fuentes oficiales; documentación: documentation/fp_basica_plan_2026_27.md.
 */

export interface FpBasicaRaData {
  id: string;
  module: string;
  module_es: string;
  module_ca: string;
  moduleCode: string;
  tipoNivel: string;
  description: string;
  description_es: string;
  description_ca: string;
  criterios_es: string[];
  criterios_ca: string[];
}

export const FP_BASICA_RAS_DATA: FpBasicaRaData[] = [
  {
    "id": "RA1",
    "module": "Preparación del entorno profesional",
    "module_es": "Preparación del entorno profesional",
    "module_ca": "Preparació de l'entorn professional",
    "moduleCode": "3060",
    "tipoNivel": "FP_BASICA",
    "description": "Muestra una imagen personal y profesional adecuada en el entorno de trabajo, relacionándola con la higiene corporal y la estética personal.",
    "description_es": "Muestra una imagen personal y profesional adecuada en el entorno de trabajo, relacionándola con la higiene corporal y la estética personal.",
    "description_ca": "Mostra una imatge personal i professional adequada a l'entorn de treball, relacionant-la amb la higiene corporal i l'estètica personal.",
    "criterios_es": [
      "a) Se ha relacionado la imagen personal que precisa un profesional con el aspecto de su cabello y manos.",
      "b) Se ha identificado el vestuario y calzado más adecuado para el ejercicio de la profesión.",
      "c) Se ha adaptado la imagen personal a la imagen de la empresa.",
      "d) Se han identificado las posturas más idóneas para prevenir problemas físicos, trabajar en condiciones de seguridad y prevenir riesgos laborales.",
      "e) Se han descrito las medidas de protección que debe emplear el profesional, relacionándolas con la técnica que se va a realizar.",
      "f) Se han descrito las cualidades y aptituds que debe presentar un buen profesional.",
      "g) Se han identificado las normas de deontología profesional."
    ],
    "criterios_ca": [
      "a) S'ha relacionat la imatge personal que necessita un professional amb l'aspecte del seu cabell i de les seves mans.",
      "b) S'han identificat el vestuari i el calçat més adequats per a l'exercici de la professió.",
      "c) S'ha adaptat la imatge personal a la imatge de l'empresa.",
      "d) S'han identificat les postures més idònies per prevenir problemes físics, treballar en condicions de seguretat i prevenir riscs laborals.",
      "e) S'han descrit les mesures de protecció que ha de fer servir el professional, relacionant-les amb la tècnica que es farà.",
      "f) S'han descrit les qualitats i aptituds que ha de presentar un bon professional.",
      "g) S'han identificat les normes de deontologia professional."
    ]
  },
  {
    "id": "RA2",
    "module": "Preparación del entorno profesional",
    "module_es": "Preparación del entorno profesional",
    "module_ca": "Preparació de l'entorn professional",
    "moduleCode": "3060",
    "tipoNivel": "FP_BASICA",
    "description": "Prepara las instalaciones, aplicando las técnicas de higienización.",
    "description_es": "Prepara las instalaciones, aplicando las técnicas de higienización.",
    "description_ca": "Prepara les instal·lacions, aplicant les tècniques d'higienització.",
    "criterios_es": [
      "a) Se han descrito los conceptos de limpieza, desinfección y esterilización.",
      "b) Se han identificado los contaminantes físicos, químicos y biológicos más frecuentes en los salones de peluquería y estética.",
      "c) Se han identificado los productos, aparatos y métodos de higiene, desinfección y esterilización que se pueden aplicar en peluquería y estética.",
      "d) Se han seleccionado los métodos de limpieza, desinfección y esterilización más adecuados en función del tipo de contaminante y de los materiales empleados en los equipos, útiles, aparatos, mobiliario e instalaciones.",
      "e) Se ha realizado la limpieza y desinfección de superficies y mobiliario, asegurando su higiene.",
      "f) Se han determinado los métodos para aislar de posibles contaminantes a los equipos ya desinfectados.",
      "g) Se ha valorado la importancia que tiene la aplicación de las medidas higiénico-sanitarias para garantizar la seguridad de los clientes y del profesional.",
      "h) Se ha realizado la recogida selectiva de los productos de desecho generados.",
      "i) Se ha justificado las ventajas de utilizar material de un solo uso en determinados procesos con relación a la higiene.",
      "j) Se han aplicado las especificaciones de seguridad y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han descrit els conceptes de neteja, desinfecció i esterilització.",
      "b) S'han identificat els contaminants físics, químics i biològics més freqüents als salons de perruqueria i estètica.",
      "c) S'han identificat els productes, aparells i mètodes d'higiene, desinfecció i esterilització que es poden aplicar en perruqueria i estètica.",
      "d) S'han seleccionat els mètodes de neteja, desinfecció i esterilització més adequats en funció del tipus de contaminant i dels materials dels equips, estris, aparells, mobiliari i instal·lacions.",
      "e) S'han fet la neteja i la desinfecció de superfícies i mobiliari, assegurant-ne la higiene.",
      "f) S'han determinat els mètodes per aïllar dels possibles contaminants els equips ja desinfectats.",
      "g) S'ha valorat la importància que té l'aplicació de les mesures higienicosanitàries per garantir la seguretat dels clients i del professional.",
      "h) S'ha fet la recollida selectiva dels productes de rebuig generats.",
      "i) S'han justificat els avantatges d'utilitzar material d'un sol ús en determinats processos en relació amb la higiene.",
      "j) S'han aplicat les especificacions de seguretat i mediambientals requerides."
    ]
  },
  {
    "id": "RA3",
    "module": "Preparación del entorno profesional",
    "module_es": "Preparación del entorno profesional",
    "module_ca": "Preparació de l'entorn professional",
    "moduleCode": "3060",
    "tipoNivel": "FP_BASICA",
    "description": "Recepciona material de peluquería y estética, identificando sus características y aplicaciones.",
    "description_es": "Recepciona material de peluquería y estética, identificando sus características y aplicaciones.",
    "description_ca": "Recepciona material de perruqueria i estètica, identificant-ne les característiques i les aplicacions.",
    "criterios_es": [
      "a) Se han identificado los tipos de materiales y productos de peluquería y estética, así como sus aplicaciones.",
      "b) Se han explicado las condiciones básicas de manipulación de productos.",
      "c) Se han descrito las técnicas de conservación de los útiles y productos de peluquería y estética.",
      "d) Se ha organizado el almacén en condiciones de seguridad, facilitando el acceso a los productos.",
      "e) Se ha mantenido el almacén en condiciones de orden y limpieza.",
      "f) Se ha controlado la caducidad de las existencias.",
      "g) Se han detectado las alteraciones y defectos más frecuentes que pueden presentar.",
      "h) Se han relacionado las mercancías recibidas con el contenido del albarán.",
      "i) Se han clasificado las mercancías siguiendo las condiciones adecuadas de conservación y seguridad.",
      "j) Se han controlado las existencias, asegurando un stock óptimo.",
      "k) Se han aplicado las especificaciones de seguridad y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han identificat els tipus de materials i productes de perruqueria i estètica, així com les seves aplicacions.",
      "b) S'han explicat les condicions bàsiques de manipulació de productes.",
      "c) S'han descrit les tècniques de conservació dels estris i productes de perruqueria i estètica.",
      "d) S'ha organitzat el magatzem en condicions de seguretat, facilitant l'accés als productes.",
      "e) S'ha mantingut el magatzem en condicions d'ordre i neteja.",
      "f) S'ha controlat la caducitat de les existències.",
      "g) S'han detectat les alteracions i els defectes més freqüents que poden presentar.",
      "h) S'han relacionat les mercaderies rebudes amb el contingut de l'albarà.",
      "i) S'han classificat les mercaderies seguint les condicions adequades de conservació i seguretat.",
      "j) S'han controlat les existències, assegurant un estoc òptim.",
      "k) S'han aplicat les especificacions de seguretat i mediambientals requerides."
    ]
  },
  {
    "id": "RA4",
    "module": "Preparación del entorno profesional",
    "module_es": "Preparación del entorno profesional",
    "module_ca": "Preparació de l'entorn professional",
    "moduleCode": "3060",
    "tipoNivel": "FP_BASICA",
    "description": "Acomoda y protege al cliente en función de las características del servicio previsto, aplicando las técnicas y las normas de comportamiento apropiadas en condiciones de calidad, higiene y seguridad.",
    "description_es": "Acomoda y protege al cliente en función de las características del servicio previsto, aplicando las técnicas y las normas de comportamiento apropiadas en condiciones de calidad, higiene y seguridad.",
    "description_ca": "Acomoda i protegeix el client en funció de les característiques del servei previst, aplicant les tècniques i les normes de comportament apropiades en condicions de qualitat, higiene i seguretat.",
    "criterios_es": [
      "a) Se han analizado las normas de comportamiento y las técnicas más apropiadas para la recepción del cliente.",
      "b) Se han registrado las citas y los servicios solicitados utilizando el lenguaje propio de la profesión y los procedimientos establecidos.",
      "c) Se han seleccionado las preguntas básicas que deben formularse para garantizar la seguridad y calidad en relación al servicio que solicita el cliente.",
      "d) Se ha solicitado la información necesaria para reflejarla en la ficha de cliente establecida.",
      "e) Se han identificado las posiciones ergonómicas del cliente más idóneas en función del servicio demandado.",
      "f) Se han utilizado las técnicas de acomodación al cliente en función del servicio que se va a aplicar.",
      "g) Se han identificado los equipos de protección del cliente según el servicio previsto.",
      "h) Se han identificado las causas que pueden originar insatisfacción del cliente."
    ],
    "criterios_ca": [
      "a) S'han analitzat les normes de comportament i les tècniques més apropiades per a la recepció del client.",
      "b) S'han registrat les cites i els serveis sol·licitats utilitzant el llenguatge propi de la professió i els procediments establerts.",
      "c) S'han seleccionat les preguntes bàsiques que s'han de formular per garantir la seguretat i la qualitat en relació amb el servei que sol·licita el client.",
      "d) S'ha sol·licitat la informació necessària per reflectir-la en la fitxa de client establerta.",
      "e) S'han identificat les posicions ergonòmiques del client més idònies en funció del servei demandat.",
      "f) S'han utilitzat les tècniques d'acomodació del client en funció del servei que s'aplicarà.",
      "g) S'han identificat els equips de protecció del client segons el servei previst.",
      "h) S'han identificat les causes que poden originar insatisfacció del client."
    ]
  },
  {
    "id": "RA1",
    "module": "Depilación mecánica y decoloración del vello superfluo",
    "module_es": "Depilación mecánica y decoloración del vello superfluo",
    "module_ca": "Depilació mecànica i decoloració del borrissol",
    "moduleCode": "3062",
    "tipoNivel": "FP_BASICA",
    "description": "Observa las características del pelo y de la zona a tratar, relacionándolo con las técnicas que pueden ser empleadas.",
    "description_es": "Observa las características del pelo y de la zona a tratar, relacionándolo con las técnicas que pueden ser empleadas.",
    "description_ca": "Observa les característiques del pèl i de la zona que s'ha de tractar, relacionant-les amb les tècniques que es poden emprar.",
    "criterios_es": [
      "a) Se ha descrito la morfología del pelo.",
      "b) Se han indicado las fases del ciclo piloso.",
      "c) Se han relacionado los factores que influyen en el crecimiento del vello con las características del vello del cliente.",
      "d) Se han descrito los efectos de la depilación mecánica y de la decoloración del vello.",
      "e) Se han relacionado las características del vello y de la zona a depilar para seleccionar la técnica más adecuada.",
      "f) Se han justificado las causas que determinan la elección de la técnica de decoloración y/o de depilación.",
      "g) Se ha cumplimentado la ficha técnica del servicio con los datos, tanto personales como los relativos al estudio de la zona a depilar o decolorar.",
      "h) Se han formulado preguntas que permiten detectar las demandas y necesidades del servicio.",
      "i) Se han descrito las ventajas e inconvenientes de los productos depilatorios según su temperatura de aplicación.",
      "j) Se han definido las precauciones y contraindicaciones en el uso adecuado de la técnica de decoloración y de depilación según las características del vello.",
      "k) Se han expuesto los criterios para derivar el cliente a otros profesionales."
    ],
    "criterios_ca": [
      "a) S'ha descrit la morfologia del pèl.",
      "b) S'han indicat les fases del cicle pilós.",
      "c) S'han relacionat els factors que influeixen en el creixement del pèl amb les característiques del pèl del client.",
      "d) S'han descrit els efectes de la depilació mecànica i de la decoloració del pèl.",
      "e) S'han relacionat les característiques del pèl i de la zona que s'ha de depilar per seleccionar la tècnica més adequada.",
      "f) S'han justificat les causes que determinen l'elecció de la tècnica de decoloració o de depilació mecànica.",
      "g) S'ha emplenat la fitxa tècnica del servei amb les dades, tant les personals com les relatives a l'estudi de la zona que s'ha de depilar o decolorar.",
      "h) S'han formulat preguntes que permeten detectar les demandes i necessitats que ha de cobrir el servei.",
      "i) S'han descrit els avantatges i els inconvenients dels productes depilatoris segons la seva temperatura d'aplicació.",
      "j) S'han definit les precaucions i contraindicacions en l'ús adequat de la tècnica de decoloració i de depilació segons les característiques del pèl.",
      "k) S'han exposat els criteris per derivar el client a altres professionals."
    ]
  },
  {
    "id": "RA2",
    "module": "Depilación mecánica y decoloración del vello superfluo",
    "module_es": "Depilación mecánica y decoloración del vello superfluo",
    "module_ca": "Depilació mecànica i decoloració del borrissol",
    "moduleCode": "3062",
    "tipoNivel": "FP_BASICA",
    "description": "Prepara equipos, útiles y productos de depilación y decoloración, reconociendo sus características y aplicaciones.",
    "description_es": "Prepara equipos, útiles y productos de depilación y decoloración, reconociendo sus características y aplicaciones.",
    "description_ca": "Prepara equipaments, estris i productes de depilació i decoloració, reconeixent-ne les característiques i les aplicacions.",
    "criterios_es": [
      "a) Se ha descrito el procedimiento de limpieza del material y de los aparatos.",
      "b) Se han preparado los equipos, útiles y productos aplicando técnicas de higiene y desinfección.",
      "c) Se han identificado los útiles necesarios y se ordenan correctamente.",
      "d) Se ha explicado el método de preparación y precauciones de los productos decolorantes del vello.",
      "e) Se han revisado los aparatos, comprobando el uso correcto de termostatos y conexión a la red.",
      "f) Se han seleccionado y preparado los aparatos utilizados en la depilación de cera caliente y tibia en condiciones adecuadas para su utilización y mantenimiento.",
      "g) Se han identificado las características de cada tipo de cera.",
      "h) Se ha descrito el uso adecuado de cada tipo de cera y su técnica de aplicación.",
      "i) Se reconocen los peligros asociados a las actividades con aparatos eléctricos.",
      "j) Se han aplicado las medidas de prevención de riesgos laborales y medioambientales.",
      "k) Se han aplicado las normas de seguridad en la manipulación de los aparatos eléctricos."
    ],
    "criterios_ca": [
      "a) S'ha descrit el procediment de neteja del material i dels aparells.",
      "b) S'han preparat els equips, estris i productes, aplicant les tècniques d'higiene i desinfecció necessàries.",
      "c) S'han identificat els estris necessaris i s'han ordenat correctament.",
      "d) S'han explicat correctament el mètode de preparació i les precaucions dels productes decolorants del pèl.",
      "e) S'han revisat els aparells, comprovant l'ús correcte dels termòstats i la connexió a la xarxa.",
      "f) S'han seleccionat i preparat els aparells utilitzats en la depilació amb cera calenta i tèbia en condicions adequades per utilitzar-los i mantenir-los.",
      "g) S'han identificat les característiques de cada tipus de cera.",
      "h) S'han descrit l'ús adequat de cada tipus de cera i la seva tècnica d'aplicació.",
      "i) Es reconeixen els perills associats a les activitats amb aparells elèctrics.",
      "j) S'han aplicat les mesures de prevenció de riscs laborals i mediambientals requerides.",
      "k) S'han aplicat les normes de seguretat en la manipulació dels aparells elèctrics."
    ]
  },
  {
    "id": "RA3",
    "module": "Depilación mecánica y decoloración del vello superfluo",
    "module_es": "Depilación mecánica y decoloración del vello superfluo",
    "module_ca": "Depilació mecànica i decoloració del borrissol",
    "moduleCode": "3062",
    "tipoNivel": "FP_BASICA",
    "description": "Depila de forma mecánica, relacionando la técnica seleccionada con los efectos finales.",
    "description_es": "Depila de forma mecánica, relacionando la técnica seleccionada con los efectos finales.",
    "description_ca": "Depila de manera mecànica, relacionant la tècnica seleccionada amb els efectes finals.",
    "criterios_es": [
      "a) Se ha recogido el cabello, quitado las joyas y usado la ropa de trabajo y calzado establecido, higienizándose las manos posteriormente.",
      "b) Se ha preparado al cliente para el servicio garantizando su seguridad.",
      "c) Se han preparado los útiles y materiales necesarios para los diferentes procesos de depilación mecánica: espátulas, bandas de papel, guantes, entre otros.",
      "d) Se han relacionado correctamente los cosméticos, el material y los aparatos necesarios para realizar la depilación mecánica seleccionada.",
      "e) Se ha efectuado la limpieza y desinfección de la zona a tratar.",
      "f) Se ha preparado y revisado los aparatos y si la cera caliente y tibia se encuentra en las condiciones adecuadas para su aplicación en procesos de depilación.",
      "g) Se han aplicado las tiras de cera en la dirección del crecimiento del vello, con el grosor adecuado y retirándose a contrapelo.",
      "h) Se han retirado los restos de vello con pinzas y los de cera con los cosméticos específicos.",
      "i) Se han realizado maniobras de masaje de efecto calmante y descongestivo para aplicar los cosméticos posteriores a los procesos de depilación mecánica.",
      "j) Se ha completado el proceso en un tiempo adecuado.",
      "k) Se ha realizado la limpieza de los aparatos con los productos específicos, respetando las normas de seguridad indicadas por el fabricante.",
      "l) Se han aplicado las medidas de seguridad y medioambientales requeridas.",
      "m) Se han eliminado los residuos siguiendo la normativa vigente.",
      "n) Se han formulado preguntas que permitan conocer el grado de satisfacción del cliente."
    ],
    "criterios_ca": [
      "a) S'ha recollit el cabell, s'han llevat les joies i s'han fet servir la roba de treball i el calçat establerts, i després s'han higienitzat les mans.",
      "b) S'ha preparat el client per al servei que es farà, garantint-ne la seguretat.",
      "c) S'han preparat els estris i materials necessaris per als diferents processos de depilació mecànica: espàtules, bandes de paper i guants, entre d'altres.",
      "d) S'han relacionat correctament els cosmètics, el material i els aparells necessaris per fer la depilació mecànica seleccionada.",
      "e) S'han fet la neteja i la desinfecció de la zona que s'ha de tractar.",
      "f) S'han preparat i revisat els aparells i s'ha comprovat si la cera calenta i tèbia es troba en les condicions adequades per aplicar-la en processos de depilació.",
      "g) S'han aplicat les tires de cera en la direcció del creixement del pèl, amb el gruix adequat, i s'han retirat a contrapèl.",
      "h) S'han retirat les restes de pèl amb l'ajuda de pinces i les de cera aplicant els cosmètics específics adequats.",
      "i) S'han fet maniobres de massatge d'efecte calmant i descongestiu per aplicar els cosmètics posteriors als processos de depilació mecànica.",
      "j) S'ha completat el procés en un temps adequat.",
      "k) S'ha fet la neteja dels aparells amb els productes específics, respectant les normes de seguretat indicades pel fabricant.",
      "l) S'han aplicat les mesures de seguretat i mediambientals requerides.",
      "m) S'han eliminat els residus seguint la normativa vigent.",
      "n) S'han formulat preguntes que permetin conèixer el grau de satisfacció del client."
    ]
  },
  {
    "id": "RA4",
    "module": "Depilación mecánica y decoloración del vello superfluo",
    "module_es": "Depilación mecánica y decoloración del vello superfluo",
    "module_ca": "Depilació mecànica i decoloració del borrissol",
    "moduleCode": "3062",
    "tipoNivel": "FP_BASICA",
    "description": "Decolora el vello, reconociendo el efecto de los productos sobre el vello y la piel.",
    "description_es": "Decolora el vello, reconociendo el efecto de los productos sobre el vello y la piel.",
    "description_ca": "Decolora el pèl, reconeixent l'efecte dels productes sobre el pèl i la pell.",
    "criterios_es": [
      "a) Se ha realizado la protección personal adecuada.",
      "b) Se ha seleccionado y preparado el material de uso exclusivo para cada cliente.",
      "c) Se han relacionado correctamente los cosméticos y el material necesarios para realizar la técnica de decoloración del vello facial y corporal.",
      "d) Se ha preparado el producto decolorante con la debida precaución.",
      "e) Se ha efectuado la limpieza y desinfección de la zona a tratar.",
      "f) Se ha realizado la prueba de sensibilidad al producto decolorante.",
      "g) Se ha aplicado el producto con destreza, con el grosor adecuado y evitando goteos.",
      "h) Se han vigilado los tiempos de exposición y retirado los restos sin producir alteraciones en la piel.",
      "i) Se han aplicado cuidados posteriores para restituir la emulsión epicutánea.",
      "j) Se ha realizado la limpieza de los utensilios respetando las normas de seguridad del fabricante.",
      "k) Se han aplicado las medidas de seguridad y medioambientales requeridas.",
      "l) Se han realizado preguntas tipo que permitan conocer el grado de satisfacción del cliente, tanto respecto al resultado del servicio como de la atención personal."
    ],
    "criterios_ca": [
      "a) S'ha aplicat la protecció personal adequada.",
      "b) S'ha seleccionat i preparat adequadament el material d'ús exclusiu per a cada client.",
      "c) S'han relacionat correctament els cosmètics i el material necessaris per aplicar la tècnica de decoloració del pèl facial i corporal.",
      "d) S'ha preparat el producte decolorant amb la deguda precaució.",
      "e) S'han fet la neteja i la desinfecció de la zona que s'ha de tractar.",
      "f) S'ha fet la prova de sensibilitat al producte decolorant.",
      "g) S'ha aplicat el producte amb destresa, amb el gruix adequat i evitant degotejos.",
      "h) S'han vigilat els temps d'exposició i s'han retirat les restes adequadament, sense produir alteracions a la pell.",
      "i) S'han aplicat cures posteriors per restituir l'emulsió epicutània.",
      "j) S'ha fet la neteja dels estris utilitzats respectant les normes de seguretat indicades pel fabricant.",
      "k) S'han aplicat les mesures de seguretat i mediambientals requerides.",
      "l) S'han fet preguntes tipus que permetin conèixer el grau de satisfacció del client, tant pel que fa al resultat del servei com a l'atenció personal."
    ]
  },
  {
    "id": "RA1",
    "module": "Lavado y cambios de forma del cabello",
    "module_es": "Lavado y cambios de forma del cabello",
    "module_ca": "Rentada i canvis de forma dels cabells",
    "moduleCode": "3064",
    "tipoNivel": "FP_BASICA",
    "description": "Observa el estado del cuero cabelludo y cabello, reconociendo las alteraciones más relevantes.",
    "description_es": "Observa el estado del cuero cabelludo y cabello, reconociendo las alteraciones más relevantes.",
    "description_ca": "Observa l'estat del cuir cabellut i del cabell, reconeixent-ne les alteracions més rellevants.",
    "criterios_es": [
      "a) Se ha descrito la estructura de la piel.",
      "b) Se ha explicado la estructura y los tipos de cabello.",
      "c) Se ha determinado el tipo y el estado del cuero cabelludo.",
      "d) Se han descrito las anomalías más frecuentes de cabello y cuero cabelludo.",
      "e) Se ha acomodado al cliente teniendo en cuenta las posiciones ergonómicas más idóneas para el proceso.",
      "f) Se han identificado las pautas a seguir para realizar la observación del cabello y del cuero cabelludo.",
      "g) Se ha realizado el estudio básico del cabello y cuero cabelludo, exponiendo sus resultados con discreción en caso necesario y seleccionando cosméticos adecuados.",
      "h) Se han identificado los componentes que constituyen la suciedad del cabello y cuero cabelludo.",
      "i) Se ha realizado el proceso de análisis con la discreción requerida, respetando la confidencialidad."
    ],
    "criterios_ca": [
      "a) S'ha descrit l'estructura de la pell.",
      "b) S'han explicat l'estructura i els tipus de cabell.",
      "c) S'han determinat el tipus i l'estat del cuir cabellut.",
      "d) S'han descrit les anomalies més freqüents del cabell i el cuir cabellut.",
      "e) S'ha acomodat el client tenint en compte les posicions ergonòmiques més idònies per al procés.",
      "f) S'han identificat les pautes que cal seguir per fer l'observació del cabell i del cuir cabellut.",
      "g) S'ha fet l'estudi bàsic del cabell i del cuir cabellut, exposant-ne els resultats amb discreció si cal i seleccionant cosmètics adequats.",
      "h) S'han identificat els components que constitueixen la brutícia del cabell i del cuir cabellut.",
      "i) S'ha fet el procés d'anàlisi amb la discreció requerida, respectant la confidencialitat."
    ]
  },
  {
    "id": "RA2",
    "module": "Lavado y cambios de forma del cabello",
    "module_es": "Lavado y cambios de forma del cabello",
    "module_ca": "Rentada i canvis de forma dels cabells",
    "moduleCode": "3064",
    "tipoNivel": "FP_BASICA",
    "description": "Prepara equipos y útiles de lavado y cambios de forma, reconociendo sus características y aplicaciones.",
    "description_es": "Prepara equipos y útiles de lavado y cambios de forma, reconociendo sus características y aplicaciones.",
    "description_ca": "Prepara equips i estris de rentat i canvis de forma, reconeixent-ne les característiques i les aplicacions.",
    "criterios_es": [
      "a) Se han descrito los equipos y accesorios necesarios para realizar el proceso de higiene capilar.",
      "b) Se ha preparado la zona de trabajo en condiciones de higiene, para la realización del servicio de higiene capilar.",
      "c) Se han clasificado los útiles y accesorios para realizar un montaje de cambio de forma en función del tipo de cabello y el peinado que se va a realizar.",
      "d) Se han identificado las clases de moldes y útiles para realizar los diferentes cambios de forma temporal y permanente.",
      "e) Se ha indicado el grado de dificultad asociado al tipo de molde que hay que utilizar y se ha estimado el tiempo de ejecución del montaje.",
      "f) Se han clasificado los aparatos utilizados como fuentes de calor en las técnicas para el cambio de forma del cabello, indicando su modo de utilización e higienización.",
      "g) Se ha distinguido los desperfectos que pueden presentarse en los útiles y accesorios y que pueden originar deficiencias en el resultado final.",
      "h) Se han detectado las anomalías que pueden presentar los aparatos y que pueden causar riesgos, tanto para el cliente como para el profesional.",
      "i) Se ha demostrado seguridad a la hora de elegir los útiles más adecuados para el proceso técnico que se va a realizar.",
      "j) Se han aplicado las medidas de prevención de riesgos laborales requeridas."
    ],
    "criterios_ca": [
      "a) S'han descrit els equips i accessoris necessaris per fer el procés d'higiene capil·lar.",
      "b) S'ha preparat la zona de treball en condicions d'higiene per fer el servei d'higiene capil·lar.",
      "c) S'han classificat els estris i accessoris per fer un muntatge de canvi de forma en funció del tipus de cabell i del pentinat que es farà.",
      "d) S'han identificat les classes de motlles i estris per fer els diferents canvis de forma temporals i permanents.",
      "e) S'ha indicat el grau de dificultat associat al tipus de motlle que cal utilitzar i s'ha estimat el temps d'execució del muntatge.",
      "f) S'han classificat els aparells utilitzats com a fonts de calor en les tècniques per al canvi de forma del cabell, indicant-ne la manera d'utilització i d'higienització.",
      "g) S'han distingit els desperfectes que es poden presentar en els estris i accessoris i que poden originar deficiències en el resultat final.",
      "h) S'han detectat les anomalies que poden presentar els aparells i que poden causar riscs, tant per al client com per al professional.",
      "i) S'ha demostrat seguretat a l'hora de triar els estris més adequats per al procés tècnic que es farà.",
      "j) S'han aplicat les mesures de prevenció de riscs laborals requerides."
    ]
  },
  {
    "id": "RA3",
    "module": "Lavado y cambios de forma del cabello",
    "module_es": "Lavado y cambios de forma del cabello",
    "module_ca": "Rentada i canvis de forma dels cabells",
    "moduleCode": "3064",
    "tipoNivel": "FP_BASICA",
    "description": "Lava/acondiciona el cabello, relacionándolo con las características del mismo.",
    "description_es": "Lava/acondiciona el cabello, relacionándolo con las características del mismo.",
    "description_ca": "Renta i condiciona el cabell, relacionant-ho amb les seves característiques.",
    "criterios_es": [
      "a) Se han descrito de forma básica la composición y el mecanismo de actuación de un champú y de un acondicionador capilar.",
      "b) Se han seleccionado los cosméticos a emplear en el lavado y acondicionado del cabello teniendo en cuenta el tipo de cabello.",
      "c) Se ha acomodado y preparado al cliente para la realización del servicio de higiene capilar.",
      "d) Se ha adoptado la posición ergonómica del cliente y del profesional para la aplicación de las técnicas de higiene capilar.",
      "e) Se ha asegurado que el cabello y cuero cabelludo queda mojado, antes de la aplicación champú.",
      "f) Se han realizado las maniobras de aplicación de los productos con la intensidad y ritmos requeridos.",
      "g) Se ha asegurado la eliminación de los cosméticos aplicados.",
      "h) Se ha reflejado en la ficha del cliente y en la ficha de servicio los productos cosméticos utilizados.",
      "i) Se han empleado los equipos de protección individual.",
      "j) Se ha adaptado el proceso de higiene capilar a los cambios de forma temporal y permanente del cabello.",
      "k) Se han detectado las causas que originan deficiencias en el servicio y las medidas para subsanarlas.",
      "l) Se han aplicado las especificaciones de seguridad requeridas."
    ],
    "criterios_ca": [
      "a) S'han descrit de manera bàsica la composició i el mecanisme d'actuació d'un xampú i d'un condicionador capil·lar.",
      "b) S'han seleccionat els cosmètics que s'han d'emprar en el rentat i el condicionament del cabell tenint en compte el tipus de cabell.",
      "c) S'ha acomodat i preparat el client per fer el servei d'higiene capil·lar.",
      "d) S'ha adoptat la posició ergonòmica del client i del professional per aplicar les tècniques d'higiene capil·lar.",
      "e) S'ha assegurat que el cabell i el cuir cabellut queden mullats abans d'aplicar el xampú.",
      "f) S'han fet les maniobres d'aplicació dels productes amb la intensitat i els ritmes requerits.",
      "g) S'ha assegurat l'eliminació dels cosmètics aplicats.",
      "h) S'han reflectit en la fitxa del client i en la fitxa de servei els productes cosmètics utilitzats.",
      "i) S'han emprat els equips de protecció individual.",
      "j) S'ha adaptat el procés d'higiene capil·lar als canvis de forma temporals i permanents del cabell.",
      "k) S'han detectat les causes que originen deficiències en el servei i les mesures per esmenar-les.",
      "l) S'han aplicat les especificacions de seguretat requerides."
    ]
  },
  {
    "id": "RA4",
    "module": "Lavado y cambios de forma del cabello",
    "module_es": "Lavado y cambios de forma del cabello",
    "module_ca": "Rentada i canvis de forma dels cabells",
    "moduleCode": "3064",
    "tipoNivel": "FP_BASICA",
    "description": "Cambia la forma del cabello de manera temporal, relacionando las técnicas de cambio temporal seleccionadas con el efecto final.",
    "description_es": "Cambia la forma del cabello de manera temporal, relacionando las técnicas de cambio temporal seleccionadas con el efecto final.",
    "description_ca": "Canvia la forma del cabell de manera temporal, relacionant les tècniques de canvi temporal seleccionades amb l'efecte final.",
    "criterios_es": [
      "a) Se han identificado las modificaciones que se originan en el cabello durante el proceso de cambio temporal.",
      "b) Se han enumerado los procedimientos físicos implicados en la modificación de la forma del cabello de manera temporal.",
      "c) Se han descrito los cosméticos que facilitan y mantienen el peinado, su composición básica y su forma de actuar.",
      "d) Se ha acomodado y preparado al cliente para la realización del servicio de cambio temporal del cabello.",
      "e) Se ha elegido la técnica de cambio de forma, en función del tipo de peinado a realizar y la longitud del cabello, así como los equipos necesarios para ejecutarla.",
      "f) Se ha elegido el tipo y tamaño de molde o accesorio necesario para realizar el cambio de forma.",
      "g) Se ha elegido y aplicado el cosmético fijador previo a la realización del marcado.",
      "h) Se han colocado los accesorios y/o moldes en función del resultado pretendido, adaptando perfectamente el tallo capilar y siguiendo las direcciones correctas, en función del largo del cabello y el estilo del peinado.",
      "i) Se ha controlado el tiempo de exposición requerido en el proceso de secado.",
      "j) Se ha adaptado la temperatura y la distancia del secador de mano al tipo de cabello y al grado de humedad.",
      "k) Se han detectado las causas que originan deficiencias en el servicio y las medidas para subsanarlas."
    ],
    "criterios_ca": [
      "a) S'han identificat les modificacions que s'originen en el cabell durant el procés de canvi temporal.",
      "b) S'han enumerat els procediments físics implicats en la modificació temporal de la forma del cabell.",
      "c) S'han descrit els cosmètics que faciliten i mantenen el pentinat, la seva composició bàsica i la seva manera d'actuar.",
      "d) S'ha acomodat i preparat el client per fer el servei de canvi temporal del cabell.",
      "e) S'ha triat la tècnica de canvi de forma en funció del tipus de pentinat que es farà i de la longitud del cabell, així com els equips necessaris per executar-la.",
      "f) S'ha triat el tipus i la mida del motlle o l'accessori necessari per fer el canvi de forma.",
      "g) S'ha triat i aplicat el cosmètic fixador previ a la realització del marcat.",
      "h) S'han col·locat els accessoris o els motlles en funció del resultat pretès, adaptant perfectament la tija capil·lar i seguint les direccions correctes, en funció de la llargada del cabell i de l'estil del pentinat.",
      "i) S'ha controlat el temps d'exposició requerit en el procés d'assecat.",
      "j) S'han adaptat la temperatura i la distància de l'assecador de mà al tipus de cabell i al grau d'humitat.",
      "k) S'han detectat les causes que originen deficiències en el servei i les mesures per esmenar-les."
    ]
  },
  {
    "id": "RA5",
    "module": "Lavado y cambios de forma del cabello",
    "module_es": "Lavado y cambios de forma del cabello",
    "module_ca": "Rentada i canvis de forma dels cabells",
    "moduleCode": "3064",
    "tipoNivel": "FP_BASICA",
    "description": "Cambia la forma del cabello de manera permanente, relacionando las técnicas de cambio permanente seleccionadas con el efecto final.",
    "description_es": "Cambia la forma del cabello de manera permanente, relacionando las técnicas de cambio permanente seleccionadas con el efecto final.",
    "description_ca": "Canvia la forma del cabell de manera permanent, relacionant les tècniques de canvi permanent seleccionades amb l'efecte final.",
    "criterios_es": [
      "a) Se han descrito las fases que tienen lugar en un cambio de forma permanente, así como las modificaciones asociadas.",
      "b) Se han identificado los cosméticos que se emplean en cada una de las fases, su relación con el tipo de cabello y su forma de utilización.",
      "c) Se ha protegido el profesional con las medidas adecuadas para trabajar en condiciones de seguridad e higiene.",
      "d) Se ha preparado al cliente y se le han aplicado los productos necesarios para la protección de la piel.",
      "e) Se ha elegido el tipo y tamaño de molde más adecuado para el cambio de forma permanente que se pretende realizar y se han colocado con habilidad y destreza en la dirección indicada.",
      "f) Se han aplicado los cosméticos seleccionados, controlando el proceso y el tiempo de exposición.",
      "g) Se han reflejado en la ficha del cliente los productos cosméticos utilizados y, en la ficha de servicio, la técnica realizada.",
      "h) Se ha mantenido el área de trabajo con el grado apropiado de orden y limpieza.",
      "i) Se ha recogido y almacenado todo el material una vez terminado el proceso realizado.",
      "j) Se ha evaluado el resultado del cambio de forma del cabello, formulando las preguntas tipos.",
      "k) Se han detectado las causas que originan deficiencias en el servicio y las medidas para subsanarlas."
    ],
    "criterios_ca": [
      "a) S'han descrit les fases que tenen lloc en un canvi de forma permanent, així com les modificacions associades.",
      "b) S'han identificat els cosmètics que s'empren en cadascuna de les fases, la seva relació amb el tipus de cabell i la seva manera d'utilització.",
      "c) El professional s'ha protegit amb les mesures adequades per treballar en condicions de seguretat i higiene.",
      "d) S'ha preparat el client i se li han aplicat els productes necessaris per protegir la pell.",
      "e) S'ha triat el tipus i la mida de motlle més adequats per al canvi de forma permanent que es vol fer i s'han col·locat amb habilitat i destresa en la direcció indicada.",
      "f) S'han aplicat els cosmètics seleccionats, controlant el procés i el temps d'exposició.",
      "g) S'han reflectit en la fitxa del client els productes cosmètics utilitzats i, en la fitxa de servei, la tècnica aplicada.",
      "h) S'ha mantingut l'àrea de treball amb el grau apropiat d'ordre i neteja.",
      "i) S'ha recollit i emmagatzemat tot el material un cop acabat el procés.",
      "j) S'ha avaluat el resultat del canvi de forma del cabell, formulant les preguntes tipus.",
      "k) S'han detectat les causes que originen deficiències en el servei i les mesures per esmenar-les."
    ]
  },
  {
    "id": "RA1",
    "module": "Cuidados estéticos básicos de uñas",
    "module_es": "Cuidados estéticos básicos de uñas",
    "module_ca": "Cures estètiques bàsiques d'ungles",
    "moduleCode": "3061",
    "tipoNivel": "FP_BASICA",
    "description": "Prepara equipos, útiles y productos de manicura y pedicura, reconociendo sus características y aplicaciones.",
    "description_es": "Prepara equipos, útiles y productos de manicura y pedicura, reconociendo sus características y aplicaciones.",
    "description_ca": "Prepara equipaments, estris i productes de manicura i pedicura, reconeixent-ne les característiques i les aplicacions.",
    "criterios_es": [
      "a) Se ha descrito la imagen que debe presentar el ayudante de manicura.",
      "b) Se han descrito e identificado los útiles y aparatos necesarios para realizar los procesos de manicura y pedicura.",
      "c) Se han explicado los factores a tener en cuenta para la selección de los útiles de acuerdo con el proceso que se desea realizar.",
      "d) Se han identificado los métodos de higiene, desinfección y esterilización previos a la aplicación de la técnica.",
      "e) Se han realizado los procesos de higiene, desinfección y esterilización de los aparatos según el fin al que estén destinados.",
      "f) Se ha seleccionado de forma adecuada el material de uso exclusivo para cada cliente.",
      "g) Se han preparado los útiles necesarios para la técnica que se va a realizar.",
      "h) Se han ordenado los útiles de forma correcta según su orden de utilización.",
      "i) Se han identificado los cosméticos generales utilizados en el cuidado de las uñas de manos y pies.",
      "j) Se han seleccionado adecuadamente los cosméticos según la técnica que se va a realizar.",
      "k) Se ha comprobado que los cosméticos a utilizar estén en buen estado.",
      "l) Se ha descrito la conservación adecuada de los útiles de corte.",
      "m) Se han aplicado las medidas de prevención de riesgos laborales y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'ha descrit la imatge que ha de presentar l'ajudant de manicura.",
      "b) S'han descrit i identificat els estris i aparells necessaris per fer els processos de manicura i pedicura.",
      "c) S'han explicat els factors que cal tenir en compte per seleccionar els estris d'acord amb el procés que es durà a terme.",
      "d) S'han identificat els mètodes d'higiene, desinfecció i esterilització previs a l'aplicació de la tècnica.",
      "e) S'han fet els processos d'higiene, desinfecció i esterilització dels aparells segons la finalitat a què es destinen.",
      "f) S'ha seleccionat adequadament el material d'ús exclusiu per a cada client.",
      "g) S'han preparat els estris necessaris per a la tècnica que es farà.",
      "h) S'han ordenat correctament els estris segons el seu ordre d'utilització.",
      "i) S'han identificat els cosmètics generals utilitzats en la cura de les ungles de mans i peus.",
      "j) S'han seleccionat adequadament els cosmètics segons la tècnica que es farà.",
      "k) S'ha comprovat que els cosmètics que s'han de fer servir estiguin en bon estat.",
      "l) S'ha descrit la conservació adequada dels estris de tall.",
      "m) S'han aplicat les mesures de prevenció de riscs laborals i mediambientals requerides."
    ]
  },
  {
    "id": "RA2",
    "module": "Cuidados estéticos básicos de uñas",
    "module_es": "Cuidados estéticos básicos de uñas",
    "module_ca": "Cures estètiques bàsiques d'ungles",
    "moduleCode": "3061",
    "tipoNivel": "FP_BASICA",
    "description": "Observa las uñas, reconociendo las alteraciones más relevantes.",
    "description_es": "Observa las uñas, reconociendo las alteraciones más relevantes.",
    "description_ca": "Observa les ungles, reconeixent-ne les alteracions més rellevants.",
    "criterios_es": [
      "a) Se ha descrito la estructura de la uña.",
      "b) Se han identificado las alteraciones más relevantes de las uñas de las manos y los pies.",
      "c) Se han detectado desviaciones del patrón de normalidad en el aspecto de las uñas y la piel que deben ser consultadas con el técnico responsable.",
      "d) Se ha transmitido la información al técnico responsable si se ha considerado necesario.",
      "e) Se ha organizado el servicio atendiendo a las alteraciones detectadas y derivando su atención a otros profesionales, si resultase necesario.",
      "f) Se han formulado preguntas tipo que permiten detectar las demandas y necesidades que debe cubrir el servicio.",
      "g) Se ha preparado al cliente para el servicio que se va a realizar garantizando su seguridad.",
      "h) Se ha descrito la posición ergonómica del cliente y del profesional para realizar las técnicas de manicura y/o pedicura.",
      "i) Se han relacionado las características morfológicas de las manos y/o los pies y de las uñas para seleccionar la forma final más adecuada.",
      "j) Se ha cumplimentado la ficha técnica del servicio con los datos más relevantes."
    ],
    "criterios_ca": [
      "a) S'ha descrit l'estructura de l'ungla.",
      "b) S'han identificat les alteracions més rellevants de les ungles de les mans i dels peus.",
      "c) S'han detectat desviacions del patró de normalitat en l'aspecte de les ungles i la pell que s'han de considerar en el servei.",
      "d) S'ha transmès la informació al tècnic responsable si s'ha considerat necessari.",
      "e) S'ha organitzat el servei atenent les alteracions detectades i derivant-ne l'atenció a altres professionals si cal.",
      "f) S'han formulat preguntes tipus que permeten detectar les demandes i necessitats que ha de cobrir el servei.",
      "g) S'ha preparat el client per al servei que es farà, garantint-ne la seguretat.",
      "h) S'ha descrit la posició ergonòmica del client i del professional per aplicar les tècniques de manicura i pedicura.",
      "i) S'han relacionat les característiques morfològiques de les mans o dels peus i de les ungles per seleccionar la forma més adequada.",
      "j) S'ha emplenat la fitxa tècnica del servei amb les dades més rellevants."
    ]
  },
  {
    "id": "RA3",
    "module": "Cuidados estéticos básicos de uñas",
    "module_es": "Cuidados estéticos básicos de uñas",
    "module_ca": "Cures estètiques bàsiques d'ungles",
    "moduleCode": "3061",
    "tipoNivel": "FP_BASICA",
    "description": "Aplica técnicas básicas de manicura, relacionando las características morfológicas de las manos y de las uñas con la forma final de éstas últimas.",
    "description_es": "Aplica técnicas básicas de manicura, relacionando las características morfológicas de las manos y de las uñas con la forma final de éstas últimas.",
    "description_ca": "Aplica tècniques bàsiques de manicura, relacionant les característiques morfològiques de les mans i de les ungles amb la forma final d'aquestes darreres.",
    "criterios_es": [
      "a) Se han explicado las fases del proceso de manicura y se han indicado las operaciones técnicas que se realizan en cada una de ellas.",
      "b) Se han relacionado los cosméticos que se van a utilizar de acuerdo con cada una de las fases del proceso.",
      "c) Se ha identificado la forma de manipularlos adecuadamente.",
      "d) Se ha preparado y protegido al cliente y al profesional de forma correcta.",
      "e) Se ha practicado la técnica de desmaquillado en dos fases: lámina ungular y pliegues ungulares.",
      "f) Se han realizado las técnicas de limado y acondicionamiento de cutículas adecuadas a las características de las uñas y al servicio solicitado.",
      "g) Se han definido las maniobras de masaje de manos en el orden correcto con destreza y respetando las características de cada cliente.",
      "h) Se han aplicado técnicas de pulido de uñas utilizando los útiles y productos adecuados, respetando las características de las uñas.",
      "i) Se han descrito las técnicas de aplicación de cosméticos decorativos sobre las uñas.",
      "j) Se ha completado el proceso en un tiempo adecuado.",
      "k) Se han realizado preguntas para conocer el grado de satisfacción del cliente.",
      "l) Se han aplicado las especificaciones de seguridad y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han explicat les fases del procés de manicura i s'han indicat les operacions tècniques que es fan en cadascuna.",
      "b) S'han relacionat els cosmètics que es faran servir amb cadascuna de les fases del procés.",
      "c) S'ha identificat la manera de manipular-los adequadament.",
      "d) S'han preparat i protegit correctament el client i el professional.",
      "e) S'ha practicat la tècnica de desmaquillatge en dues fases: làmina unguial i plecs unguials.",
      "f) S'han aplicat les tècniques de llimat i condicionament de cutícules adequades a les característiques de les ungles i al servei sol·licitat pel client.",
      "g) S'han definit les maniobres de massatge de mans en l'ordre correcte, amb destresa i respectant les característiques de cada client.",
      "h) S'han aplicat tècniques de polit d'ungles utilitzant els estris i productes adequats, respectant les característiques de les ungles.",
      "i) S'han descrit les tècniques d'aplicació de cosmètics decoratius sobre les ungles.",
      "j) S'ha completat el procés en un temps adequat.",
      "k) S'han fet preguntes per conèixer el grau de satisfacció del client.",
      "l) S'han aplicat les especificacions de seguretat i mediambientals requerides."
    ]
  },
  {
    "id": "RA4",
    "module": "Cuidados estéticos básicos de uñas",
    "module_es": "Cuidados estéticos básicos de uñas",
    "module_ca": "Cures estètiques bàsiques d'ungles",
    "moduleCode": "3061",
    "tipoNivel": "FP_BASICA",
    "description": "Aplica técnicas básicas de pedicura, relacionando las características morfológicas de los pies y de las uñas con la forma final de éstas últimas.",
    "description_es": "Aplica técnicas básicas de pedicura, relacionando las características morfológicas de los pies y de las uñas con la forma final de éstas últimas.",
    "description_ca": "Aplica tècniques bàsiques de pedicura, relacionant les característiques morfològiques dels peus i les ungles amb la forma final d'aquestes darreres.",
    "criterios_es": [
      "a) Se han identificado los métodos de higiene previos a la aplicación de la técnica de pedicura.",
      "b) Se han explicado las fases del proceso de pedicura y se han indicado las operaciones técnicas que se realizan en cada una de ellas.",
      "c) Se han relacionado los cosméticos utilizados con cada una de las fases del proceso.",
      "d) Se ha identificado la forma de manipularlos adecuadamente.",
      "e) Se ha preparado y protegido al cliente y al profesional de forma correcta.",
      "f) Se ha practicado la técnica de tratamiento de durezas superficiales de forma adecuada.",
      "g) Se han realizado las técnicas de desmaquillado, de limado y acondicionamiento de cutículas adecuadas a las características de las uñas y al servicio solicitado.",
      "h) Se han definido las maniobras de masaje de pies en el orden correcto con destreza y respetando las características de cada cliente.",
      "i) Se han aplicado técnicas de pulido de uñas, utilizando los útiles y productos adecuados, respetando las características de las uñas",
      "j) Se han descrito las técnicas de aplicación de cosméticos decorativos sobre las uñas.",
      "k) Se ha completado el proceso en un tiempo adecuado.",
      "l) Se han realizado preguntas para conocer el grado de satisfacción del cliente.",
      "m) Se han realizado preguntas tipo que permitan conocer el grado de satisfacción del cliente, tanto respecto al resultado del servicio como de la atención personal.",
      "n) Se han aplicado las especificaciones de seguridad y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han identificat els mètodes d'higiene previs a l'aplicació de la tècnica de pedicura.",
      "b) S'han explicat les fases del procés de pedicura i s'han indicat les operacions tècniques que es fan en cadascuna.",
      "c) S'han relacionat els cosmètics utilitzats amb cadascuna de les fases del procés.",
      "d) S'ha identificat la manera de manipular-los adequadament.",
      "e) S'han preparat i protegit correctament el client i el professional.",
      "f) S'ha practicat adequadament la tècnica de tractament de duresses superficials.",
      "g) S'han aplicat les tècniques de desmaquillatge, llimat i condicionament de cutícules adequades a les característiques de les ungles i al servei sol·licitat pel client.",
      "h) S'han definit les maniobres de massatge de peus en l'ordre correcte, amb destresa i respectant les característiques de cada client.",
      "i) S'han aplicat tècniques de polit d'ungles, utilitzant els estris i productes adequats, respectant les característiques de les ungles.",
      "j) S'han descrit les tècniques d'aplicació de cosmètics decoratius sobre les ungles.",
      "k) S'ha completat el procés en un temps adequat.",
      "l) S'han fet preguntes per conèixer el grau de satisfacció del client.",
      "m) S'han fet preguntes tipus que permetin conèixer el grau de satisfacció del client, tant pel que fa al resultat del servei com a l'atenció personal.",
      "n) S'han aplicat les especificacions de seguretat i mediambientals requerides."
    ]
  },
  {
    "id": "RA1",
    "module": "Itinerario personal para la empleabilidad",
    "module_es": "Itinerario personal para la empleabilidad",
    "module_ca": "Itinerari personal per a l'ocupabilitat",
    "moduleCode": "3159",
    "tipoNivel": "FP_BASICA",
    "description": "Desarrolla actividades de autoconocimiento que le permiten orientarse a campos profesionales motivadores en los que puede desplegar todas sus capacidades.",
    "description_es": "Desarrolla actividades de autoconocimiento que le permiten orientarse a campos profesionales motivadores en los que puede desplegar todas sus capacidades.",
    "description_ca": "Desenvolupa activitats d'autoconeixement que li permeten orientar-se a camps professionals motivadors en els quals pot desplegar totes les seves capacitats.",
    "criterios_es": [
      "a) Se han evaluado los propios intereses, motivaciones, habilidades y destrezas en el marco de un proceso de autoconocimiento.",
      "b) Se han determinado las competencias personales y sociales con valor para el empleo.",
      "c) Se ha valorado el concepto de autoestima en el proceso de búsqueda de empleo.",
      "d) Se han identificado las fortalezas, debilidades, amenazas y oportunidades propias para la inserción profesional, así como las estrategias para sacarles el mayor aprovechamiento.",
      "e) Se han identificado expectativas de futuro para la inserción profesional analizando competencias, intereses y destrezas personales."
    ],
    "criterios_ca": [
      "a) S'han avaluat els propis interessos, motivacions, habilitats i destreses en el marc d'un procés d'autoconeixement.",
      "b) S'han determinat les competències personals i socials amb valor per a l'ocupació.",
      "c) S'ha valorat el concepte d'autoestima en el procés de cerca d'ocupació.",
      "d) S'han identificat les fortaleses, febleses, amenaces i oportunitats pròpies per a la inserció professional, així com les estratègies per a treure'ls el major aprofitament.",
      "e) S'han identificat expectatives de futur per a la inserció professional analitzant competències, interessos i destreses personals."
    ]
  },
  {
    "id": "RA2",
    "module": "Itinerario personal para la empleabilidad",
    "module_es": "Itinerario personal para la empleabilidad",
    "module_ca": "Itinerari personal per a l'ocupabilitat",
    "moduleCode": "3159",
    "tipoNivel": "FP_BASICA",
    "description": "Desarrolla habilidades sociales concretas que se han demostrado como fundamentales a la hora de encontrar un empleo y mantenerlo.",
    "description_es": "Desarrolla habilidades sociales concretas que se han demostrado como fundamentales a la hora de encontrar un empleo y mantenerlo.",
    "description_ca": "Desenvolupa habilitats socials concretes que s'han demostrat com a fonamentals a l'hora de trobar una ocupació i mantenir-lo.",
    "criterios_es": [
      "a) Se ha valorado la importancia de las competencias personales y sociales en la empleabilidad.",
      "b) Se han aplicado estrategias para canalizar las emociones de manera asertiva en las relaciones con otras personas, diferenciándolas de conductas agresivas y/o pasivas.",
      "c) Se han puesto en práctica técnicas de presentación, orales y escritas, para una comunicación efectiva y afectiva valorando su importancia como recurso personal para la empleabilidad.",
      "d) Se han identificado los beneficios del trabajo en equipo, así como las diferentes formas de llevarlo a cabo.",
      "e) Se ha reaccionado de forma flexible y positiva ante conflictos y situaciones nuevas, aprovechando las oportunidades y gestionando las dificultades haciendo uso de estrategias relacionadas con la inteligencia emocional."
    ],
    "criterios_ca": [
      "a) S'ha valorat la importància de les competències personals i socials en l'ocupabilitat.",
      "b) S'han aplicat estratègies per a canalitzar les emocions de manera assertiva en les relacions amb altres persones, diferenciant-les de conductes agressives i/o passives.",
      "c) S'han posat en pràctica tècniques de presentació, orals i escrites, per a una comunicació efectiva i afectiva valorant la seva importància com a recurs personal per a l'ocupabilitat.",
      "d) S'han identificat els beneficis del treball en equip, així com les diferents maneres de dur-ho a terme.",
      "e) S'ha reaccionat de manera flexible i positiva davant conflictes i situacions noves, aprofitant les oportunitats i gestionant les dificultats fent ús d'estratègies relacionades amb la intel·ligència emocional."
    ]
  },
  {
    "id": "RA3",
    "module": "Itinerario personal para la empleabilidad",
    "module_es": "Itinerario personal para la empleabilidad",
    "module_ca": "Itinerari personal per a l'ocupabilitat",
    "moduleCode": "3159",
    "tipoNivel": "FP_BASICA",
    "description": "Accede a la información de los posibles itinerarios académicos y/o profesionales que tiene a su alcance a través de la investigación y la reflexión libre de estereotipos vocacionales.",
    "description_es": "Accede a la información de los posibles itinerarios académicos y/o profesionales que tiene a su alcance a través de la investigación y la reflexión libre de estereotipos vocacionales.",
    "description_ca": "Accedeix a la informació dels possibles itineraris acadèmics i/o professionals que té al seu abast a través de la recerca i la reflexió lliure d'estereotips vocacionals.",
    "criterios_es": [
      "a) Se ha determinado la realidad del entorno sociolaboral actual.",
      "b) Se han identificado los itinerarios académicos y profesionales afines a sus intereses y se han valorado las opciones que mejor se ajustan a sus perfiles profesionales y sus preferencias.",
      "c) Se ha valorado la importancia de la formación permanente como factor clave para el empleo y la adaptación al cambio."
    ],
    "criterios_ca": [
      "a) S'ha determinat la realitat de l'entorn sociolaboral actual.",
      "b) S'han identificat els itineraris acadèmics i professionals afins als seus interessos i s'han valorat les opcions que millor s'ajusten als seus perfils professionals i les seves preferències.",
      "c) S'ha valorat la importància de la formació permanent com a factor clau per a l'ocupació i l'adaptació al canvi."
    ]
  },
  {
    "id": "RA4",
    "module": "Itinerario personal para la empleabilidad",
    "module_es": "Itinerario personal para la empleabilidad",
    "module_ca": "Itinerari personal per a l'ocupabilitat",
    "moduleCode": "3159",
    "tipoNivel": "FP_BASICA",
    "description": "Pone en marcha un itinerario propio analizando las distintas opciones educativas y profesionales, valorando las ventajas e inconvenientes de cada una de ellas y examinando aquellas que mejor se ajustan a sus posibilidades y preferencias.",
    "description_es": "Pone en marcha un itinerario propio analizando las distintas opciones educativas y profesionales, valorando las ventajas e inconvenientes de cada una de ellas y examinando aquellas que mejor se ajustan a sus posibilidades y preferencias.",
    "description_ca": "Posa en marxa un itinerari propi analitzant les diferents opcions educatives i professionals, valorant els avantatges i inconvenients de cadascuna d'elles i examinant aquelles que millor s'ajusten a les seves possibilitats i preferències.",
    "criterios_es": [
      "a) Se han valorado las ventajas e inconvenientes de cada una de las opciones posibles.",
      "b) Se han analizado y seleccionado las opciones que más se ajustan a sus perfiles profesionales.",
      "c) Se ha realizado un proceso de toma de decisiones identificando el itinerario académico y profesional personal, a partir de sus preferencias profesionales, intereses y metas en el marco de un proyecto profesional."
    ],
    "criterios_ca": [
      "a) S'han valorat els avantatges i inconvenients de cadascuna de les opcions possibles.",
      "b) S'han analitzat i seleccionat les opcions que més s'ajusten als seus perfils professionals.",
      "c) S'ha realitzat un procés de presa de decisions identificant l'itinerari acadèmic i professional personal, a partir de les seves preferències professionals, interessos i metes en el marc d'un projecte professional."
    ]
  },
  {
    "id": "RA5",
    "module": "Itinerario personal para la empleabilidad",
    "module_es": "Itinerario personal para la empleabilidad",
    "module_ca": "Itinerari personal per a l'ocupabilitat",
    "moduleCode": "3159",
    "tipoNivel": "FP_BASICA",
    "description": "Conoce las estrategias de acceso al mercado de trabajo por cuenta ajena y utiliza las herramientas necesarias para el proceso de inserción laboral.",
    "description_es": "Conoce las estrategias de acceso al mercado de trabajo por cuenta ajena y utiliza las herramientas necesarias para el proceso de inserción laboral.",
    "description_ca": "Coneix les estratègies d'accés al mercat de treball per compte d'altri i utilitza les eines necessàries per al procés d'inserció laboral.",
    "criterios_es": [
      "a) Se ha analizado la búsqueda de empleo como un proceso.",
      "b) Se han identificado las diferentes fuentes de información de acceso al empleo.",
      "c) Se han analizado las distintas técnicas utilizadas para la búsqueda de empleo por cuenta ajena.",
      "d) Se han puesto en práctica las diferentes herramientas que permitan una búsqueda de empleo óptima."
    ],
    "criterios_ca": [
      "a) S'ha analitzat la cerca d'ocupació com un procés.",
      "b) S'han identificat les diferents fonts d'informació d'accés a l'ocupació.",
      "c) S'han analitzat les diferents tècniques utilitzades per a la cerca d'ocupació per compte d'altri.",
      "d) S'han posat en pràctica les diferents eines que permetin una cerca d'ocupació òptima."
    ]
  },
  {
    "id": "CE1",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Identificar y comprender la naturaleza histórica y geográfica de las relaciones sociales, las actividades económicas, las manifestaciones culturales y los bienes patrimoniales, analizando sus orígenes y evolución e identificando las causas y consecuencias de los cambios producidos, los problemas actuales y sus valores presentes, para realizar propuestas que contribuyan al bienestar futuro y al desarrollo sostenible de la sociedad.",
    "description_es": "Identificar y comprender la naturaleza histórica y geográfica de las relaciones sociales, las actividades económicas, las manifestaciones culturales y los bienes patrimoniales, analizando sus orígenes y evolución e identificando las causas y consecuencias de los cambios producidos, los problemas actuales y sus valores presentes, para realizar propuestas que contribuyan al bienestar futuro y al desarrollo sostenible de la sociedad.",
    "description_ca": "Identificar i comprendre la naturalesa històrica i geogràfica de les relacions socials, les activitats econòmiques, les manifestacions culturals i els béns patrimonials, analitzant-ne els orígens i l'evolució i identificant les causes i les conseqüències dels canvis produïts, els problemes actuals i els seus valors presents per fer propostes que contribueixin al benestar futur i al desenvolupament sostenible de la societat.",
    "criterios_es": [
      "1.1 Analizar e interpretar el entorno desde una perspectiva sistémica e integradora, a través de conceptos y procedimientos geográficos, identificando sus principales elementos y las interrelaciones existentes, valorando el grado de sostenibilidad y equilibrio de los espacios a partir de actitudes de defensa, protección, conservación y mejora del entorno (natural, rural y urbano).",
      "1.2 Relacionar las culturas y civilizaciones que se han desarrollado a lo largo de la historia con las distintas identidades colectivas que se han construido hasta la actualidad, explicando y valorando la realidad multicultural generada a lo largo del tiempo y analizando las situaciones y los problemas del presente.",
      "1.3 Valorar, proteger y conservar el patrimonio histórico-artístico, cultural y natural, como fundamento de nuestra identidad colectiva y como un recurso esencial para el disfrute y el desarrollo de los pueblos, realizando propuestas que contribuyan a su conservación y a un desarrollo ecosocial sostenible."
    ],
    "criterios_ca": [
      "1.1 Analitzar i interpretar l'entorn des d'una perspectiva sistèmica i integradora, a través de conceptes i procediments geogràfics, identificar els elements principals i les interrelacions existents, valorar el grau de sostenibilitat i equilibri dels espais a partir d'actituds de defensa, protecció, conservació i millora de l’entorn (natural, rural i urbà).",
      "1.2 Relacionar les cultures i les civilitzacions que s'han desenvolupat en la història amb les identitats col·lectives diferents que s'han construït fins a l'actualitat, explicar i valorar la realitat multicultural generada al llarg del temps i analitzar les situacions i els problemes del present.",
      "1.3 Valorar, protegir i conservar el patrimoni historicoartístic, cultural i natural com a fonament de la identitat col·lectiva i com un recurs essencial per al gaudi i el desenvolupament dels pobles, fent propostes que contribueixin a la seva conservació i a un desenvolupament ecosocial sostenible."
    ]
  },
  {
    "id": "CE2",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Comprender los orígenes y evolución de los procesos de integración europea y su relevancia en el presente y futuro tanto de la sociedad española como de la sociedad balear y de las comunidades locales, destacando la contribución del Estado, sus instituciones y las entidades sociales a la paz, a la seguridad integral ciudadana, a la cooperación internacional, al desarrollo sostenible frente al cambio climático y a la ciudadanía global, para contribuir a crear un mundo más seguro, solidario, sostenible y justo.",
    "description_es": "Comprender los orígenes y evolución de los procesos de integración europea y su relevancia en el presente y futuro tanto de la sociedad española como de la sociedad balear y de las comunidades locales, destacando la contribución del Estado, sus instituciones y las entidades sociales a la paz, a la seguridad integral ciudadana, a la cooperación internacional, al desarrollo sostenible frente al cambio climático y a la ciudadanía global, para contribuir a crear un mundo más seguro, solidario, sostenible y justo.",
    "description_ca": "Comprendre els orígens i l'evolució dels processos d'integració europea i la seva rellevància en el present i en el futur, tant de la societat espanyola com de la societat balear i de les comunitats locals, destacant la contribució de l'Estat, les institucions i les entitats socials a la pau, a la seguretat integral ciutadana, a la cooperació internacional, al desenvolupament sostenible davant del canvi climàtic, a la ciutadania global, per contribuir a crear un món més segur, solidari, sostenible i just.",
    "criterios_es": [
      "2.1 Explicar el proceso de unificación del espacio europeo y su relevancia en la construcción tanto de la sociedad española como de la balear, analizando su evolución y argumentando su influencia en la política nacional y autonómica.",
      "2.2 Identificar y valorar las principales instituciones europeas, analizando sus principios rectores, sus normas de funcionamiento y sus funciones, juzgando su papel en los conflictos internacionales y reconociendo su contribución a la paz y a la cooperación internacional, al desarrollo sostenible, a la lucha contra el cambio el climático y a la ciudadanía global.",
      "2.3 Interpretar desde la perspectiva del desarrollo sostenible y la ciudadanía global los principales desafíos del mundo actual, expresando la importancia de implicarse en la búsqueda de soluciones y en el modo de concretarlos desde la propia capacidad de acción, valorando la contribución de programas y misiones dirigidos por los Estados, los organismos internacionales y las asociaciones civiles para el logro de la paz, la seguridad integral, la convivencia social y la cooperación entre los pueblos."
    ],
    "criterios_ca": [
      "2.1 Explicar el procés d'unificació de l'espai europeu i la rellevància que té en la construcció tant de la societat espanyola com de la balear, analitzar-ne l'evolució i argumentar-ne la influència en la política nacional i autonòmica.",
      "2.2 Identificar i valorar les principals institucions europees, analitzar-ne els principis rectors, les normes de funcionament i les funcions, jutjar-ne el paper en els conflictes internacionals i reconèixer la contribució que fan a la pau i a la cooperació internacional, al desenvolupament sostenible, a la lluita contra el canvi el climàtic i a la ciutadania global.",
      "2.3 Interpretar des de la perspectiva del desenvolupament sostenible i la ciutadania global els principals desafiaments del món actual, expressar la importància d'implicar-se en la recerca de solucions i en la manera de concretar-los des de la capacitat d'acció pròpia, valorar la contribució de programes i missions dirigits pels estats, els organismes internacionals i les associacions civils per aconseguir la pau, la seguretat integral, la convivència social i la cooperació entre els pobles."
    ]
  },
  {
    "id": "CE3",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Reconocer los principios, valores, derechos y deberes de nuestro sistema democrático y constitucional, analizando de forma crítica los planteamientos históricos y geográficos, las instituciones y las diferentes organizaciones políticas y económicas en que se enmarcan y manifiestan, para adecuar el comportamiento propio al cumplimiento de dichos principios, valores, derechos y deberes.",
    "description_es": "Reconocer los principios, valores, derechos y deberes de nuestro sistema democrático y constitucional, analizando de forma crítica los planteamientos históricos y geográficos, las instituciones y las diferentes organizaciones políticas y económicas en que se enmarcan y manifiestan, para adecuar el comportamiento propio al cumplimiento de dichos principios, valores, derechos y deberes.",
    "description_ca": "Reconèixer els principis, valors, drets i deures del nostre sistema democràtic i constitucional, mitjançant l’anàlisi crítica dels plantejaments històrics i geogràfics, de les institucions i les diferents organitzacions polítiques i econòmiques en què s'emmarquen i manifesten, per adequar el comportament propi al compliment d’aquests principis, valors, drets i deures.",
    "criterios_es": [
      "3.1 Identificar y analizar los principios, valores, deberes y derechos fundamentales de la Constitución española, del Estatuto de Autonomía de las Illes Balears, el sistema democrático y sus instituciones y organizaciones sociales, políticas y económicas, explicando su función como mecanismos que regulan la convivencia y la vida en comunidad.",
      "3.2 Reconocer y explicar los mecanismos que han regulado la convivencia y la vida en común a lo largo de la historia, desde el origen de la sociedad a las distintas civilizaciones que se han ido sucediendo, señalando los principales modelos de organización social y política que se han ido gestando.",
      "3.3 Adecuar el comportamiento propio al cumplimiento de los principios, valores, derechos y deberes democráticos y constitucionales, identificando los motivos y argumentos que sustentan su validez y rechazando todo tipo de discriminación, especialmente aquella que se da por motivos socio-económicos, de género, orientación sexual o pertenencia a minorías etnoculturales."
    ],
    "criterios_ca": [
      "3.1 Identificar i analitzar els principis, valors, deures i drets fonamentals de la Constitució espanyola, de l’Estatut d’autonomia de les Illes Balears, el sistema democràtic i les seves institucions i organitzacions socials, polítiques i econòmiques, i explicar-ne la funció com a mecanismes que regulen la convivència i la vida en comunitat.",
      "3.2 Reconèixer i explicar els mecanismes que han regulat la convivència i la vida en comú al llarg de la història, des de l'origen de la societat a les diferents civilitzacions que s'han succeït, assenyalant els principals models d'organització social i política que han gestat.",
      "3.3 Adequar el comportament propi al compliment dels principis, valors, drets i deures democràtics i constitucionals, identificar els motius i arguments que sustenten la validesa i rebutjar tota mena de discriminació, especialment la que es produeix per motius socioeconòmics, de gènere, d’orientació sexual o de pertinença a minories ètniques i culturals."
    ]
  },
  {
    "id": "CE4",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Buscar y seleccionar información de manera progresivamente autónoma a partir de diferentes fuentes, evaluando su fiabilidad y pertinencia en función de las necesidades detectadas y evitando los riesgos de manipulación y desinformación, para integrarla como conocimiento y compartirla desde un punto de vista crítico, personal y respetuoso con la propiedad intelectual.",
    "description_es": "Buscar y seleccionar información de manera progresivamente autónoma a partir de diferentes fuentes, evaluando su fiabilidad y pertinencia en función de las necesidades detectadas y evitando los riesgos de manipulación y desinformación, para integrarla como conocimiento y compartirla desde un punto de vista crítico, personal y respetuoso con la propiedad intelectual.",
    "description_ca": "Cercar i seleccionar informació de manera progressivament autònoma a partir de fonts diverses, mitjançant l’avaluació de la fiabilitat i de la pertinència en funció de les necessitats detectades i evitar els riscos de manipulació i desinformació, per integrar-la com a coneixement i compartir-la des d'un punt de vista crític, personal i respectuós amb la propietat intel·lectual.",
    "criterios_es": [
      "4.1 Aplicar estrategias tanto analógicas como digitales de búsqueda, selección y organización de información, evaluando su fiabilidad y su pertinencia en función del objetivo perseguido y evitando los riesgos de manipulación y desinformación.",
      "4.2 Elaborar contenidos propios a partir de diferentes fuentes de manera progresivamente autónoma, respetando los principios de propiedad intelectual y citando las fuentes consultadas."
    ],
    "criterios_ca": [
      "4.1 Aplicar estratègies tant analògiques com digitals de cerca, selecció i organització d'informació, avaluant-ne la fiabilitat i la pertinència en funció de l'objectiu a aconseguir, evitant els riscos de manipulació i desinformació.",
      "4.2 Elaborar continguts propis a partir de diferents fonts de manera progressivament autònoma, respectant els principis de propietat intel·lectual i esmentant les fonts consultades."
    ]
  },
  {
    "id": "CE5",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Comunicar en lengua castellana y en lengua catalana de manera cooperativa y respetuosa, atendiendo a las convenciones propias de los diferentes géneros discursivos y a su adecuación a diferentes ámbitos y contextos, para dar respuesta a necesidades concretas.",
    "description_es": "Comunicar en lengua castellana y en lengua catalana de manera cooperativa y respetuosa, atendiendo a las convenciones propias de los diferentes géneros discursivos y a su adecuación a diferentes ámbitos y contextos, para dar respuesta a necesidades concretas.",
    "description_ca": "Comunicar-se en llengua castellana i en llengua catalana de manera cooperativa i respectuosa, tenint en compte les convencions pròpies dels diferents gèneres discursius i la seva adequació a diversos àmbits i contextos, per respondre a necessitats concretes.",
    "criterios_es": [
      "5.1 Comprender e interpretar el sentido global, la estructura, la información más relevante en función de las necesidades comunicativas y la intención del emisor en textos orales, escritos y multimodales de diferentes ámbitos, evaluando su calidad, su fiabilidad y la idoneidad del canal utilizado.",
      "5.2 Realizar exposiciones orales con diferente grado de planificación sobre temas de interés personal, ecosocial y profesional, ajustándose a las convenciones propias de los diversos géneros discursivos, con fluidez, coherencia y el registro adecuado, en diferentes soportes y utilizando de manera eficaz recursos verbales y no verbales.",
      "5.3 Planificar la redacción de textos escritos y multimodales atendiendo a la situación comunicativa, destinatario, propósito y canal; redactar borradores y revisarlos, y presentar un texto final coherente, cohesionado y con el registro adecuado, con precisión léxica y corrección ortográfica y gramatical.",
      "5.4 Participar de manera activa y adecuada en interacciones orales informales, en el trabajo en equipo y en situaciones orales formales de carácter dialogado, con actitudes de escucha activa y estrategias de cooperación conversacional y cortesía lingüística."
    ],
    "criterios_ca": [
      "5.1 Comprendre i interpretar el sentit global, l'estructura, la informació més rellevant en funció de les necessitats comunicatives i la intenció de l'emissor en textos orals, escrits i multimodals de diferents àmbits i avaluar-ne la qualitat, la fiabilitat i la idoneïtat del canal utilitzat.",
      "5.2 Fer exposicions orals amb diferent grau de planificació sobre temes d'interès personal, ecosocial i professional, ajustar-se a les convencions pròpies dels diversos gèneres discursius, amb fluïdesa, coherència i registre adequat, en diferents suports i utilitzant de manera eficaç recursos verbals i no verbals.",
      "5.3 Planificar la redacció de textos escrits i multimodals segons la situació comunicativa, el destinatari, el propòsit i el canal; redactar esborranys i revisar-los, i presentar un text final coherent, cohesionat i amb el registre adequat, amb precisió lèxica i correcció ortogràfica i gramatical.",
      "5.4 Participar de manera activa i adequada en interaccions orals informals, en el treball en equip i en situacions orals formals de caràcter dialogat, amb actituds d’escolta activa i estratègies de cooperació conversacional i cortesia lingüística."
    ]
  },
  {
    "id": "CE6",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Interpretar y valorar obras diversas como fuente de placer y conocimiento, compartiendo experiencias de lectura, para construir la propia identidad lectora y disfrutar de la dimensión social de esta actividad.",
    "description_es": "Interpretar y valorar obras diversas como fuente de placer y conocimiento, compartiendo experiencias de lectura, para construir la propia identidad lectora y disfrutar de la dimensión social de esta actividad.",
    "description_ca": "Interpretar i valorar obres diverses com a font de plaer i coneixement i compartir experiències de lectura, per construir la identitat lectora pròpia i gaudir de la dimensió social d'aquesta activitat.",
    "criterios_es": [
      "6.1 Leer de manera autónoma textos seleccionados en función de los propios gustos, intereses y necesidades, dejando constancia del progreso del propio itinerario lector y cultural y explicando los criterios de selección de las lecturas.",
      "6.2 Compartir la experiencia de lectura literaria en soportes diversos relacionando el texto leído con otras manifestaciones artísticas en función de temas, estructuras, lenguaje y valores éticos y estéticos."
    ],
    "criterios_ca": [
      "6.1 Llegir de manera autònoma textos seleccionats en funció dels gustos, interessos i necessitats propis, deixar constància del progrés del propi itinerari lector i cultural i explicar els criteris de selecció de les lectures.",
      "6.2 Compartir l’experiència de lectura literària en suports diversos i relacionar el text llegit amb altres manifestacions artístiques en funció de temes, estructures, llenguatge i valors ètics i estètics."
    ]
  },
  {
    "id": "CE7",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Comunicarse en lengua extranjera, con creciente autonomía, empleando recursos analógicos y digitales y usando estrategias básicas de comprensión, producción e interacción, para responder de manera creativa y eficaz a necesidades personales y profesionales concretas.",
    "description_es": "Comunicarse en lengua extranjera, con creciente autonomía, empleando recursos analógicos y digitales y usando estrategias básicas de comprensión, producción e interacción, para responder de manera creativa y eficaz a necesidades personales y profesionales concretas.",
    "description_ca": "Comunicar-se en llengua estrangera, amb autonomia creixent, amb l’ús recursos analògics i digitals i d’estratègies bàsiques de comprensió, producció i interacció, per respondre de manera creativa i eficaç a necessitats personals i professionals concretes.",
    "criterios_es": [
      "7.1 Interpretar el sentido global y la información específica y explícita de textos orales, escritos y multimodales breves y sencillos sobre temas frecuentes y cotidianos, de relevancia personal o propios del ámbito profesional de especialización, expresados de forma clara y en el registro estándar de la lengua extranjera.",
      "7.2 Producir en lengua extranjera textos orales, escritos y multimodales, breves, sencillos, estructurados, comprensibles y adecuados a la situación comunicativa, siguiendo pautas establecidas y haciendo uso de herramientas y recursos analógicos y digitales.",
      "7.3 Participar en situaciones y acciones guiadas síncronas y asíncronas, breves y sencillas, en lengua extranjera, sobre temas cotidianos, de relevancia personal o próximos al ámbito profesional del ciclo, mostrando empatía y respeto por la cortesía lingüística y la etiqueta digital, así como por las diferentes necesidades, ideas, inquietudes, iniciativas y motivaciones de interlocutores e interlocutoras.",
      "7.4 Utilizar, de forma guiada y en entornos personales y de la propia especialidad profesional, estrategias adecuadas para iniciar, mantener y terminar la comunicación, tomar y ceder la palabra, solicitar y formular aclaraciones y explicaciones en lengua extranjera."
    ],
    "criterios_ca": [
      "7.1 Interpretar el sentit global i la informació específica i explícita de textos orals, escrits i multimodals breus i senzills sobre temes freqüents i quotidians, de rellevància personal o propis de l'àmbit professional d'especialització, expressats de forma clara i en el registre estàndard de la llengua estrangera.",
      "7.2 Produir en llengua estrangera textos orals, escrits i multimodals, breus, senzills, estructurats, comprensibles i adequats a la situació comunicativa, segons pautes establertes, fent ús de les eines i els recursos analògics i digitals.",
      "7.3 Participar en situacions i accions guiades síncrones i asíncrones, breus i senzilles, en llengua estrangera, sobre temes quotidians, de rellevància personal o propers a l'àmbit professional del cicle, mostrar empatia i respecte per la cortesia lingüística i l'etiqueta digital, així com per diferents necessitats, idees, inquietuds, iniciatives i motivacions d'interlocutors i interlocutores.",
      "7.4 Utilitzar, de manera guiada i en entorns personals i de la pròpia especialitat professional, estratègies adequades per iniciar, mantenir i acabar la comunicació, parlar i cedir la paraula, sol·licitar i formular aclariments i explicacions en llengua estrangera."
    ]
  },
  {
    "id": "CE8",
    "module": "Comunicación y Ciencias Sociales I",
    "module_es": "Comunicación y Ciencias Sociales I",
    "module_ca": "Comunicació i Ciències Socials I",
    "moduleCode": "3161",
    "tipoNivel": "FP_BASICA",
    "description": "Valorar críticamente y adecuarse a la diversidad lingüística y cultural, usando los repertorios personales y tomando conciencia de las estrategias y conocimientos propios, para gestionar de forma empática y respetuosa situaciones interculturales.",
    "description_es": "Valorar críticamente y adecuarse a la diversidad lingüística y cultural, usando los repertorios personales y tomando conciencia de las estrategias y conocimientos propios, para gestionar de forma empática y respetuosa situaciones interculturales.",
    "description_ca": "Valorar críticament i adequar-se a la diversitat lingüística i cultural, amb l’ús dels repertoris personals i prenent consciència de les estratègies i coneixements propis, per gestionar de manera empàtica i respectuosa situacions interculturals.",
    "criterios_es": [
      "8.1 Mejorar la capacidad de comunicarse en lengua extranjera utilizando los conocimientos y estrategias del repertorio lingüístico y cultural propio, con apoyo de otras y otros participantes y de soportes analógicos y digitales.",
      "8.2 Aceptar y valorar la diversidad lingüística y cultural como fuente de enriquecimiento personal y profesional, identificando los elementos culturales y lingüísticos que fomentan el respeto, la sostenibilidad y la democracia."
    ],
    "criterios_ca": [
      "8.1 Millorar la capacitat de comunicar-se en llengua estrangera utilitzant els coneixements i les estratègies del repertori lingüístic i cultural propi, amb el suport d'altres participants i l’ajuda de recursos analògics i digitals.",
      "8.2 Acceptar i valorar la diversitat lingüística i cultural com a font d'enriquiment personal i professional, mitjançant la identificació dels elements culturals i lingüístics que fomenten el respecte, la sostenibilitat i la democràcia."
    ]
  },
  {
    "id": "CE1",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Reconocer los motivos por los que ocurren los principales fenómenos naturales, a partir de situaciones cotidianas, y explicarlos en términos de las leyes y teorías científicas adecuadas, para poner en valor la contribución de la ciencia a la sociedad.",
    "description_es": "Reconocer los motivos por los que ocurren los principales fenómenos naturales, a partir de situaciones cotidianas, y explicarlos en términos de las leyes y teorías científicas adecuadas, para poner en valor la contribución de la ciencia a la sociedad.",
    "description_ca": "Reconèixer els motius pels quals ocorren els principals fenòmens naturals, a partir de situacions quotidianes, i explicar-los en termes de les lleis i teories científiques adequades, per posar en valor la contribució de la ciència a la societat.",
    "criterios_es": [
      "1.1 Explicar los fenómenos naturales más relevantes en términos de teorías, leyes y principios científicos adecuados como estrategia en la toma de decisiones fundamentadas.",
      "1.2 Justificar la contribución de la ciencia a la sociedad, y la labor de los hombres y mujeres dedicados a su desarrollo, entendiendo la investigación como una labor colectiva en constante evolución fruto de la interacción entre la ciencia, la tecnología, la sociedad y el medio ambiente."
    ],
    "criterios_ca": [
      "1.1 Explicar els fenòmens naturals més rellevants en termes de teories, lleis i principis científics adequats com a estratègia en la presa de decisions fonamentades.",
      "1.2 Justificar la contribució de la ciència a la societat i la tasca dels homes i dones dedicats al seu desenvolupament, entenent la investigació com una tasca col·lectiva en constant evolució fruit de la interacció entre la ciència, la tecnologia, la societat i el medi ambient."
    ]
  },
  {
    "id": "CE2",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Interpretar y modelizar en términos científicos problemas y situaciones de la vida cotidiana y profesional, aplicando diferentes estrategias, formas de razonamiento, herramientas tecnológicas y el pensamiento computacional, para hallar y analizar soluciones comprobando su validez.",
    "description_es": "Interpretar y modelizar en términos científicos problemas y situaciones de la vida cotidiana y profesional, aplicando diferentes estrategias, formas de razonamiento, herramientas tecnológicas y el pensamiento computacional, para hallar y analizar soluciones comprobando su validez.",
    "description_ca": "Interpretar i modelitzar en termes científics problemes i situacions de la vida quotidiana i professional i aplicar-hi diferents estratègies, formes de raonament, eines tecnològiques i el pensament computacional, per analitzar-los i trobar-hi solucions, comprovant-ne la validesa.",
    "criterios_es": [
      "2.1 Elaborar representaciones que ayuden en la búsqueda de estrategias de resolución de una situación problematizada, organizando los datos y comprendiendo las preguntas formuladas.",
      "2.2 Hallar las soluciones de un problema utilizando los datos e información aportados, los propios conocimientos, y las estrategias y herramientas apropiadas.",
      "2.3 Comprobar la corrección de las soluciones de un problema y su coherencia en el contexto planteado.",
      "2.4 Emplear herramientas tecnológicas adecuadas en la representación, la resolución de problemas y la comprobación de las soluciones."
    ],
    "criterios_ca": [
      "2.1 Elaborar representacions que ajudin a la recerca d'estratègies de resolució d'una situació problematitzada, mitjançant l’organització de les dades i la comprensió de les preguntes formulades.",
      "2.2 Trobar les solucions d'un problema amb les dades i la informació aportades, els coneixements propis i les estratègies i les eines adequades.",
      "2.3 Comprovar la correcció de les solucions d'un problema i la coherència en el context plantejat.",
      "2.4 Emprar eines tecnològiques adequades en la representació, la resolució de problemes i la comprovació de les solucions."
    ]
  },
  {
    "id": "CE3",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Utilizar los métodos científicos, haciendo indagaciones y llevando a cabo proyectos, para desarrollar los razonamientos propios del pensamiento científico y mejorar las destrezas en el uso de las metodologías científicas.",
    "description_es": "Utilizar los métodos científicos, haciendo indagaciones y llevando a cabo proyectos, para desarrollar los razonamientos propios del pensamiento científico y mejorar las destrezas en el uso de las metodologías científicas.",
    "description_ca": "Utilitzar els mètodes científics, indagar i dur a terme projectes per desenvolupar els raonaments propis del pensament científic i millorar les destreses en l’ús de les metodologies científiques.",
    "criterios_es": [
      "3.1 Plantear preguntas e hipótesis que puedan ser respondidas o contrastadas utilizando los métodos científicos, la observación, la información y el razonamiento, explicando fenómenos naturales y realizando predicciones sobre estos.",
      "3.2 Diseñar y realizar experimentos y obtener datos cuantitativos y cualitativos sobre fenómenos naturales en el medio natural y en el laboratorio, utilizando con corrección los instrumentos, herramientas o técnicas adecuadas a la hora de obtener resultados claros que respondan a cuestiones concretas o que contrasten la veracidad de una hipótesis.",
      "3.3 Interpretar los resultados obtenidos en proyectos de investigación, utilizando el razonamiento y, cuando sea necesario, herramientas matemáticas y tecnológicas."
    ],
    "criterios_ca": [
      "3.1 Plantejar preguntes i hipòtesis que puguin ser respostes o contrastades utilitzant els mètodes científics, l'observació, la informació i el raonament, explicant fenòmens naturals i fent prediccions sobre aquests.",
      "3.2 Dissenyar i fer experiments i obtenir dades quantitatives i qualitatives sobre fenòmens naturals al medi natural i al laboratori, utilitzar amb correcció els instruments, eines o tècniques adequades a l'hora d'obtenir resultats clars que responguin a qüestions concretes o que contrastin la veracitat d’una hipòtesi.",
      "3.3 Interpretar els resultats obtinguts en projectes de recerca, mitjançant el raonament i, quan calgui, amb eines matemàtiques i tecnològiques."
    ]
  },
  {
    "id": "CE4",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Analizar los efectos de determinadas acciones cotidianas o del entorno profesional sobre la salud, el medio natural y social, basándose en fundamentos científicos y con especial atención al entorno de las Illes Balears, para valorar la importancia de los hábitos que mejoran la salud individual y colectiva, evitan o minimizan los impactos medioambientales negativos y son compatibles con un desarrollo sostenible.",
    "description_es": "Analizar los efectos de determinadas acciones cotidianas o del entorno profesional sobre la salud, el medio natural y social, basándose en fundamentos científicos y con especial atención al entorno de las Illes Balears, para valorar la importancia de los hábitos que mejoran la salud individual y colectiva, evitan o minimizan los impactos medioambientales negativos y son compatibles con un desarrollo sostenible.",
    "description_ca": "Analitzar els efectes de determinades accions quotidianes o de l'entorn professional sobre la salut, el medi natural i social, basant-se en fonaments científics i amb especial atenció a l’entorn de les Illes Balears, per valorar la importància dels hàbits que milloren la salut individual i col·lectiva, eviten o minimitzen els impactes mediambientals negatius i són compatibles amb un desenvolupament sostenible.",
    "criterios_es": [
      "4.1 Evaluar los efectos de determinadas acciones individuales sobre el organismo y el medio natural, proponiendo hábitos saludables y sostenibles basados en los conocimientos adquiridos y la información disponible.",
      "4.2 Relacionar con fundamentos científicos la preservación de la biodiversidad, la conservación del medio ambiente y la protección de los seres vivos con el desarrollo sostenible y la calidad de vida, dentro del entorno de las Illes Balears."
    ],
    "criterios_ca": [
      "4.1 Avaluar els efectes de determinades accions individuals sobre l'organisme i el medi natural i proposar hàbits saludables i sostenibles basats en els coneixements adquirits i la informació disponible.",
      "4.2 Relacionar amb fonaments científics, la preservació de la biodiversitat, la conservació del medi ambient i la protecció dels éssers vius amb el desenvolupament sostenible i la qualitat de vida, dins l’entorn de les Illes Balears."
    ]
  },
  {
    "id": "CE5",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Interpretar y transmitir información y datos científicos, contrastando previamente su veracidad y utilizando lenguaje verbal o gráfico apropiado, para adquirir y afianzar conocimientos del entorno natural, social y profesional.",
    "description_es": "Interpretar y transmitir información y datos científicos, contrastando previamente su veracidad y utilizando lenguaje verbal o gráfico apropiado, para adquirir y afianzar conocimientos del entorno natural, social y profesional.",
    "description_ca": "Interpretar i transmetre informació i dades científiques, contrastar-ne prèviament la veracitat i utilitzar llenguatge verbal o gràfic apropiat, per adquirir i consolidar coneixements de l'entorn natural, social i professional.",
    "criterios_es": [
      "5.1 Organizar y comunicar información científica y matemática de forma clara y rigurosa de manera verbal, gráfica, numérica, etc. utilizando el formato más adecuado.",
      "5.2 Analizar e interpretar información científica y matemática presente en la vida cotidiana manteniendo una actitud crítica.",
      "5.3 Emplear y citar de forma adecuada fuentes fiables, seleccionando la información científica relevante en la consulta y creación de contenidos, y mejorando el aprendizaje propio y colectivo."
    ],
    "criterios_ca": [
      "5.1 Organitzar i comunicar informació científica i matemàtica de manera clara i rigorosa verbal, gràfica, numèrica, etc., fent servir el format més adequat.",
      "5.2 Analitzar i interpretar informació científica i matemàtica present a la vida quotidiana amb una actitud crítica.",
      "5.3 Emprar i citar de manera adequada fonts fiables, amb la selecció de la informació científica rellevant en la consulta i la creació de continguts, i millorar l'aprenentatge propi i col·lectiu."
    ]
  },
  {
    "id": "CE6",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Identificar las ciencias y las matemáticas implicadas en contextos diversos, interrelacionando conceptos y procedimientos, para aplicarlos en situaciones de la vida cotidiana y del ámbito profesional correspondiente.",
    "description_es": "Identificar las ciencias y las matemáticas implicadas en contextos diversos, interrelacionando conceptos y procedimientos, para aplicarlos en situaciones de la vida cotidiana y del ámbito profesional correspondiente.",
    "description_ca": "Identificar les ciències i les matemàtiques implicades en contextos diversos, mitjançant la interrelació de conceptes i procediments, per aplicar-los en situacions de la vida quotidiana i de l’àmbit professional corresponent.",
    "criterios_es": [
      "6.1 Aplicar procedimientos propios de las ciencias y las matemáticas en situaciones diversas estableciendo conexiones entre distintas áreas de conocimiento en contextos naturales, sociales y profesionales."
    ],
    "criterios_ca": [
      "6.1 Aplicar procediments propis de les ciències i les matemàtiques en situacions diverses i establir connexions entre diferents àrees de coneixement en contextos naturals, socials i professionals."
    ]
  },
  {
    "id": "CE7",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Desarrollar destrezas personales identificando y gestionando emociones, poniendo en práctica estrategias de aceptación del error como parte del proceso de aprendizaje y adaptándose ante situaciones de incertidumbre, para mejorar la perseverancia en la consecución de objetivos y la valoración del aprendizaje de las ciencias.",
    "description_es": "Desarrollar destrezas personales identificando y gestionando emociones, poniendo en práctica estrategias de aceptación del error como parte del proceso de aprendizaje y adaptándose ante situaciones de incertidumbre, para mejorar la perseverancia en la consecución de objetivos y la valoración del aprendizaje de las ciencias.",
    "description_ca": "Desenvolupar destreses personals per identificar i gestionar emocions, per posar en pràctica estratègies d'acceptació de l'error com a part del procés d'aprenentatge i adaptar-se a les situacions d'incertesa, per millorar la perseverança en la consecució d'objectius i la valoració de l'aprenentatge de les ciències.",
    "criterios_es": [
      "7.1 Mostrar resiliencia ante los retos académicos asumiendo el error como una oportunidad para la mejora y desarrollando un autoconcepto positivo ante las ciencias."
    ],
    "criterios_ca": [
      "7.1 Mostrar resiliència davant els reptes acadèmics, assumir l'error com una oportunitat per a la millora i desenvolupar un autoconcepte positiu davant de les ciències."
    ]
  },
  {
    "id": "CE8",
    "module": "Ciencias Aplicadas I",
    "module_es": "Ciencias Aplicadas I",
    "module_ca": "Ciències Aplicades I",
    "moduleCode": "3163",
    "tipoNivel": "FP_BASICA",
    "description": "Desarrollar destrezas sociales y trabajar de forma colaborativa en equipos diversos con roles asignados que permitan potenciar el crecimiento entre iguales, valorando la importancia de romper los estereotipos de género en la investigación científica, para el emprendimiento personal y laboral.",
    "description_es": "Desarrollar destrezas sociales y trabajar de forma colaborativa en equipos diversos con roles asignados que permitan potenciar el crecimiento entre iguales, valorando la importancia de romper los estereotipos de género en la investigación científica, para el emprendimiento personal y laboral.",
    "description_ca": "Desenvolupar destreses socials i treballar de forma col·laborativa en equips diversos amb rols assignats que permetin potenciar el creixement entre iguals i valorar la importància de trencar els estereotips de gènere a la investigació científica, per a l'emprenedoria personal i laboral.",
    "criterios_es": [
      "8.1 Asumir responsablemente una función concreta dentro de un proyecto científico, utilizando espacios virtuales cuando sea necesario, aportando valor, analizando críticamente las contribuciones del resto del equipo, respetando la diversidad y favoreciendo la inclusión.",
      "8.2 Emprender, de forma guiada y de acuerdo a la metodología adecuada, proyectos científicos colaborativos orientados a la mejora y a la creación de valor en la sociedad."
    ],
    "criterios_ca": [
      "8.1 Assumir responsablement una funció concreta en un projecte científic, amb l’ús d’espais virtuals, quan calgui, aportar valor, analitzar críticament les contribucions de la resta de l'equip, respectar la diversitat i afavorir-ne la inclusió.",
      "8.2 Emprendre, de manera guiada i d'acord amb la metodologia adequada, projectes científics col·laboratius orientats a la millora i a la creació de valor a la societat."
    ]
  },
  {
    "id": "RA1",
    "module": "Atención al cliente",
    "module_es": "Atención al cliente",
    "module_ca": "Atenció al client",
    "moduleCode": "3005",
    "tipoNivel": "FP_BASICA",
    "description": "Atiende a posibles clientes, reconociendo las diferentes técnicas de comunicación.",
    "description_es": "Atiende a posibles clientes, reconociendo las diferentes técnicas de comunicación.",
    "description_ca": "Atén possibles clients, reconeixent les diferents tècniques de comunicació.",
    "criterios_es": [
      "a) Se ha analizado el comportamiento del posible cliente.",
      "b) Se han adaptado adecuadamente la actitud y discurso a la situación de la que se parte.",
      "c) Se ha obtenido la información necesaria del posible cliente.",
      "d) Se ha favorecido la comunicación con el empleo de las técnicas y actitudes apropiadas al desarrollo de la misma.",
      "e) Se ha mantenido una conversación, utilizando las fórmulas, léxico comercial y nexos de comunicación.",
      "f) Se ha dado respuesta a una pregunta de fácil solución, utilizando el léxico comercial adecuado.",
      "g) Se ha expresado un tema prefijado de forma oral delante de un grupo o en una relación de comunicación en la que intervienen dos interlocutores.",
      "h) Se ha mantenido una actitud conciliadora y sensible a los demás, demostrando cordialidad y amabilidad en el trato.",
      "i) Se ha trasmitido información con claridad, de manera ordenada, estructura clara y precisa."
    ],
    "criterios_ca": [
      "a) S'ha analitzat el comportament del possible client.",
      "b) S'han adaptat adequadament l'actitud i el discurs a la situació de partida.",
      "c) S'ha obtingut la informació necessària del possible client.",
      "d) S'ha afavorit la comunicació amb l'ús de les tècniques i les actituds apropiades per desenvolupar-la.",
      "e) S'ha mantingut una conversa utilitzant les fórmules, el lèxic comercial i els nexes de comunicació.",
      "f) S'ha respost una pregunta de fàcil solució utilitzant el lèxic comercial adequat.",
      "g) S'ha exposat oralment un tema prefixat davant d'un grup o en una relació de comunicació en què intervenen dos interlocutors.",
      "h) S'ha mantingut una actitud conciliadora i sensible als altres, demostrant cordialitat i amabilitat en el tracte.",
      "i) S'ha transmès informació amb claredat, de manera ordenada i amb una estructura clara i precisa."
    ]
  },
  {
    "id": "RA2",
    "module": "Atención al cliente",
    "module_es": "Atención al cliente",
    "module_ca": "Atenció al client",
    "moduleCode": "3005",
    "tipoNivel": "FP_BASICA",
    "description": "Comunica al posible cliente las diferentes posibilidades del servicio, justificándolas desde el punto de vista técnico.",
    "description_es": "Comunica al posible cliente las diferentes posibilidades del servicio, justificándolas desde el punto de vista técnico.",
    "description_ca": "Comunica al possible client les diferents possibilitats del servei, justificant-les des del punt de vista tècnic.",
    "criterios_es": [
      "a) Se han analizado las diferentes tipologías de público.",
      "b) Se han diferenciado clientes de proveedores, y éstos del público en general.",
      "c) Se ha reconocido la terminología básica de comunicación comercial.",
      "d) Se ha diferenciado entre información y publicidad.",
      "e) Se han adecuado las respuestas en función de las preguntas del público.",
      "f) Se ha informado al cliente de las características del servicio, especialmente de las calidades esperables.",
      "g) Se ha asesorado al cliente sobre la opción más recomendable, cuando existen varias posibilidades, informándole de las características y acabados previsibles de cada una de ellas.",
      "h) Se ha solicitado al cliente que comunique la elección de la opción elegida."
    ],
    "criterios_ca": [
      "a) S'han analitzat les diferents tipologies de públic.",
      "b) S'han diferenciat els clients dels proveïdors, i aquests, del públic en general.",
      "c) S'ha reconegut la terminologia bàsica de comunicació comercial.",
      "d) S'ha diferenciat entre informació i publicitat.",
      "e) S'han adequat les respostes en funció de les preguntes del públic.",
      "f) S'ha informat el client de les característiques del servei, especialment de les qualitats esperables.",
      "g) S'ha assessorat el client sobre l'opció més recomanable, quan hi ha diverses possibilitats, informant-lo de les característiques i els acabats previsibles de cadascuna.",
      "h) S'ha sol·licitat al client que comuniqui l'elecció de l'opció triada."
    ]
  },
  {
    "id": "RA3",
    "module": "Atención al cliente",
    "module_es": "Atención al cliente",
    "module_ca": "Atenció al client",
    "moduleCode": "3005",
    "tipoNivel": "FP_BASICA",
    "description": "Informa al probable cliente del servicio realizado, justificando las operaciones ejecutadas.",
    "description_es": "Informa al probable cliente del servicio realizado, justificando las operaciones ejecutadas.",
    "description_ca": "Informa el probable client del servei fet, justificant les operacions executades.",
    "criterios_es": [
      "a) Se ha hecho entrega al cliente de los artículos procesados, informando de los servicios realizados en los artículos.",
      "b) Se han transmitido al cliente, de modo oportuno, las operaciones a llevar a cabo en los artículos entregados y los tiempos previstos para ello.",
      "c) Se han identificado los documentos de entrega asociados al servicio o producto.",
      "d) Se ha recogido la conformidad del cliente con el acabado obtenido, tomando nota, en caso contrario, de sus objeciones, de modo adecuado.",
      "e) Se ha valorado la pulcritud y corrección, tanto en el vestir como en la imagen corporal, elementos clave en la atención al cliente.",
      "f) Se ha mantenido en todo momento el respeto hacia el cliente.",
      "g) Se ha intentado la fidelización del cliente con el buen resultado del trabajo.",
      "h) Se ha definido periodo de garantía y las obligaciones legales aparejadas."
    ],
    "criterios_ca": [
      "a) S'han lliurat al client els articles processats, informant-lo dels serveis fets en els articles.",
      "b) S'han transmès al client, de manera oportuna, les operacions que s'han de dur a terme en els articles lliurats i els temps previstos per fer-ho.",
      "c) S'han identificat els documents de lliurament associats al servei o producte.",
      "d) S'ha recollit la conformitat del client amb l'acabat obtingut, prenent nota, en cas contrari, de les seves objeccions, de manera adequada.",
      "e) S'han valorat la pulcritud i la correcció, tant en el vestir com en la imatge corporal, elements clau en l'atenció al client.",
      "f) S'ha mantingut en tot moment el respecte cap al client.",
      "g) S'ha intentat la fidelització del client amb el bon resultat de la feina.",
      "h) S'ha definit el període de garantia i les obligacions legals associades."
    ]
  },
  {
    "id": "RA4",
    "module": "Atención al cliente",
    "module_es": "Atención al cliente",
    "module_ca": "Atenció al client",
    "moduleCode": "3005",
    "tipoNivel": "FP_BASICA",
    "description": "Atiende reclamaciones de posibles clientes, reconociendo el protocolo de actuación.",
    "description_es": "Atiende reclamaciones de posibles clientes, reconociendo el protocolo de actuación.",
    "description_ca": "Atén les reclamacions dels clients, reconeixent el protocol d'actuació.",
    "criterios_es": [
      "a) Se han ofrecido alternativas al cliente ante reclamaciones fácilmente subsanables, exponiendo claramente los tiempos y condiciones de las operaciones a realizar.",
      "b) Se han reconocido los aspectos principales en los que incide la legislación vigente, en relación con las reclamaciones.",
      "c) Se ha suministrado la información y documentación necesaria al cliente para la presentación de una reclamación escrita.",
      "d) Se han recogido los formularios presentados por el cliente para la realización de una reclamación.",
      "e) Se ha cumplimentado una hoja de reclamación.",
      "f) Se ha compartido información con el equipo de trabajo."
    ],
    "criterios_ca": [
      "a) S'han ofert alternatives al client davant reclamacions fàcilment esmenables, exposant clarament els temps i les condicions de les operacions que s'han de fer.",
      "b) S'han reconegut els aspectes principals en què incideix la legislació vigent en relació amb les reclamacions.",
      "c) S'han subministrat al client la informació i la documentació necessàries per presentar una reclamació escrita.",
      "d) S'han recollit els formularis presentats pel client per fer una reclamació.",
      "e) S'ha emplenat un full de reclamació.",
      "f) S'ha compartit informació amb l'equip de treball."
    ]
  },
  {
    "id": "RA1",
    "module": "Cambio de color del cabello",
    "module_es": "Cambio de color del cabello",
    "module_ca": "Canvi de color del cabell",
    "moduleCode": "3065",
    "tipoNivel": "FP_BASICA",
    "description": "Prepara equipos y útiles de cambio de color, reconociendo sus características y aplicaciones.",
    "description_es": "Prepara equipos y útiles de cambio de color, reconociendo sus características y aplicaciones.",
    "description_ca": "Prepara equips i estris de canvi de color, reconeixent-ne les característiques i les aplicacions.",
    "criterios_es": [
      "a) Se han descrito las instalaciones utilizadas en los procesos de cambio de color del cabello.",
      "b) Se han identificado los equipos, aparatos, útiles y accesorios necesarios para la realización de las distintas técnicas de cambio de color del cabello.",
      "c) Se han descrito la utilización y el mantenimiento de los equipos y aparatos empleados en el proceso, teniendo en cuenta criterios de higiene y seguridad.",
      "d) Se han preparado los útiles y accesorios aplicando las técnicas de higiene y desinfección necesarias.",
      "e) Se ha preparado la zona de trabajo, en condiciones de higiene, para la realización del servicio de cambio de color del cabello.",
      "f) Se ha identificado la composición del equipo personal de peluquería para la ejecución técnica del cambio de color.",
      "g) Se han aplicado las medidas de prevención de riesgos laborales y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han descrit les instal·lacions utilitzades en els processos de canvi de color del cabell.",
      "b) S'han identificat els equips, aparells, estris i accessoris necessaris per aplicar les diferents tècniques de canvi de color del cabell.",
      "c) S'han descrit la utilització i el manteniment dels equips i aparells emprats en el procés, tenint en compte criteris d'higiene i seguretat.",
      "d) S'han preparat els estris i accessoris aplicant les tècniques d'higiene i desinfecció necessàries.",
      "e) S'ha preparat la zona de treball en condicions d'higiene per fer el servei de canvi de color del cabell.",
      "f) S'ha identificat la composició de l'equip personal de perruqueria per a l'execució tècnica del canvi de color.",
      "g) S'han aplicat les mesures de prevenció de riscs laborals i mediambientals requerides."
    ]
  },
  {
    "id": "RA2",
    "module": "Cambio de color del cabello",
    "module_es": "Cambio de color del cabello",
    "module_ca": "Canvi de color del cabell",
    "moduleCode": "3065",
    "tipoNivel": "FP_BASICA",
    "description": "Decolora el cabello, reconociendo el efecto de los productos sobre el cabello.",
    "description_es": "Decolora el cabello, reconociendo el efecto de los productos sobre el cabello.",
    "description_ca": "Decolora el cabell, reconeixent l'efecte dels productes sobre el cabell.",
    "criterios_es": [
      "a) Se ha estudiado el color natural del cabello y la escala de tonos.",
      "b) Se ha descrito el proceso de decoloración capilar.",
      "c) Se ha identificado la forma de actuar de los cosméticos decolorantes.",
      "d) Se han descrito las normas de utilización de los productos decolorantes.",
      "e) Se ha protegido el profesional con las medidas adecuadas para trabajar en condiciones de seguridad e higiene.",
      "f) Se ha acomodado, protegido y preparado al cliente, aplicándole los productos necesarios para proteger la piel.",
      "g) Se ha preparado el producto siguiendo las indicaciones del técnico responsable.",
      "h) Se ha aplicado el producto total o parcialmente sobre el cabello, cumpliendo las normas de seguridad, vigilando el proceso y controlando el tiempo de exposición.",
      "i) Se ha adaptado el servicio de higiene capilar al proceso de decoloración capilar.",
      "j) Se ha reflejado en la ficha del cliente los cosméticos aplicados y las observaciones relativas al proceso y, en la ficha de servicio, la técnica realizada.",
      "k) Se ha evaluado el resultado del proceso de decoloración, formulando las preguntas tipos.",
      "l) Se han detectado las causas que originan deficiencias en el servicio y las medidas para subsanarlas.",
      "m) Se han aplicado las especificaciones de seguridad y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han estudiat el color natural del cabell i l'escala de tons.",
      "b) S'ha descrit el procés de decoloració capil·lar.",
      "c) S'ha identificat la manera d'actuar dels cosmètics decolorants.",
      "d) S'han descrit les normes d'utilització dels productes decolorants.",
      "e) El professional s'ha protegit amb les mesures adequades per treballar en condicions de seguretat i higiene.",
      "f) S'ha acomodat, protegit i preparat el client, aplicant-li els productes necessaris per protegir la pell.",
      "g) S'ha preparat el producte seguint les indicacions del tècnic responsable.",
      "h) S'ha aplicat el producte totalment o parcialment sobre el cabell, complint les normes de seguretat, vigilant el procés i controlant el temps d'exposició.",
      "i) S'ha adaptat el servei d'higiene capil·lar al procés de decoloració capil·lar.",
      "j) S'han reflectit en la fitxa del client els cosmètics aplicats i les observacions relatives al procés i, en la fitxa de servei, la tècnica aplicada.",
      "k) S'ha avaluat el resultat del procés de decoloració, formulant les preguntes tipus.",
      "l) S'han detectat les causes que originen deficiències en el servei i les mesures per esmenar-les.",
      "m) S'han aplicat les especificacions de seguretat i mediambientals requerides."
    ]
  },
  {
    "id": "RA3",
    "module": "Cambio de color del cabello",
    "module_es": "Cambio de color del cabello",
    "module_ca": "Canvi de color del cabell",
    "moduleCode": "3065",
    "tipoNivel": "FP_BASICA",
    "description": "Colorea el conjunto del cabello, relacionando la técnica seleccionada con los efectos finales.",
    "description_es": "Colorea el conjunto del cabello, relacionando la técnica seleccionada con los efectos finales.",
    "description_ca": "Acoloreix el conjunt del cabell, relacionant la tècnica seleccionada amb els efectes finals.",
    "criterios_es": [
      "a) Se han clasificado los productos colorantes capilares en función de su naturaleza, de la duración del resultado, de su aplicación y de su composición general.",
      "b) Se ha identificado la forma de actuar de los distintos cosméticos colorantes, su finalidad y su acción sobre el cabello.",
      "c) Se han identificado las operaciones técnicas previas a los cambios de coloración capilar.",
      "d) Se ha informado al cliente y realizado la prueba de tolerancia, determinando los resultados y teniendo en cuenta los parámetros aconsejados por el laboratorio fabricante del cosmético.",
      "e) Se ha protegido el profesional con las medidas adecuadas para trabajar en condiciones de seguridad e higiene.",
      "f) Se ha acomodado, protegido y preparado al cliente, aplicándole los productos necesarios para proteger la piel.",
      "g) Se han identificado las mezclas correctas de los productos colorantes, siguiendo las indicaciones del fabricante y del técnico responsable.",
      "h) Se ha aplicado el producto en raíces y/o sobre todo el cabello, cumpliendo las normas de seguridad, vigilando el proceso y controlando el tiempo de exposición.",
      "i) Se ha adaptado el servicio de higiene capilar al proceso de coloración capilar.",
      "j) Se ha operado de forma ordenada, con pulcritud y seguridad, aplicando los procedimientos y técnicas adecuados y evaluando correctamente los resultados.",
      "k) Se ha reflejado en la ficha del cliente todos los datos relativos a la prueba de tolerancia, el cosmético aplicado y las observaciones relativas al proceso.",
      "l) Se han enumerado las causas que pueden originar deficiencias en la prestación del servicio y se han propuesto medidas que permitan evitarlas.",
      "m) Se ha estudiado el grado de satisfacción del cliente, tanto en la prestación del servicio como en la atención personal, y se han corregido las deficiencias.",
      "n) Se han aplicado las especificaciones de seguridad y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han classificat els productes colorants capil·lars en funció de la seva naturalesa, de la durada del resultat, de la seva aplicació i de la seva composició general.",
      "b) S'ha identificat la manera d'actuar dels diferents cosmètics colorants, la seva finalitat i la seva acció sobre el cabell.",
      "c) S'han identificat les operacions tècniques prèvies als canvis de coloració capil·lar.",
      "d) S'ha informat el client i s'ha fet la prova de tolerància, determinant-ne els resultats i tenint en compte els paràmetres aconsellats pel laboratori fabricant del cosmètic.",
      "e) El professional s'ha protegit amb les mesures adequades per treballar en condicions de seguretat i higiene.",
      "f) S'ha acomodat, protegit i preparat el client, aplicant-li els productes necessaris per protegir la pell.",
      "g) S'han identificat les mescles correctes dels productes colorants, seguint les indicacions del fabricant i del tècnic responsable.",
      "h) S'ha aplicat el producte a les arrels o a tot el cabell, complint les normes de seguretat, vigilant el procés i controlant el temps d'exposició.",
      "i) S'ha adaptat el servei d'higiene capil·lar al procés de coloració capil·lar.",
      "j) S'ha treballat de manera ordenada, amb pulcritud i seguretat, aplicant els procediments i les tècniques adequats i avaluant correctament els resultats.",
      "k) S'han reflectit en la fitxa del client totes les dades relatives a la prova de tolerància, el cosmètic aplicat i les observacions relatives al procés.",
      "l) S'han enumerat les causes que poden originar deficiències en la prestació del servei i s'han proposat mesures que permetin evitar-les.",
      "m) S'ha estudiat el grau de satisfacció del client, tant en la prestació del servei com en l'atenció personal, i s'han corregit les deficiències.",
      "n) S'han aplicat les especificacions de seguretat i mediambientals requerides."
    ]
  },
  {
    "id": "RA4",
    "module": "Cambio de color del cabello",
    "module_es": "Cambio de color del cabello",
    "module_ca": "Canvi de color del cabell",
    "moduleCode": "3065",
    "tipoNivel": "FP_BASICA",
    "description": "Colorea parcialmente el cabello, relacionando la técnica seleccionada con los efectos finales.",
    "description_es": "Colorea parcialmente el cabello, relacionando la técnica seleccionada con los efectos finales.",
    "description_ca": "Acoloreix parcialment el cabell, relacionant la tècnica seleccionada amb els efectes finals.",
    "criterios_es": [
      "a) Se han descrito las técnicas que se emplean para colorear parcialmente el cabello.",
      "b) Se ha seleccionado la técnica a realizar en función de los efectos finales que se desean conseguir.",
      "c) Se ha protegido el profesional con las medidas adecuadas para trabajar en condiciones de seguridad e higiene.",
      "d) Se ha determinado el tipo de cosmético siguiendo las indicaciones del técnico responsable.",
      "e) Se ha informado al cliente y realizado la prueba de tolerancia, determinando los resultados y teniendo en cuenta los parámetros aconsejados por el laboratorio fabricante del cosmético.",
      "f) Se ha acomodado, protegido y preparado al cliente, aplicándole los productos necesarios para proteger la piel.",
      "g) Se ha aplicado el producto para coloración parcial: mechas con peine, gorro, papel de aluminio y otras técnicas, vigilando el proceso y controlando el tiempo de exposición.",
      "h) Se ha adaptado el servicio de higiene capilar al proceso de coloración parcial del cabello.",
      "i) Se han reflejado en la ficha del cliente los cosméticos aplicados y las observaciones relativas al proceso y en la ficha de servicio la técnica realizada.",
      "j) Se ha operado de forma ordenada, con pulcritud y seguridad, aplicando los procedimientos y técnicas adecuados y evaluando correctamente los resultados y la calidad del proceso.",
      "k) Se han enumerado las causas que pueden originar deficiencias en la prestación del servicio y se han propuesto medidas que permitan evitarlas.",
      "l) Se ha estudiado el grado de satisfacción del cliente, tanto en la prestación del servicio como en la atención personal y se han corregido las deficiencias.",
      "m) Se han aplicado las especificaciones de seguridad y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han descrit les tècniques que s'empren per acolorir parcialment el cabell.",
      "b) S'ha seleccionat la tècnica que s'aplicarà en funció dels efectes finals que es volen aconseguir.",
      "c) El professional s'ha protegit amb les mesures adequades per treballar en condicions de seguretat i higiene.",
      "d) S'ha determinat el tipus de cosmètic seguint les indicacions del tècnic responsable.",
      "e) S'ha informat el client i s'ha fet la prova de tolerància, determinant-ne els resultats i tenint en compte els paràmetres aconsellats pel laboratori fabricant del cosmètic.",
      "f) S'ha acomodat, protegit i preparat el client, aplicant-li els productes necessaris per protegir la pell.",
      "g) S'ha aplicat el producte per a la coloració parcial (metxes amb pinta, gorro, paper d'alumini i altres tècniques), vigilant el procés i controlant el temps d'exposició.",
      "h) S'ha adaptat el servei d'higiene capil·lar al procés de coloració parcial del cabell.",
      "i) S'han reflectit en la fitxa del client els cosmètics aplicats i les observacions relatives al procés i, en la fitxa de servei, la tècnica aplicada.",
      "j) S'ha treballat de manera ordenada, amb pulcritud i seguretat, aplicant els procediments i les tècniques adequats i avaluant correctament els resultats i la qualitat del procés.",
      "k) S'han enumerat les causes que poden originar deficiències en la prestació del servei i s'han proposat mesures que permetin evitar-les.",
      "l) S'ha estudiat el grau de satisfacció del client, tant en la prestació del servei com en l'atenció personal, i s'han corregit les deficiències.",
      "m) S'han aplicat les especificacions de seguretat i mediambientals requerides."
    ]
  },
  {
    "id": "RA1",
    "module": "Maquillaje",
    "module_es": "Maquillaje",
    "module_ca": "Maquillatge",
    "moduleCode": "3063",
    "tipoNivel": "FP_BASICA",
    "description": "Prepara útiles y productos de maquillaje, reconociendo sus características y aplicaciones.",
    "description_es": "Prepara útiles y productos de maquillaje, reconociendo sus características y aplicaciones.",
    "description_ca": "Prepara estris i productes de maquillatge, reconeixent-ne les característiques i les aplicacions.",
    "criterios_es": [
      "a) Se han definido y realizado los procesos de higiene, desinfección y esterilización de los materiales de uso en las técnicas de maquillaje.",
      "b) Se han descrito las posibles alteraciones dermatológicas y oculares más frecuentes derivadas de una mala higiene de útiles y productos.",
      "c) Se ha realizado la identificación de los útiles adecuados para cada tipo de trabajo.",
      "d) Se ha descrito el uso adecuado de cada pincel en la técnica de maquillaje.",
      "e) Se han preparado los útiles, materiales y productos, aplicando técnicas de seguridad e higiene necesarias.",
      "f) Se han identificado los útiles y productos necesarios para las técnicas de maquillaje social y fantasía facial.",
      "g) Se han señalado los usos correctos y más habituales de los distintos productos.",
      "h) Se han reconocido las etiquetas de los diferentes productos familiarizándose con su composición.",
      "i) Se han aplicado las medidas de prevención de riesgos laborales y medioambientales requeridas."
    ],
    "criterios_ca": [
      "a) S'han definit i fet els processos d'higiene, desinfecció i esterilització dels materials d'ús en les tècniques de maquillatge.",
      "b) S'han descrit les possibles alteracions dermatològiques i oculars més freqüents derivades d'una mala higiene d'estris i productes.",
      "c) S'han identificat els estris adequats per a cada tipus de treball.",
      "d) S'ha descrit l'ús adequat de cada pinzell en la tècnica de maquillatge.",
      "e) S'han preparat els estris, materials i productes, aplicant les tècniques de seguretat i higiene necessàries.",
      "f) S'han identificat els estris i productes necessaris per a les tècniques de maquillatge social i de fantasia facial.",
      "g) S'han assenyalat els usos correctes i més habituals dels diferents productes.",
      "h) S'han reconegut les etiquetes dels diferents productes, familiaritzant-se amb la seva composició.",
      "i) S'han aplicat les mesures de prevenció de riscs laborals i mediambientals requerides."
    ]
  },
  {
    "id": "RA2",
    "module": "Maquillaje",
    "module_es": "Maquillaje",
    "module_ca": "Maquillatge",
    "moduleCode": "3063",
    "tipoNivel": "FP_BASICA",
    "description": "Prepara la piel del cliente, aplicando técnicas de higiene y protección.",
    "description_es": "Prepara la piel del cliente, aplicando técnicas de higiene y protección.",
    "description_ca": "Prepara la pell del client aplicant tècniques d'higiene i protecció.",
    "criterios_es": [
      "a) Se ha preparado al cliente para el servicio a realizar garantizando su seguridad.",
      "b) Se ha descrito la posición ergonómica del cliente y del profesional para realizar la higiene superficial del rostro.",
      "c) Se han formulado preguntas tipo que permiten detectar las demandas y necesidades que debe cubrir el servicio.",
      "d) Se han relacionado las características de la piel con el uso de los cosméticos más adecuados.",
      "e) Se han valorado las causas que determinan la elección de los cosméticos de higiene en relación con las técnicas de maquillaje que se van a realizar.",
      "f) Se ha realizado la aplicación de los cosméticos de higiene describiendo las direcciones correctas en función de la zona del rostro: ojos, labios, cuello, escote.",
      "g) Se han retirado completamente los restos de cosmético limpiador y aplicado el tónico, evitando la zona orbicular.",
      "h) Se ha valorado si es necesaria la aplicación de un cosmético exfoliante y, en caso afirmativo, se aplica y retira adecuadamente.",
      "i) Se ha valorado y realizado la aplicación de una mascarilla en el rostro siguiendo las direcciones correctas, respetando el tiempo de exposición y retirándola completamente.",
      "j) Se ha aplicado el cosmético hidratante o tensor siguiendo las normas señaladas por el fabricante.",
      "k) Se ha cumplimentado la ficha técnica del servicio con los datos tanto personales como los relativos a los cosméticos aplicados y a las observaciones realizadas.",
      "l) Se han aplicado las medidas de seguridad requeridas."
    ],
    "criterios_ca": [
      "a) S'ha preparat el client per al servei que es farà, garantint-ne la seguretat.",
      "b) S'ha descrit la posició ergonòmica del client i del professional per fer la higiene superficial de la cara.",
      "c) S'han formulat preguntes tipus que permeten detectar les demandes i necessitats que ha de cobrir el servei.",
      "d) S'han relacionat les característiques de la pell amb l'ús dels cosmètics més adequats.",
      "e) S'han valorat les causes que determinen l'elecció dels cosmètics d'higiene en relació amb les tècniques de maquillatge que es faran.",
      "f) S'han aplicat els cosmètics d'higiene descrivint les direccions correctes en funció de la zona de la cara: ulls, llavis, coll i escot.",
      "g) S'han retirat completament les restes de cosmètic netejador i s'ha aplicat el tònic, evitant la zona orbicular.",
      "h) S'ha valorat si cal aplicar un cosmètic exfoliant i, en cas afirmatiu, s'aplica i es retira adequadament.",
      "i) S'ha valorat i s'ha fet l'aplicació d'una mascareta a la cara seguint les direccions correctes, respectant el temps d'exposició i retirant-la completament.",
      "j) S'ha aplicat el cosmètic hidratant o tensor seguint les normes assenyalades pel fabricant.",
      "k) S'ha emplenat la fitxa tècnica del servei amb les dades, tant les personals com les relatives als cosmètics aplicats i a les observacions fetes.",
      "l) S'han aplicat les mesures de seguretat requerides."
    ]
  },
  {
    "id": "RA3",
    "module": "Maquillaje",
    "module_es": "Maquillaje",
    "module_ca": "Maquillatge",
    "moduleCode": "3063",
    "tipoNivel": "FP_BASICA",
    "description": "Aplica técnicas de maquillaje social, relacionando el tipo de maquillaje con las necesidades del cliente.",
    "description_es": "Aplica técnicas de maquillaje social, relacionando el tipo de maquillaje con las necesidades del cliente.",
    "description_ca": "Aplica tècniques de maquillatge social, relacionant el tipus de maquillatge amb les necessitats del client.",
    "criterios_es": [
      "a) Se han seleccionado y preparado de forma adecuada el material y cosméticos de uso para cada cliente atendiendo al tipo de piel y en función del tono de la misma, color de ojos y tipo de ropa.",
      "b) Se ha descrito la posición ergonómica del cliente y del profesional para realizar el maquillaje social demandado.",
      "c) Se ha observado el rostro del cliente y realizado preguntas que permitan conocer su estilo personal y posibles alergias de contacto.",
      "d) Se ha realizado la depilación de cejas corrigiendo su forma, de acuerdo a la configuración del rostro, aplicando las medidas de higiene necesarias.",
      "e) Se han descrito las normas de seguridad e higiene que se deben aplicar en la realización de maquillajes sociales.",
      "f) Se ha determinado correctamente la armonía de colores a utilizar y las técnicas de «visagismo» a emplear.",
      "g) Se han aplicado adecuadamente las correcciones claras, fondo de maquillaje indicado al tipo de piel y la técnica específica que requiera la textura del producto.",
      "h) Se han realizado las correcciones oscuras oportunas según las técnicas de «visagismo» adaptadas al óvalo del cliente y al tipo de maquillaje social.",
      "i) Se han aplicado diestramente y mediante las técnicas apropiadas de «visagismo» los cosméticos decorativos de ojos, labios, cejas, pestañas y mejillas.",
      "j) Se ha valorado la responsabilidad asociada a las actividades profesionales del maquillador al desenvolupar su actividad en zonas sensibles como los ojos y labios.",
      "k) Se han realizado las precauciones oportunas retirando lentes de contacto u otras prótesis que puedan resultar peligrosas en el desarrollo de la técnica de maquillaje.",
      "l) Se han aplicado las medidas de seguridad requeridas."
    ],
    "criterios_ca": [
      "a) S'han seleccionat i preparat adequadament el material i els cosmètics d'ús per a cada client, atenent el tipus de pell i en funció del seu to, el color dels ulls i el tipus de roba.",
      "b) S'ha descrit la posició ergonòmica del client i del professional per fer el maquillatge social demandat.",
      "c) S'ha observat la cara del client i s'han fet preguntes que permetin conèixer el seu estil personal i possibles al·lèrgies de contacte.",
      "d) S'ha fet la depilació de les celles corregint-ne la forma d'acord amb la configuració de la cara i aplicant les mesures d'higiene necessàries.",
      "e) S'han descrit les normes de seguretat i higiene que s'han d'aplicar en la realització de maquillatges socials.",
      "f) S'han determinat correctament l'harmonia de colors que s'ha d'utilitzar i les tècniques de visagisme que s'han d'emprar.",
      "g) S'han aplicat adequadament les correccions clares, el fons de maquillatge indicat per al tipus de pell i la tècnica específica que requereixi la textura del producte.",
      "h) S'han fet les correccions fosques oportunes segons les tècniques de visagisme adaptades a l'oval del client i al tipus de maquillatge social que es farà.",
      "i) S'han aplicat amb destresa i mitjançant les tècniques apropiades de visagisme els cosmètics decoratius d'ulls, llavis, celles, pestanyes i galtes.",
      "j) S'ha valorat la responsabilitat associada a les activitats professionals del maquillador en desenvolupar la seva activitat en zones sensibles com els ulls i els llavis.",
      "k) S'han pres les precaucions oportunes retirant lents de contacte o altres pròtesis que puguin resultar perilloses en el desenvolupament de la tècnica de maquillatge.",
      "l) S'han aplicat les mesures de seguretat requerides."
    ]
  },
  {
    "id": "RA4",
    "module": "Maquillaje",
    "module_es": "Maquillaje",
    "module_ca": "Maquillatge",
    "moduleCode": "3063",
    "tipoNivel": "FP_BASICA",
    "description": "Realiza maquillajes básicos de fantasía facial, determinando la armonía estética y cromática de los mismos.",
    "description_es": "Realiza maquillajes básicos de fantasía facial, determinando la armonía estética y cromática de los mismos.",
    "description_ca": "Fa maquillatges bàsics de fantasia facial, determinant-ne l'harmonia estètica i cromàtica.",
    "criterios_es": [
      "a) Se han seleccionado y preparado de forma adecuada el material y cosméticos utilizados en los maquillajes de fantasía.",
      "b) Se han considerado las normas de seguridad e higiene que se deben aplicar en la realización de maquillajes de fantasía.",
      "c) Se ha descrito la posición ergonómica del cliente y del profesional para realizar el maquillaje de fantasía facial seleccionado.",
      "d) Se han formulado preguntas tipo que permiten detectar las demandas y necesidades que debe cubrir el servicio.",
      "e) Se ha realizado un boceto previo sobre la fantasía a realizar que facilite su ejecución.",
      "f) Se ha determinado correctamente la armonía estética y cromática que permita un buen resultado.",
      "g) Se ha comenzado con el dibujo sobre la piel con un lápiz blanco que permita corregir, si no se ha logrado la adaptación correcta del diseño al espacio que debe ocupar.",
      "h) Se ha considerado la necesidad de utilizar un pincel para cada color para conseguir una limpieza de ejecución y acabado del maquillaje.",
      "i) Se ha aplicado una sustancia fijadora que permita mantener inalterable el maquillaje durante más tiempo.",
      "j) Se han identificado las fases del proceso y resultado de los maquillajes realizados, aplicando las medidas necesarias para la corrección de posibles desviaciones.",
      "k) Se ha completado el proceso en un tiempo adecuado.",
      "l) Se ha realizado la limpieza de los útiles con los productos específicos, respetando las normas de seguridad indicadas por el fabricante, conservándolos en buen estado para el próximo uso.",
      "m) Se han aplicado las medidas de seguridad requeridas.",
      "n) Se han realizado preguntas tipo que permitan conocer el grado de satisfacción del cliente."
    ],
    "criterios_ca": [
      "a) S'han seleccionat i preparat adequadament el material i els cosmètics utilitzats en els maquillatges de fantasia.",
      "b) S'han considerat les normes de seguretat i higiene que s'han d'aplicar en la realització de maquillatges de fantasia.",
      "c) S'ha descrit la posició ergonòmica del client i del professional per fer el maquillatge de fantasia facial seleccionat.",
      "d) S'han formulat preguntes tipus que permeten detectar les demandes i necessitats que ha de cobrir el servei.",
      "e) S'ha fet un esbós previ de la fantasia que es farà, que en faciliti l'execució.",
      "f) S'ha determinat correctament l'harmonia estètica i cromàtica que permeti un bon resultat.",
      "g) S'ha començat el dibuix sobre la pell amb un llapis blanc que permeti corregir-lo si no s'ha aconseguit l'adaptació correcta del disseny a l'espai que ha d'ocupar.",
      "h) S'ha considerat la necessitat d'utilitzar un pinzell per a cada color per aconseguir netedat en l'execució i l'acabat del maquillatge.",
      "i) S'ha aplicat una substància fixadora que permeti mantenir inalterable el maquillatge durant més temps.",
      "j) S'han identificat les fases del procés i el resultat dels maquillatges fets, aplicant les mesures necessàries per corregir possibles desviacions.",
      "k) S'ha completat el procés en un temps adequat.",
      "l) S'ha fet la neteja dels estris amb els productes específics, respectant les normes de seguretat indicades pel fabricant, i s'han conservat en bon estat per al pròxim ús.",
      "m) S'han aplicat les mesures de seguretat requerides.",
      "n) S'han fet preguntes tipus que permetin conèixer el grau de satisfacció del client."
    ]
  },
  {
    "id": "RA1",
    "module": "Proyecto intermodular de aprendizaje colaborativo",
    "module_es": "Proyecto intermodular de aprendizaje colaborativo",
    "module_ca": "Projecte intermodular d'aprenentatge col·laboratiu",
    "moduleCode": "3160",
    "tipoNivel": "FP_BASICA",
    "description": "Busca información en internet sobre empresas «tipo» del sector/es relacionados con los estándares de competencia incluidos en el ámbito profesional del título, elaborando un mapa de las mismas y los servicios o productos que ofrecen.",
    "description_es": "Busca información en internet sobre empresas «tipo» del sector/es relacionados con los estándares de competencia incluidos en el ámbito profesional del título, elaborando un mapa de las mismas y los servicios o productos que ofrecen.",
    "description_ca": "Cerca informació a internet sobre empreses «tipus» dels sectors relacionats amb els estàndards de competència inclosos en l'àmbit professional del títol, elaborant-ne un mapa amb els serveis o productes que ofereixen.",
    "criterios_es": [
      "a) Se han definido las características de las empresas tipo del sector.",
      "b) Se han buscado empresas del sector con herramientas de internet.",
      "c) Se han contrastado los servicios o productos que ofrecen.",
      "d) Se ha elaborado un mapa de empresas tipo del sector."
    ],
    "criterios_ca": [
      "a) S'han definit les característiques de les empreses tipus del sector.",
      "b) S'han cercat empreses del sector amb eines d'internet.",
      "c) S'han contrastat els serveis o productes que ofereixen.",
      "d) S'ha elaborat un mapa d'empreses tipus del sector."
    ]
  },
  {
    "id": "RA2",
    "module": "Proyecto intermodular de aprendizaje colaborativo",
    "module_es": "Proyecto intermodular de aprendizaje colaborativo",
    "module_ca": "Projecte intermodular d'aprenentatge col·laboratiu",
    "moduleCode": "3160",
    "tipoNivel": "FP_BASICA",
    "description": "Selecciona un servicio o producto de una empresa del sector relacionándolo con su contribución a los ODS y sus destinatarios a nivel global.",
    "description_es": "Selecciona un servicio o producto de una empresa del sector relacionándolo con su contribución a los ODS y sus destinatarios a nivel global.",
    "description_ca": "Selecciona un servei o producte d'una empresa del sector i el relaciona amb la seva contribució als ODS i amb els seus destinataris a escala global.",
    "criterios_es": [
      "a) Se ha descrito el servicio o producto seleccionado.",
      "b) Se han analizado los ODS a los que puede contribuir la empresa.",
      "c) Se ha justificado la vinculación del servicio con los ODS."
    ],
    "criterios_ca": [
      "a) S'ha descrit el servei o producte seleccionat.",
      "b) S'han analitzat els ODS als quals pot contribuir l'empresa.",
      "c) S'ha justificat la vinculació del servei amb els ODS."
    ]
  },
  {
    "id": "RA3",
    "module": "Proyecto intermodular de aprendizaje colaborativo",
    "module_es": "Proyecto intermodular de aprendizaje colaborativo",
    "module_ca": "Projecte intermodular d'aprenentatge col·laboratiu",
    "moduleCode": "3160",
    "tipoNivel": "FP_BASICA",
    "description": "Hace una propuesta de una empresa tipo «spin-off» indicando los aspectos diferenciales con la empresa de referencia y elaborando un dosier con sus características.",
    "description_es": "Hace una propuesta de una empresa tipo «spin-off» indicando los aspectos diferenciales con la empresa de referencia y elaborando un dosier con sus características.",
    "description_ca": "Fa una proposta d'empresa tipus spin-off, indicant-ne els aspectes diferencials respecte de l'empresa de referència i elaborant un dossier amb les seves característiques.",
    "criterios_es": [
      "a) Se han descrito las características principales de una empresa spin-off.",
      "b) Se han identificado las diferencias con la empresa de referencia.",
      "c) Se ha elaborado un dossier detallado con la propuesta."
    ],
    "criterios_ca": [
      "a) S'han descrit les característiques principals d'una empresa spin-off.",
      "b) S'han identificat les diferències amb l'empresa de referència.",
      "c) S'ha elaborat un dossier detallat amb la proposta."
    ]
  },
  {
    "id": "RA4",
    "module": "Proyecto intermodular de aprendizaje colaborativo",
    "module_es": "Proyecto intermodular de aprendizaje colaborativo",
    "module_ca": "Projecte intermodular d'aprenentatge col·laboratiu",
    "moduleCode": "3160",
    "tipoNivel": "FP_BASICA",
    "description": "Relaciona cada unidad de una empresa tipo con la prevención de riesgos profesionales, identificando los equipos/sistemas de protección generales y los propios de cada actividad.",
    "description_es": "Relaciona cada unidad de una empresa tipo con la prevención de riesgos profesionales, identificando los equipos/sistemas de protección generales y los propios de cada actividad.",
    "description_ca": "Relaciona cada unitat d'una empresa tipus amb la prevenció de riscs professionals, identificant els equips i sistemes de protecció generals i els propis de cada activitat.",
    "criterios_es": [
      "a) Se han identificado los riesgos profesionales por cada unidad de la empresa.",
      "b) Se han determinado los equipos de protección individual necesarios.",
      "c) Se han establecido los sistemas de protección general."
    ],
    "criterios_ca": [
      "a) S'han identificat els riscs professionals de cada unitat de l'empresa.",
      "b) S'han determinat els equips de protecció individual necessaris.",
      "c) S'han establert els sistemes de protecció general."
    ]
  },
  {
    "id": "RA5",
    "module": "Proyecto intermodular de aprendizaje colaborativo",
    "module_es": "Proyecto intermodular de aprendizaje colaborativo",
    "module_ca": "Projecte intermodular d'aprenentatge col·laboratiu",
    "moduleCode": "3160",
    "tipoNivel": "FP_BASICA",
    "description": "Transmite información con claridad de manera ordenada y estructurada.",
    "description_es": "Transmite información con claridad de manera ordenada y estructurada.",
    "description_ca": "Transmet informació amb claredat de manera ordenada i estructurada.",
    "criterios_es": [
      "a) Se ha comunicado la información de forma clara.",
      "b) Se han utilizado herramientas adecuadas para la estructuración de la información."
    ],
    "criterios_ca": [
      "a) S'ha comunicat la informació de manera clara.",
      "b) S'han utilitzat eines adequades per estructurar la informació."
    ]
  },
  {
    "id": "CE1",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Identificar y comprender la naturaleza histórica y geográfica de las relaciones sociales, las actividades económicas, las manifestaciones culturales y los bienes patrimoniales, analizando sus orígenes y evolución e identificando las causas y consecuencias de los cambios producidos, los problemas actuales y sus valores presentes, para realizar propuestas que contribuyan al bienestar futuro y al desarrollo sostenible de la sociedad.",
    "description_es": "Identificar y comprender la naturaleza histórica y geográfica de las relaciones sociales, las actividades económicas, las manifestaciones culturales y los bienes patrimoniales, analizando sus orígenes y evolución e identificando las causas y consecuencias de los cambios producidos, los problemas actuales y sus valores presentes, para realizar propuestas que contribuyan al bienestar futuro y al desarrollo sostenible de la sociedad.",
    "description_ca": "Identificar i comprendre la naturalesa històrica i geogràfica de les relacions socials, les activitats econòmiques, les manifestacions culturals i els béns patrimonials, analitzant-ne els orígens i l'evolució i identificant les causes i les conseqüències dels canvis produïts, els problemes actuals i els seus valors presents per fer propostes que contribueixin al benestar futur i al desenvolupament sostenible de la societat.",
    "criterios_es": [
      "1.1 Analizar e interpretar el entorno desde una perspectiva sistémica e integradora, a través de conceptos y procedimientos geográficos, identificando sus principales elementos y las interrelaciones existentes, valorando el grado de sostenibilidad y equilibrio de los espacios a partir de actitudes de defensa, protección, conservación y mejora del entorno (natural, rural y urbano).",
      "1.2 Relacionar las culturas y civilizaciones que se han desarrollado a lo largo de la historia con las distintas identidades colectivas que se han construido hasta la actualidad, explicando y valorando la realidad multicultural generada a lo largo del tiempo y analizando las situaciones y los problemas del presente.",
      "1.3 Valorar, proteger y conservar el patrimonio histórico-artístico, cultural y natural, como fundamento de nuestra identidad colectiva y como un recurso esencial para el disfrute y el desarrollo de los pueblos, realizando propuestas que contribuyan a su conservación y a un desarrollo ecosocial sostenible."
    ],
    "criterios_ca": [
      "1.1 Analitzar i interpretar l'entorn des d'una perspectiva sistèmica i integradora, a través de conceptes i procediments geogràfics, identificar els elements principals i les interrelacions existents, valorar el grau de sostenibilitat i equilibri dels espais a partir d'actituds de defensa, protecció, conservació i millora de l’entorn (natural, rural i urbà).",
      "1.2 Relacionar les cultures i les civilitzacions que s'han desenvolupat en la història amb les identitats col·lectives diferents que s'han construït fins a l'actualitat, explicar i valorar la realitat multicultural generada al llarg del temps i analitzar les situacions i els problemes del present.",
      "1.3 Valorar, protegir i conservar el patrimoni historicoartístic, cultural i natural com a fonament de la identitat col·lectiva i com un recurs essencial per al gaudi i el desenvolupament dels pobles, fent propostes que contribueixin a la seva conservació i a un desenvolupament ecosocial sostenible."
    ]
  },
  {
    "id": "CE2",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Comprender los orígenes y evolución de los procesos de integración europea y su relevancia en el presente y futuro tanto de la sociedad española como de la sociedad balear y de las comunidades locales, destacando la contribución del Estado, sus instituciones y las entidades sociales a la paz, a la seguridad integral ciudadana, a la cooperación internacional, al desarrollo sostenible frente al cambio climático y a la ciudadanía global, para contribuir a crear un mundo más seguro, solidario, sostenible y justo.",
    "description_es": "Comprender los orígenes y evolución de los procesos de integración europea y su relevancia en el presente y futuro tanto de la sociedad española como de la sociedad balear y de las comunidades locales, destacando la contribución del Estado, sus instituciones y las entidades sociales a la paz, a la seguridad integral ciudadana, a la cooperación internacional, al desarrollo sostenible frente al cambio climático y a la ciudadanía global, para contribuir a crear un mundo más seguro, solidario, sostenible y justo.",
    "description_ca": "Comprendre els orígens i l'evolució dels processos d'integració europea i la seva rellevància en el present i en el futur, tant de la societat espanyola com de la societat balear i de les comunitats locals, destacant la contribució de l'Estat, les institucions i les entitats socials a la pau, a la seguretat integral ciutadana, a la cooperació internacional, al desenvolupament sostenible davant del canvi climàtic, a la ciutadania global, per contribuir a crear un món més segur, solidari, sostenible i just.",
    "criterios_es": [
      "2.1 Explicar el proceso de unificación del espacio europeo y su relevancia en la construcción tanto de la sociedad española como de la balear, analizando su evolución y argumentando su influencia en la política nacional y autonómica.",
      "2.2 Identificar y valorar las principales instituciones europeas, analizando sus principios rectores, sus normas de funcionamiento y sus funciones, juzgando su papel en los conflictos internacionales y reconociendo su contribución a la paz y a la cooperación internacional, al desarrollo sostenible, a la lucha contra el cambio el climático y a la ciudadanía global.",
      "2.3 Interpretar desde la perspectiva del desarrollo sostenible y la ciudadanía global los principales desafíos del mundo actual, expresando la importancia de implicarse en la búsqueda de soluciones y en el modo de concretarlos desde la propia capacidad de acción, valorando la contribución de programas y misiones dirigidos por los Estados, los organismos internacionales y las asociaciones civiles para el logro de la paz, la seguridad integral, la convivencia social y la cooperación entre los pueblos."
    ],
    "criterios_ca": [
      "2.1 Explicar el procés d'unificació de l'espai europeu i la rellevància que té en la construcció tant de la societat espanyola com de la balear, analitzar-ne l'evolució i argumentar-ne la influència en la política nacional i autonòmica.",
      "2.2 Identificar i valorar les principals institucions europees, analitzar-ne els principis rectors, les normes de funcionament i les funcions, jutjar-ne el paper en els conflictes internacionals i reconèixer la contribució que fan a la pau i a la cooperació internacional, al desenvolupament sostenible, a la lluita contra el canvi el climàtic i a la ciutadania global.",
      "2.3 Interpretar des de la perspectiva del desenvolupament sostenible i la ciutadania global els principals desafiaments del món actual, expressar la importància d'implicar-se en la recerca de solucions i en la manera de concretar-los des de la capacitat d'acció pròpia, valorar la contribució de programes i missions dirigits pels estats, els organismes internacionals i les associacions civils per aconseguir la pau, la seguretat integral, la convivència social i la cooperació entre els pobles."
    ]
  },
  {
    "id": "CE3",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Reconocer los principios, valores, derechos y deberes de nuestro sistema democrático y constitucional, analizando de forma crítica los planteamientos históricos y geográficos, las instituciones y las diferentes organizaciones políticas y económicas en que se enmarcan y manifiestan, para adecuar el comportamiento propio al cumplimiento de dichos principios, valores, derechos y deberes.",
    "description_es": "Reconocer los principios, valores, derechos y deberes de nuestro sistema democrático y constitucional, analizando de forma crítica los planteamientos históricos y geográficos, las instituciones y las diferentes organizaciones políticas y económicas en que se enmarcan y manifiestan, para adecuar el comportamiento propio al cumplimiento de dichos principios, valores, derechos y deberes.",
    "description_ca": "Reconèixer els principis, valors, drets i deures del nostre sistema democràtic i constitucional, mitjançant l’anàlisi crítica dels plantejaments històrics i geogràfics, de les institucions i les diferents organitzacions polítiques i econòmiques en què s'emmarquen i manifesten, per adequar el comportament propi al compliment d’aquests principis, valors, drets i deures.",
    "criterios_es": [
      "3.1 Identificar y analizar los principios, valores, deberes y derechos fundamentales de la Constitución española, del Estatuto de Autonomía de las Illes Balears, el sistema democrático y sus instituciones y organizaciones sociales, políticas y económicas, explicando su función como mecanismos que regulan la convivencia y la vida en comunidad.",
      "3.2 Reconocer y explicar los mecanismos que han regulado la convivencia y la vida en común a lo largo de la historia, desde el origen de la sociedad a las distintas civilizaciones que se han ido sucediendo, señalando los principales modelos de organización social y política que se han ido gestando.",
      "3.3 Adecuar el comportamiento propio al cumplimiento de los principios, valores, derechos y deberes democráticos y constitucionales, identificando los motivos y argumentos que sustentan su validez y rechazando todo tipo de discriminación, especialmente aquella que se da por motivos socio-económicos, de género, orientación sexual o pertenencia a minorías etnoculturales."
    ],
    "criterios_ca": [
      "3.1 Identificar i analitzar els principis, valors, deures i drets fonamentals de la Constitució espanyola, de l’Estatut d’autonomia de les Illes Balears, el sistema democràtic i les seves institucions i organitzacions socials, polítiques i econòmiques, i explicar-ne la funció com a mecanismes que regulen la convivència i la vida en comunitat.",
      "3.2 Reconèixer i explicar els mecanismes que han regulat la convivència i la vida en comú al llarg de la història, des de l'origen de la societat a les diferents civilitzacions que s'han succeït, assenyalant els principals models d'organització social i política que han gestat.",
      "3.3 Adequar el comportament propi al compliment dels principis, valors, drets i deures democràtics i constitucionals, identificar els motius i arguments que sustenten la validesa i rebutjar tota mena de discriminació, especialment la que es produeix per motius socioeconòmics, de gènere, d’orientació sexual o de pertinença a minories ètniques i culturals."
    ]
  },
  {
    "id": "CE4",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Buscar y seleccionar información de manera progresivamente autónoma a partir de diferentes fuentes, evaluando su fiabilidad y pertinencia en función de las necesidades detectadas y evitando los riesgos de manipulación y desinformación, para integrarla como conocimiento y compartirla desde un punto de vista crítico, personal y respetuoso con la propiedad intelectual.",
    "description_es": "Buscar y seleccionar información de manera progresivamente autónoma a partir de diferentes fuentes, evaluando su fiabilidad y pertinencia en función de las necesidades detectadas y evitando los riesgos de manipulación y desinformación, para integrarla como conocimiento y compartirla desde un punto de vista crítico, personal y respetuoso con la propiedad intelectual.",
    "description_ca": "Cercar i seleccionar informació de manera progressivament autònoma a partir de fonts diverses, mitjançant l’avaluació de la fiabilitat i de la pertinència en funció de les necessitats detectades i evitar els riscos de manipulació i desinformació, per integrar-la com a coneixement i compartir-la des d'un punt de vista crític, personal i respectuós amb la propietat intel·lectual.",
    "criterios_es": [
      "4.1 Aplicar estrategias tanto analógicas como digitales de búsqueda, selección y organización de información, evaluando su fiabilidad y su pertinencia en función del objetivo perseguido y evitando los riesgos de manipulación y desinformación.",
      "4.2 Elaborar contenidos propios a partir de diferentes fuentes de manera progresivamente autónoma, respetando los principios de propiedad intelectual y citando las fuentes consultadas."
    ],
    "criterios_ca": [
      "4.1 Aplicar estratègies tant analògiques com digitals de cerca, selecció i organització d'informació, avaluant-ne la fiabilitat i la pertinència en funció de l'objectiu a aconseguir, evitant els riscos de manipulació i desinformació.",
      "4.2 Elaborar continguts propis a partir de diferents fonts de manera progressivament autònoma, respectant els principis de propietat intel·lectual i esmentant les fonts consultades."
    ]
  },
  {
    "id": "CE5",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Comunicar en lengua castellana y en lengua catalana de manera cooperativa y respetuosa, atendiendo a las convenciones propias de los diferentes géneros discursivos y a su adecuación a diferentes ámbitos y contextos, para dar respuesta a necesidades concretas.",
    "description_es": "Comunicar en lengua castellana y en lengua catalana de manera cooperativa y respetuosa, atendiendo a las convenciones propias de los diferentes géneros discursivos y a su adecuación a diferentes ámbitos y contextos, para dar respuesta a necesidades concretas.",
    "description_ca": "Comunicar-se en llengua castellana i en llengua catalana de manera cooperativa i respectuosa, tenint en compte les convencions pròpies dels diferents gèneres discursius i la seva adequació a diversos àmbits i contextos, per respondre a necessitats concretes.",
    "criterios_es": [
      "5.1 Comprender e interpretar el sentido global, la estructura, la información más relevante en función de las necesidades comunicativas y la intención del emisor en textos orales, escritos y multimodales de diferentes ámbitos, evaluando su calidad, su fiabilidad y la idoneidad del canal utilizado.",
      "5.2 Realizar exposiciones orales con diferente grado de planificación sobre temas de interés personal, ecosocial y profesional, ajustándose a las convenciones propias de los diversos géneros discursivos, con fluidez, coherencia y el registro adecuado, en diferentes soportes y utilizando de manera eficaz recursos verbales y no verbales.",
      "5.3 Planificar la redacción de textos escritos y multimodales atendiendo a la situación comunicativa, destinatario, propósito y canal; redactar borradores y revisarlos, y presentar un texto final coherente, cohesionado y con el registro adecuado, con precisión léxica y corrección ortográfica y gramatical.",
      "5.4 Participar de manera activa y adecuada en interacciones orales informales, en el trabajo en equipo y en situaciones orales formales de carácter dialogado, con actitudes de escucha activa y estrategias de cooperación conversacional y cortesía lingüística."
    ],
    "criterios_ca": [
      "5.1 Comprendre i interpretar el sentit global, l'estructura, la informació més rellevant en funció de les necessitats comunicatives i la intenció de l'emissor en textos orals, escrits i multimodals de diferents àmbits i avaluar-ne la qualitat, la fiabilitat i la idoneïtat del canal utilitzat.",
      "5.2 Fer exposicions orals amb diferent grau de planificació sobre temes d'interès personal, ecosocial i professional, ajustar-se a les convencions pròpies dels diversos gèneres discursius, amb fluïdesa, coherència i registre adequat, en diferents suports i utilitzant de manera eficaç recursos verbals i no verbals.",
      "5.3 Planificar la redacció de textos escrits i multimodals segons la situació comunicativa, el destinatari, el propòsit i el canal; redactar esborranys i revisar-los, i presentar un text final coherent, cohesionat i amb el registre adequat, amb precisió lèxica i correcció ortogràfica i gramatical.",
      "5.4 Participar de manera activa i adequada en interaccions orals informals, en el treball en equip i en situacions orals formals de caràcter dialogat, amb actituds d’escolta activa i estratègies de cooperació conversacional i cortesia lingüística."
    ]
  },
  {
    "id": "CE6",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Interpretar y valorar obras diversas como fuente de placer y conocimiento, compartiendo experiencias de lectura, para construir la propia identidad lectora y disfrutar de la dimensión social de esta actividad.",
    "description_es": "Interpretar y valorar obras diversas como fuente de placer y conocimiento, compartiendo experiencias de lectura, para construir la propia identidad lectora y disfrutar de la dimensión social de esta actividad.",
    "description_ca": "Interpretar i valorar obres diverses com a font de plaer i coneixement i compartir experiències de lectura, per construir la identitat lectora pròpia i gaudir de la dimensió social d'aquesta activitat.",
    "criterios_es": [
      "6.1 Leer de manera autónoma textos seleccionados en función de los propios gustos, intereses y necesidades, dejando constancia del progreso del propio itinerario lector y cultural y explicando los criterios de selección de las lecturas.",
      "6.2 Compartir la experiencia de lectura literaria en soportes diversos relacionando el texto leído con otras manifestaciones artísticas en función de temas, estructuras, lenguaje y valores éticos y estéticos."
    ],
    "criterios_ca": [
      "6.1 Llegir de manera autònoma textos seleccionats en funció dels gustos, interessos i necessitats propis, deixar constància del progrés del propi itinerari lector i cultural i explicar els criteris de selecció de les lectures.",
      "6.2 Compartir l’experiència de lectura literària en suports diversos i relacionar el text llegit amb altres manifestacions artístiques en funció de temes, estructures, llenguatge i valors ètics i estètics."
    ]
  },
  {
    "id": "CE7",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Comunicarse en lengua extranjera, con creciente autonomía, empleando recursos analógicos y digitales y usando estrategias básicas de comprensión, producción e interacción, para responder de manera creativa y eficaz a necesidades personales y profesionales concretas.",
    "description_es": "Comunicarse en lengua extranjera, con creciente autonomía, empleando recursos analógicos y digitales y usando estrategias básicas de comprensión, producción e interacción, para responder de manera creativa y eficaz a necesidades personales y profesionales concretas.",
    "description_ca": "Comunicar-se en llengua estrangera, amb autonomia creixent, amb l’ús recursos analògics i digitals i d’estratègies bàsiques de comprensió, producció i interacció, per respondre de manera creativa i eficaç a necessitats personals i professionals concretes.",
    "criterios_es": [
      "7.1 Interpretar el sentido global y la información específica y explícita de textos orales, escritos y multimodales breves y sencillos sobre temas frecuentes y cotidianos, de relevancia personal o propios del ámbito profesional de especialización, expresados de forma clara y en el registro estándar de la lengua extranjera.",
      "7.2 Producir en lengua extranjera textos orales, escritos y multimodales, breves, sencillos, estructurados, comprensibles y adecuados a la situación comunicativa, siguiendo pautas establecidas y haciendo uso de herramientas y recursos analógicos y digitales.",
      "7.3 Participar en situaciones y acciones guiadas síncronas y asíncronas, breves y sencillas, en lengua extranjera, sobre temas cotidianos, de relevancia personal o próximos al ámbito profesional del ciclo, mostrando empatía y respeto por la cortesía lingüística y la etiqueta digital, así como por las diferentes necesidades, ideas, inquietudes, iniciativas y motivaciones de interlocutores e interlocutoras.",
      "7.4 Utilizar, de forma guiada y en entornos personales y de la propia especialidad profesional, estrategias adecuadas para iniciar, mantener y terminar la comunicación, tomar y ceder la palabra, solicitar y formular aclaraciones y explicaciones en lengua extranjera."
    ],
    "criterios_ca": [
      "7.1 Interpretar el sentit global i la informació específica i explícita de textos orals, escrits i multimodals breus i senzills sobre temes freqüents i quotidians, de rellevància personal o propis de l'àmbit professional d'especialització, expressats de forma clara i en el registre estàndard de la llengua estrangera.",
      "7.2 Produir en llengua estrangera textos orals, escrits i multimodals, breus, senzills, estructurats, comprensibles i adequats a la situació comunicativa, segons pautes establertes, fent ús de les eines i els recursos analògics i digitals.",
      "7.3 Participar en situacions i accions guiades síncrones i asíncrones, breus i senzilles, en llengua estrangera, sobre temes quotidians, de rellevància personal o propers a l'àmbit professional del cicle, mostrar empatia i respecte per la cortesia lingüística i l'etiqueta digital, així com per diferents necessitats, idees, inquietuds, iniciatives i motivacions d'interlocutors i interlocutores.",
      "7.4 Utilitzar, de manera guiada i en entorns personals i de la pròpia especialitat professional, estratègies adequades per iniciar, mantenir i acabar la comunicació, parlar i cedir la paraula, sol·licitar i formular aclariments i explicacions en llengua estrangera."
    ]
  },
  {
    "id": "CE8",
    "module": "Comunicación y Ciencias Sociales II",
    "module_es": "Comunicación y Ciencias Sociales II",
    "module_ca": "Comunicació i Ciències Socials II",
    "moduleCode": "3162",
    "tipoNivel": "FP_BASICA",
    "description": "Valorar críticamente y adecuarse a la diversidad lingüística y cultural, usando los repertorios personales y tomando conciencia de las estrategias y conocimientos propios, para gestionar de forma empática y respetuosa situaciones interculturales.",
    "description_es": "Valorar críticamente y adecuarse a la diversidad lingüística y cultural, usando los repertorios personales y tomando conciencia de las estrategias y conocimientos propios, para gestionar de forma empática y respetuosa situaciones interculturales.",
    "description_ca": "Valorar críticament i adequar-se a la diversitat lingüística i cultural, amb l’ús dels repertoris personals i prenent consciència de les estratègies i coneixements propis, per gestionar de manera empàtica i respectuosa situacions interculturals.",
    "criterios_es": [
      "8.1 Mejorar la capacidad de comunicarse en lengua extranjera utilizando los conocimientos y estrategias del repertorio lingüístico y cultural propio, con apoyo de otras y otros participantes y de soportes analógicos y digitales.",
      "8.2 Aceptar y valorar la diversidad lingüística y cultural como fuente de enriquecimiento personal y profesional, identificando los elementos culturales y lingüísticos que fomentan el respeto, la sostenibilidad y la democracia."
    ],
    "criterios_ca": [
      "8.1 Millorar la capacitat de comunicar-se en llengua estrangera utilitzant els coneixements i les estratègies del repertori lingüístic i cultural propi, amb el suport d'altres participants i l’ajuda de recursos analògics i digitals.",
      "8.2 Acceptar i valorar la diversitat lingüística i cultural com a font d'enriquiment personal i professional, mitjançant la identificació dels elements culturals i lingüístics que fomenten el respecte, la sostenibilitat i la democràcia."
    ]
  },
  {
    "id": "CE1",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Reconocer los motivos por los que ocurren los principales fenómenos naturales, a partir de situaciones cotidianas, y explicarlos en términos de las leyes y teorías científicas adecuadas, para poner en valor la contribución de la ciencia a la sociedad.",
    "description_es": "Reconocer los motivos por los que ocurren los principales fenómenos naturales, a partir de situaciones cotidianas, y explicarlos en términos de las leyes y teorías científicas adecuadas, para poner en valor la contribución de la ciencia a la sociedad.",
    "description_ca": "Reconèixer els motius pels quals ocorren els principals fenòmens naturals, a partir de situacions quotidianes, i explicar-los en termes de les lleis i teories científiques adequades, per posar en valor la contribució de la ciència a la societat.",
    "criterios_es": [
      "1.1 Explicar los fenómenos naturales más relevantes en términos de teorías, leyes y principios científicos adecuados como estrategia en la toma de decisiones fundamentadas.",
      "1.2 Justificar la contribución de la ciencia a la sociedad, y la labor de los hombres y mujeres dedicados a su desarrollo, entendiendo la investigación como una labor colectiva en constante evolución fruto de la interacción entre la ciencia, la tecnología, la sociedad y el medio ambiente."
    ],
    "criterios_ca": [
      "1.1 Explicar els fenòmens naturals més rellevants en termes de teories, lleis i principis científics adequats com a estratègia en la presa de decisions fonamentades.",
      "1.2 Justificar la contribució de la ciència a la societat i la tasca dels homes i dones dedicats al seu desenvolupament, entenent la investigació com una tasca col·lectiva en constant evolució fruit de la interacció entre la ciència, la tecnologia, la societat i el medi ambient."
    ]
  },
  {
    "id": "CE2",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Interpretar y modelizar en términos científicos problemas y situaciones de la vida cotidiana y profesional, aplicando diferentes estrategias, formas de razonamiento, herramientas tecnológicas y el pensamiento computacional, para hallar y analizar soluciones comprobando su validez.",
    "description_es": "Interpretar y modelizar en términos científicos problemas y situaciones de la vida cotidiana y profesional, aplicando diferentes estrategias, formas de razonamiento, herramientas tecnológicas y el pensamiento computacional, para hallar y analizar soluciones comprobando su validez.",
    "description_ca": "Interpretar i modelitzar en termes científics problemes i situacions de la vida quotidiana i professional i aplicar-hi diferents estratègies, formes de raonament, eines tecnològiques i el pensament computacional, per analitzar-los i trobar-hi solucions, comprovant-ne la validesa.",
    "criterios_es": [
      "2.1 Elaborar representaciones que ayuden en la búsqueda de estrategias de resolución de una situación problematizada, organizando los datos y comprendiendo las preguntas formuladas.",
      "2.2 Hallar las soluciones de un problema utilizando los datos e información aportados, los propios conocimientos, y las estrategias y herramientas apropiadas.",
      "2.3 Comprobar la corrección de las soluciones de un problema y su coherencia en el contexto planteado.",
      "2.4 Emplear herramientas tecnológicas adecuadas en la representación, la resolución de problemas y la comprobación de las soluciones."
    ],
    "criterios_ca": [
      "2.1 Elaborar representacions que ajudin a la recerca d'estratègies de resolució d'una situació problematitzada, mitjançant l’organització de les dades i la comprensió de les preguntes formulades.",
      "2.2 Trobar les solucions d'un problema amb les dades i la informació aportades, els coneixements propis i les estratègies i les eines adequades.",
      "2.3 Comprovar la correcció de les solucions d'un problema i la coherència en el context plantejat.",
      "2.4 Emprar eines tecnològiques adequades en la representació, la resolució de problemes i la comprovació de les solucions."
    ]
  },
  {
    "id": "CE3",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Utilizar los métodos científicos, haciendo indagaciones y llevando a cabo proyectos, para desarrollar los razonamientos propios del pensamiento científico y mejorar las destrezas en el uso de las metodologías científicas.",
    "description_es": "Utilizar los métodos científicos, haciendo indagaciones y llevando a cabo proyectos, para desarrollar los razonamientos propios del pensamiento científico y mejorar las destrezas en el uso de las metodologías científicas.",
    "description_ca": "Utilitzar els mètodes científics, indagar i dur a terme projectes per desenvolupar els raonaments propis del pensament científic i millorar les destreses en l’ús de les metodologies científiques.",
    "criterios_es": [
      "3.1 Plantear preguntas e hipótesis que puedan ser respondidas o contrastadas utilizando los métodos científicos, la observación, la información y el razonamiento, explicando fenómenos naturales y realizando predicciones sobre estos.",
      "3.2 Diseñar y realizar experimentos y obtener datos cuantitativos y cualitativos sobre fenómenos naturales en el medio natural y en el laboratorio, utilizando con corrección los instrumentos, herramientas o técnicas adecuadas a la hora de obtener resultados claros que respondan a cuestiones concretas o que contrasten la veracidad de una hipótesis.",
      "3.3 Interpretar los resultados obtenidos en proyectos de investigación, utilizando el razonamiento y, cuando sea necesario, herramientas matemáticas y tecnológicas."
    ],
    "criterios_ca": [
      "3.1 Plantejar preguntes i hipòtesis que puguin ser respostes o contrastades utilitzant els mètodes científics, l'observació, la informació i el raonament, explicant fenòmens naturals i fent prediccions sobre aquests.",
      "3.2 Dissenyar i fer experiments i obtenir dades quantitatives i qualitatives sobre fenòmens naturals al medi natural i al laboratori, utilitzar amb correcció els instruments, eines o tècniques adequades a l'hora d'obtenir resultats clars que responguin a qüestions concretes o que contrastin la veracitat d’una hipòtesi.",
      "3.3 Interpretar els resultats obtinguts en projectes de recerca, mitjançant el raonament i, quan calgui, amb eines matemàtiques i tecnològiques."
    ]
  },
  {
    "id": "CE4",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Analizar los efectos de determinadas acciones cotidianas o del entorno profesional sobre la salud, el medio natural y social, basándose en fundamentos científicos y con especial atención al entorno de las Illes Balears, para valorar la importancia de los hábitos que mejoran la salud individual y colectiva, evitan o minimizan los impactos medioambientales negativos y son compatibles con un desarrollo sostenible.",
    "description_es": "Analizar los efectos de determinadas acciones cotidianas o del entorno profesional sobre la salud, el medio natural y social, basándose en fundamentos científicos y con especial atención al entorno de las Illes Balears, para valorar la importancia de los hábitos que mejoran la salud individual y colectiva, evitan o minimizan los impactos medioambientales negativos y son compatibles con un desarrollo sostenible.",
    "description_ca": "Analitzar els efectes de determinades accions quotidianes o de l'entorn professional sobre la salut, el medi natural i social, basant-se en fonaments científics i amb especial atenció a l’entorn de les Illes Balears, per valorar la importància dels hàbits que milloren la salut individual i col·lectiva, eviten o minimitzen els impactes mediambientals negatius i són compatibles amb un desenvolupament sostenible.",
    "criterios_es": [
      "4.1 Evaluar los efectos de determinadas acciones individuales sobre el organismo y el medio natural, proponiendo hábitos saludables y sostenibles basados en los conocimientos adquiridos y la información disponible.",
      "4.2 Relacionar con fundamentos científicos la preservación de la biodiversidad, la conservación del medio ambiente y la protección de los seres vivos con el desarrollo sostenible y la calidad de vida, dentro del entorno de las Illes Balears."
    ],
    "criterios_ca": [
      "4.1 Avaluar els efectes de determinades accions individuals sobre l'organisme i el medi natural i proposar hàbits saludables i sostenibles basats en els coneixements adquirits i la informació disponible.",
      "4.2 Relacionar amb fonaments científics, la preservació de la biodiversitat, la conservació del medi ambient i la protecció dels éssers vius amb el desenvolupament sostenible i la qualitat de vida, dins l’entorn de les Illes Balears."
    ]
  },
  {
    "id": "CE5",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Interpretar y transmitir información y datos científicos, contrastando previamente su veracidad y utilizando lenguaje verbal o gráfico apropiado, para adquirir y afianzar conocimientos del entorno natural, social y profesional.",
    "description_es": "Interpretar y transmitir información y datos científicos, contrastando previamente su veracidad y utilizando lenguaje verbal o gráfico apropiado, para adquirir y afianzar conocimientos del entorno natural, social y profesional.",
    "description_ca": "Interpretar i transmetre informació i dades científiques, contrastar-ne prèviament la veracitat i utilitzar llenguatge verbal o gràfic apropiat, per adquirir i consolidar coneixements de l'entorn natural, social i professional.",
    "criterios_es": [
      "5.1 Organizar y comunicar información científica y matemática de forma clara y rigurosa de manera verbal, gráfica, numérica, etc. utilizando el formato más adecuado.",
      "5.2 Analizar e interpretar información científica y matemática presente en la vida cotidiana manteniendo una actitud crítica.",
      "5.3 Emplear y citar de forma adecuada fuentes fiables, seleccionando la información científica relevante en la consulta y creación de contenidos, y mejorando el aprendizaje propio y colectivo."
    ],
    "criterios_ca": [
      "5.1 Organitzar i comunicar informació científica i matemàtica de manera clara i rigorosa verbal, gràfica, numèrica, etc., fent servir el format més adequat.",
      "5.2 Analitzar i interpretar informació científica i matemàtica present a la vida quotidiana amb una actitud crítica.",
      "5.3 Emprar i citar de manera adequada fonts fiables, amb la selecció de la informació científica rellevant en la consulta i la creació de continguts, i millorar l'aprenentatge propi i col·lectiu."
    ]
  },
  {
    "id": "CE6",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Identificar las ciencias y las matemáticas implicadas en contextos diversos, interrelacionando conceptos y procedimientos, para aplicarlos en situaciones de la vida cotidiana y del ámbito profesional correspondiente.",
    "description_es": "Identificar las ciencias y las matemáticas implicadas en contextos diversos, interrelacionando conceptos y procedimientos, para aplicarlos en situaciones de la vida cotidiana y del ámbito profesional correspondiente.",
    "description_ca": "Identificar les ciències i les matemàtiques implicades en contextos diversos, mitjançant la interrelació de conceptes i procediments, per aplicar-los en situacions de la vida quotidiana i de l’àmbit professional corresponent.",
    "criterios_es": [
      "6.1 Aplicar procedimientos propios de las ciencias y las matemáticas en situaciones diversas estableciendo conexiones entre distintas áreas de conocimiento en contextos naturales, sociales y profesionales."
    ],
    "criterios_ca": [
      "6.1 Aplicar procediments propis de les ciències i les matemàtiques en situacions diverses i establir connexions entre diferents àrees de coneixement en contextos naturals, socials i professionals."
    ]
  },
  {
    "id": "CE7",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Desarrollar destrezas personales identificando y gestionando emociones, poniendo en práctica estrategias de aceptación del error como parte del proceso de aprendizaje y adaptándose ante situaciones de incertidumbre, para mejorar la perseverancia en la consecución de objetivos y la valoración del aprendizaje de las ciencias.",
    "description_es": "Desarrollar destrezas personales identificando y gestionando emociones, poniendo en práctica estrategias de aceptación del error como parte del proceso de aprendizaje y adaptándose ante situaciones de incertidumbre, para mejorar la perseverancia en la consecución de objetivos y la valoración del aprendizaje de las ciencias.",
    "description_ca": "Desenvolupar destreses personals per identificar i gestionar emocions, per posar en pràctica estratègies d'acceptació de l'error com a part del procés d'aprenentatge i adaptar-se a les situacions d'incertesa, per millorar la perseverança en la consecució d'objectius i la valoració de l'aprenentatge de les ciències.",
    "criterios_es": [
      "7.1 Mostrar resiliencia ante los retos académicos asumiendo el error como una oportunidad para la mejora y desarrollando un autoconcepto positivo ante las ciencias."
    ],
    "criterios_ca": [
      "7.1 Mostrar resiliència davant els reptes acadèmics, assumir l'error com una oportunitat per a la millora i desenvolupar un autoconcepte positiu davant de les ciències."
    ]
  },
  {
    "id": "CE8",
    "module": "Ciencias Aplicadas II",
    "module_es": "Ciencias Aplicadas II",
    "module_ca": "Ciències Aplicades II",
    "moduleCode": "3164",
    "tipoNivel": "FP_BASICA",
    "description": "Desarrollar destrezas sociales y trabajar de forma colaborativa en equipos diversos con roles asignados que permitan potenciar el crecimiento entre iguales, valorando la importancia de romper los estereotipos de género en la investigación científica, para el emprendimiento personal y laboral.",
    "description_es": "Desarrollar destrezas sociales y trabajar de forma colaborativa en equipos diversos con roles asignados que permitan potenciar el crecimiento entre iguales, valorando la importancia de romper los estereotipos de género en la investigación científica, para el emprendimiento personal y laboral.",
    "description_ca": "Desenvolupar destreses socials i treballar de forma col·laborativa en equips diversos amb rols assignats que permetin potenciar el creixement entre iguals i valorar la importància de trencar els estereotips de gènere a la investigació científica, per a l'emprenedoria personal i laboral.",
    "criterios_es": [
      "8.1 Asumir responsablemente una función concreta dentro de un proyecto científico, utilizando espacios virtuales cuando sea necesario, aportando valor, analizando críticamente las contribuciones del resto del equipo, respetando la diversidad y favoreciendo la inclusión.",
      "8.2 Emprender, de forma guiada y de acuerdo a la metodología adecuada, proyectos científicos colaborativos orientados a la mejora y a la creación de valor en la sociedad."
    ],
    "criterios_ca": [
      "8.1 Assumir responsablement una funció concreta en un projecte científic, amb l’ús d’espais virtuals, quan calgui, aportar valor, analitzar críticament les contribucions de la resta de l'equip, respectar la diversitat i afavorir-ne la inclusió.",
      "8.2 Emprendre, de manera guiada i d'acord amb la metodologia adequada, projectes científics col·laboratius orientats a la millora i a la creació de valor a la societat."
    ]
  }
];
