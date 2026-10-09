# Tarea 209: Corrección de los módulos transversales del CFGM Peluquería

## Propósito
Al incorporar el CFGM Atención a Personas en Situación de Dependencia (tarea 208) se vio que los módulos transversales de **CFGM Peluquería y Cosmética Capilar** (1664, 1709, 0156, 1708, 1710 y 1713) no coincidían con el BOE. Esta tarea los corrige en los RA y en los dos mapas intermodulares del ciclo (`CFGM_PELUQUERIA` y `CFGM_PELUQUERIA_2`).

## Errores corregidos
- **Castellano, que ahora es literal del BOE:**
  - Espacios sobrantes en 1664: «software ,», «Blockchain ,», «cloud /nube» y «cloud/ nube».
  - Escape de markdown «Agenda 2030\.» en 1708 RA1 c).
  - 1713 RA1: «de acuerdo con» donde el RD 499/2024 dice «de acuerdo a» (e y h). En i) faltaba «(Objetivos de Desarrollo Sostenible)».
  - 1709 RA3: se eliminan los criterios h) e i) («libertad sindical» y «huelga»), que no están en ninguna versión del RD 659/2023.
    - Procedían de un documento de trabajo parafraseado (`RA_CE_CFGM_peluqueria_1er_curso_ES.md`) que incluso decía «derecho fundamental a la vaga».
    - La lista literal del BOE (`lista_RA_CE_..._2026_27.md`) solo tiene siete criterios.
- **Catalán:**
  - Apóstrofos ausentes: «Shan determinat», «lexecució», «dintervenció».
  - «S'han fet el seguiment» pasa a «S'ha fet el seguiment».
  - «s'han de ser aplicades» pasa a «han de ser aplicades».
  - «afectaria als recursos humans» pasa a «afectaria els recursos humans».
  - Dos traducciones que no seguían el castellano, en 1713 RA2 i) y RA4.
  - El texto es el revisado en la tarea 208 (`ras_cfgm_atencion_dependencia.data.ts`).
- **Mapas:**
  - Se actualizan los textos de RA y criterios copiados en el mapa, tanto en los RA propios como en los RA destino y en las referencias a criterios y RA.
  - Se eliminan las dos conexiones con origen en 1709-3h y 1709-3i, con 3 actividades en total. 1709 RA3 conserva 7 conexiones.
  - Se corrigen **74 etiquetas catalanas** de referencias a criterios en las que un generador antiguo había traducido la letra «e)» como «i)». El texto era el de la e), pero la etiqueta decía i).
  - El 1.er curso pasa de 377 a 375 conexiones y de 846 a 843 actividades.

## Arquitectura y flujo
- `backend/src/data/ras_cfgm_peluqueria.data.ts` y los dos JSON del mapa se corrigen con un script temporal determinista.
  - Toma el texto oficial ya validado de la tarea 208 y reescribe los archivos con el mismo formato, así que el diff solo contiene las correcciones.
  - Es idempotente: una segunda pasada no cambia nada.
- **Migración `27_reload_cfgm_peluqueria_transversales.ts`:**
  - Recarga todos los RA de `CFGM_PELUQUERIA` con `deleteMany` + `insertMany`, como la 24 con Estética. Los proyectos no guardan referencias por `_id` a los RA.
  - Recarga las pestañas `CFGM_PELUQUERIA` y `CFGM_PELUQUERIA_2` del mapa desde sus JSON, con el patrón de las migraciones 14 y 16.
  - Solo toca Peluquería y se puede reejecutar.
- Las migraciones anteriores que importan los datos (07, 14 y 16) ya están aplicadas en producción y no se reejecutan.

## Archivos modificados
1. `backend/src/data/ras_cfgm_peluqueria.data.ts`: transversales con texto oficial y catalán revisado. Los nombres de los módulos no cambian.
2. `backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria.json` y `mapa_cfgm_peluqueria_2.json`: textos sincronizados, conexiones eliminadas y etiquetas corregidas.
3. `backend/src/migrations/27_reload_cfgm_peluqueria_transversales.ts` (nueva).
4. `backend/src/tests/mapa.test.ts`:
   - test de la migración 27: idempotencia, otros niveles intactos, 1709 RA3 con 7 criterios y sin rastro de 1709-3h/3i ni de «cloud /nube»;
   - recuentos de 1.er curso actualizados.
5. `backend/src/tests/ras-atencion-dependencia.test.ts`: los transversales de Peluquería y de Atención a la Dependencia deben tener el mismo texto, para que no vuelvan a divergir.

## Decisiones técnicas
- Los nombres catalanes de los módulos («Itinerari personal per a l’ocupabilitat I», con apóstrofo tipográfico) se mantienen porque no son erróneos y el mapa los usa igual.
- **Quedan fuera de alcance**, por ser problemas previos ajenos a los transversales:
  - Cuatro conexiones de 0643 RA5 (2.º curso) apuntan a un **RA6 de 0636 que no existe**, con `targetRaText` vacío.
  - Estética y Educación Infantil usan también módulos transversales. No se han revisado en esta tarea.

## Verificación
- Auditoría con un script temporal: los 9 148 textos de RA y criterios copiados en los mapas coinciden con los datos. Solo quedan las cuatro conexiones al RA inexistente.
- `cd backend && npm test`: 29 archivos y 355 tests en verde.
- `cd frontend && npm test`: 66 archivos y 832 tests en verde (1 omitido); cobertura y comprobación zoneless correctas.
- Despliegue en producción con `./scripts/deploy-prod.sh` tras el commit.
