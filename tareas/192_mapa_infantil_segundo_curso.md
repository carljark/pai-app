# 192 · Mapa intermodular de 2.º de Educación Infantil con tres actividades por conexión

## Propósito

Esta tarea completa lo iniciado en la [tarea 191](191_mapa_infantil_estructura_drive.md). Se rehace el mapa intermodular de **2.º de Educación Infantil** a partir de las relaciones RA↔RA de los documentos de Drive.

Siguiendo el criterio del usuario, cada conexión lleva **al menos tres actividades**. Es la misma densidad que el mapa de CFGM Estética: 3 actividades por conexión. Peluquería tiene una media de 2 a 3.

## Flujo

1. **Plan de relaciones.** Se usa el mismo algoritmo que en la tarea 191, con un tope de **9 conexiones por RA** en 2.º, en lugar de 15. Así se mantiene un volumen comparable al de Peluquería, de unas 8 por RA, y aun así se cumplen las reglas:
   - 179 relaciones, que dan 358 conexiones bidireccionales;
   - entre 6 y 9 conexiones por RA, en 48 RA;
   - todos los criterios oficiales cubiertos, con un máximo de 3 criterios externos por conexión.
2. **Redacción.**
   - Cada relación tiene una justificación de conexión y **3 actividades** bilingües ES/CA.
   - Cada actividad incluye título, factor motivador, desarrollo con los criterios concretos de ambos módulos, evidencia, medidas DUA y metodología activa.
   - Total: 537 actividades distintas.
   - Como cada relación se publica en los dos RA que conecta, el mapa contiene 1.074 actividades.
3. **Generación y validación.**
   - El script `build.py`, temporal y ya eliminado, compone el JSON con los textos oficiales de los RA y criterios. Conserva los metadatos de cada módulo (nombre, tipo, color e icono).
   - Comprueba que no se repite ningún título de actividad dentro de un RA.
   - Aplica heurísticas para detectar castellano en `_ca` y catalán en `_es`.
   - Comprueba los rangos de las reglas del mapa y la cobertura de criterios.
   - `relationType` depende del módulo destino:

     | Módulos destino | `relationType` |
     |---|---|
     | 0013, 0016, 0018, 0019 | técnica |
     | 0017, 0179 | comunicación |
     | 0020 | ciencias |
     | 1708 | sostenibilidad |
     | 1710 | empleabilidad |

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgs_educacion_infantil_2.json`: regenerado con 9 módulos, 48 RA, 358 conexiones y 1.074 actividades.
- `backend/src/migrations/20_reload_mapa_infantil_segundo_curso.ts`: recarga solo la pestaña `CFGS_EDUCACION_INFANTIL_2` y es reejecutable.
- `backend/src/tests/mapa.test.ts`:
  - nuevo helper `expectBidirectionalMap`, que comprueba la bidireccionalidad, el mínimo de actividades por conexión, los títulos únicos por RA y que `relatedCriteria` pertenezca al módulo destino;
  - lo usan los tests de las migraciones 19 y 20;
  - la migración 20 no toca 1.º.

## Pendiente

Falta ampliar el 1.º curso (tarea 191) de 1 a 3 actividades por conexión, como pidió el usuario. Supone 406 actividades más sobre las 203 relaciones existentes, con una nueva migración que recargue la pestaña de 1.º.
