# Tarea 183: Corrección del catalán en los mapas de FPB, Estética y 1.º de Peluquería (y RA de Estética)

## Propósito
Continuación de la tarea 182: eliminar el castellano incrustado en los campos `_ca` de los mapas intermodulares restantes. Durante la revisión aparecieron además dos problemas de datos en MongoDB.

## Método
Mismo procedimiento que en la tarea 182:
1. Auditoría con un script temporal: morfología castellana, palabras funcionales y comparación de vocabulario con un corpus catalán de confianza.
2. Retraducción de cada texto afectado desde su pareja en castellano (`_es`).
3. Reemplazo exacto en todos los campos `_ca` (también dentro de las listas de criterios).
4. Verificación estructural contra el último commit: no cambia ningún campo que no sea `_ca`.

Se mantienen los falsos positivos, que son catalán correcto: «bigudí», «carro», «pros», «dispersos», «constituents», primeras personas como «preparo» o «explico», «rul·los»…

| Mapa | Textos retraducidos | Campos `_ca` cambiados |
|---|---|---|
| FPB (`mapa_fpb.json`) | 136 | 268 |
| 1.º Peluquería (`mapa_cfgm_peluqueria.json`) | 60 | 149 |
| Estética (`mapa_cfgm_estetica.json`) | 4 | 5 |

## Correcciones destacadas
- **FPB:**
  - criterios con traducción automática a medias: «S'han expuesto», «éstos», «aplicándole», «higienizándose»;
  - criterios en los que la letra «e)» se había traducido como la conjunción «i)»;
  - una medida DUA que llevaba pegados por error unos 49.000 caracteres de otro documento, repetidos en varias conexiones (el fichero baja unos 460 KB).
- **Estética:** un título catalán («Secreto profesional») que no correspondía al castellano («Práctica guiada de taller»), con sus descripciones.
- **Formato:** los JSON de FPB y Estética se reescriben en formato compacto con los mismos separadores que el original.

## Problemas de datos encontrados en MongoDB
- **RA de Estética:** en la base de datos, los `criterios_ca` estaban en castellano (416 textos) aunque `ras_cfgm_estetica.data.ts` está bien. La migración 04 los cargó antes de que se corrigiera el fichero y nunca se resincronizaron. **Corregido** con la migración 17.
- **RA de FPB (no corregido; pendiente de decisión):** sus `criterios_ca` son una copia del castellano (444 textos), por el relleno de la migración antigua `002` («Fallback for cat»). No hay fichero de datos catalán. El mapa de FPB solo cubre 186 de esos criterios con texto equivalente; el resto (unos 260 criterios y 45 descripciones) habría que traducirlo desde cero. Es lo que reciben el generador y el prompt de la IA cuando se trabaja en catalán con FPB.
- **Otras incidencias de FPB detectadas (no corregidas):**
  - algunos campos `_es` del mapa tienen catalanismos («higienitzación», «deficiències», «ajudant de manicura»);
  - varias actividades citan referencias de aprendizaje distintas en castellano y catalán (por ejemplo, «3159-2c» frente a «3159-3c»).

## Archivos
- `backend/src/data/mapa-intermodular/mapa_fpb.json`, `mapa_cfgm_estetica.json` y `mapa_cfgm_peluqueria.json`: campos `_ca`.
- Nueva migración `backend/src/migrations/17_fix_catalan_mapas_y_ras_estetica.ts`:
  - resincroniza los campos catalanes de los RA de Estética desde su fichero de datos;
  - recarga las pestañas `FPB`, `CFGM` y `CFGM_PELUQUERIA`;
  - es reejecutable.
- `backend/src/tests/mapa.test.ts`: test de la migración 17.

## Verificación
- Migración 17 aplicada en local: 52 RA de Estética sincronizados (0 criterios catalanes en castellano) y tres mapas recargados.
- Auditoría final de los tres mapas: solo falsos positivos.
- Pendiente (usuario): `cd backend && npm test`.
