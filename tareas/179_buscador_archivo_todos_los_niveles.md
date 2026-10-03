# Tarea 179: Buscador del Archivo en todos los niveles y por relevancia

## Propósito
El usuario indicó que el buscador por palabras del Archivo "no funcionaba". En la prueba en local se encontraron dos causas:
1. Solo buscaba **dentro de la pestaña activa** (FPB, CFGM Peluquería, CFGM Estética, ESO). Por ejemplo, "Imatge" daba 0 resultados porque el proyecto estaba en otra pestaña.
2. Buscaba también en todo el contenido generado y mostraba los resultados **sin orden de relevancia**: proyectos que solo mencionaban la palabra en el texto aparecían mezclados con los que la tenían en el título.

## Decisiones del usuario
- Mientras haya texto en el buscador se busca en **todas las pestañas**; al vaciarlo vuelve a filtrar por pestaña.
- Se busca en **todo** (título, módulos, RA y contenido), pero **ordenado**: primero los que coinciden en título, módulos o RA.

## Arquitectura y flujo
- `features/history/utils/history-filter.ts`:
  - `keywordRank(project, keywords)`: 2 si todas las palabras están en título, módulos o RA; 1 si hace falta el contenido; 0 si no coincide;
  - el contenido incluye el original y las **traducciones guardadas**, así que también se encuentran palabras en el otro idioma;
  - `sortByRelevance`: orden estable por relevancia;
  - `matchesProjectFilters` ignora la pestaña cuando hay palabras clave; los demás filtros (míos, módulo, RA) se mantienen.
- `history-view.component`:
  - `keywords` / `isSearching` (computed);
  - `filteredProjects` ordena por relevancia;
  - con búsqueda activa, las pestañas se atenúan (`history-view__tabs--searching`) y se muestra el aviso `historySearchAllLevels` (ES/CA).

## Archivos modificados
- `frontend/src/app/features/history/utils/history-filter.ts` (+ spec).
- `frontend/src/app/features/history/components/history-view/history-view.component.{ts,html,scss}` (+ spec).
- `frontend/src/app/services/translations.{es,ca}.ts`.

## Verificación
- Prueba real en local:
  - "Imatge" encuentra primero "Imatge corporal i hàbits saludables" (pestaña CFGM Peluquería);
  - "Ciencias" muestra primero las coincidencias de título y módulos;
  - al vaciar el buscador vuelve el filtro por pestaña.
- `ngc`, `tsc` de specs y ESLint sin errores.
- Pendiente (usuario): `cd frontend && npm test`.
