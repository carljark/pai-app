# 237 · Mapa intermodular de 1.º del CFGS Enseñanza y Animación Sociodeportiva

## Propósito

Esta tarea completa el mapa intermodular del CFGS Enseñanza y Animación Sociodeportiva con el **1.º curso**: 8 módulos, 48 RA y 339 criterios. El 2.º lo hizo Gemini en la tarea 235.

Además, se ha preparado para Gemini el mapa de 2.º del CFGS Laboratorio Clínico y Biomédico (tarea 238).

## Trabajo en paralelo

- **Rama de esta tarea:** `feature/237_mapa_cfgs_animacion_sociodeportiva_1`. Sale de la 235, que está desplegada y ya incluye las tareas 234 y 236. Se trabajó en el worktree `../pai-app-mapa232`.
- **Migraciones:** esta tarea usa la **44**. La **45** queda reservada para la 238.
- **Prompt de Gemini:** `scripts/mapa-intermodular/prompt_cfgs_laboratorio_clinico_2.md` (7 módulos, 44 RA, 335 criterios).
  - Se creó la rama `feature/238_mapa_cfgs_laboratorio_clinico_2` desde la 235, con el prompt dentro, en el directorio donde trabaja Gemini.
  - Respecto a prompts anteriores, este pide expresamente comprobar el plan de relaciones con un script antes de redactar.

## Flujo

1. **Ficha y configuración.** Familias e iconos de los módulos específicos:

   | Módulo | Familia | Icono |
   |---|---|---|
   | 1124 Dinamización grupal | comunicación | `users` |
   | 1136 Valoración de la condición física e intervención en accidentes | ciencias | `heart-pulse` |
   | 1138 Juegos y actividades físico-recreativas y de animación turística | cliente | `party-popper` |
   | 1139 Actividades físico-deportivas individuales | técnica | `timer` |
   | 1141 Actividades físico-deportivas de implementos | técnica | `target` |
   | 1143 Metodología de la enseñanza de actividades físico-deportivas | técnica | `graduation-cap` |

   - Los comunes, 1665 (digital) y 1709 (empleabilidad), conservan los valores por defecto.
   - El 1136 conserva el color rojo que tiene en el mapa de 1.º de Acondicionamiento Físico.

2. **Plan.** Antes de redactar se escribió un plan compacto y un script temporal lo comprobó.
   - **Primer borrador:** 189 relaciones, 6 pares repetidos, 34 criterios sin cubrir y un RA de 1709 con solo 3 conexiones.
   - **Plan corregido:** 192 relaciones, con 6 a 13 conexiones por RA.

3. **Redacción.** Hay siete archivos, de `relaciones_01.json` a `relaciones_07.json`, agrupados por el primer módulo del plan. Cada relación tiene una actividad bilingüe redactada a mano, situada en un contexto real de las Illes Balears: hoteles y su animación turística, casales de verano, campamentos, escuelas deportivas municipales, clubes, piscinas, playas y turismo activo. Ejes principales:
   - **1124:** equipos de monitores, conflictos en el miniclub, fases del grupo, sociometría y comunicación con públicos diversos.
   - **1136:** valoración y baremos, socorrismo y soporte vital, lesiones según el medio, nutrición y recuperación.
   - **1138:** veladas, ambientación, contingencias, promoción y evaluación de la animación.
   - **1139 y 1141:** sesiones, adaptaciones, seguridad, competiciones y evaluación técnica y táctica.
   - **1143:** modelos de enseñanza, programas, progresiones y evaluación.
   - **Comunes:** wearables, nube, IA y datos en el deporte; riesgos del sector, contratos fijos discontinuos, autoconocimiento y entorno personal de aprendizaje.

   Las actividades del 1136, el 1665 y el 1709 son distintas de las del mapa de 1.º de Acondicionamiento Físico, que comparte esos módulos.

4. **Validación.**
   - La primera pasada del generador dio cuatro errores, ya corregidos:
     - dos campos con el mismo texto en los dos idiomas;
     - un título castellano marcado como catalán por el topónimo «Cala d'Or», que se cambió por «Cala Ratjada»;
     - una evidencia repetida.
   - Resultado final: sin errores ni avisos.
   - Una búsqueda de palabras de un idioma en los campos del otro no encontró ninguna mezcla.

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgs_animacion_sociodeportiva.json`: 8 módulos, 48 RA y 384 conexiones (192 actividades distintas).
- `scripts/mapa-intermodular/fuentes/CFGS_ANIMACION_SOCIODEPORTIVA/`: `config.json` y `relaciones_01.json` a `relaciones_07.json`. `ficha.md` no se versiona.
- `backend/src/migrations/44_ingest_mapa_cfgs_animacion_sociodeportiva.ts`: sustituye solo la pestaña `CFGS_ANIMACION_SOCIODEPORTIVA` y se puede volver a ejecutar.
- `backend/src/data/niveles.ts`: la entrada `mapas` del ciclo tiene los dos cursos. El 1.º se abre en `1124_RA1`.
- Tests:
  - `mapa.test.ts`, migración 44. Comprueba:
    - que es idempotente y no toca otras pestañas;
    - las 384 conexiones bidireccionales;
    - entre 6 y 15 conexiones por RA y como máximo 3 criterios relacionados por conexión;
    - que los textos de los RA coinciden con los de los datos;
    - el orden de los módulos que devuelve el endpoint.
  - `niveles-catalogo.test.ts` y `ras-animacion-sociodeportiva.test.ts`: la nueva pestaña.
- Documentación:
  - `mapas_intermodulares_pendientes.md`: quedan 4 pestañas, con Laboratorio Clínico 2.º en curso con Gemini;
  - `niveles_educativos_y_catalogo.md`;
  - `procesamiento_actividades_mapa_intermodular.md`: también se añade el 2.º de la 235, que faltaba en la lista.
- `scripts/mapa-intermodular/prompt_cfgs_laboratorio_clinico_2.md`: prompt de la tarea 238.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 1.º | 192 | 384 | 6-13 | 339 de 339 |

## Decisiones

- **Completar el ciclo antes de empezar otro.** Así el selector del mapa muestra ya los dos cursos de Animación Sociodeportiva.
- **Laboratorio Clínico 2.º para Gemini.** Es el siguiente más pequeño (44 RA). El 1.º del mismo ciclo puede hacerse después para completarlo.
