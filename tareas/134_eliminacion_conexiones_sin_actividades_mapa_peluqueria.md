# 134 – Eliminación de Conexiones sin Actividad Asociada en CFGM Peluquería

## Propósito

Resolver el problema donde al seleccionar un módulo y Resultado de Aprendizaje (RA) en los ciclos formativos de Grado Medio (CFGM Peluquería 1º y 2º), se mostraban más de 200 conexiones intermodulares por RA, la inmensa mayoría de las cuales correspondían a "conexiones zombi/fantasma" sin ninguna actividad asociada (`activities: []`), saturando la interfaz de usuario con cientos de tarjetas vacías y aumentando el peso de transferencia de los ficheros de datos a más de 37 MB.

---

## Análisis Técnico y Causa Raíz

1. **Efecto colateral de la deduplicación de actividades (Tareas 130 y 132):**
   - Durante la generación inicial del mapa intermodular de Peluquería, se creó una explosión combinatoria de conexiones (~12.514 en 1º curso y ~10.671 en 2º curso) asociando las mismas actividades de forma redundante.
   - En la migración 09 previa, se deduplicaron las actividades para que cada una apareciera una sola vez por RA. Esto dejó a las conexiones secundarias con `activities = []`.
   - Sin embargo, las estructuras de conexión (`IntermodularConnection`) no fueron purgadas de `learningOutcome.connections`. Por lo tanto:
     - En `CFGM_PELUQUERIA`: Existían 12.514 conexiones totales, pero solo 532 tenían actividades (11.982 conexiones vacías).
     - En `CFGM_PELUQUERIA_2`: Existían 10.671 conexiones totales, pero solo 412 tenían actividades (10.259 conexiones vacías).
   - Como resultado, el selector de RA en el Paso 1 y el Paso 2 mostraba badges con más de 200 conexiones (`ra.connections.length ≈ 266`), y el Paso 3 renderizaba más de 250 tarjetas con la justificación y criterios pero sin bloque de actividades.
   - Además, la carga por red transfería payloads de 37 MB (`mapa_cfgm_peluqueria.json`) y 30 MB (`mapa_cfgm_peluqueria_2.json`).

2. **Comparativa con ciclos de referencia (FPB y CFGM Estética):**
   - En **FPB**: 485 conexiones totales, 485 con actividades, 0 sin actividad.
   - En **CFGM Estética**: 410 conexiones totales, 410 con actividades, 0 sin actividad.
   - Todos los mapas intermodulares en Plappin están diseñados bajo la premisa de que una conexión intermodular existe para plantear un reto o propuesta de actividad colaborativa. Las conexiones sin actividad carecen de utilidad pedagógica.

---

## Arquitectura y Solución End-to-End

Se aplicó una solución en cuatro niveles con defensa en profundidad:

1. **Limpieza y Reducción de los Datasets JSON (`backend/src/data/mapa-intermodular/`):**
   - Se eliminaron todas las conexiones cuyo array de actividades estuviera vacío o indefinido:
     - `mapa_cfgm_peluqueria.json`: de 12.514 conexiones se redujo a **532 conexiones** válidas (~11 conexiones por RA, distribuidas homogéneamente entre los 47 RAs). El archivo se redujo de **37 MB a 4.2 MB** (-88.6%).
     - `mapa_cfgm_peluqueria_2.json`: de 10.671 conexiones se redujo a **412 conexiones** válidas (~9 conexiones por RA en los 47 RAs). El archivo se redujo de **30 MB a 3.0 MB** (-90%).
2. **Actualización de Migraciones Backend:**
   - En [`backend/src/migrations/09_deduplicate_mapa_peluqueria.ts`](file:///Users/csgj/dev/pai-app/backend/src/migrations/09_deduplicate_mapa_peluqueria.ts) y [`backend/migrations/04_deduplicate_mapa_peluqueria.ts`](file:///Users/csgj/dev/pai-app/backend/migrations/04_deduplicate_mapa_peluqueria.ts):
     - Tras deduplicar las actividades por título dentro de cada RA, se agregó el filtro explícito:
       ```ts
       lo.connections = (lo.connections || []).filter((c: any) => c.activities && c.activities.length > 0);
       ```
   - Se ejecutó la actualización en la base de datos MongoDB local y Docker `pai_db` (puerto 27018), dejando 0 conexiones vacías en toda la base de datos.
3. **Controlador Backend (`mapa.controller.ts`):**
   - En `getMapaModules`, se implementó una sanitización defensiva que asegura que cualquier módulo retornado al frontend filtre cualquier conexión que no contenga actividades (`c.activities && c.activities.length > 0`).
4. **Fachada Frontend (`mapa-intermodular.facade.ts`):**
   - En `loadSeed(tab)` se incorporó `sanitizeModules(rawData)` para garantizar de forma proactiva que la vista del cliente nunca almacene ni procese conexiones sin actividades.

---

## Archivos Modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| [`backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria.json`](file:///Users/csgj/dev/pai-app/backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria.json) | **MODIFICADO** | Reducción de 12.514 a 532 conexiones (eliminadas 11.982 vacías). Tamaño reducido de 37 MB a 4.2 MB. |
| [`backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria_2.json`](file:///Users/csgj/dev/pai-app/backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria_2.json) | **MODIFICADO** | Reducción de 10.671 a 412 conexiones (eliminadas 10.259 vacías). Tamaño reducido de 30 MB a 3.0 MB. |
| [`backend/src/migrations/09_deduplicate_mapa_peluqueria.ts`](file:///Users/csgj/dev/pai-app/backend/src/migrations/09_deduplicate_mapa_peluqueria.ts) | **MODIFICADO** | Purga de conexiones huérfanas sin actividades durante la migración. |
| [`backend/migrations/04_deduplicate_mapa_peluqueria.ts`](file:///Users/csgj/dev/pai-app/backend/migrations/04_deduplicate_mapa_peluqueria.ts) | **MODIFICADO** | Versión para EC2 actualizada con la purga de conexiones vacías. |
| [`backend/src/controllers/mapa.controller.ts`](file:///Users/csgj/dev/pai-app/backend/src/controllers/mapa.controller.ts) | **MODIFICADO** | Sanitización defensiva en `getMapaModules` para retornar únicamente conexiones con actividades. |
| [`backend/src/tests/mapa.test.ts`](file:///Users/csgj/dev/pai-app/backend/src/tests/mapa.test.ts) | **MODIFICADO** | Nuevas aserciones para verificar conteo de conexiones (532 en 1º, 412 en 2º) y 0 conexiones vacías. |
| [`frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts) | **MODIFICADO** | Función `sanitizeModules` integrada en `loadSeed()` para blindar al cliente. |

---

## Verificación y Pruebas

1. **Inspección en MongoDB (`pai_db`):**
   - **FPB**: 485 conexiones (485 con actividad, 0 sin actividad).
   - **CFGM Estética**: 410 conexiones (410 con actividad, 0 sin actividad).
   - **CFGM Peluquería 1º**: 532 conexiones (532 con actividad, 0 sin actividad).
   - **CFGM Peluquería 2º**: 412 conexiones (412 con actividad, 0 sin actividad).
   - Promedio de conexiones por RA: **11.3** en 1º y **8.8** en 2º (rango normal y educativo, en lugar de >200).

2. **Suite de Pruebas Backend (`npm test`):**
   - 16 suites ejecutadas, 129 tests aprobados (100%).
   - Verificado `src/tests/mapa.test.ts` con aserciones de cero conexiones vacías.

3. **Suite de Pruebas Frontend (`npm test`):**
   - 33 suites ejecutadas, 424 tests aprobados (100%).
   - Cobertura global de ramas: **95.75%** (umbral requerido >= 90%).
