# Tarea 238: Mapa intermodular de 2.º de CFGS Laboratorio Clínico y Biomédico

## 1. Propósito

Incorporar el mapa intermodular completo para el segundo curso del ciclo formativo de grado superior **Laboratorio Clínico y Biomédico** (`CFGS_LABORATORIO_CLINICO_2`), dotando al módulo de proyecto intermodular y al generador de actividades de una red estructurada de relaciones curriculares bidireccionales con redacción pedagógica de alta calidad bilingüe (castellano y catalán balear).

El ciclo formativo fue incorporado curricularmente en la tarea 219 sin mapa intermodular (siguiendo las directrices de `AGENTS.md` §8). Con esta tarea se completa el mapa curricular de 2.º curso con cobertura del 100% de los criterios de evaluación del curso y un grafo regular de exactamente 8 conexiones por resultado de aprendizaje.

---

## 2. Parámetros del Mapa Curricular

- **Identificador de pestaña (`tab`):** `CFGS_LABORATORIO_CLINICO_2`.
- **Curso:** 2.º curso.
- **Módulos participantes (7 módulos, 44 RAs, 335 criterios de evaluación):**
  - `1371`: Análisis bioquímico (8 RAs, 66 criterios) — Color `#0ea5e9`, icono `flask-conical`, tipo `especifico`, relación `ciencias`.
  - `1372`: Técnicas de inmunodiagnóstico (7 RAs, 55 criterios) — Color `#6366f1`, icono `shield-check`, tipo `especifico`, relación `tecnica`.
  - `1373`: Microbiología clínica (7 RAs, 61 criterios) — Color `#10b981`, icono `microscope`, tipo `especifico`, relación `ciencias`.
  - `1374`: Técnicas de análisis hematológico (7 RAs, 51 criterios) — Color `#f43f5e`, icono `droplet`, tipo `especifico`, relación `cliente`.
  - `1375`: Proyecto intermodular de laboratorio clínico y biomédico (4 RAs, 28 criterios) — Color `#8b5cf6`, icono `folder-kanban`, tipo `transversal`, relación `tecnica`.
  - `1708`: Sostenibilidad aplicada al sistema productivo (6 RAs, 36 criterios) — Color `#14b8a6`, icono `leaf`, tipo `transversal`, relación `sostenibilidad`.
  - `1710`: Itinerario personal para la empleabilidad II (5 RAs, 38 criterios) — Color `#f59e0b`, icono `briefcase`, tipo `transversal`, relación `empleabilidad`.
- **Topología del grafo:** Grafo conexo regular de grado 8 exacto.
  - Grado por RA: exactamente 8 conexiones (dentro del rango exigido de 6–15 conexiones).
  - Total de relaciones no dirigidas: 176 relaciones.
  - Total de conexiones dirigidas bidireccionales: 352 conexiones.
  - Actividades pedagógicas: 176 actividades únicas, contextualizadas y diferenciadas.
- **Cobertura curricular:** 100% (335 de 335 criterios cubiertos con al menos una conexión, 1–3 criterios por extremo).

---

## 3. Arquitectura y Decisiones Técnicas

### 3.1. Diseño del Grafo y Reglas Curriculares

1. **Contextualización sanitaria y hospitalaria balear:**
   - Cada una de las 176 actividades parte de un escenario asistencial y diagnóstico real y concreto, ambientado en las Islas Baleares: laboratorios de urgencias y rutina de Son Espases, Son Llàtzer, Hospital Comarcal d'Inca, Hospital de Manacor, Hospital Mateu Orfila de Menorca, Hospital Can Misses de Ibiza y Formentera, el Banc de Sang i Teixits de les Illes Balears (BSTIB), centros de atención primaria y laboratorios de investigación biomédica del IdISBa.
2. **Distribución equitativa y regularidad de grado 8:**
   - La red de 44 RAs se modeló como un grafo 8-regular mediante asignación equilibrada entre módulos específicos (`1371`, `1372`, `1373`, `1374`) y transversales (`1375`, `1708`, `1710`).
   - Todos los RAs de todos los módulos alcanzan exactamente 8 relaciones no dirigidas (16 conexiones dirigidas considerando bidireccionalidad).
   - Se evitaron pares repetidos entre resultados de aprendizaje (no existe multigrafo).
3. **Cobertura exhaustiva de criterios de evaluación:**
   - Cada relación vincula de 1 a 3 criterios específicos de cada RA.
   - La totalidad de los 335 criterios del 2.º curso quedaron cubiertos y referenciados formalmente.
4. **Redacción pedagógica de alta calidad y bilingüismo estricto:**
   - Redacción manual individualizada para cada actividad, sin uso de plantillas ni secuencias generativas repetitivas (<5% de repetición en frases de inicio, 0 contextos o evidencias duplicadas).
   - Títulos con sentido completo, sin cortes abruptos ni nexos finales.
   - Paridad y correspondencia estricta de citas curriculares `(MÓDULO-RAletra)` en idéntico orden en castellano y en catalán balear técnico de FP sanitaria.
   - Variedad en metodologías activas aplicadas: aprendizaje basado en casos clínicos, simulación técnica de laboratorio, aprendizaje basado en problemas (ABP), retos técnicos (ABR), aprendizaje cooperativo y proyectos interdisciplinares.

### 3.2. Integración en Base de Datos y Backend

- **Compilación de fuentes JSON:**
  - Las relaciones se estructuraron en 6 archivos fuente modulares (`relaciones_01.json` a `relaciones_06.json`) en `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/`.
  - El compilador determinista `mapa-intermodular.mts construir` validó y generó `backend/src/data/mapa-intermodular/mapa_cfgs_laboratorio_clinico_2.json` (352 conexiones canónicas).
- **Migración 45:**
  - Creada en `backend/src/migrations/45_ingest_mapa_cfgs_laboratorio_clinico_2.ts`.
  - Idempotente: limpia previamente con `deleteMany({ tab: 'CFGS_LABORATORIO_CLINICO_2' })` antes de insertar los 7 módulos del mapa.
- **Catálogo de niveles (`backend/src/data/niveles.ts`):**
  - Añadido el mapa a `CFGS_LABORATORIO_CLINICO`:
    ```typescript
    mapas: [
      { tab: 'CFGS_LABORATORIO_CLINICO_2', curso: '2º', moduleCode: '1371', raId: '1371_RA1' },
    ]
    ```
  - `MAPA_TABS` deriva automáticamente `CFGS_LABORATORIO_CLINICO_2`.

---

## 4. Archivos Modificados y Creados

### Fuentes del mapa
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/config.json`: Configuración visual, tipológica y relacional de los 7 módulos de 2.º curso.
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/relaciones_01.json`: Relaciones 1 a 30.
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/relaciones_02.json`: Relaciones 31 a 60.
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/relaciones_03.json`: Relaciones 61 a 90.
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/relaciones_04.json`: Relaciones 91 a 120.
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/relaciones_05.json`: Relaciones 121 a 148.
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/relaciones_06.json`: Relaciones 149 a 176.
- `backend/src/data/mapa-intermodular/mapa_cfgs_laboratorio_clinico_2.json`: JSON compilado del mapa intermodular.

### Backend y Migraciones
- `backend/src/data/niveles.ts`: Declaración de pestaña en el array `mapas` de `CFGS_LABORATORIO_CLINICO`.
- `backend/src/migrations/45_ingest_mapa_cfgs_laboratorio_clinico_2.ts`: Migración 45 para la ingesta en MongoDB.

### Tests
- `backend/src/tests/niveles-catalogo.test.ts`: Inclusión de `CFGS_LABORATORIO_CLINICO_2` en `MAPA_TABS` y array de mapas iniciales.
- `backend/src/tests/ras-laboratorio-clinico.test.ts`: Actualización de la aserción de `nivel?.mapas` para esperar la pestaña de 2.º curso.
- `backend/src/tests/mapa.test.ts`: Suite de integración completa para la migración 45 (352 conexiones, 7 módulos, verificación bidireccional, regularidad de grado 8, validación de textos de RA contra catálogo y endpoint `/api/mapa-intermodular?tab=CFGS_LABORATORIO_CLINICO_2`).

### Documentación
- `documentation/mapas_intermodulares_pendientes.md`: Marcado como completado el 2.º curso de Laboratorio Clínico y recuento actualizado a 4 pestañas pendientes.
- `documentation/niveles_educativos_y_catalogo.md`: Sección de Laboratorio Clínico y Biomédico actualizada.
- `documentation/procesamiento_actividades_mapa_intermodular.md`: Incorporación de CFGS Laboratorio Clínico y Biomédico (2.º) a la lista de ciclos con mapa intermodular.
- `tareas/238_mapa_cfgs_laboratorio_clinico_2.md`: Este documento de diseño técnico.

---

## 5. Verificación y Resultados de Tests

1. **Construcción y validación del mapa (`mapa-intermodular.mts`):**
   - 0 errores (❌), 0 avisos (⚠️).
   - 176 relaciones procesadas → 352 conexiones generadas.
   - 176 actividades bilingües contextualizadas.
   - 44 de 44 RAs conectados con exactamente grado 8 (8 conexiones bidireccionales por RA).
   - 335 de 335 criterios cubiertos (100% de cobertura).
2. **Backend:**
   - Typecheck (`npm --prefix backend run typecheck`): 0 errores.
   - Vitest (`npm --prefix backend test`): 38 suites ejecutadas, 451 tests pasados en verde (0 fallos).
3. **Frontend:**
   - Vitest (`npm --prefix frontend test`): todas las suites en verde, zoneless check superado y todos los umbrales de cobertura cumplidos.
