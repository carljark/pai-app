# 234 · Mapa intermodular de 1.º del CFGM Atención a Personas en Situación de Dependencia

## Propósito

Esta tarea completa el mapa intermodular del CFGM Atención a Personas en Situación de Dependencia con el **1.º curso**: 8 módulos, 40 RA y 306 criterios. El 2.º ya tenía mapa desde la tarea 232. Además, deja preparado el prompt para que Gemini haga el 2.º del CFGS Enseñanza y Animación Sociodeportiva en la tarea 235.

## Trabajo en paralelo

- **Rama:** `feature/234_mapa_cfgm_atencion_dependencia_1`, creada desde la 233, que fusiona las dos cadenas y está desplegada. Se trabajó en el worktree `../pai-app-mapa232`.
- **Migraciones:** la de esta tarea es la **42**. La 43 queda reservada para la tarea 235.
- **Prompt de Gemini:** `scripts/mapa-intermodular/prompt_cfgs_animacion_sociodeportiva_2.md`, con los datos de la ficha (8 módulos, 42 RA y 295 criterios). Indica a Gemini que cree su rama desde la 233 y que se integre como lo hizo la 232, porque Animación Sociodeportiva aún no tenía ningún mapa. Se subió en un primer commit para dejar reservado el número 235.

## Flujo

1. **Ficha y configuración.** La ficha se generó con `mapa-intermodular.mts ficha`. Familias e iconos de los módulos específicos:

   | Módulo | Familia | Icono |
   |---|---|---|
   | 0020 Primeros auxilios | ciencias | `heart-pulse` |
   | 0210 Organización de la atención | técnica | `clipboard-list` |
   | 0212 Características y necesidades | cliente | `users` |
   | 0213 Atención y apoyo psicosocial | comunicación | `smile` |
   | 0215 Apoyo domiciliario | técnica | `house` |
   | 0217 Atención higiénica | ciencias | `droplets` |

   Los comunes, 1664 (digital) y 1709 (empleabilidad), conservan los valores por defecto. Los ocho colores son distintos.

2. **Plan.** Antes de redactar se escribió un plan compacto con los pares de RA y las letras de criterio de cada relación, y un script temporal comprobó tres cosas:
   - las conexiones de cada RA;
   - que no hubiera pares de RA repetidos;
   - que todos los criterios quedaran cubiertos.

   El primer borrador tenía 9 pares repetidos, 5 RA con menos de 6 conexiones y 29 criterios sin cubrir. Se corrigió redistribuyendo relaciones y añadiendo otras nuevas, hasta llegar a 161 relaciones con entre 6 y 12 conexiones por RA.

3. **Redacción.** Las relaciones están en seis archivos, `relaciones_01.json` a `relaciones_06.json`, agrupados por el primer módulo del plan. Cada relación tiene una actividad bilingüe redactada a mano, situada en un servicio concreto: residencia, centro de día, ayuda a domicilio, piso tutelado o centro ocupacional de las Illes Balears. Ejes principales:
   - **0020 Primeros auxilios:** urgencias que aparecen en el propio servicio:
     - atragantamientos en la comida;
     - hipoglucemia en el taller;
     - parada en el baño geriátrico;
     - incendio nocturno;
     - picaduras en un paseo.
   - **0210 Organización de la atención:** el plan de atención individualizado (PAI) y los grados de dependencia, la normativa de distintos niveles, los equipos interdisciplinares, el expediente en la nube, los bancos de ayudas técnicas y el convenio colectivo.
   - **0212 Características y necesidades:** envejecimiento, discapacidad, enfermedad mental y crónica, con personas usuarias concretas y sus cuidadores familiares.
   - **0213 Atención y apoyo psicosocial:** organización del entorno, habilidades sociales, estimulación cognitiva, acompañamientos, animación y orientación a las familias.
   - **0215 Apoyo domiciliario:** plan de trabajo, presupuesto, compra, mantenimiento, alimentación, cocina y seguimiento.
   - **0217 Atención higiénica:** úlceras por presión, aseo, vestido, muestras, cuidados postmortem, aislamiento y registros.
   - **Comunes:**
     - 1664: DEA conectado, sensores, nube, economía circular de ayudas técnicas y residuos, y plan de digitalización del servicio de ayuda a domicilio;
     - 1709: riesgos del sector, convenio, nómina, autoconocimiento y entorno personal de aprendizaje.

4. **Validación.** El generador no dio ningún error ni aviso. Además, se buscaron palabras de un idioma en los campos del otro; solo aparecieron falsos positivos, como «ambiental» o enclíticos como «oferint-los».

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgm_atencion_dependencia.json`: 8 módulos, 40 RA y 322 conexiones (161 actividades distintas).
- `scripts/mapa-intermodular/fuentes/CFGM_ATENCION_DEPENDENCIA/`: `config.json` y `relaciones_01.json` a `relaciones_06.json`. `ficha.md` no se versiona.
- `backend/src/migrations/42_ingest_mapa_cfgm_atencion_dependencia.ts`: sustituye solo la pestaña `CFGM_ATENCION_DEPENDENCIA` y se puede volver a ejecutar.
- `backend/src/data/niveles.ts`: la entrada `mapas` del ciclo tiene los dos cursos; el 1.º se abre en `0020_RA1`.
- Tests:
  - `mapa.test.ts`, migración 42: idempotencia, que no toca otras pestañas, 322 conexiones bidireccionales, de 6 a 15 conexiones por RA, como máximo 3 criterios relacionados, textos de RA iguales a los del archivo de datos y orden de módulos del endpoint;
  - `niveles-catalogo.test.ts` y `ras-atencion-dependencia.test.ts`: la nueva pestaña.
- Documentación:
  - `mapas_intermodulares_pendientes.md`: quedan 6 pestañas y hay un nuevo orden sugerido;
  - `niveles_educativos_y_catalogo.md`;
  - `procesamiento_actividades_mapa_intermodular.md`.
- `scripts/mapa-intermodular/prompt_cfgs_animacion_sociodeportiva_2.md`: prompt de la tarea 235.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 1.º | 161 | 322 | 6-12 | 306 de 306 |

## Decisiones

- **El 1.º antes que otros ciclos.** Así el selector del mapa ya muestra los dos cursos del ciclo.
- **Dos módulos con la familia «ciencias».** Primeros auxilios y Atención higiénica son los dos módulos sanitarios del curso. Se distinguen por el color y el icono.
- **Plan compacto validado antes de redactar.** Detectar pares repetidos y criterios sin cubrir en el plan evitó reescribir actividades ya redactadas, que fue el coste principal de la tarea 232.
- **Animación Sociodeportiva 2.º para Gemini.** Comparte los módulos comunes y el contexto deportivo con Acondicionamiento Físico 2.º, que Gemini resolvió bien en la tarea 227. El prompt le pide expresamente que no reutilice esas actividades.
