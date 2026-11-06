# FP Básica: plan 2026/27 (tarea 250)

El CFGB Peluquería y Estética (IMP11) sigue el plan de los matriculados desde 2026/27 de FP Illes Balears. Desde la tarea 250, el currículo del generador y el mapa intermodular salen de una sola fuente, `backend/src/data/ras_fp_basica.data.ts`, y el mapa tiene una pestaña por curso.

## Módulos por curso

| Curso | Pestaña | Módulos (orden oficial) |
|---|---|---|
| 1.º | `FPB` (id histórico) | 3060 Preparación del entorno profesional · 3062 Depilación mecánica y decoloración del vello superfluo · 3064 Lavado y cambios de forma del cabello · 3061 Cuidados estéticos básicos de uñas · 3159 Itinerario personal para la empleabilidad · 3161 Comunicación y Ciencias Sociales I · 3163 Ciencias Aplicadas I |
| 2.º | `FPB_2` | 3005 Atención al cliente · 3065 Cambio de color del cabello · 3063 Maquillaje · 3160 Proyecto intermodular de aprendizaje colaborativo · 3162 Comunicación y Ciencias Sociales II · 3164 Ciencias Aplicadas II |

El catálogo (`niveles.ts`) declara estos módulos en `cursos[].modulos`. Así, el generador muestra en cada curso solo sus módulos, y la herramienta del mapa prepara cada curso por separado.

## Fuentes oficiales

El usuario fijó el orden de prioridad de las fuentes: **CAIB, después BOE y después TodoFP**.

| Módulos | Catalán | Castellano |
|---|---|---|
| 3060-3065, 3005 | Textos del mapa revisados en la tarea 211 | Textos del mapa (RD 127/2014) |
| 3159 | Apéndice 6 de la resolución DGFPIOE 03/2024 de la CAIB | Anexo III del RD 659/2023 |
| 3160 | RA de Baleares ya cargados en la aplicación (5 RA) | Ídem |
| 3161-3164 | Apéndices 5 (Comunicació i Ciències Socials) y 4 (Ciències Aplicades) de la resolución de la CAIB | Anexo V del RD 217/2022, con las adaptaciones de la CAIB |

- **Resolución de la CAIB:** instrucciones de organización y funcionamiento de los ciclos de FP, <https://www.caib.es/sites/fp/f/469565>.
- **3160:** la norma estatal no le da RA.
- **Currículo autonómico propio:** la ficha IMP11 lo enlaza como borrador y no está publicado.

### Los ámbitos no tienen RA

En el grado básico (LO 3/2022 y RD 659/2023, art. 87.1), los ámbitos de Comunicación y Ciencias Sociales y de Ciencias Aplicadas siguen el currículo del anexo V del RD 217/2022. Su estructura es la de la ESO: **competencias específicas** y **criterios de evaluación numerados**, sin RA.

| Ámbito | Competencias | Criterios |
|---|---|---|
| Ciencias Aplicadas (3163, 3164) | 8 | 18 |
| Comunicación y Ciencias Sociales (3161, 3162) | 8 | 23 |

- **Representación en la aplicación:** cada competencia es una unidad `CE1`…`CE8` en la colección `ras`, con sus criterios `1.1`, `1.2`…
- **I y II:** ni la CAIB ni el BOE los diferencian, así que **comparten competencias y criterios**.
- **Lo que se deja de usar:** los RA del RD 127/2014 que había hasta ahora (3009, 3011 y 3042, y Comunicación y sociedad II).

**Adaptaciones de Baleares.** La CAIB añade al texto estatal algunas referencias propias:
- el entorno de las Illes Balears (Ciencias Aplicadas, CE4 y 4.2);
- la sociedad balear y la política autonómica (Comunicación, CE2 y 2.1);
- el Estatut d'Autonomia (3.1);
- la lengua catalana (CE5).

Como manda la CAIB, esos añadidos se trasladan también al castellano para que ES y CA digan lo mismo (`ADAPTACIONES_ES` en el generador del archivo de datos, ver la tarea 250).

## Datos y migración

- **`ras_fp_basica.data.ts`:** 71 unidades, con `tipoNivel: 'FP_BASICA'` y `moduleCode`.
  - 1.º tiene 38 unidades y 2.º, 33.
  - Los `id` son `RA1`… o `CE1`….
  - `module_es`/`module_ca` usan los nombres del plan 2026/27.
- **Migración 52 (`52_fp_basica_plan_2026_27.ts`):**
  - sustituye todos los RA de FP Básica (los que no tienen `tipoNivel` o tienen `FP_BASICA`) por los del archivo;
  - recarga las pestañas `FPB` y `FPB_2` desde `mapa_fp_basica.json` y `mapa_fp_basica_2.json`.

  Se puede reejecutar.
  - **Proyectos ya guardados:** guardan el texto de sus RA, no el documento, así que no les afecta.
  - **Generar desde un proyecto antiguo:** si un RA antiguo ya no existe, el prompt lo cita por su texto.
- **`mapa_fpb.json`:** es el mapa anterior, con una sola pestaña. Se conserva sin cambios porque lo leen las migraciones 08, 17, 18 y 29 en una base nueva, antes de que la 52 lo sustituya.

## Generador

- **`findSelectedRa(allRas, texto, tipoNivel, curso)`:** dentro del nivel, prefiere el RA de un módulo del curso. Los ámbitos I y II comparten textos, y sin esta preferencia el prompt podía atribuir a 2.º una competencia del módulo de 1.º.
- **`describeRaForPrompt`:** nombra «Competencia específica CE4» a las unidades de los ámbitos.

## Mapa

- **Herramienta:** se generó con `scripts/mapa-intermodular/mapa-intermodular.mts`, que desde esta tarea admite:
  - unidades `CE`;
  - criterios numerados (cita `3161-1.1`);
  - los comandos `plan` (valida el plan de relaciones sin actividades) y `comprobar --archivo` (valida un archivo de relaciones sin exigir aún el mapa completo).
- **Frontend:** el filtro por criterio (`criterio-clave.ts`) reconoce la clave `1.1` además de la letra.
- **Redacción:** se encargó a DeepSeek V4.1 Flash con opencode, como en las tareas 245 y 247. Las cifras y el procedimiento están en `tareas/250_*.md`.
