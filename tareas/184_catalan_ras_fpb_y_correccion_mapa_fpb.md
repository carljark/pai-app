# Tarea 184: Traducción al catalán de los RA de FPB y corrección del mapa de FPB

## Propósito
Cerrar los problemas de FPB (Peluquería y Estética) detectados en la tarea 183:
- en la colección `ras`, los `criterios_ca` de FPB eran una copia del castellano (relleno «Fallback for cat» de la migración antigua `002`), y 15 RA no tenían criterios;
- el mapa intermodular de FPB tenía catalanismos en campos `_es`, referencias de aprendizaje distintas entre ES y CA y texto pegado de otros documentos.

## Alcance
- **73 RA de FPB** (todos los módulos salvo Itinerario personal para la empleabilidad, 3159, que ya estaba bien): descripción y criterios en catalán (590 criterios).
- **Nombre catalán** guardado en `module_ca`. Se corrige además «Proyecto inter modular de aprendizaje colaborativo», que tenía el nombre castellano en el campo catalán: pasa a «Projecte intermodular d'aprenentatge col·laboratiu».
- **Criterios castellanos** (`criterios_es`) reescritos solo en 19 RA, con el texto oficial del BOE (RD 127/2014, anexo de Peluquería y Estética):
  - 15 RA que no tenían criterios: Cuidados RA1–RA2, Depilación RA2 y RA4, Maquillaje RA1–RA2, Lavado RA3, Atención al cliente RA1 y RA4, Ciencias aplicadas II RA4, RA5, RA6, RA9 y RA14, Comunicación y sociedad I RA6;
  - 4 RA cuyos criterios eran copia de otro RA:
    - Ciencias aplicadas II RA1 (copia de Ciencias aplicadas I RA9);
    - Lavado RA5 (copia de RA4);
    - Comunicación y sociedad I RA4 (copia de RA3);
    - Comunicación y sociedad II RA4 (copia de RA3).
- **Mapa de FPB** (`mapa_fpb.json`), sin cambios de estructura (mismos módulos, RA, conexiones y actividades que en el último commit):
  - 719 medidas DUA limpiadas:
    - basura pegada al final (notas metodológicas, nombres de archivo `.md`, encabezados de RA, separadores «———»);
    - dobles puntos «..».
  - 300 campos `_es` y 56 campos heredados `criteria` con catalanismos corregidos: «ajudant», «higienitzación», «deficiències», «desenvolupado», «conèixer», «Reconèixer», «Fidelitzar», «anatòmica», «gomets».
  - 242 campos `_ca` con referencias de aprendizaje corregidas para que coincidan con el castellano:
    - en 3159 el catalán estaba desplazado un RA («3159-2a» en lugar de «3159-1a»);
    - letras «e» convertidas en «i» por la traducción automática.
  - RA y criterios catalanes del mapa sincronizados con la traducción revisada de la BD:
    - 53 enunciados de RA;
    - todos los criterios de cada RA;
    - 367 `targetRaText_ca`;
    - unos 990 `relatedCriteria.criteria_ca`.
  - 14 criterios que el mapa daba abreviados se sustituyen por el texto oficial en ambos idiomas (y sus 32 referencias en `relatedCriteria`).
  - Castellano y valenciano residual en otros campos `_ca` corregidos al catalán estándar balear:
    - castellanismos: «cera caliente i tibia», «fabricante», «cumplimentat», «reflejat», «necesarios», «utensilios», «contagio», «apoyada»…;
    - formas valencianas: «seua/seues» → «seva/seves», «tindre» → «tenir»;
    - apóstrofos perdidos: «dhigiene», «laigua»…

## Arquitectura y flujo
1. `backend/src/data/ras_fpb_catalan.data.ts` (`FPB_RAS_CATALAN`):
   - una entrada por RA, con `module_es` e `id` (clave de búsqueda), `module_ca`, `description_ca` y `criterios_ca`;
   - `criterios_es` solo en los 19 RA corregidos.
2. Migración `backend/src/migrations/18_fix_catalan_ras_y_mapa_fpb.ts`:
   - **RA:** `updateOne` por `module_es` + `id`, filtrando `tipoNivel` nulo o `FP_BASICA`, porque los RA antiguos de FPB no guardan `tipoNivel`. Solo fija los campos catalanes (`module`, `module_ca`, `description`, `description_ca`, `criterios_ca`) y, cuando el fichero lo trae, `criterios_es`. No toca RA de otros ciclos. Se puede volver a ejecutar sin efectos.
   - **Mapa:** sustituye la pestaña `FPB` con el JSON corregido.
3. Aplicada en local: 73/73 RA actualizados y 11 módulos de mapa recargados. Ya no queda castellano en `criterios_ca` de FPB ni RA sin criterios.

## Decisiones técnicas
- **Fuente:**
  - el castellano se ha contrastado con el texto del BOE descargado en la sesión;
  - el catalán es traducción propia con terminología de FP balear (estris, cuir cabellut, riscs, esmenar…), porque el BOIB no publica estos currículos en catalán;
  - se han reaprovechado los criterios del mapa solo cuando su castellano coincidía con el de la BD.
- **Criterios duplicados del propio BOE:** en Ciencias aplicadas I RA7 la secuencia de letras del BOE es «a–e, h, f, g, h», y el primer «h)» arrastra el texto «describir adecuadamente los aparatos y sistemas». Se conservan las letras tal como están en la BD, y la traducción omite ese fragmento sin sentido.
- **Medidas DUA:** se recortan en el primer marcador de texto ajeno. Las que empiezan por minúscula («regla de tres, proporciones… Medidas DUA…») son así en el documento de origen y no se reescriben.
- **Formato:** el JSON se escribe compacto, con los mismos separadores que el original. Respecto al último commit (sumando la limpieza de la tarea 183), el fichero pasa de 6,30 MB a 5,57 MB.

## Archivos
- Nuevo: `backend/src/data/ras_fpb_catalan.data.ts`.
- Nuevo: `backend/src/migrations/18_fix_catalan_ras_y_mapa_fpb.ts`.
- Modificado: `backend/src/data/mapa-intermodular/mapa_fpb.json`.
- Modificado: `backend/src/tests/mapa.test.ts`. El test de la migración 18 comprueba:
  - la traducción;
  - el relleno de RA vacíos y duplicados;
  - que no toca RA de otros ciclos;
  - que se puede reejecutar;
  - que desaparecen los catalanismos y la basura del mapa.
- Modificado: `documentation/procesamiento_actividades_mapa_intermodular.md`, sección 7 (comprobaciones de calidad lingüística y de referencias).

## Pendiente para el usuario
- Ejecutar `cd backend && npm test`.
