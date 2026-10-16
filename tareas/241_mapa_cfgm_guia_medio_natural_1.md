# 241 · Mapa intermodular de 1.º del CFGM Guía en el Medio Natural y de Tiempo Libre

## Propósito

Esta tarea hace el mapa intermodular de **1.º del CFGM Guía en el Medio Natural y de Tiempo Libre**: 9 módulos, 52 RA y 335 criterios. Es el mayor de los mapas pendientes. Con él, el ciclo tiene ya los dos cursos (el 2.º se hizo en la tarea 240).

## Trabajo en paralelo

- **Rama:** `feature/241_mapa_cfgm_guia_medio_natural_1` sale de la 240, que está desplegada. Se trabajó en el worktree `../pai-app-mapa232`.
- **Migraciones:** esta tarea usa la **48**. La 45 sigue reservada para la 238 (Laboratorio Clínico 2.º, Gemini).
- **Catálogo:** la entrada `mapas` del ciclo tiene ahora los dos cursos. El 1.º se abre en `1325_RA1` y va delante del 2.º.

## Flujo

1. **Ficha y configuración.** Familias e iconos de los módulos específicos:

   | Módulo | Familia | Icono |
   |---|---|---|
   | 1325 Técnicas de equitación | técnica | `footprints` |
   | 1327 Guía ecuestre | cliente | `map` |
   | 1329 Organización de itinerarios | técnica | `compass` |
   | 1333 Guía de baja y media montaña | técnica | `mountain-snow` |
   | 1334 Guía de bicicleta | técnica | `bike` |
   | 1335 Técnicas de tiempo libre | comunicación | `party-popper` |
   | 1336 Técnicas de natación | ciencias | `waves` |

   Los módulos comunes son 1664 (digital) y 1709 (empleabilidad), con los valores por defecto.

2. **Plan.** Primero se repartieron las relaciones entre parejas de módulos según su afinidad. Por ejemplo, equitación con guía ecuestre, natación con tiempo libre e itinerarios con montaña y bicicleta. Después, un script temporal comprobó el plan.
   - El primer borrador tenía 7 pares de RA repetidos, dos RA con 5 conexiones y un criterio sin cubrir.
   - Se fusionaron o reorientaron esas relaciones y se añadieron cuatro.
   - El plan final tiene 205 relaciones, con 6 a 15 conexiones por RA y todos los criterios cubiertos.

3. **Redacción.** Los textos se escribieron por línea del plan. Un script temporal montó cada `relaciones_0N.json` con los RA y criterios exactos del plan. También comprobó que cada criterio se cita en el desarrollo en los dos idiomas. Así se evitan errores al copiar los criterios.
   - Las actividades están situadas en las Illes Balears: el Camí de Cavalls, la serra de Tramuntana, el Pla de Mallorca, la Via Verda de Manacor, calas, pozas y centros ecuestres.
   - Hay escenarios mixtos: rutas de caballo y bicicleta, montaña con nieve en un viaje al Pirineo, y baños en rutas costeras.
   - **Módulos comunes:**
     - 1664: sensores, nube, big data, IA y planes de transformación digital de centros ecuestres y empresas de bicicletas;
     - 1709: prevención de riesgos, convenio, nómina, autoconocimiento y entorno personal de aprendizaje.

4. **Validación.**
   - En las pasadas intermedias, el generador detectó algunos campos breves con el mismo texto en los dos idiomas, como «DAFO personal.» o «lectura guiada.». Se completaron con un complemento traducible.
   - El script de montaje detectó una cita doble mal formada, «(1333-7e, 1334-6e)», que se separó en dos citas.
   - El resultado final no tiene errores ni avisos.
   - La búsqueda de palabras de un idioma en los campos del otro solo dio un falso positivo: el enclítico «poder-los».

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgm_guia_medio_natural.json`: 9 módulos, 52 RA y 410 conexiones (205 actividades distintas).
- `scripts/mapa-intermodular/fuentes/CFGM_GUIA_MEDIO_NATURAL/`: `config.json` y `relaciones_01.json` a `relaciones_08.json`.
- `backend/src/migrations/48_ingest_mapa_cfgm_guia_medio_natural.ts`: sustituye solo su pestaña y se puede volver a ejecutar.
- `backend/src/data/niveles.ts`: la entrada `mapas` del ciclo con los dos cursos.
- **Tests:**
  - `mapa.test.ts`: test de la migración 48;
  - `niveles-catalogo.test.ts` y `ras-guia-medio-natural.test.ts`: la nueva pestaña.
- **Documentación:**
  - `mapas_intermodulares_pendientes.md`: ya solo queda Laboratorio Clínico 2.º, que tiene Gemini;
  - `niveles_educativos_y_catalogo.md`;
  - `procesamiento_actividades_mapa_intermodular.md`.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 1.º | 205 | 410 | 6-15 | 335 de 335 |

## Decisiones

- **Montaje desde el plan.** En mapas grandes conviene redactar los textos aparte y generar los JSON desde el plan. Además, hay que comprobar las citas antes del validador: así los RA y criterios no se copian a mano en 205 relaciones.
- **Cada cita, por separado.** El validador espera cada criterio citado por separado, `(MMMM-Nx)`; no admite citas agrupadas.
