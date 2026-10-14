# 226 · Mapa intermodular de 1.º del CFGS Integración Social (rehecho)

## Propósito

El mapa de 1.º del CFGS Integración Social se encargó a Gemini (antigravity-cli) en la [tarea 224](224_mapa_cfgs_integracion_social.md). Su resultado superaba las comprobaciones estructurales del generador, pero al revisarlo antes de desplegar se vio que el contenido no era utilizable:

- **Textos de plantilla.**
  - Los 148 desarrollos empezaban con la misma frase («En equipos de trabajo, el alumnado analiza la situación técnica planteada en el servicio…»), seguida del texto del criterio pegado.
  - 64 títulos estaban cortados («Los procesos básicos del y el marco legal y»).
  - En 21 desarrollos aparecía el texto de un criterio pegado («…vinculadas a Se han comparado métodos…»).
  - Solo había 12 contextos y 6 textos DUA, repetidos unas 25 veces cada uno.
- **Plan mecánico.** Emparejaba los criterios por orden alfabético (0337-1a↔0338-1a, 0337-1b↔0338-2a…), lo que daba relaciones sin sentido como «iniciativa en la mediación ↔ fog y mist computing» o «tratamiento de datos ↔ primeros auxilios».

El usuario decidió no desplegarlo y que el mapa se rehiciera en esta tarea. Se conservan de la 224 el `config.json`, la migración 37 y los tests; el plan y todos los textos son nuevos.

## Flujo

1. **Rama.** `feature/226_mapa_cfgs_integracion_social_1` sale de la 225, ya desplegada, y fusiona la 224. La fusión resuelve los conflictos de catálogo, tests y documentación con los dos cursos.
2. **Plan nuevo.** Se diseñaron 145 relaciones RA↔RA con criterios temáticamente afines. Un script temporal comprobó los grados (entre 6 y 12 por RA), que no hubiera pares repetidos (se fusionaron 11) y la cobertura de los 299 criterios. Para los módulos comunes se buscaron situaciones reales del ciclo:
   - **1665 Digitalización:**
     - brecha digital como factor de exclusión;
     - protección de datos de las personas usuarias;
     - historia social digital;
     - IA en la asignación de ayudas y en el cruce de perfiles de empleo;
     - sensores de movilidad con edge computing;
     - transformación digital de una asociación;
     - empresas de inserción con entornos de planta (OT) y de oficina (IT).
   - **1709 Empleabilidad I:**
     - salidas del perfil, como la de preparador laboral;
     - función pública frente a entidades privadas;
     - riesgos psicosociales del mediador;
     - acoso sexual en el trabajo;
     - nóminas y contratos de las personas usuarias;
     - DAFO y plan de desarrollo personal;
     - identidad digital.
3. **Redacción.** Una actividad bilingüe por relación. El desarrollo cita todos los criterios de los dos lados con su código completo.
4. **Validación.** El generador, ya con las comprobaciones contra textos de plantilla de la tarea 225, terminó sin errores ni avisos. Una búsqueda más amplia de palabras del otro idioma no encontró nada.

## Archivos

- `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones.json`: sustituye los seis `relaciones_0N_*.json` de la 224. Se conserva su `config.json`.
- `backend/src/data/mapa-intermodular/mapa_cfgs_integracion_social.json`: 7 módulos, 37 RA, 290 conexiones y 290 actividades (145 distintas).
- `backend/src/migrations/37_ingest_mapa_cfgs_integracion_social.ts`: es la de la 224, que nunca se aplicó en producción; solo cambia el comentario.
- `backend/src/data/niveles.ts`: `mapas` de `CFGS_INTEGRACION_SOCIAL` con las pestañas de 1.º y 2.º.
- **Tests:** `mapa.test.ts` (migraciones 37, con 290 conexiones, y 38), `niveles-catalogo.test.ts` y `ras-integracion-social.test.ts`, todos con los dos cursos.
- **Documentación:**
  - `tareas/224_*.md`: aviso de que no se desplegó;
  - `mapas_intermodulares_pendientes.md`;
  - `niveles_educativos_y_catalogo.md`;
  - `procesamiento_actividades_mapa_intermodular.md`.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 1.º (tarea 226) | 145 | 290 | 6-12 | 299 de 299 |
| 2.º (tarea 225) | 165 | 330 | 6-11 | 346 de 346 |

## Lecciones para los mapas encargados a otros modelos

- Una validación estructural no basta. Hay que mirar una muestra de actividades y, desde ahora, el generador rechaza los patrones de plantilla.
- El prompt prohíbe generar los textos con scripts y exige títulos completos. Aun así, conviene revisar también el **plan**: que cada relación una criterios afines y no se limite a cuadrar los números.
