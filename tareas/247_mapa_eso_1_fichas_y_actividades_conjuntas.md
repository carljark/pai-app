# Tarea 247: Ampliación del mapa de afinidades de 1.º de ESO y actividades conjuntas

> **Plan:** [247 — Ampliación del mapa de afinidades de 1.º de ESO y actividades conjuntas](../planes/247_plan_mapa_eso_1_fichas_y_actividades_conjuntas.md)

## Propósito
Encargo en audio (`add_maps/eva_add_eso_first_activities.ogg`): «Amplía el mapa intermodular de primero de la ESO y crea más ejemplos de actividades conjuntas entre las diferentes asignaturas de primero de la ESO».

El mapa de la ESO es el de afinidades. 1.º tenía 21 fichas, que cubrían 19 de las 66 parejas posibles entre sus 12 materias, y ninguna ficha de la ESO tenía actividades. Ahora:
- **43 fichas** en 1.º, 22 de ellas nuevas (`ESO1-22` a `ESO1-43`). Cubren 42 parejas de materias y cada materia aparece en al menos 6 fichas.
- **129 actividades conjuntas** bilingües, 3 por ficha en todas las de 1.º.

## Arquitectura y flujo
- **Datos.** `backend/src/data/afinidades-eso/afinidades_eso_1.json`. Las fichas tienen un campo opcional nuevo, `actividades`. Cada actividad usa los campos de las actividades del mapa de FP (`title`, `motivatingFactor`, `description`, `evidence`, `diversitySupport`, en `_es`/`_ca`), más un `id` estable (`ESO1-22-A1`) y `criterios: { materia: ['x.y'] }`.
- **Modelo.** `AfinidadEso.ts` añade la interfaz `ActividadAfinidad` y el campo `actividades` en el esquema, sin valor por defecto: las fichas de 2.º-4.º no lo guardan.
- **Migración 51.** `51_reload_afinidades_eso.ts` reutiliza el `up` de la 25, que sustituye solo la colección `afinidadesos` y se puede reejecutar.
- **API.** `GET /api/afinidades-eso` no cambia: el controlador ya devolvía todos los campos de la ficha, así que las actividades llegan sin tocarlo.
- **Frontend.**
  - Nuevo componente `AfinidadActividadesComponent`, que `AfinidadCardComponent` muestra antes de los conceptos solo si la ficha tiene actividades.
  - Cada actividad es un `<details>` con la idea motivadora, el desarrollo, el producto, la atención a la diversidad y los criterios por materia («CE x.y» / «CA x.y»), con el texto oficial del criterio como `title`.
  - El idioma se lee con un `computed` de `LayoutService`, así que el cambio de idioma es reactivo.
  - El panel del mapa mental usa `app-afinidad-card`, de modo que también muestra las actividades.

### Redacción con opencode y DeepSeek
Las herramientas están en `scripts/afinidades-eso/actividades/`, ignorada en git. Son una adaptación de las de la tarea 245:

| Archivo | Función |
|---|---|
| `catalogo.json` | Esqueleto de las 22 fichas nuevas (materias, ámbito ES/CA y criterios de cada vínculo), elegido a mano, validado contra `curriculo-eso` y aprobado por el usuario antes de redactar |
| `INSTRUCCIONES.md` | Normas de redacción y formato de salida |
| `comun.py` | Rutas y validación compartida |
| `preparar_tramos.py` | Genera 16 tramos: 11 de fichas nuevas (2 por tramo) y 5 de actividades para las fichas existentes (5 por tramo). Cada entrada lleva los textos oficiales ES/CA de los criterios, para que el modelo no tenga que leer el repositorio |
| `comprobar.py NNN` | Valida un tramo, con las mismas reglas que los tests y algunas más estrictas (ver abajo) |
| `lanzar.sh` | `opencode run --standalone --auto` con `openrouter/deepseek/deepseek-v4.1-flash` y los permisos restringidos de la 245: shell denegada salvo `comprobar.py`, sin web y lectura limitada a las instrucciones, la entrada y las salidas |
| `estado.py` | Resumen del estado de los tramos |
| `incorporar.py` | Exige que todos los tramos validen y reconstruye `afinidades_eso_1.json` de forma determinista |

Comprobaciones de `comprobar.py`:
- 3 actividades por ficha que citen al menos 2 materias, solo con criterios de los vínculos de la ficha y cubriendo entre las tres todas sus materias;
- campos completos, distintos entre ES y CA y en el idioma que les corresponde;
- apóstrofo tipográfico `’` en catalán;
- títulos y comienzos de la descripción sin repetir en todo el curso;
- en las fichas nuevas, además: resúmenes, relaciones, saberes y conceptos.

Los 16 tramos validaron. DeepSeek corrigió dentro de su propia sesión los pocos errores que marcó el validador (apóstrofos rectos, un título repetido y un comienzo repetido), sin necesidad de reintentos.

## Archivos modificados
1. `backend/src/data/afinidades-eso/afinidades_eso_1.json`: 22 fichas nuevas y actividades en las 43. Las 21 fichas originales no cambian salvo por las actividades (comprobado comparando con `HEAD`).
2. `backend/src/models/AfinidadEso.ts`: `ActividadAfinidad` y el campo opcional `actividades`.
3. `backend/src/migrations/51_reload_afinidades_eso.ts` (nuevo): vuelve a cargar las afinidades.
4. `backend/src/tests/afinidades-datos.test.ts`:
   - mínimo de 6 fichas por materia en 1.º (3 en el resto de cursos);
   - bloque nuevo de actividades: al menos 3 por ficha con ids consecutivos, campos completos y distintos por idioma, criterios válidos de al menos 2 materias de la ficha, títulos únicos y ninguna actividad en 2.º-4.º.
   - Las comprobaciones de idioma y de textos vacíos que ya existían recorren la ficha entera, así que también cubren las actividades.
5. `backend/src/tests/afinidades.test.ts`: la API devuelve las actividades de 1.º y ninguna en 2.º; test de la migración 51 (sustituye la colección, no duplica y 2.º-4.º no tienen el campo).
6. `frontend/src/app/features/mapa-intermodular/models/afinidad-eso.model.ts`: `ActividadAfinidad` y `actividades?`.
7. `frontend/src/app/features/mapa-intermodular/components/ui/afinidad-actividades/` (nuevo: ts, html, scss y spec): bloque de actividades con BEM `.afinidad-actividades__*` y variables de `_variables.scss`.
8. `frontend/src/app/features/mapa-intermodular/components/ui/afinidad-card/afinidad-card.component.{ts,html,spec.ts}`: importa y muestra el bloque; test con y sin actividades.
9. `frontend/src/app/testing/afinidades.mock.ts`: `ACTIVIDAD_BYG_MAT` y `FICHA_CON_ACTIVIDADES`.
10. `documentation/mapa_afinidades_eso.md`: secciones de actividades conjuntas y ampliación de 1.º, y la migración 51 y el componente en la tabla de arquitectura.
11. `.gitignore`: `scripts/afinidades-eso/actividades/`.
12. `planes/247_plan_mapa_eso_1_fichas_y_actividades_conjuntas.md` y `planes/README.md`.

## Decisiones técnicas
- **Actividades por ficha, no por vínculo.** Los vínculos de la ESO son pares de criterios con resúmenes de una línea; colgar actividades de cada uno las multiplicaría sin aportar nada.
- **Mismos campos que en la FP.** El formato es homogéneo y se aprovechan los prompts y el validador de la 245.
- **Componente propio en lugar de `activities-grid`.** `activities-grid` depende de `MapaTab` de la FP (sigla del ciclo) y no muestra criterios por materia. Así `afinidad-card` crece una sola línea de plantilla.
- **Desplegables cerrados.** Con 3 actividades por ficha, mostrarlas abiertas alargaría mucho la vista de fichas y el panel del mapa mental.
- **El esqueleto de las fichas nuevas lo fija Claude Code y lo aprueba el usuario; DeepSeek solo redacta.** La elección de qué materias y criterios relacionar es la parte que exige criterio curricular.
  - De las 66 parejas posibles se dejaron fuera las 24 menos naturales (p. ej. Cultura Clásica–Entornos Digitales).
  - Las dos fichas más débiles del catálogo (la 32 y la 43) se señalaron al usuario antes de redactarlas.
- **Normalización de saberes en `incorporar.py`.** DeepSeek los redactó como frases con mayúscula y punto final (398 de 480), mientras que las fichas existentes usan expresiones breves que la ficha une con «; ». Se quita el punto final y se pone en minúscula la inicial de todos menos el primero. Antes se comprobó que ninguno empieza por un nombre propio.
- **Coste.** OpenRouter factura **0,253 $** por DeepSeek V4.1 Flash el 5-11-2026, contando las pruebas y las correcciones dentro de cada sesión. Son unos 0,002 $ por actividad: 129 actividades más el texto de 22 fichas. La estimación de opencode (`opencode stats`) es de 0,19 $, más baja que lo que factura OpenRouter. Conviene tener en cuenta esa diferencia al presupuestar otras tareas con opencode.

## Verificación
- `afinidades-datos.test.ts` y `afinidades.test.ts`: 37/37 con los datos definitivos.
- Backend:
  - `npm run typecheck`: 0 errores;
  - `npm test`: 41 archivos y 491 tests en verde, con los umbrales de cobertura.
- Frontend:
  - ESLint y typecheck (`ngc -p tsconfig.app.json`, `tsc -p tsconfig.spec.json`) sin errores en los archivos tocados;
  - `npm test` (lint, 113 archivos y 1102 tests, `check-coverage.js` y `check-zoneless.js`): todo en verde.
- Revisión de muestra hecha por Claude Code:
  - la lista completa de los 129 títulos;
  - variedad de productos;
  - lectura completa de 8 actividades y 2 fichas nuevas en ES/CA.

  No hay nombres de personas ni datos oficiales inventados, y el catalán es correcto.
- **No se hizo la revisión visual en local**, porque Docker no estaba arrancado, ni tampoco en producción con navegador. La vista queda cubierta por los specs de `afinidad-actividades` y `afinidad-card`, pero falta comprobarla a ojo.
- **Despliegue en producción** (5-11-2026) con `./scripts/deploy-prod.sh` del commit `a6901dc`:
  - copia de seguridad `pai_db_20261105_194646.archive.gz`;
  - migración `51_reload_afinidades_eso` completada;
  - `GET /api/afinidades-eso?tab=ESO_1` devuelve 43 fichas y 129 actividades (al menos 3 por ficha; cada materia en 6 fichas o más);
  - `tab=ESO_2` devuelve sus 29 fichas sin actividades;
  - contenedores `pai_backend_prod` y `pai_frontend_prod` arriba.

## Desviaciones respecto al plan
- **Detección de cambios ajenos en `lanzar.sh`.** Detuvo dos veces la cola (tramos 002 y 013) por falsos positivos: mientras corrían, se estaban editando el frontend y la documentación. Se relanzó sin tocar archivos versionados; los tramos ya validados se saltaron.
- **Normalización de saberes en `incorporar.py`.** No estaba prevista (ver «Decisiones técnicas»).
- **Fichas de 2.º-4.º.** Siguen sin el campo, como estaba previsto.
