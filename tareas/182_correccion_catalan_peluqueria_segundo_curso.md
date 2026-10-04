# Tarea 182: Corrección del catalán de 2.º de CFGM Peluquería (RA y mapa intermodular)

## Propósito
Corregir los campos en catalán (`_ca`) de 2.º de CFGM Peluquería y Cosmética Capilar, que contenían texto en castellano o mezclado (restos de una traducción automática parcial). Afectaba a:
- **Resultados de aprendizaje y criterios** de 0640, 0643, 0843, 0848 y 0636 (31 RA, 236 criterios), en los datos de RA y en el mapa.
- **Mapa intermodular de 2.º** (`mapa_cfgm_peluqueria_2.json`): textos de los RA, criterios relacionados, títulos, justificaciones, retos, descripciones, evidencias y medidas DUA de las actividades.

## Fuentes y método
- **Fuente catalana:** el PDF `add_mid_grades/grado_medio_peluqueria/RA_CE_CFGM_peluqueria_2o_curso_CAT.md.pdf` es una traducción automática (marca «Machine Translated by Google») y su texto extraído sale truncado y mezclado con otras columnas. Solo se ha usado como referencia de terminología.
- **Traducción:** los 31 RA se traducen al catalán desde el castellano oficial de los datos (RD 1588/2011), con terminología de FP: estris, cuir cabellut, metxes, fitxa tècnica, afaitat, marxandatge, servucció…
- **Mapa:**
  1. Los campos estructurales (`text_ca`, `criteria_ca`, `targetRaText_ca` y `criteria_ca` de los criterios relacionados) se regeneran desde los datos de RA corregidos.
  2. Los textos de actividades con castellano incrustado se retraducen desde su pareja en castellano (`_es`) de la misma actividad, así que el catalán queda también alineado con el castellano. Son 435 textos distintos en tres pasadas de detección y unos 900 reemplazos, porque cada actividad se repite en todos los RA que conecta.
- **Detección**, con scripts temporales de auditoría:
  - palabras funcionales castellanas;
  - morfología que no existe en catalán: «ñ», «-ción», «-dad», «-ado/-ido», «-mente», gerundios en «-ando/-iendo», «-ico» y el diptongo «ue»;
  - una comparación de vocabulario: palabras del castellano del mismo mapa que no aparecen en un corpus catalán de confianza.
  - Se excluyen las formas catalanas válidas: «introdueix», «dues», «-los» enclítico, «verdes», «siluetes», etc.
- **Resultado:**
  - 2.836 campos `_ca` corregidos en el mapa; la auditoría final no encuentra castellano (solo falsos positivos conocidos);
  - comprobación estructural: ningún campo que no sea `_ca` ha cambiado y la estructura (8 módulos, 367 conexiones) es idéntica.

## Archivos
- `backend/src/data/ras_cfgm_peluqueria.data.ts` y `frontend/src/app/features/curriculum/data/ras_cfgm_peluqueria.data.ts`: catalán de los RA de 2.º.
- `backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria_2.json`: campos `_ca`.
- Nueva migración `backend/src/migrations/16_fix_catalan_peluqueria_segundo_curso.ts`:
  - actualiza solo los campos en catalán de los RA de Peluquería (`module_ca`, `description`, `description_ca`, `criterios_ca`);
  - recarga la pestaña `CFGM_PELUQUERIA_2` desde su JSON;
  - es reejecutable.
- `backend/src/tests/mapa.test.ts`: test de la migración 16.

## Fuera de alcance (detectado)
La misma auditoría encuentra mezclas menores en otros mapas, que no se han tocado:
- **1.º de Peluquería:** unos 39 textos («resuelto», «anotado», «diferenciados»…).
- **FPB:** unos 24 («fuents», «expuesto», «señalar»…).
- **Estética:** «constituents» en un criterio.

Se pueden corregir con el mismo método.

## Verificación
- Migración 16 aplicada en local: 94 RA sincronizados y mapa recargado.
- Playwright: el mapa «CFGM Perruqueria i Cosmètica Capil·lar 2n» muestra los RA y las conexiones en catalán.
- `tsc` de specs, `ngc` y ESLint del frontend sin errores.
- Pendiente (usuario): `cd backend && npm test` y `cd frontend && npm test`.
