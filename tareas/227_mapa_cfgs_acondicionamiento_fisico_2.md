# 227 · Mapa intermodular de 2.º del CFGS Acondicionamiento Físico

## Propósito

Esta tarea elabora el mapa intermodular de **2.º curso del CFGS Acondicionamiento Físico** (pestaña `CFGS_ACONDICIONAMIENTO_FISICO_2`): 7 módulos, 35 RA y 248 criterios curriculares.
Se desarrolló en paralelo a la tarea 228 (mapa de 1.º curso), partiendo de su rama `origin/feature/228_mapa_cfgs_acondicionamiento_fisico_1` para consolidar ambos cursos del ciclo.

## Configuración y Módulos de 2.º

Los 7 módulos del segundo curso se configuraron con colores e iconos diferenciados e identificativos:

| Módulo | Denominación (ES / CA) | Tipo | Relación | Color | Icono |
|---|---|---|---|---|---|
| **1150** | Actividades especializadas con soporte musical / Activitats especialitzades amb suport musical | específico | tecnica | `#c084fc` | `sparkles` |
| **1152** | Técnicas de hidrocinesia / Tècniques d'hidrocinèsia | específico | cliente | `#34d399` | `waves` |
| **1153** | Control postural, bienestar y técnicas de control corporal / Control postural, benestar i tècniques de control corporal | específico | ciencias | `#fb923c` | `heart-pulse` |
| **1154** | Proyecto intermodular de acondicionamiento físico / Projecte intermodular de condicionament físic | específico | proyecto | `#fbbf24` | `folder-kanban` |
| **0179** | Inglés profesional / Anglès professional | transversal | comunicacion | `#38bdf8` | `languages` |
| **1708** | Sostenibilidad aplicada al sistema productivo / Sostenibilitat aplicada al sistema productiu | transversal | organizacion | `#f87171` | `leaf` |
| **1710** | Itinerario personal para la empleabilidad II / Itinerari personal per a l'ocupabilitat II | transversal | legal | `#4ade80` | `briefcase` |

## Plan de Relaciones Curriculares

Se diseñó una matriz de **140 relaciones intermodulares** (280 conexiones dirigidas) que conecta los 35 RA garantizando:
- **Grado por RA equilibrado:** entre 7 y 9 conexiones por RA (cumpliendo con solvencia la horquilla de 6 a 15).
- **Cero pares repetidos:** ningún par de RA se relaciona más de una vez.
- **Cobertura total:** el 100 % de los criterios (248 de 248) están cubiertos y citados en el desarrollo pedagógico.
- **1 a 3 criterios por lado:** cada conexión especifica con precisión los criterios vinculados de cada módulo.

Las relaciones cubren situaciones profesionales del sector del fitness y la salud:
- Coreografías avanzadas con soporte musical (step, aeróbic, ciclo indoor, elíptica) combinadas con principios biomecánicos, control postural y prevención de sobrecargas.
- Hidrocinesia y programas acuáticos adaptados a colectivos específicos (embarazo, personas mayores, patologías osteoarticulares, diversidad funcional), vinculados con el bienestar psicofísico y técnicas mente-cuerpo (pilates acuático, watsu/relajación).
- Integración del proyecto intermodular (1154) como eje aglutinador: viabilidad técnica, diseño de instalaciones, presupuestos, comercialización y evaluación de servicios de acondicionamiento físico.
- Módulos transversales plenamente imbricados:
  - **0179 (Inglés profesional):** instrucción técnica en inglés para masterclasses internacionales, glosarios de anatomía y coreografía, comunicación con clientela extranjera y lectura de manuales técnicos de maquinaria.
  - **1708 (Sostenibilidad):** cálculo de huella de carbono de instalaciones deportivas, climatización y depuración eficiente en piscinas termales/hidrocinesia, economía circular en material deportivo y diseño de eventos eco-responsables.
  - **1710 (Empleabilidad II):** autoempleo y emprendimiento en centros de fitness, negociación de convenios colectivos deportivos, prevención de riesgos laborales específica del entrenador/instructor y gestión del estrés profesional.

## Redacción y Validación Pedagógica

- Todas las actividades fueron redactadas de forma manual y artesanal (sin plantillas, scripts de texto ni sustituciones mecánicas).
- Estricta diferenciación lingüística en castellano y catalán balear genuino, respetando los límites de palabras y la terminología oficial (`fitnes`, `condicionament físic`, `suport musical`, `hidrocinèsia`, `esdeveniment`, etc.).
- Cada desarrollo cita de forma ordenada y simétrica los criterios de ambos lados (`1150-1a`, `1152-2c`...).
- La validación con `scripts/mapa-intermodular/mapa-intermodular.mts construir` completó con **0 errores y 0 advertencias**:
  - 140 relaciones → 280 conexiones.
  - 140 actividades distintas sin títulos repetidos ni estructuras idénticas que superen el límite del 5 %.

## Archivos y Cambios

1. **Fuentes y generación:**
   - `scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO_2/config.json`: configuración de módulos, iconos, colores y relaciones.
   - `scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO_2/relaciones_01.json` a `relaciones_06.json`: 140 relaciones distribuidas de forma balanceada.
   - `backend/src/data/mapa-intermodular/mapa_cfgs_acondicionamiento_fisico_2.json`: JSON generado del mapa (280 conexiones).
2. **Backend:**
   - `backend/src/data/niveles.ts`: alta de la pestaña `CFGS_ACONDICIONAMIENTO_FISICO_2` (curso `2º`, módulo inicial `1150`, RA inicial `1150_RA1`).
   - `backend/src/migrations/39_ingest_mapa_cfgs_acondicionamiento_fisico_2.ts`: migración idempotente para ingerir la pestaña en MongoDB.
3. **Tests:**
   - `backend/src/tests/niveles-catalogo.test.ts`: inclusión de la pestaña en `MAPA_TABS` y mapas del catálogo.
   - `backend/src/tests/ras-acondicionamiento-fisico.test.ts`: comprobación de los dos mapas (1.º y 2.º) en el nivel.
   - `backend/src/tests/mapa.test.ts`: test de la migración 39 (idempotencia, aislamiento, 280 conexiones bidireccionales, 6-15 conexiones por RA, citas y endpoint HTTP).
4. **Documentación:**
   - `documentation/mapas_intermodulares_pendientes.md`: marcado de 2.º curso como completado y actualización del recuento de pestañas pendientes (8 restantes).
   - `documentation/niveles_educativos_y_catalogo.md`: indicación de que ambos cursos cuentan con mapa intermodular.
   - `documentation/procesamiento_actividades_mapa_intermodular.md`: actualización de la lista de ciclos con mapa completo.

## Resumen de Métricas

| Parámetro | Valor |
|---|---|
| Módulos | 7 (1150, 1152, 1153, 1154, 0179, 1708, 1710) |
| Resultados de Aprendizaje | 35 |
| Criterios de Evaluación | 248 |
| Relaciones intermodulares | 140 |
| Conexiones publicadas | 280 (140 en cada dirección) |
| Conexiones por RA | 7 a 9 (mín. 6, máx. 15 cumplido) |
| Criterios cubiertos | 248 de 248 (100 %) |
| Actividades únicas | 140 bilingües (ES/CA) |
