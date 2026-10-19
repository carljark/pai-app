# Tarea 245: Tres actividades por conexión en todos los mapas intermodulares de FP

> **Plan:** [`planes/245_plan_tres_actividades_por_conexion_mapas_fp.md`](../planes/245_plan_tres_actividades_por_conexion_mapas_fp.md)
> **Rama:** `feature/245_tres_actividades_por_conexion_mapas_fp`

## Propósito

Desde el 9 de octubre, los mapas intermodulares de FP se generaban con **una** actividad por conexión para abaratarlos. El usuario pidió que **todas las conexiones de todos los mapas tengan al menos tres actividades**, y que esa sea la regla para los mapas futuros. Solo la cumplían FPB, Estética y los dos cursos de Educación Infantil. El mapa de afinidades de la ESO queda fuera porque por diseño no tiene actividades.

## Resultado

Se añadieron **4.874 actividades bilingües** (castellano y catalán de las Illes Balears) en 15 pestañas. Todas las conexiones de todos los mapas de FP tienen ahora 3 actividades o más.

| Mapa | Conexiones | Actividades nuevas |
|---|---|---|
| CFGM Atención a Personas en Situación de Dependencia 1.º / 2.º | 322 / 306 | 322 / 306 |
| CFGM Cuidados Auxiliares de Enfermería | 272 | 272 |
| CFGM Guía en el Medio Natural 1.º / 2.º | 410 / 368 | 410 / 368 |
| CFGS Acondicionamiento Físico 1.º / 2.º | 314 / 280 | 314 / 280 |
| CFGS Animación Sociodeportiva 1.º / 2.º | 384 / 336 | 384 / 336 |
| CFGS Integración Social 1.º / 2.º | 290 / 330 | 290 / 330 |
| CFGS Laboratorio Clínico 1.º / 2.º | 374 / 348 | 374 / 348 |
| CFGM Peluquería 1.º / 2.º | 375 / 367 | 307 / 233 |

En los 13 mapas con fuentes, cada relación genera dos conexiones (una por sentido), así que se añadieron dos actividades por relación. En Peluquería, que no tiene fuentes, se completó cada conexión hasta tres. Las actividades nuevas de Peluquería citan todos los criterios de su conexión, aunque sean de módulos muy distintos. Por eso algunas quedan algo forzadas, como aceptó el usuario.

## Arquitectura y flujo

1. **Regla en el generador.** `scripts/mapa-intermodular/mapa-intermodular.mts` exige `MIN_ACTIVIDADES = 3` por relación y rechaza construir un mapa que no la cumpla.
2. **Redacción por lotes.** Las relaciones pendientes se repartieron en 84 lotes de unas 30 relaciones. Peluquería se agrupó por RA completo para controlar los títulos repetidos.
   - Los lotes 01-28 (Atención a la Dependencia, Cuidados Auxiliares de Enfermería y Guía en el Medio Natural) y parte de Acondicionamiento Físico los redactaron subagentes Sonnet de Claude Code.
   - Por coste, el resto se pasó a DeepSeek V4.1 Flash (OpenRouter) mediante opencode. Para ello se partió lo pendiente en 165 tramos pequeños y numerados.
3. **Validación.** `validar.py` replica las comprobaciones del generador y añade otras más estrictas:
   - todos los campos ES/CA presentes y distintos entre sí, y detección de mezcla de idiomas;
   - las citas `(MMMM-Nx)`: todas las de la relación, en el mismo orden en ES y CA y sin criterios ajenos;
   - los títulos: que no estén cortados, que no copien un criterio y que no se repitan dentro de un RA;
   - que no se repitan contextos, evidencias, medidas DUA ni comienzos del desarrollo.
4. **Incorporación.** `merge.py` añade las actividades a `scripts/mapa-intermodular/fuentes/<MAPA>/relaciones*.json`. En Peluquería las convierte al formato del mapa con el siguiente id `act_<módulo>_<criterio>_<n>`. Después, `construir` regenera `backend/src/data/mapa-intermodular/mapa_<mapa>.json`, de forma determinista.
5. **Carga en MongoDB.** La migración `49_reload_mapas_tres_actividades.ts` sustituye en `MapaModule` las 15 pestañas por sus JSON, de una en una para no cargar todos los JSON a la vez. No toca las demás pestañas y es segura de reejecutar.

### DeepSeek con opencode

Las herramientas viven en `scripts/mapa-intermodular/tres-actividades/`, que está ignorado en git porque contiene trabajo intermedio. Son estas:

- `preparar_tramos.py`: aparta las relaciones con errores, parte lo pendiente en tramos de hasta 10 relaciones (8 en Peluquería) y genera `tramos/NNN.input.json`, `prompts/NNN.md` y `PASOS.md`.
- `comprobar.py NNN`: valida el lote entero del tramo, para detectar repeticiones con tramos anteriores, pero solo informa de las relaciones del tramo.
- `lanzar.sh NNN [MMM]`: ejecuta `opencode run --standalone --auto` con permisos restringidos mediante `OPENCODE_CONFIG_CONTENT`. Si un tramo no valida, pide hasta dos correcciones en la misma sesión y se detiene si sigue fallando.
- `incorporar.py <MAPA>`: comprueba que todos los lotes del mapa validan, los incorpora, regenera el mapa y verifica que no queda ninguna conexión con menos de 3 actividades.

Permisos del lanzador:
- La shell está denegada salvo `comprobar.py`, y no hay acceso web.
- La lectura se limita a `INSTRUCCIONES.md`, al tramo y a las salidas de tramos. Así se evita que el modelo lea scripts o lotes enteros, que encarecían cada sesión, y que siga las instrucciones de `AGENTS.md` sobre tests, commit y despliegue.
- Los permisos solo se aplican con `--standalone`. Con el servicio de opencode en segundo plano, la variable de entorno se ignora.

**Coste.** DeepSeek V4.1 Flash salió a unos 0,0014 $ por actividad en tramos de 20 actividades. Cada sesión tiene un coste fijo de alrededor de 1 céntimo, porque reenvía las instrucciones y el tramo en cada petición. Casi todos los tramos validaron a la primera.

## Archivos modificados

- **Reglas y documentación:** `AGENTS.md` §8, `.agents/skills/agregar-ciclo-educativo/SKILL.md`, `references/checklist_archivos.md`, `scripts/verify_cfgm_integration.sh` y `documentation/procesamiento_actividades_mapa_intermodular.md`. En todos, «al menos una actividad» pasa a «al menos tres».
- **Prompts de generación de mapas:** `scripts/mapa-intermodular/prompt.md` y `prompt_cfgs_*.md` piden ahora tres actividades por relación.
- **Generador:** `scripts/mapa-intermodular/mapa-intermodular.mts` (`MIN_ACTIVIDADES`).
- **Fuentes:** `scripts/mapa-intermodular/fuentes/*/relaciones*.json` de los 13 mapas con fuentes.
- **Datos:** `backend/src/data/mapa-intermodular/mapa_*.json` de las 15 pestañas.
- **Migración nueva:** `backend/src/migrations/49_reload_mapas_tres_actividades.ts`.
- **Tests:** `backend/src/tests/mapa.test.ts`.
  - Los mapas bidireccionales exigen 3 actividades por conexión.
  - Hay un test nuevo de la migración 49: no toca otras pestañas, todas las conexiones tienen 3 actividades o más y los títulos no se repiten dentro de un RA.
  - Se actualizaron los recuentos de Peluquería en las migraciones 09 y 11: 1.150 y 1.640 actividades, y 163 títulos en el módulo 0848.
- **Otros:** `.gitignore` y los planes (`planes/245_*.md` y `planes/README.md`).

## Decisiones y detalles técnicos

- **Se amplían las fuentes en vez de editar los JSON a mano.** El generador sigue siendo la única vía para escribir los mapas que tienen fuentes, y sus validaciones se aplican a todo lo nuevo.
- **Las actividades se escriben por relación, no por conexión.** Así cada actividad aparece en las dos conexiones que genera su relación, igual que las existentes.
- **Tramos pequeños y en orden dentro de cada mapa.**
  - Caben de sobra en el contexto del modelo y, si un tramo falla, se pierde poco.
  - Los mapas distintos se ejecutaron en paralelo. Para ello, el aviso de cambios en archivos versionados ignora las fuentes y los JSON de los mapas, que reescribe `incorporar.py` desde otro proceso.
- **La migración 49 sustituye cada pestaña entera.** Borra y vuelve a insertar sus módulos en `MapaModule`, igual que las migraciones de mapas anteriores. Los mapas solo contienen datos curriculares, no datos de usuarios.

## Despliegue

- **Fecha:** 19 de octubre de 2026.
- **Qué se desplegó:** el commit `3d5f73c` de la rama `feature/245_tres_actividades_por_conexion_mapas_fp`, con `./scripts/deploy-prod.sh`.
- **Copia de seguridad previa:** `pai_db_20261019_015815.archive.gz`.
- **Migración:** la 49 se aplicó al arrancar.
- **Comprobación:** se consultó la API de producción (`/api/mapa-intermodular?tab=…`) para las 15 pestañas. Todas devuelven las mismas conexiones que sus JSON, y ninguna conexión tiene menos de 3 actividades.
