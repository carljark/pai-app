# Tarea 250: FP Básica al plan 2026/27 en el mapa y en el generador

> **Plan:** [250 — FP Básica al plan 2026/27 en el mapa y en el generador](../planes/250_plan_fp_basica_plan_2026_27_mapa_y_curriculo.md)

## Propósito
La project manager detectó que al mapa del CFGB Peluquería y Estética (IMP11) le faltaban módulos de 2.º, sobre todo el **3160, Proyecto intermodular**. Lo comparó con el plan de estudios de los matriculados desde 2026/27 (FP Illes Balears):
- **1.º:** 3060, 3062, 3064, 3061, 3159, 3161 y 3163.
- **2.º:** 3005, 3065, 3063, 3160, 3162 y 3164.

**No era una regresión.** Ninguna de las 17 versiones del seed del frontend ni de las 3 del JSON del backend tuvo nunca el 3160 en el mapa, aunque el generador lo tiene desde el commit `0057f4f`.

Se hicieron los cuatro puntos del plan:
1. el 3160 y Comunicación y Ciencias Sociales II en el mapa;
2. una pestaña por curso;
3. los módulos comunes con los códigos 3161-3164;
4. el 3159 en el generador, con los módulos filtrados por curso.

## Arquitectura y flujo
- **Currículo:** `backend/src/data/ras_fp_basica.data.ts` es la fuente única del generador y del mapa.
  - 71 unidades: 38 de 1.º y 33 de 2.º.
  - Todas tienen `tipoNivel: 'FP_BASICA'`, `moduleCode` y nombres del plan 2026/27.
- **Ámbitos 3161-3164 sin RA.** Siguen el anexo V del RD 217/2022 y la resolución DGFPIOE 03/2024 de la CAIB (apéndices 4 y 5).
  - Tienen **competencias específicas** `CE1`…`CE8` con criterios numerados `1.1`. El I y el II comparten competencias y criterios.
  - Prioridad de fuentes fijada por el usuario: CAIB, después BOE y después TodoFP.
  - Las adaptaciones de Baleares se trasladan también al castellano.
  - Detalle en [`documentation/fp_basica_plan_2026_27.md`](../documentation/fp_basica_plan_2026_27.md).
- **Catálogo:** `niveles.ts` declara los módulos de cada curso y dos mapas, `FPB` (1.º) y `FPB_2` (2.º). El frontend no cambia de lógica: el selector de curso del mapa y el agrupado del generador salen del catálogo.
- **Migración 52** (`52_fp_basica_plan_2026_27.ts`):
  - sustituye todos los RA de FP Básica (sin `tipoNivel` o con `FP_BASICA`);
  - recarga `FPB` y `FPB_2` desde `mapa_fp_basica.json` y `mapa_fp_basica_2.json`;
  - se puede reejecutar.
- **Generador:**
  - `findSelectedRa` prefiere, dentro del nivel, el RA de un módulo del curso, porque los ámbitos I y II comparten textos.
  - `describeRaForPrompt` escribe «Competencia específica CE4» en los ámbitos.
- **Frontend:** `utils/criterio-clave.ts` extrae la clave del criterio, ya sea la letra o `1.1`. Lo usa el filtro de conexiones por criterio de `MapaIntermodularFacade`, que antes cogía la «r» de «1.1 Explicar…» y acababa mostrando todas las conexiones.

### Mapa rehecho con DeepSeek
Del mapa antiguo (485 conexiones en una sola pestaña) solo sobrevivían 133 conexiones dirigidas al separar cursos y quitar los módulos comunes antiguos. Sus actividades citaban criterios de módulos que ya no existen (3042, 3067), así que no se reutilizaron. Los emparejamientos antiguos se dieron a DeepSeek como `pistas.md`.

**Herramienta** (`scripts/mapa-intermodular/mapa-intermodular.mts`). Ahora admite:
- unidades `CE`;
- criterios numerados, con citas del tipo `3161-1.1`;
- el comando `plan`, que valida el plan de relaciones sin actividades;
- el comando `comprobar --archivo`, que valida un solo archivo de relaciones.

**Proceso con DeepSeek V4.1 Flash** (opencode `--standalone --auto`, con los permisos restringidos de la tarea 245, en un worktree aparte):
1. **Plan de relaciones por pestaña:** 127 relaciones en 1.º y 114 en 2.º. Los dos validaron a la primera sin criterios sin cubrir.
2. **Actividades en 41 tramos de 6 relaciones,** con 3 actividades por relación. Al principio iban dos tandas, una por curso. A petición del usuario se pasó a 8 tramos en paralelo.
   - Todos los tramos validaron.
   - Dos necesitaron una corrección automática: una metodología idéntica en ES y CA.
3. **Retoque final** con un script temporal:
   - sustituir anglicismos: «role-play» por «juego de rol» / «joc de rol», «checklist» y «Corner card»;
   - poner mayúscula inicial en la metodología.

| Curso | Pestaña | Relaciones | Conexiones | Actividades distintas |
|---|---|---|---|---|
| 1.º | `FPB` | 127 | 254 | 381 |
| 2.º | `FPB_2` | 114 | 228 | 342 |

El 3160 tiene 6 conexiones en cada uno de sus 5 RA.

## Archivos modificados
1. `backend/src/data/ras_fp_basica.data.ts` (nuevo): currículo de FP Básica 2026/27.
2. `backend/src/data/niveles.ts`: módulos por curso y mapas `FPB`/`FPB_2`.
3. `backend/src/data/mapa-intermodular/mapa_fp_basica.json` y `mapa_fp_basica_2.json` (nuevos): mapas generados. `mapa_fpb.json` no se toca, porque lo leen las migraciones 08, 17, 18 y 29.
4. `backend/src/migrations/52_fp_basica_plan_2026_27.ts` (nueva).
5. `backend/src/controllers/project.controller.ts`: `inCourse`, `findSelectedRa` con curso y el rótulo de competencia específica.
6. `backend/src/tests/mapa.test.ts`: test de la migración 52, con:
   - RA sustituidos y otros niveles intactos;
   - reejecución sin duplicar;
   - mapas bidireccionales con 3 actividades por conexión y 6-15 conexiones por unidad;
   - textos iguales a los datos;
   - orden de los módulos en la API.
7. `backend/src/tests/niveles-catalogo.test.ts`: `FPB_2`, cursos de los mapas y FP Básica en la cobertura de módulos.
8. `backend/src/tests/projects.test.ts`: preferencia por curso de `findSelectedRa` y rótulo de competencia.
9. `scripts/mapa-intermodular/mapa-intermodular.mts`: competencias, criterios numerados, `plan`, `comprobar` y `COMUNES` con 3159-3164.
10. `scripts/mapa-intermodular/fuentes/FPB/` y `FPB_2/`: `config.json` y los 41 `relaciones_NNN.json`.
11. `frontend/src/app/features/mapa-intermodular/utils/criterio-clave.ts` y su spec (nuevos), y `services/mapa-intermodular.facade.ts`.
12. `frontend/src/app/features/mapa-intermodular/components/ui/header/header.component.spec.ts` (nuevo): cubre el subtítulo de un mapa sin curso en un ciclo de varios cursos, que antes cubría FPB.
13. `frontend/src/app/testing/niveles.mock.ts` y los specs de `curriculum.facade`, `projects.facade`, `niveles.service` y `mapa-intermodular-view`.
14. `documentation/fp_basica_plan_2026_27.md` (nuevo), `procesamiento_actividades_mapa_intermodular.md` y `mapas_intermodulares_pendientes.md`.
15. `AGENTS.md` §10: normas del usuario añadidas durante la tarea (VPN GlobalProtect, Docker con Rancher Desktop y fórmula de respuesta).
16. `.gitignore`: carpeta de trabajo `scripts/mapa-intermodular/fpb-2026/`, y `pistas.md` y `plan.json` de las fuentes.

## Decisiones técnicas
- **Archivos de mapa nuevos en lugar de sobrescribir `mapa_fpb.json`.** Las migraciones antiguas lo leen al crear una base nueva. Si se sobrescribía, sus tests se rompían y el historial de migraciones perdía sentido.
- **Competencias como unidades `CE` dentro de la colección `ras`.** Así el generador, el mapa y la cesta las tratan como un RA más, sin modelos nuevos. El rótulo del prompt las distingue.
- **Plan y actividades por separado.** El modelo primero decide qué se relaciona (`plan`) y luego redacta en tramos pequeños. Un validador por tramo permite paralelizar y corregir en la misma sesión.
- **Retoque determinista final** en vez de pedir más correcciones al modelo, para los anglicismos y las mayúsculas. «Kit» se mantiene porque lo recogen el DRAE y el DIEC.
- **Mapeos de `curriculum.controller.ts` sin cambios.** Los datos nuevos llevan `module_es`/`module_ca`, que tienen prioridad.
- **`fpbmatches`:** en producción está vacía, así que no hace falta adaptarla.

## Verificación
- Backend:
  - `npm run typecheck`: 0 errores.
  - `npm test`: 41 archivos y 494 tests en verde, con los umbrales de cobertura.
- Frontend:
  - ESLint de los archivos tocados sin hallazgos;
  - `tsc -p tsconfig.spec.json` sin errores;
  - `npm test` (lint, 126 archivos y 1181 tests, `check-coverage.js` y `check-zoneless.js`) en verde.
- Herramienta: `construir` de las dos pestañas sin errores ni avisos, también después del retoque.
- Docker local (Rancher Desktop):
  - la migración 52 se aplicó al arrancar;
  - `GET /api/mapa-intermodular?tab=FPB` devuelve 7 módulos, 38 unidades y 254 conexiones;
  - `tab=FPB_2` devuelve 6 módulos, 33 unidades y 228 conexiones, con el 3160 y sus 5 RA;
  - `GET /api/ras?lang=catalan` devuelve los nombres y criterios en catalán de 3159, 3160 y 3162.
- Revisión de muestras de los planes y de las actividades de los dos cursos, hecha por Claude Code: actividades integradas (una sola tarea por actividad), metodologías variadas y catalán correcto.
- **Pendientes:**
  - la revisión visual en el navegador, porque el servidor de Playwright no conectó;
  - el coste de DeepSeek según OpenRouter, que no se ha consultado.

## Desviaciones respecto al plan
- **Rama B1:** las fuentes oficiales mostraron que los ámbitos no tienen RA sino competencias específicas. Por eso el mapa se rehízo casi entero con DeepSeek en lugar de convertir las conexiones existentes.
- **Archivos:** `mapa_fp_basica*.json` y `ras_fp_basica.data.ts` en lugar de `mapa_fpb*.json` y `ras_fpb_2026.data.ts`.
- **Frontend:** se cambió código, la utilidad `criterio-clave`, no solo tests.
- **Prueba en Docker:** se probó la API; no se hizo la prueba visual de la cesta ni de «Crear proyecto» en `FPB_2`.
