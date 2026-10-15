# Tarea 235: Mapa intermodular de 2.º de CFGS Enseñanza y Animación Sociodeportiva

## 1. Propósito

Incorporar el mapa intermodular completo para el segundo curso del ciclo formativo de grado superior **Enseñanza y Animación Sociodeportiva** (`CFGS_ANIMACION_SOCIODEPORTIVA_2`), dotando al módulo de proyecto intermodular y al generador de actividades de una red estructurada de relaciones curriculares bidireccionales con redacción pedagógica de alta calidad bilingüe (castellano y catalán balear).

El ciclo fue incorporado curricularmente en la tarea 216 sin mapa (conforme a las directrices de `AGENTS.md` §8). Con esta tarea se completa el mapa de 2.º curso con cobertura total de los criterios de evaluación y grado regular exacto de 8 conexiones por resultado de aprendizaje.

---

## 2. Parámetros del Mapa Curricular

- **Identificador de pestaña (`tab`):** `CFGS_ANIMACION_SOCIODEPORTIVA_2`.
- **Curso:** 2.º curso.
- **Módulos participantes (8 módulos, 42 RAs, 295 criterios):**
  - `1123`: Actividades de ocio y tiempo libre (5 RAs, 35 criterios) — Color `#f472b6`, icono `tent`, tipo `especifico`, relación `cliente`.
  - `1137`: Planificación de la animación sociodeportiva (5 RAs, 38 criterios) — Color `#34d399`, icono `clipboard-list`, tipo `especifico`, relación `tecnica`.
  - `1140`: Metodología de la enseñanza y animación de actividades físico-deportivas de equipo (5 RAs, 34 criterios) — Color `#fb923c`, icono `trophy`, tipo `especifico`, relación `tecnica`.
  - `1142`: Actividades físico-deportivas e inclusión social (7 RAs, 43 criterios) — Color `#a78bfa`, icono `accessibility`, tipo `especifico`, relación `cliente`.
  - `1144`: Proyecto intermodular de enseñanza y animación sociodeportiva (4 RAs, 28 criterios) — Color `#38bdf8`, icono `folder-kanban`, tipo `especifico`, relación `tecnica`.
  - `0179`: Inglés profesional (GS) (4 RAs, 41 criterios) — Color `#f87171`, icono `languages`, tipo `transversal`, relación `comunicacion`.
  - `1708`: Sostenibilidad aplicada al sistema productivo (6 RAs, 36 criterios) — Color `#4ade80`, icono `leaf`, tipo `transversal`, relación `sostenibilidad`.
  - `1710`: Itinerario personal para la empleabilidad II (6 RAs, 40 criterios) — Color `#fbbf24`, icono `briefcase`, tipo `transversal`, relación `empleabilidad`.
- **Topología del grafo:** Grafo conexo 8-regular exacto.
  - Grado por RA: exactamente 8 conexiones (mínimo 6, máximo 15 según especificación del proyecto).
  - Total de relaciones no dirigidas: 168 relaciones.
  - Total de conexiones dirigidas bidireccionales: 336 conexiones.
  - Actividades pedagógicas: 168 actividades únicas, contextualizadas y diferenciadas.
- **Cobertura curricular:** 100% (295 de 295 criterios cubiertos con al menos una conexión, 1–3 criterios por extremo).

---

## 3. Arquitectura y Decisiones Técnicas

### 3.1. Diseño del Grafo y Reglas de Conexión

1. **Priorización pedagógica:**
   - Los módulos transversales (`0179`, `1708`, `1710`) se conectan exclusivamente con módulos específicos del sector sociodeportivo (`1123`, `1137`, `1140`, `1142`, `1144`), evitando actividades transversales genéricas sin anclaje en el perfil profesional.
   - Los módulos específicos se conectan entre sí y con los transversales, articulando proyectos auténticos de animación lúdica, inclusión social, deportes de equipo y dinamización comunitaria en las Islas Baleares.
2. **Asignación determinista de criterios:**
   - Se distribuyeron los 295 criterios en las 168 relaciones garantizando que cada relación citase entre 1 y 3 criterios por módulo, sin criterios huérfanos.
3. **Redacción libre de plantillas (<5% de repetición):**
   - Cada una de las 168 actividades cuenta con título, contexto territorial insular, desarrollo pedagógico con citación formal de criterios `(MOD-RAC)` simétrica en ES y CA, evidencia evaluable, pauta DUA (Diseño Universal para el Aprendizaje) y metodología activa específica.
   - Ningún inicio de desarrollo supera las 4 repeticiones a lo largo del mapa.
   - Ningún contexto, evidencia o soporte DUA se repite.
   - Todos los títulos tienen cierre completo y no terminan en nexos o artículos.

### 3.2. Integración en Base de Datos y Backend

- **JSON del mapa:** Generado mediante `scripts/mapa-intermodular/mapa-intermodular.mts construir` y ubicado en `backend/src/data/mapa-intermodular/mapa_cfgs_animacion_sociodeportiva_2.json` (336 conexiones en formato canónico de MongoDB).
- **Migración 43:** `backend/src/migrations/43_ingest_mapa_cfgs_animacion_sociodeportiva_2.ts`.
  - Idempotente: ejecuta `deleteMany({ tab: 'CFGS_ANIMACION_SOCIODEPORTIVA_2' })` antes de la inserción, permitiendo reejecuciones seguras sin afectar otras pestañas.
- **Catálogo de niveles (`backend/src/data/niveles.ts`):**
  - Añadido el mapa a `CFGS_ANIMACION_SOCIODEPORTIVA`:
    ```typescript
    mapas: [
      { tab: 'CFGS_ANIMACION_SOCIODEPORTIVA_2', curso: '2º', moduleCode: '1123', raId: '1123_RA1' },
    ]
    ```
  - `MAPA_TABS` incorpora dinámicamente `CFGS_ANIMACION_SOCIODEPORTIVA_2`.

---

## 4. Archivos Modificados y Creados

### Fuentes del mapa y artefactos de datos
- `scripts/mapa-intermodular/fuentes/CFGS_ANIMACION_SOCIODEPORTIVA_2/config.json`: Configuración de colores, tipos, iconos y tipos de relación de los 8 módulos.
- `scripts/mapa-intermodular/fuentes/CFGS_ANIMACION_SOCIODEPORTIVA_2/relaciones_01.json` a `relaciones_06.json`: 6 bloques de 28 relaciones cada uno (168 relaciones en total con redacción bilingüe completa).
- `backend/src/data/mapa-intermodular/mapa_cfgs_animacion_sociodeportiva_2.json`: Archivo JSON compilado del mapa completo.

### Backend y Migraciones
- `backend/src/data/niveles.ts`: Declaración de `mapas` en el nivel `CFGS_ANIMACION_SOCIODEPORTIVA`.
- `backend/src/migrations/43_ingest_mapa_cfgs_animacion_sociodeportiva_2.ts`: Migración de ingesta para MongoDB.

### Tests
- `backend/src/tests/niveles-catalogo.test.ts`: Actualización de orden de `MAPA_TABS` y array de mapas iniciales.
- `backend/src/tests/ras-animacion-sociodeportiva.test.ts`: Actualización de la expectativa de `nivel?.mapas`.
- `backend/src/tests/mapa.test.ts`: Test unitario e integración para la migración 43 (336 conexiones, 8 módulos, verificación bidireccional, grado 8 en cada RA y endpoint `/api/mapa-intermodular?tab=CFGS_ANIMACION_SOCIODEPORTIVA_2`).

### Documentación
- `documentation/mapas_intermodulares_pendientes.md`: Estado actualizado a realizado para 2.º curso y conteo restante a 6 pestañas.
- `documentation/niveles_educativos_y_catalogo.md`: Sección de Enseñanza y Animación Sociodeportiva actualizada con la disponibilidad del mapa de 2.º curso.
- `tareas/235_mapa_cfgs_animacion_sociodeportiva_2.md`: Este documento de diseño técnico.

---

## 5. Verificación y Resultados de Tests

1. **Construcción y validación del mapa (`mapa-intermodular.mts`):**
   - 0 errores, 0 avisos.
   - 168 relaciones → 336 conexiones bidireccionales, 168 actividades distintas.
2. **Backend:**
   - Typecheck (`npm run typecheck`): 0 errores.
   - Vitest (`npm test`): 38 suites completas pasadas, 449 tests en verde (0 fallos).
3. **Frontend:**
   - Vitest (`npm test`): 100% de suites pasadas, zoneless check superado, todos los umbrales de cobertura cumplidos.
