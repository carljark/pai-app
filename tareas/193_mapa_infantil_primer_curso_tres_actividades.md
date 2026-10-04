# 193 · Tres actividades por conexión en 1.º de Educación Infantil

## Propósito

El usuario pidió **al menos tres actividades por conexión** en los dos cursos de Educación Infantil. Es la densidad del mapa de CFGM Estética. La [tarea 192](192_mapa_infantil_segundo_curso.md) ya lo aplicó al 2.º curso. Esta tarea amplía el 1.º curso, publicado en la [tarea 191](191_mapa_infantil_estructura_drive.md) con una sola actividad por conexión.

## Flujo

1. Se conservan las 203 relaciones RA↔RA de la tarea 191 y su actividad original.
2. Para cada relación se redactan **dos actividades nuevas** bilingües ES/CA: 406 nuevas en total. Trabajan otros aspectos de los mismos criterios oficiales, con contextos y metodologías distintos a los de la actividad existente.
3. El generador temporal combina las actividades originales y las nuevas y vuelve a validar:
   - 406 conexiones, entre 7 y 15 por RA;
   - 3 actividades por conexión: 1.218 en el mapa, porque cada relación aparece en los dos RA;
   - ningún título se repite dentro de un RA;
   - todos los criterios oficiales están cubiertos;
   - la heurística no detecta mezcla de idiomas ES/CA.
4. Las actividades de una conexión llevan identificadores `act_<módulo>_<RA><criterio>_<n>_<k>`, únicos dentro del RA.

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgs_educacion_infantil.json`: regenerado con 1.218 actividades.
- `backend/src/migrations/21_reload_mapa_infantil_primer_curso_tres_actividades.ts`: recarga solo la pestaña `CFGS_EDUCACION_INFANTIL` y es reejecutable. La migración 19 ya estaba aplicada en producción, así que hace falta una nueva para recargar.
- `backend/src/tests/mapa.test.ts`: el test de la migración 19 ahora exige 3 actividades por conexión, ya que lee el mismo JSON. Se añade un test para la migración 21.

## Resultado

| Curso | Conexiones | Actividades por conexión | Actividades |
|---|---|---|---|
| 1.º | 406 | 3 | 1.218 |
| 2.º | 358 | 3 | 1.074 |
