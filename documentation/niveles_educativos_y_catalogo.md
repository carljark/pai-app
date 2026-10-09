# Niveles educativos y catálogo de niveles

## Catálogo único

`backend/src/data/niveles.ts` es la fuente única de los niveles educativos (titulaciones). Cada entrada define:

| Campo | Uso |
|---|---|
| `id` | Valor de `tipoNivel` en proyectos, RA y CE (`FP_BASICA`, `CFGM_ESTETICA`, `ESO_ORDINARIA`…). |
| `etapa` | `FPB`, `CFGM`, `CFGS` o `ESO`. El frontend la muestra como sigla («CFGB» para la FPB) en el mapa. |
| `comunidad` | Currículo aplicado: `IB` (Illes Balears) o `estatal`. |
| `nombre_es` / `nombre_ca` | Nombre oficial: desplegable del generador, pestañas del historial, filtros, tarjetas de proyecto, exportación y mapa. |
| `nombrePrompt_es` / `nombrePrompt_ca` | Opcional. Nombre del nivel en el prompt («2º de …»); si falta, se usa el nombre oficial. |
| `palabrasClave` | Opcional. Familia profesional o etapa para elegir los ejemplos INTEF del prompt (`LEVEL_KEYWORDS`). |
| `unidad` | `RA` (FP) o `CE` (ESO): qué se selecciona al crear un proyecto. |
| `terminologia` | `proyecto_intermodular` o `situacion_aprendizaje`. |
| `cursos` | Cursos del nivel; el primero es el de por defecto. `edad` es opcional y llega al prompt. `modulos` (FP) son los códigos de los módulos del curso en su orden oficial: filtran y ordenan el selector curricular y los módulos del proyecto generado. |
| `mapas` | Pestañas del mapa intermodular del nivel: `tab` (id histórico de `MapaModule.tab`), `curso` (sin curso, el mapa abarca todo el ciclo) y la selección inicial (`moduleCode`, `raId`). |

### Backend

- `GET /api/niveles` sirve el catálogo al frontend.
- `Project.tipoNivel` y `RA.tipoNivel` se validan contra `NIVEL_IDS`; `DEFAULT_TIPO_NIVEL` (`FP_BASICA`) es el nivel de los proyectos y RA antiguos sin `tipoNivel`.
- `MapaModule.tab` y el parámetro `tab` de `GET /api/mapa-intermodular` se validan contra `MAPA_TABS`, derivado de `mapas`. Los ids de pestaña (`FPB`, `CFGM`, `CFGM_PELUQUERIA_2`…) se conservan para no migrar datos.
- `describeTargetCourse` describe el curso destino con `nombrePrompt` (o el nombre oficial) en el idioma del proyecto; `LEVEL_KEYWORDS` sale de `palabrasClave`.
- Las reglas propias de un nivel (Carpeta de Aprendizaje de FP Básica, instrucciones de la ESO) son lógica con nombre propio en el backend, no datos del catálogo.
- `backend/src/tests/niveles-catalogo.test.ts` comprueba que los `modulos` cubren exactamente los RA de cada ciclo y que todos los `tipoNivel` y `tab` de datos y migraciones están en el catálogo.

### Frontend

`NivelesService` carga el catálogo al iniciar sesión (junto a los RA) y ofrece `find`, `nombreDe`, `cursos`, `cursoPorDefecto`, `modulos`, `usaRa`, `nivelPorDefecto`, `mapaTabs`, `mapaTab` y `sigla`. De él salen:

- el desplegable de titulación y los cursos del generador;
- los módulos de cada curso y su orden (`CurriculumFacade`); al cargar el catálogo, un nivel o curso guardado en `localStorage` que ya no existe pasa al nivel por defecto o al primer curso;
- las pestañas del historial (una por nivel, con el `tipoNivel` como id) y los filtros de «Mis proyectos»;
- el nombre del nivel en tarjetas de inicio, «Mis proyectos», Taller (pipe `nivelNombre`) y exportación;
- el selector de ciclo y curso del mapa, su selección inicial, el título y los textos con la sigla de la etapa.

`normalizeTipoNivel` (modelo de proyectos) trata los valores antiguos: vacío → `FP_BASICA` y `ESO` → `DIVERSIFICACION_CURRICULAR`. Si el catálogo no carga, el historial muestra un aviso (`levelsLoadError`).

Los RA solo están en MongoDB (`GET /api/ras`): el frontend ya no incluye RA de respaldo (`curriculum/data/ras_*.data.ts`, unos 600 KB). Si la API falla, el selector curricular queda vacío, como ya pasaba con la ESO.

## Cómo añadir un nivel

1. Añadir la entrada en `backend/src/data/niveles.ts`: nombres oficiales ES/CA, cursos (con `modulos` en FP) y `mapas` si tiene mapa intermodular.
2. Cargar sus datos curriculares en MongoDB con una migración nueva (`backend/src/migrations/NN_*.ts`), a partir de datos en `backend/src/data/` (nunca como semillas en el bundle del frontend).
3. Ciclos FP o niveles de ESO: seguir la skill `agregar-ciclo-educativo` (RA bilingües, mapa intermodular y tests).

El frontend no se toca.

## Módulos transversales compartidos (FP)

Los módulos comunes de la reforma de 2024 tienen **un único texto en todos los ciclos** (tareas 209 y 210):
- 1664 Digitalización (GM), 1708 Sostenibilidad, 1709 y 1710 Itinerario personal para la empleabilidad I y II, y 0156 Inglés profesional (GM): **RD 659/2023, texto consolidado** (última modificación: 6/5/2025).
- 1713 Proyecto intermodular (GM): RD 499/2024, anexo II.

El catalán es una traducción canónica en catalán balear, sin formas valencianas («seva», no «seua») ni calcos como «del mateix». La referencia es `ras_cfgm_atencion_dependencia.data.ts`. `ras-atencion-dependencia.test.ts` comprueba que Peluquería, Estética y Educación Infantil tienen el mismo texto (1708, 1709 y 1710 también en grado superior).

Al añadir un ciclo, estos módulos se copian de ahí, no de otra fuente. Si se corrige uno, se corrige en todos los ciclos y en sus mapas.

## CFGM Atención a Personas en Situación de Dependencia (`CFGM_ATENCION_DEPENDENCIA`)

Ciclo SSC21 de la familia Servicios Socioculturales y a la Comunidad (tarea 208). No tiene mapa intermodular.

### Fuente normativa

- **Módulos y cursos:** ficha del ciclo en FP Illes Balears (<https://www.caib.es/sites/fp/ca/atencia_a_persones_en_situacia_de_dependancia/>), tabla «Matriculats a partir del curs 2026/27».
  - 1.º: 0020, 0210, 0212, 0213, 0215, 0217, 1664 y 1709.
  - 2.º: 0211, 0214, 0216, 0831, 0156, 1708, 1710 y 1713.
  - El módulo optativo no se carga porque no tiene currículo propio. FOL (0218), EIE (0219) y FCT (0220), que siguen en el RD de 2011, ya no se imparten.
- **Castellano:**
  - RA y criterios de 0020, 0210-0217 y 0831: anexo I del **RD 1593/2011** (BOE núm. 301). El BOE no tiene versión consolidada de este RD. El **RD 499/2024** solo cambia del título el artículo 6 y los anexos III y V.
  - 1664, 1708, 1709, 1710 y 0156: **RD 659/2023, texto consolidado** (última modificación: 6/5/2025). Este texto cambia, por ejemplo, el RA2 de 1709 («Adquiere las competencias necesarias para el desempeño de las funciones de nivel básico en Prevención de Riesgos Laborales»).
  - 1713 Proyecto intermodular: anexo II del **RD 499/2024**.
- **Catalán:**
  - La CAIB aplica currículos autonómicos «en fase d'esborrany», sin texto publicado, así que la traducción es propia, con la terminología de FP balear.
  - Los nombres de los módulos son los de la ficha de la CAIB.
  - Los transversales y parte de 0020 reutilizan el catalán ya revisado de Peluquería y Educación Infantil cuando el castellano coincide.

### Datos y extracción

- `backend/src/data/ras_cfgm_atencion_dependencia.data.ts`: 16 módulos, 78 RA y 590 criterios. Los carga la migración `26_ingest_cfgm_atencion_dependencia_ras.ts`, que es reejecutable y solo toca este nivel.
- Un script temporal extrae los textos de los PDF oficiales. Se comprueba que cada texto castellano aparece literalmente en su BOE, que la numeración de RA y letras es consecutiva y que hay paridad ES/CA.
- **Erratas del BOE:**
  - El RD 1593/2011 escribe «Código 0212» sin dos puntos.
  - Falta el punto final en 0211 RA2 b) y 0215 RA2 b); se añade.
  - El RD 499/2024 repite la letra «a)» en el RA5 de 1713; se renumera a)-d), como en Peluquería.
- **Diferencias con otros ciclos:** el 0020 de este RD usa «persona accidentada» y «que hay que conseguir». El de Educación Infantil (RD 1394/2007) dice «accidentado» y «a conseguir», así que cada ciclo conserva el texto de su RD.

## CFGM Guía en el Medio Natural y de Tiempo Libre (`CFGM_GUIA_MEDIO_NATURAL`)

Ciclo AFD21 de la familia Actividades Físicas y Deportivas (tarea 212). No tiene mapa intermodular.

### Fuente normativa

- **Módulos y cursos:** ficha del ciclo en FP Illes Balears (<https://www.caib.es/sites/fp/ca/guia_en_el_medi_natural_i_de_temps_lliure/>), tabla «Matriculats a partir del curs 2026/27», idéntica a la de 2024/25 y 2025/26.
  - 1.º: 1325, 1327, 1329, 1333, 1334, 1335, 1336, 1664 y 1709.
  - 2.º: 1328, 1337, 1338, 1339, 0156, 1708, 1710 y 1713.
  - El módulo optativo no se carga porque no tiene currículo propio. El título no incluye Primeros auxilios (0020): su contenido está en Socorrismo en el medio natural (1337).
- **Castellano:**
  - Módulos propios (1325-1339): anexo I del **RD 402/2020, texto consolidado** (BOE-A-2020-2738, última actualización 28/5/2024).
  - Transversales (1664, 1709, 0156, 1708, 1710 y 1713): el texto canónico compartido con los demás ciclos (ver «Módulos transversales compartidos»). El 1713 del texto consolidado del RD 402/2020 es el mismo del RD 499/2024, con la letra «a)» repetida en el RA5.
- **Catalán:**
  - La CAIB aplica currículos autonómicos «en fase d'esborrany», sin texto publicado. La traducción de los módulos propios es propia, con el agente `traductor-es-ca` y la terminología de FP balear.
  - Los nombres de los módulos son los de la ficha de la CAIB. El 1338 se llama allí «Guia en el medi aquàtic», aunque el BOE dice «Guía en el medio natural acuático».

### Datos y extracción

- `backend/src/data/ras_cfgm_guia_medio_natural.data.ts`: 17 módulos, 97 RA y 651 criterios (66 RA y 425 criterios de los módulos propios). Los carga la migración `30_ingest_cfgm_guia_medio_natural_ras.ts`, que es reejecutable y solo toca este nivel.
- Un script temporal extrae los textos del PDF consolidado del BOE y comprueba que cada texto castellano aparece literalmente en él, que la numeración de RA y letras es consecutiva y que hay paridad ES/CA.
- **Erratas del BOE:**
  - En 1338 RA1, los criterios c) y d) están en el mismo párrafo («…para la ruta. d) Se ha seleccionado…»); se separan.
  - Falta el punto final en seis criterios (1334 RA1 b) y RA2 d), 1337 RA6 f), 1338 RA3 c) y RA5 e), y 1339 RA6 e)); se añade.
  - 1336 RA5 d) es el único criterio que no empieza por «Se ha»: «Se ejecutan las diferentes fases…» («S'executen…»).
  - 1337 RA6 g) incluye una lista de pruebas con guiones «−»; se conserva en un único criterio.
- **Decisiones de traducción:** «conducción del diestro» → «conducció de l'èquid de la mà»; «zafaduras» → «alliberament»; «franqueo de pequeños saltos» → «franqueig de petits salts»; «pozas» → «gorgs»; «vías ferratas» → «vies ferrades».

## CFGM Cuidados Auxiliares de Enfermería (`CFGM_CUIDADOS_AUXILIARES_ENFERMERIA`)

Ciclo SAN23 de la familia Sanidad (tarea 213). No tiene mapa intermodular. Es el primer título **LOGSE** del catálogo.

### Fuente normativa

- **Ordenación:** según la ficha de FP Illes Balears (<https://www.caib.es/sites/fp/ca/cures_auxiliars_dinfermeria/>), el ciclo es LOGSE y en Baleares se aplican los currículos estatales. No hay currículo autonómico ni texto oficial en catalán.
- **Castellano:** capacidades terminales y criterios de evaluación del **RD 546/1995** (título y enseñanzas mínimas, BOE-A-1995-13533). El RD 558/1995 (currículo, BOE-A-1995-13592) solo añade contenidos y remite al 546 para capacidades y criterios.
- **Catalán:** traducción propia con el agente `traductor-es-ca` (dos lotes). Nombres de los módulos traducidos («Tècniques bàsiques d'infermeria», «Higiene del medi hospitalari i neteja de material», etc.).
- **Sustitución prevista:** el Ministerio sometió a consulta pública en junio de 2026 el proyecto de RD del título LOE «Técnico en Cuidados de enfermería». Cuando se publique y la CAIB lo implante, este ciclo deberá recargarse con los RA del nuevo título (nuevo `tipoNivel` o migración de recarga).

### Adaptación LOGSE al modelo de RA

- **Capacidades terminales como RA:** cada capacidad terminal se guarda como un RA (`RA1` = capacidad N.1 del módulo N) y sus criterios llevan letras `a)`, `b)`… en el orden del RD. Los criterios LOGSE están en infinitivo («Explicar…», «Describir…»), no en la forma «Se ha…» de la LOE.
- **Códigos de módulo:** los módulos LOGSE no tienen código oficial. Se usan `CAE1`-`CAE7`, con la numeración del RD (el 6, Relaciones en el equipo de trabajo, es transversal; el 7 es FOL). El prompt los muestra como «CAE2 Técnicas básicas de enfermería».
- **Cursos:** un solo curso (`1º`) con los siete módulos: el ciclo dura 1.400 horas, con un curso en el centro y la FCT.
- **FCT:** no se carga, como en los demás ciclos, que no incluyen la formación en empresa.
- Los módulos transversales LOE compartidos (1664, 1709, 0156, 1708, 1710 y 1713) no existen en este título.

### Datos y extracción

- `backend/src/data/ras_cfgm_cuidados_auxiliares_enfermeria.data.ts`: 7 módulos, 30 capacidades y 173 criterios. Los carga la migración `31_ingest_cfgm_cuidados_auxiliares_enfermeria_ras.ts`, que es reejecutable y solo toca este nivel.
- Un script temporal extrae los textos del HTML del BOE. En él, las dos columnas de la tabla «Capacidades terminales / Criterios de evaluación» se separan con « / » en la primera fila de cada capacidad. El script comprueba que cada texto castellano aparece literalmente en el BOE y que la numeración de capacidades (1.1-1.3, 2.1-2.6, 3.1-3.4, 4.1-4.3, 5.1-5.4 y 6.1-6.5) coincide.
- **Particularidades del BOE:** las capacidades de FOL no van numeradas. Los criterios «En un supuesto práctico…: …» incluyen una lista interna que se conserva en un único criterio. CAE2 RA4 g) escribe «específicado» con tilde; se conserva en castellano y se traduce «especificat».
- **Decisiones de traducción:** «botiquín» → «farmaciola»; «sábana de arrastre» → «llençol travesser»; «camilla» → «llitera»; «calzas» → «peücs»; «ancianos» → «persones grans»; «lesionados» → «ferits»; «liquidación de haberes» → «liquidació de havers»; «sillón dental» → «cadira dental».

## CFGS Acondicionamiento Físico (`CFGS_ACONDICIONAMIENTO_FISICO`)

Ciclo AFD32 de la familia Actividades Físicas y Deportivas (tarea 214). No tiene mapa intermodular.

### Fuente normativa

- **Módulos y cursos:** ficha del ciclo en FP Illes Balears (<https://www.caib.es/sites/fp/ca/condicionament_fisic/>), tabla «Matriculats a partir del curs 2026/27».
  - 1.º: 0017, 1136, 1148, 1149, 1151, 1665 y 1709.
  - 2.º: 1150, 1152, 1153, 1154, 0179, 1708 y 1710.
  - El módulo optativo y las horas reservadas al módulo en inglés no se cargan porque no tienen currículo propio. FOL (1155), EIE (1156) y FCT (1157) del RD de 2017 ya no se imparten.
- **Castellano:**
  - Módulos propios (0017, 1136, 1148-1154): anexo I del **RD 651/2017** (BOE-A-2017-7981). El BOE no tiene versión consolidada; el **RD 500/2024** solo cambia del título el artículo 6 y los anexos III y V, y renombra el 1154 «Proyecto de acondicionamiento físico» como «Proyecto intermodular de acondicionamiento físico».
  - Transversales de grado superior (1665, 1709, 0179, 1708 y 1710): el mismo texto del CFGS Educación Infantil (ver «Módulos transversales compartidos»).
- **Catalán:**
  - La CAIB aplica currículos autonómicos «en fase d'esborrany», sin texto publicado. La traducción de los módulos propios es propia, con el agente `traductor-es-ca` (dos lotes) y la terminología de FP balear. 84 textos idénticos a los de otros ciclos (casi todo el 0017, parte del 1136 y del proyecto) reutilizan su catalán ya revisado.
  - Los nombres de los módulos son los de la ficha de la CAIB («Fitnes en sala d'entrenament polivalent», «Condicionament físic a l'aigua»). El 1154 aparece allí solo como «Projecte intermodular»; se usa «Projecte intermodular de condicionament físic», en paralelo al nombre del BOE.

### Datos y extracción

- `backend/src/data/ras_cfgs_acondicionamiento_fisico.data.ts`: 14 módulos, 78 RA y 569 criterios (51 RA y 373 criterios de los módulos propios). Los carga la migración `32_ingest_cfgs_acondicionamiento_fisico_ras.ts`, que es reejecutable y solo toca este nivel.
- Un script temporal extrae los textos del HTML del BOE y comprueba que cada texto castellano aparece literalmente en él, que la numeración de RA y letras es consecutiva y que hay paridad ES/CA.
- **Erratas del BOE:**
  - Falta el punto final en la descripción de 1136 RA4; se añade.
  - 1136 RA4 e) acaba en coma («…valoración cardiofuncional,»); se cambia por punto.
  - 1150 RA2 b) dice «series de coreografiadas»; se conserva en castellano y se traduce «sèries coreografiades».
  - 1151 RA6 g) incluye una lista de pruebas de socorrismo con guiones «-»; se conserva en un único criterio, como el 1337 RA6 g) de Guía en el Medio Natural.
- **Decisiones de traducción:** «fitness» → «fitnes» (forma de la CAIB); «acondicionamiento físico» → «condicionament físic»; «soporte musical» → «suport musical»; «hidrocinesia» → «hidrocinèsia»; «camillas» → «lliteres»; «músculo-esquelético» → «musculoesquelètic».

## CFGS Enseñanza y Animación Sociodeportiva (`CFGS_ANIMACION_SOCIODEPORTIVA`)

Ciclo de la familia Actividades Físicas y Deportivas (tarea 216). No tiene mapa intermodular.

### Fuente normativa

- **Módulos y cursos:** ficha del ciclo en FP Illes Balears (<https://www.caib.es/sites/fp/ca/ensenyament_i_animacio_socioesportiva/>), tabla «Matriculats a partir del curs 2026/27».
  - 1.º: 1124, 1136, 1138, 1139, 1141, 1143, 1665 y 1709.
  - 2.º: 1123, 1137, 1140, 1142, 1144, 0179, 1708 y 1710.
  - No se cargan el módulo optativo ni las horas reservadas al módulo en inglés, que no tienen currículo propio. FOL (1145), EIE (1146) y FCT (1147) del RD de 2017 ya no se imparten.
- **Castellano:**
  - Módulos propios (1123, 1124, 1137-1144): anexo I del **RD 653/2017** (BOE-A-2017-8301). El **RD 500/2024** renombra el 1144 «Proyecto de enseñanza y animación sociodeportiva» como «Proyecto intermodular de enseñanza y animación sociodeportiva».
  - 1136 (Valoración de la condición física e intervención en accidentes): mismo texto que en el CFGS Acondicionamiento Físico, con sus erratas ya corregidas.
  - Transversales de grado superior (1665, 1709, 0179, 1708 y 1710): ver «Módulos transversales compartidos».
- **Catalán:**
  - Currículo autonómico «en fase d'esborrany», sin texto publicado. Traducción propia con el agente `traductor-es-ca` (tres lotes, 394 textos). 41 textos idénticos a los de otros ciclos reutilizan su catalán ya revisado.
  - Nombres de los módulos según la ficha de la CAIB. Dos decisiones:
    - La CAIB escribe «Planificació de l'animació sociesportiva»; se corrige a «socioesportiva».
    - El 1141 es «Activitats fisicoesportives amb objectes» en la CAIB y «de implementos» en el BOE; en los textos catalanes se usa «amb objectes» por coherencia con el nombre del módulo.
  - El 1144 aparece en la CAIB solo como «Projecte intermodular»; se usa «Projecte intermodular d'ensenyament i animació socioesportiva», en paralelo al BOE.

### Datos y extracción

- `backend/src/data/ras_cfgs_animacion_sociodeportiva.data.ts`: 16 módulos, 90 RA y 634 criterios (63 RA y 438 criterios sin contar los transversales). Los carga la migración `33_ingest_cfgs_animacion_sociodeportiva_ras.ts`, reejecutable y limitada a este nivel.
- Un script temporal extrae los textos del HTML del BOE y comprueba que cada texto castellano aparece literalmente en él, que la numeración de RA y letras es consecutiva y que hay paridad ES/CA.
- **Erratas del BOE:**
  - 1137 RA4 b) no tiene punto final; se añade.
  - 1139 RA3 g) incluye una lista de pruebas de socorrismo con guiones «-»; se conserva en un único criterio, como el 1151 RA6 g) de Acondicionamiento Físico.

## CFGS Integración Social (`CFGS_INTEGRACION_SOCIAL`)

Título de Técnico Superior en Integración Social (SSC33), familia Servicios Socioculturales y a la Comunidad. Sin mapa intermodular (tarea 217).

### Fuente normativa

- **Módulos y cursos:** ficha del ciclo en FP Illes Balears (<https://www.caib.es/sites/fp/ca/integracio_social/>), tabla «Matriculats a partir del curs 2026/27».
  - 1.º: 0337, 0338, 0340, 0342, 0344, 1665 y 1709.
  - 2.º: 0017, 0020, 0339, 0341, 0343, 0345, 0179, 1708 y 1710.
  - No se cargan el módulo optativo ni las horas reservadas al módulo en inglés. FOL (0346), EIE (0347) y FCT (0348) del RD de 2012 ya no se imparten.
- **Castellano:**
  - Anexo I del **RD 1074/2012** (BOE-A-2012-10866). El BOE no muestra la versión consolidada del anexo, así que se extrae el texto original.
  - **RD 289/2023** (BOE-A-2023-10395): sustituye la redacción de los módulos 0017, 0337, 0338, 0339, 0340, 0341 y 0343, que se toman de él. Los 0020, 0342, 0344 y 0345 no cambian.
  - **RD 500/2024** (BOE-A-2024-10685): renombra el 0345 «Proyecto de integración social» como «Proyecto intermodular de integración social».
  - Transversales de grado superior (1665, 1709, 0179, 1708 y 1710): ver «Módulos transversales compartidos».
  - El 0017 y el 0020 tienen el mismo código que en Educación Infantil, pero el texto no es idéntico: el RD 289/2023 añade comas al 0017 (RA2 a) y descripción del RA4), y el 0020 RA2 dice «con el objetivo que se quiere conseguir».
- **Catalán:**
  - Currículo autonómico «en fase d'esborrany», sin texto publicado. Traducción propia con el agente `traductor-es-ca` (tres lotes, 380 textos). 123 textos idénticos a los de otros ciclos (sobre todo del 0017, 0020 y 0345) reutilizan su catalán ya revisado.
  - Nombres de los módulos según la ficha de la CAIB. El 0341 es «Suport a la intervenció socioeducativa» en la CAIB y «Apoyo a la intervención educativa» en el BOE; se mantiene el nombre oficial de cada idioma.
  - El 0345 aparece en la CAIB solo como «Projecte intermodular»; se usa «Projecte intermodular d'integració social», en paralelo al BOE.

### Datos y extracción

- `backend/src/data/ras_cfgs_integracion_social.data.ts`: 16 módulos, 81 RA y 645 criterios (54 RA y 449 criterios sin contar los transversales). Los carga la migración `34_ingest_cfgs_integracion_social_ras.ts`, reejecutable y limitada a este nivel.
- Un script temporal extrae los textos del HTML del BOE (anexo I de 2012 y apartado «Seis» del RD 289/2023) y comprueba que cada texto castellano aparece literalmente, que la numeración de RA y letras es consecutiva y que hay paridad ES/CA.
- **Erratas del BOE, que se conservan en castellano por ser el texto oficial:**
  - 0340 RA2 e) «Se ha planificado actividades apropiadas en los procesos mediación…» (concordancia y falta «de»). En catalán: «S'han planificat activitats… en els processos de mediació…».
  - 0343 RA2 e) «productos de apoyo adecuadas». En catalán, «productes de suport adequats».

## CFGS Laboratorio Clínico y Biomédico (`CFGS_LABORATORIO_CLINICO`)

Título de Técnico Superior en Laboratorio Clínico y Biomédico (SAN36), familia Sanidad. `codigoCaib: 'SAN36'`. Sin mapa intermodular (tarea 219).

### Fuente normativa

- **Módulos y cursos:** ficha del ciclo en FP Illes Balears (<https://www.caib.es/sites/fp/ca/laboratori_clinic_i_biomedic/>), tabla «Matriculats a partir del curs 2026/27».
  - 1.º: 1367, 1368, 1369, 1370, 0179, 1665 y 1709. En este ciclo, el inglés profesional va en 1.º.
  - 2.º: 1371, 1372, 1373, 1374, 1375, 1708 y 1710.
  - No se cargan el módulo optativo ni las horas reservadas al módulo en inglés. FOL (1376), EIE (1377) y FCT (1378) del RD de 2014 ya no se imparten.
- **Castellano:**
  - Anexo I del **RD 771/2014** (BOE-A-2014-10068). El RD 500/2024 solo renombra el 1375 «Proyecto de laboratorio clínico y biomédico» como «Proyecto intermodular de laboratorio clínico y biomédico».
  - Transversales de grado superior (0179, 1665, 1709, 1708 y 1710): ver «Módulos transversales compartidos».
- **Catalán:**
  - Currículo autonómico «en fase d'esborrany». El BOE no tiene traducción catalana de este real decreto, y el PDF que publica la CAIB es el texto castellano del BOE.
  - Traducción propia con el agente `traductor-es-ca` (tres lotes, 524 textos). 37 textos, casi todos del proyecto 1375, reutilizan el catalán ya revisado de otros ciclos.
  - Nombres de los módulos según la ficha de la CAIB. Se corrige la concordancia del 1374: la CAIB escribe «Tècniques d'anàlisi hematològic» y aquí se usa «hematològica», porque «anàlisi» es femenino en catalán.
  - El 1375 aparece en la CAIB solo como «Projecte intermodular»; se usa «Projecte intermodular de laboratori clínic i biomèdic», en paralelo al BOE.

### Datos y extracción

- `backend/src/data/ras_cfgs_laboratorio_clinico.data.ts`: 14 módulos y 89 RA (62 RA y 499 criterios sin contar los transversales). Los carga la migración `35_ingest_cfgs_laboratorio_clinico_ras.ts`, reejecutable y limitada a este nivel.
- Un script temporal extrae los textos del HTML del BOE y comprueba que cada texto castellano aparece literalmente en él (tras normalizar los espacios duros del BOE), que la numeración de RA y letras es consecutiva y que hay paridad ES/CA.
- **Erratas del BOE (también en el PDF oficial):**
  - 1371 RA1 j) termina en coma («…uso eficiente de los recursos,»); se cambia por punto.
  - 1371 RA7 g) no tiene punto final; se añade.
  - 1370 RA8 c) empieza en minúscula («c) se han descrito…»); se pone mayúscula.
  - 1373 RA4 empieza con un sustantivo («Aplicación de técnicas de aislamiento…») en vez de un verbo. Se conserva tal cual, también en catalán.
- Un espacio duro del BOE en 1371 («orina de 24 horas») se normaliza a espacio normal.

## ESO ordinaria (`ESO_ORDINARIA`)

### Fuente normativa

- **LOMLOE** (LO 3/2020) y **RD 217/2022** (enseñanzas mínimas).
- **Decreto 42/2025**, de 1 de agosto, de ordenación y currículo de la ESO en las Illes Balears (BOIB n.º 103, de 4/8/2025), que sustituye al Decreto 32/2022. Artículos 11 y 13 para materias por curso; anexo 2 para CE, criterios y saberes.
- Versiones oficiales en `Proyecto_FPB_PAI/ESO/` (fuera de git):
  - `Decreto ordenación y currículo ESO.pdf` (castellano);
  - `Decret ordenació i currículum ESO (ca).pdf` (catalán, descargado de la web LOMLOE de la CAIB).

### Datos

`backend/src/data/curriculo-eso/<materia>.json` contiene un archivo por materia (31):

- `code`, `name_es`, `name_ca`.
- `cursos`: tipo de la materia en cada curso. `comun`; `opcion` (a elegir dentro del currículo común: las de 4.º y Plástica/Música en 3.º); `optativa`.
- `competencias[]`: `ce_id`, `ce_num`, `description_es/ca` y `descriptores` (perfil de salida, anexo 1).
- `criterios[]` de cada competencia: `id`, `cursos`, `text_es/ca` y `aclaraciones_es/ca`.

Decisiones:

- **Criterios con varios cursos.** Los criterios se agrupan por bloques de cursos distintos en cada materia: «Primer y tercer curso», «Cursos primero y segundo», «De primero a tercero», uno por curso… Por eso cada criterio guarda la lista de cursos en los que se aplica.
- **Materias con niveles separados.** Cultura Clásica I/II, Matemáticas A/B (4.º) y Recursos Digitales I/II son materias distintas. Recursos Digitales I y II comparten el mismo bloque de criterios del decreto.
- **Excluidas:** Taller de Matemáticas y Taller Lingüístico (su currículo lo diseña cada centro, art. 12) y Religión.
- **Lengua Extranjera y Segunda Lengua Extranjera** se cargan como materias genéricas: sus CE y criterios no dependen del idioma.

### Extracción

Se extrajeron con un parser determinista del texto del BOIB, sin IA, y con estas validaciones:

- **Paridad ES/CA:** mismas CE y criterios en el mismo orden.
- **Numeración:** criterios consecutivos en cada CE.
- **Texto literal:** cada texto aparece tal cual en el decreto de su idioma.
- **Sin absorciones:** ningún criterio absorbe otro bloque.

Erratas del BOIB tratadas expresamente:
- **Entornos Digitales y Multimedia (castellano):** «CA 2.» sin número; es el 2.2.
- **Educación Plástica:** el catalán pone «Segon curs» y el castellano «Curso segundo y tercero». Se aplica a 2.º y 3.º, como el art. 11.
- **Igualdad de Género:** el decreto salta del 2.1 al 2.3 en los dos idiomas. Se conserva la numeración oficial.

La migración `23_ingest_ces_eso_ordinaria` carga los JSON en la colección `ces` con `tipoNivel: 'ESO_ORDINARIA'`. Solo reemplaza esas CE, así que es idempotente. La `22_ce_tipo_nivel_pdc` marca las 65 CE previas como `DIVERSIFICACION_CURRICULAR`.

### API y selección

- `GET /api/ces?tipoNivel=ESO_ORDINARIA&curso=2º&lang=catalan` devuelve las CE de las materias del curso, solo con los criterios de ese curso. Van ordenadas por tipo (comunes, de opción y optativas), materia y número. Sin `tipoNivel` devuelve las del PDC, como antes.
- El valor seleccionado de una CE de ESO es «Materia · CEn. Descripción» (`esoSelection`). Hace falta porque algunas materias del mismo curso tienen CE con el mismo texto (Matemáticas A y B, Cultura Clásica I y II). Ese valor se guarda en `project.ras`. `findEsoCe` lo resuelve en cualquiera de los dos idiomas y el glosario de traducción también lo reconoce.
- En el selector curricular, las materias de opción y las optativas se marcan en la cabecera del grupo («· De opción», «· Optativa»).

### Prompt

`buildEsoInstruction` (`backend/src/services/eso-curriculum.service.ts`) añade a las instrucciones de los proyectos de ESO estas reglas:
- **Terminología:** situación de aprendizaje, CE, criterios y saberes básicos; nunca RA ni módulo profesional.
- **Edad del alumnado** del curso, según el catálogo: 12-13, 13-14, 14-15 y 15-16 años. Se pide adaptar vocabulario, autonomía, duración de las tareas y andamiaje.
- **Perfil de salida.**
- **Evaluación formativa y formadora.**
- **DUA.**
- **Producto final** en un contexto cercano al alumnado.

Cada CE seleccionada se describe con su materia, su número oficial, sus descriptores y los criterios del curso. Las reglas no se aplican a los proyectos del PDC ni de FP.

## Selección de criterios de evaluación (ESO y PDC)

Cada CE de la ESO ordinaria y del PDC se despliega en el selector con sus criterios del curso. El docente puede marcar criterios sueltos o usar «Seleccionar todos los criterios». El proyecto se genera a partir de los criterios elegidos (plan 003).

### Backend (`services/criterios.service.ts`)

- `GET /api/ces` devuelve en cada CE `criteriosDetalle: [{ id, text }]` (`id` oficial, como «1.1») del curso pedido. El PDC admite ahora `curso` (por defecto 3.º).
- Los criterios del PDC siguen en su formato heredado (`ces_eso_bilingual.json`, con el curso dentro del identificador: «3º ESO - 1.1», «1.1 (4º ESO)», «CA 1.1» o «1.1»). `criteriosDeCe` los normaliza al vuelo a `{ id, text }` y filtra por curso; no hay migración de datos.
- `POST /api/projects/generate` acepta `criteriosSeleccionados: [{ ce, ids[] }]`, donde `ce` es el valor con el que se selecciona la CE (el de `selectedRas`). Se rechaza con **400**: una lista mal formada, una CE que no está en `selectedRas`, una CE sin criterios y un id que no existe en esa CE para el curso.
- Sin `criteriosSeleccionados` (peticiones antiguas, FP, CE completas) se usan todos los criterios del curso, como antes.
- Con selección, el bloque de la CE se titula «CRITERIOS DE EVALUACIÓN SELECCIONADOS» con solo esos criterios, y el prompt añade `COBERTURA_CRITERIOS`: todos deben cubrirse y evaluarse con su numeración oficial, y no se incluyen otros de esas CE.
- `Project.criteriosSeleccionados` guarda la elección. El prompt ya se guarda en el proyecto, así que el reintento conserva los criterios.

### Frontend

- `CriteriosFacade` guarda solo las **elecciones parciales** por CE. Una CE seleccionada sin entrada tiene todos sus criterios marcados, así que seleccionar una CE equivale a «seleccionar todos». Marcar un criterio selecciona la CE; desmarcar el último la deselecciona; las entradas de CE deseleccionadas se descartan solas.
- `CeCriteriosListComponent` (`ce-criterios-list`) pinta la lista dentro de cada CE. El carrito muestra «(n/m criterios)».
- La petición solo incluye `criteriosSeleccionados` cuando alguna CE tiene una elección parcial.
- Las CE del PDC se recargan al cambiar de curso (sus criterios dependen de él), igual que las de la ESO ordinaria.

### Contraste con la web de la CAIB (6 de octubre de 2026)

Se descargaron los 53 documentos (PDF y Word) de <https://www.caib.es/sites/lomloe/ca/eso_materies/> y se comprobó que los textos en catalán aparecen literalmente en ellos:
- **ESO ordinaria:** los 922 textos (189 CE y 733 criterios) coinciden.
- **PDC (`ces_eso_bilingual.json`):** 255 de 256 coinciden. La única diferencia es la coma de Física y Química 4.º, criterio 3.1 («interpretar, organitzar»), que el original de la CAIB escribe con punto («interpretar. organitzar»); se mantiene la coma corregida.

No hizo falta ninguna migración de datos. La web de la CAIB devuelve muchos 502, por lo que la descarga necesitó varios reintentos.
