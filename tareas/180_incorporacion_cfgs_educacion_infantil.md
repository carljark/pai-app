# Tarea 180: Incorporación del CFGS Educación Infantil (SSC31)

## Propósito
Añadir a Plappin el ciclo de **Grado Superior Técnico Superior en Educación Infantil** (familia Servicios Socioculturales y a la Comunidad), publicado por FP Illes Balears en <https://www.caib.es/sites/fp/ca/educacio_infantil/>. Es el primer ciclo de grado superior de la aplicación (`tipoNivel = 'CFGS_EDUCACION_INFANTIL'`).

## Fuentes (decisión del usuario: opción 2, normativa estatal)
- **El currículo balear no está publicado en el BOIB.** La CAIB indica que desde 2024‑25 se aplican currículos autonómicos "en fase d'esborrany", sin documento descargable. El BOIB núm. 17 (5‑2‑2026) solo actualiza la oferta formativa.
- **Castellano (`_es`):**
  - RA y criterios de los módulos 0011–0020: **RD 1394/2007** (BOE núm. 282, anexo I), extraídos del PDF oficial.
  - Módulos transversales 1665, 1708, 1709, 1710 y 0179: **RD 659/2023** (anexos de currículo básico).
  - Denominaciones: **RD 500/2024** (el antiguo "Proyecto de atención a la infancia" pasa a "Proyecto intermodular de atención a la infancia", código 0019).
- **Catalán (`_ca`):**
  - El BOE no tiene versión catalana de estos RD, así que la traducción es propia, con la terminología de FP (`S'ha/S'han`, "infants").
  - Los nombres de los módulos son los de FP Illes Balears.
  - De Peluquería solo se reutiliza lo idéntico al BOE: 1709 RA1, RA2 (criterios), RA4 y RA5.
- **Distribución por cursos (CAIB):**
  - 1.º: 0011, 0012, 0014, 0015, 1665, 1709.
  - 2.º: 0013, 0016, 0017, 0018, 0020, 0019, 0179, 1708, 1710.
  - El módulo optativo no se incluye porque no tiene currículo propio.
- **Fidelidad al BOE:** dos criterios del BOE unen dos frases en una sola letra (0016 RA4 d y 0019 RA3 d). Se conservan así, añadiendo solo el punto que falta.
- **Resultado:** 15 módulos, 82 RA y 692 criterios, con paridad ES/CA verificada por script (ningún texto castellano en campos `_ca` ni catalán en `_es`).

## Arquitectura y flujo
- **Backend:**
  - `data/ras_cfgs_educacion_infantil.data.ts` (tipo `CfgmRaData`).
  - Migración `13_ingest_cfgs_educacion_infantil_ras.ts`: borra y reinserta solo los RA de este nivel, así que es reejecutable.
  - `Project.tipoNivel` admite el nuevo valor.
  - `project.controller.ts`: la descripción del curso destino del prompt pasa a `describeTargetCourse()`, con una tabla `CYCLE_NAMES` de denominaciones ES/CA en lugar de ternarios anidados.
- **Frontend:**
  - `curriculum-grouping.ts` generaliza los ciclos (`FP_CYCLES`, `isFpCycle`). El orden de módulos por curso (`courseModuleOrder`) sirve ahora a Peluquería y a Educación Infantil; solo se muestran los módulos del curso elegido y en su orden oficial. Se mantiene el respaldo estático si la API aún no devuelve RA.
  - `project.model.ts`: nuevo `ProjectType`/`HistoryTab`, `HISTORY_TAB_LABEL_KEYS` y `courseLevelLabelKey()`, que dan nombre a cada nivel desde un único sitio.
  - Generador, Archivo, Inicio y Perfil usan esa tabla. Las pestañas del generador y los filtros de Perfil pasan a `@for`, lo que deja la plantilla del generador por debajo de las 200 líneas; las etiquetas de nivel de Inicio y Perfil dejan los ternarios.
  - `app.facade` usa `getHistoryTabForTipoNivel()`.
  - `projects.facade`: los módulos implicados de cualquier ciclo de dos cursos salen de `courseModuleOrder`. El nombre de respaldo del ciclo procede de las traducciones; de paso, corrige el catalán de Peluquería, que antes era "Peluqueria… Capilar".
  - Traducciones: `courseLevelCFGSEducacionInfantil` (ES "CFGS Educación Infantil" / CA "CFGS Educació Infantil").

## Archivos
- Nuevos:
  - `backend/src/data/ras_cfgs_educacion_infantil.data.ts`
  - `backend/src/migrations/13_ingest_cfgs_educacion_infantil_ras.ts`
  - `frontend/src/app/features/curriculum/data/ras_cfgs_educacion_infantil.data.ts`
- Modificados:
  - Backend: `models/Project.ts`, `controllers/project.controller.ts` y los tests `migrations.test.ts` y `projects.test.ts`.
  - Frontend: `curriculum-grouping.ts`, `curriculum.facade.ts`, `project.model.ts`, `projects.mapper.ts`, `projects.facade.ts`, `history-filter.ts`, `history-view`, `generator-view`, `home-dashboard`, `personal-view`, `app.facade.ts`, `translations.{es,ca}.ts` y sus specs.

## Pendiente / fuera de alcance
- **Mapa intermodular:** realizado en la tarea 181.
- **Cuando la CAIB publique el currículo autonómico en el BOIB**, convendrá contrastarlo y actualizar la traducción catalana con el texto oficial.
- **Incidencia previa detectada:** en `ras_cfgm_peluqueria.data.ts`, los campos `_ca` de 1708 y 1710 contenían el texto en castellano. Corregido en la tarea 181.

## Verificación
- `ngc`, `tsc` de specs y ESLint del frontend sin errores; en el backend, los archivos nuevos solo arrastran los avisos de extensión de import que tiene todo el proyecto.
- Migración aplicada en local: 82 RA.
- Prueba con Playwright: pestaña "CFGS Educación Infantil" en el generador; 1.º muestra los 6 módulos y 2.º los 9 en catalán, con sus nombres oficiales.
- Pendiente (usuario): `cd backend && npm test` y `cd frontend && npm test`.
