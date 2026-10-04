# Tarea 181: Mapa intermodular del CFGS Educación Infantil y corrección del catalán de Peluquería

## Propósito
1. Completar la incorporación del CFGS Educación Infantil (tarea 180) con su **mapa intermodular** de 1.º y 2.º curso, siguiendo las reglas de la skill `agregar-fp`.
2. Corregir los campos en catalán de los módulos **1708** (Sostenibilidad) y **1710** (Itinerario II) de **CFGM Peluquería**, que contenían texto en castellano.

## Mapa intermodular de Educación Infantil

### Contenido
- No existían documentos de conexiones para este ciclo, así que las actividades son de **elaboración propia** a partir de los RA y criterios oficiales (tarea 180), siguiendo el prompt de la skill. Conviene que las revise un docente del ciclo.
- Cada actividad une **un criterio propio con 1–3 criterios externos** de otros módulos del mismo curso y trae, en castellano y catalán:
  - título y reto motivador;
  - justificación curricular;
  - descripción;
  - evidencia evaluable;
  - medidas DUA;
  - metodología activa.
- **Bidireccionalidad:** cada actividad se publica en los RA de todos los criterios implicados. En el RA origen apunta al primer criterio externo; en cada RA externo apunta al RA origen.

| Curso | Módulos | Actividades | Conexiones | Media por RA | Rango por RA |
|---|---|---|---|---|---|
| 1.º | 0011, 0012, 0014, 0015, 1665, 1709 | 81 | 303 | 8,9 | 6–15 |
| 2.º | 0013, 0016, 0017, 0018, 0020, 0019, 0179, 1708, 1710 | 94 | 354 | 7,4 | 6–15 |

- **Reglas verificadas** con un script temporal de construcción y validación:
  - ninguna conexión vacía;
  - entre 6 y 15 conexiones por RA y entre 300 y 600 por curso;
  - como máximo 3 criterios externos por conexión;
  - todos los criterios citados existen en los datos oficiales;
  - no se repiten títulos de actividad dentro de un mismo RA;
  - ningún texto en castellano en los campos `_ca`.
- **Ficheros:** `backend/src/data/mapa-intermodular/mapa_cfgs_educacion_infantil.json` (1,7 MB) y `mapa_cfgs_educacion_infantil_2.json` (1,9 MB). Siguen el mismo esquema que los mapas existentes.

### Integración
- **Backend:**
  - `MapaModule` y `mapa.controller` admiten las pestañas `CFGS_EDUCACION_INFANTIL` y `CFGS_EDUCACION_INFANTIL_2`.
  - Migración `15_ingest_mapa_educacion_infantil.ts`: sustituye solo esas dos pestañas, así que es reejecutable.
- **Frontend:**
  - Nuevo `services/mapa-tabs.config.ts`. Es la única fuente de cada pestaña: tipo `MapaTab`, nombre ES/CA, nivel y curso del generador y selección inicial.
  - Sustituye las cadenas de `if` repetidas en la fachada (selección inicial y etiqueta del resumen exportado), la vista («Crear proyecto» fija nivel y curso), la cabecera (título y subtítulo de 2.º curso) y las pestañas, que pasan a `@for`.
  - Los componentes `header`, `connections-list` y `activities-grid` tipan `activeTab` con `MapaTab`.
  - Añadir otro ciclo al mapa queda en una entrada de configuración, más su JSON y su migración.

## Corrección del catalán de Peluquería (1708 y 1710)
- El castellano de esos módulos en Peluquería coincide con el RD 659/2023, igual que en Infantil, así que se reutiliza la traducción catalana revisada en la tarea 180.
- **Ficheros corregidos:**
  - `ras_cfgm_peluqueria.data.ts` del backend y del frontend;
  - `mapa_cfgm_peluqueria_2.json`: textos de los RA, criterios, `targetRaText_ca` de las conexiones que apuntan a esos RA y `criteria_ca` de los criterios relacionados.
  - Solo cambian campos `_ca`.
- **Migración `14_fix_catalan_peluqueria_1708_1710.ts`:** actualiza solo los campos en catalán de esos RA en la colección `ras` y recarga la pestaña `CFGM_PELUQUERIA_2` desde su JSON (el mapa es de solo lectura en la aplicación).

## Incidencia pendiente detectada
Una auditoría de paridad detectó que en **2.º de Peluquería** también tienen castellano en los campos catalanes:
- los RA de los módulos 0640, 0643, 0843, 0848 y 0636 (en los datos de RA y en el mapa);
- unas 230 conexiones del mapa: actividades, justificaciones y criterios relacionados, a veces con mezcla de idiomas.

Corregido en la tarea 182.

## Archivos
- Nuevos:
  - `backend/src/data/mapa-intermodular/mapa_cfgs_educacion_infantil.json` y `_2.json`;
  - `backend/src/migrations/14_fix_catalan_peluqueria_1708_1710.ts` y `15_ingest_mapa_educacion_infantil.ts`;
  - `frontend/src/app/features/mapa-intermodular/services/mapa-tabs.config.ts`.
- Modificados:
  - backend: `models/MapaModule.ts`, `controllers/mapa.controller.ts`, `data/ras_cfgm_peluqueria.data.ts`, `data/mapa-intermodular/mapa_cfgm_peluqueria_2.json` y `tests/mapa.test.ts`;
  - frontend: `mapa-intermodular.facade.ts`, `mapa-intermodular.service.ts`, la vista del mapa y los componentes `tabs`, `header`, `connections-list` y `activities-grid`, `ras_cfgm_peluqueria.data.ts` y specs.

## Verificación
- Migraciones 14 y 15 aplicadas en local; el endpoint `GET /api/mapa-intermodular?tab=CFGS_EDUCACION_INFANTIL[_2]` devuelve los módulos.
- Prueba con Playwright en catalán:
  - 6 pestañas;
  - título «Mapa intermodular del CFGS Educació Infantil 2n» y conexiones del módulo 0013;
  - «Crear proyecto» abre el generador en CFGS Educació Infantil, 2.º curso.
- `ngc`, `tsc` de specs y ESLint del frontend sin errores.
- Pendiente (usuario): `cd backend && npm test` y `cd frontend && npm test`.
