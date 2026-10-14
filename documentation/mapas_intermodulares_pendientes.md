# Mapas intermodulares pendientes

Los ciclos de FP se incorporan sin mapa intermodular (AGENTS.md §8), que se añade después y bajo demanda. Esta lista recoge los **7 últimos ciclos incorporados** (tareas 208-219), que aún no tienen mapa, con una pestaña por curso.

Cada mapa se hace con la herramienta `scripts/mapa-intermodular/mapa-intermodular.mts` (ver [procesamiento_actividades_mapa_intermodular.md](procesamiento_actividades_mapa_intermodular.md), sección 8). Para encargarlo a otro modelo, usa el prompt de [`scripts/mapa-intermodular/prompt.md`](../scripts/mapa-intermodular/prompt.md) con los datos de la fila.

## Estado

Las relaciones estimadas salen de unas 8 conexiones por RA: RA × 8 / 2, porque cada relación se publica en los dos RA que une.

| Ciclo | Curso | `tipoNivel` | Pestaña (`tab`) | Archivo del mapa | Módulos | RA | Criterios | Relaciones estimadas | Estado |
|---|---|---|---|---|---|---|---|---|---|
| CFGM Cuidados Auxiliares de Enfermería | 1.º (único) | `CFGM_CUIDADOS_AUXILIARES_ENFERMERIA` | `CFGM_CUIDADOS_AUXILIARES_ENFERMERIA` | `mapa_cfgm_cuidados_auxiliares_enfermeria.json` | 7 | 30 | 173 | 120 | ✅ Hecho (tarea 223, Claude): 136 relaciones, 272 conexiones |
| CFGM Atención a Personas en Situación de Dependencia | 1.º | `CFGM_ATENCION_DEPENDENCIA` | `CFGM_ATENCION_DEPENDENCIA` | `mapa_cfgm_atencion_dependencia.json` | 8 | 40 | 306 | 160 | Pendiente |
| CFGM Atención a Personas en Situación de Dependencia | 2.º | `CFGM_ATENCION_DEPENDENCIA` | `CFGM_ATENCION_DEPENDENCIA_2` | `mapa_cfgm_atencion_dependencia_2.json` | 8 | 38 | 284 | 152 | Pendiente |
| CFGM Guía en el Medio Natural y de Tiempo Libre | 1.º | `CFGM_GUIA_MEDIO_NATURAL` | `CFGM_GUIA_MEDIO_NATURAL` | `mapa_cfgm_guia_medio_natural.json` | 9 | 52 | 335 | 208 | Pendiente |
| CFGM Guía en el Medio Natural y de Tiempo Libre | 2.º | `CFGM_GUIA_MEDIO_NATURAL` | `CFGM_GUIA_MEDIO_NATURAL_2` | `mapa_cfgm_guia_medio_natural_2.json` | 8 | 45 | 316 | 180 | Pendiente |
| CFGS Acondicionamiento Físico | 1.º | `CFGS_ACONDICIONAMIENTO_FISICO` | `CFGS_ACONDICIONAMIENTO_FISICO` | `mapa_cfgs_acondicionamiento_fisico.json` | 7 | 43 | 321 | 172 | ✅ Hecho (tarea 228, Claude): 157 relaciones, 314 conexiones |
| CFGS Acondicionamiento Físico | 2.º | `CFGS_ACONDICIONAMIENTO_FISICO` | `CFGS_ACONDICIONAMIENTO_FISICO_2` | `mapa_cfgs_acondicionamiento_fisico_2.json` | 7 | 35 | 248 | 140 | En curso (tarea 227, Gemini): [prompt](../scripts/mapa-intermodular/prompt_cfgs_acondicionamiento_fisico_2.md) |
| CFGS Enseñanza y Animación Sociodeportiva | 1.º | `CFGS_ANIMACION_SOCIODEPORTIVA` | `CFGS_ANIMACION_SOCIODEPORTIVA` | `mapa_cfgs_animacion_sociodeportiva.json` | 8 | 48 | 339 | 192 | Pendiente |
| CFGS Enseñanza y Animación Sociodeportiva | 2.º | `CFGS_ANIMACION_SOCIODEPORTIVA` | `CFGS_ANIMACION_SOCIODEPORTIVA_2` | `mapa_cfgs_animacion_sociodeportiva_2.json` | 8 | 42 | 295 | 168 | Pendiente |
| CFGS Integración Social | 1.º | `CFGS_INTEGRACION_SOCIAL` | `CFGS_INTEGRACION_SOCIAL` | `mapa_cfgs_integracion_social.json` | 7 | 37 | 299 | 148 | ✅ Hecho (tarea 226, Claude): 145 relaciones, 290 conexiones. El borrador de Gemini (tarea 224) se descartó por tener textos de plantilla |
| CFGS Integración Social | 2.º | `CFGS_INTEGRACION_SOCIAL` | `CFGS_INTEGRACION_SOCIAL_2` | `mapa_cfgs_integracion_social_2.json` | 9 | 44 | 346 | 176 | ✅ Hecho (tarea 225, Claude): 165 relaciones, 330 conexiones |
| CFGS Laboratorio Clínico y Biomédico | 1.º | `CFGS_LABORATORIO_CLINICO` | `CFGS_LABORATORIO_CLINICO` | `mapa_cfgs_laboratorio_clinico.json` | 7 | 45 | 360 | 180 | Pendiente |
| CFGS Laboratorio Clínico y Biomédico | 2.º | `CFGS_LABORATORIO_CLINICO` | `CFGS_LABORATORIO_CLINICO_2` | `mapa_cfgs_laboratorio_clinico_2.json` | 7 | 44 | 335 | 176 | Pendiente |

Quedan 9 pestañas, con unas 1.560 relaciones y otras tantas actividades bilingües (una de ellas, Acondicionamiento Físico 2.º, en curso con Gemini en la tarea 227).

## Orden sugerido

1. **CFGS Integración Social 1.º** (37 RA). Es el más pequeño de los pendientes y comparte familia (Servicios Socioculturales) con Educación Infantil, que ya tiene mapa. Sirve para comparar la calidad del otro modelo. Prompt ya rellenado: [`scripts/mapa-intermodular/prompt_cfgs_integracion_social_1.md`](../scripts/mapa-intermodular/prompt_cfgs_integracion_social_1.md).
2. **CFGS Acondicionamiento Físico 2.º** (35 RA) y **CFGM Atención a la Dependencia 2.º** (38 RA): también son pequeños.
3. Después, los cursos de 40 a 45 RA y, al final, Guía en el Medio Natural 1.º (52 RA, el mayor).

Al empezar un ciclo de dos cursos, conviene hacer los dos seguidos: así el selector del mapa muestra los dos cursos desde el principio.

## Notas

- La pestaña de 1.º usa el `tipoNivel` como identificador y la de 2.º le añade `_2`, como en Peluquería y Educación Infantil. Cuidados Auxiliares tiene un solo curso, así que su entrada de `mapas` no lleva `curso`, como la de Estética.
- Ciclos con mapa anteriores a esta lista: CFGB Peluquería y Estética, CFGM Estética y Belleza, CFGM Peluquería y Cosmética Capilar (1.º y 2.º) y CFGS Educación Infantil (1.º y 2.º).
