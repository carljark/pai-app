# 233 · Fusión de la cadena de mapas con las tareas 229-231

## Propósito

Desde la tarea 224 había dos cadenas de ramas independientes:

- **Mapas intermodulares:** 225 → 226 → 228, de la que salen la 227 (Acondicionamiento Físico 2.º, hecho por Gemini) y la 232 (Atención a la Dependencia 2.º).
- **Producto:** 229 (filtros del historial en cascada) → 230 (sin campo de origen en las afinidades de la ESO) → 231 (banner de universidades), que es lo que estaba desplegado.

Desplegar cualquiera de las dos habría retirado de producción lo de la otra. Esta tarea las une en `feature/233_fusion_mapas_y_tareas_229_231` y lo despliega todo junto.

## Flujo

1. **Rama.** Sale de la 232, en el worktree `../pai-app-mapa232`.
2. **Revisión de la 227.** Antes de fusionar se reconstruyó el mapa de Gemini con `mapa-intermodular.mts construir`: 140 relaciones y 280 conexiones, sin errores ni avisos, y el JSON resultante es idéntico al versionado. Una muestra de los textos confirmó que no son de plantilla.
3. **Fusión de la 227.** Conflictos resueltos:
   - `niveles-catalogo.test.ts`: `MAPA_TABS` lleva las dos pestañas nuevas, `CFGM_ATENCION_DEPENDENCIA_2` y `CFGS_ACONDICIONAMIENTO_FISICO_2`;
   - `mapa.test.ts`: se conservan los dos tests, el de la migración 39 y el de la 41;
   - documentación: los dos mapas aparecen como hechos.
4. **Fusión de la 230.** Esa rama arrastraba el último commit de Gemini sobre Integración Social 1.º (`3ba0307`, tarea 224), que conflictúa con el mapa rehecho en la 226. Se conserva el de la 226: el usuario descartó el borrador de la 224, y producción ya tiene cargado el de la 226 (migración 37 aplicada el 14-10-2026 con sus textos). Se eliminan los seis `relaciones_0N_*.json` de la 224, que la 226 sustituyó por `relaciones.json`.

## Migraciones

Pendientes en producción: `39_ingest_mapa_cfgs_acondicionamiento_fisico_2` y `41_ingest_mapa_cfgm_atencion_dependencia_2`. Cada una sustituye solo su pestaña.

Hay dos migraciones con el número 38 (`38_ingest_mapa_cfgs_integracion_social_2` y `38_quitar_origen_afinidades_eso`). El runner las registra por nombre, y producción ya tiene aplicadas las dos, así que no hay que renombrarlas. Renombrarlas haría que se volvieran a ejecutar.

## Documentación

`mapas_intermodulares_pendientes.md`:
- quedan 7 pestañas y unas 1.264 relaciones;
- el orden sugerido empieza por Atención a la Dependencia 1.º, que completa el ciclo.

## Verificación

- Typecheck del backend sin errores.
- Backend: 38 archivos y 448 tests en verde.
- Frontend: lint, 77 archivos y 895 tests en verde, con los umbrales de cobertura cumplidos.
