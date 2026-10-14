# 232 · Mapa intermodular de 2.º del CFGM Atención a Personas en Situación de Dependencia

## Propósito

Esta tarea hace el mapa intermodular de **2.º del CFGM Atención a Personas en Situación de Dependencia**: 8 módulos, 38 RA y 284 criterios. Al mismo tiempo se dejó preparado el prompt para que Gemini haga el 2.º del CFGS Acondicionamiento Físico (tarea 227).

## Trabajo en paralelo

- Se trabajó en el worktree `../pai-app-mapa232`, en la rama `feature/232_mapa_cfgm_atencion_dependencia_2`, creada desde la 228. Esa es la última de la cadena de mapas (225 → 226 → 228) y tiene el validador contra textos de plantilla.
- La **migración es la 41**. La 39 sigue reservada para la tarea 227 y la 40 es la del 1.º de Acondicionamiento Físico. Cada migración sustituye solo su pestaña, así que el orden de aplicación no importa.
- `scripts/mapa-intermodular/prompt_cfgs_acondicionamiento_fisico_2.md` se actualizó para Gemini, porque había quedado desfasado tras la tarea 228:
  - la rama de partida pasa a ser la 228;
  - en `niveles.ts`, el 2.º se añade al array `mapas`, que ya tiene el 1.º;
  - la migración se copia de la 40, y `ras-acondicionamiento-fisico.test.ts` ya no espera un ciclo sin mapa.
- Al fusionar la 227 habrá conflictos menores en `niveles-catalogo.test.ts`, `mapa.test.ts` y la documentación.
- La rama de las tareas 229-231 (filtros, afinidades y banner) también tiene una migración **38** (`38_quitar_origen_afinidades_eso`), con el mismo número que la 38 de Integración Social 2.º. El runner las registra por nombre, así que ambas se aplican. Aun así, conviene tenerlo en cuenta al fusionar las dos cadenas.

## Flujo

1. **Ficha y configuración.** `mapa-intermodular.mts ficha` generó la ficha y la propuesta de `config.json`. Familias de relación de los módulos específicos:

   | Módulo | Familia | Icono |
   |---|---|---|
   | 0211 Destrezas sociales | comunicación | `users` |
   | 0214 Apoyo a la comunicación | cliente | `message-circle` |
   | 0216 Atención sanitaria | ciencias | `heart-pulse` |
   | 0831 Teleasistencia | técnica | `user-check` |

   Los comunes (0156, 1708, 1710) y el proyecto intermodular (1713) conservan los valores por defecto.

2. **Plan.** Antes de redactar se fijó cuántas relaciones habría entre cada par de módulos, unas 8 por RA. Cada relación se asignó a RA y criterios concretos para cubrir los 284 criterios. Ejes de las situaciones profesionales:
   - **0211 Destrezas sociales:** comunicación con personas con afasia o hipoacusia, negociación ante rechazos de cuidados, dinámicas de grupo en el centro de día y autoevaluación de la competencia social.
   - **0214 Apoyo a la comunicación:** tableros y comunicadores en la toma de constantes y en la comida, signos para anticipar exploraciones, videollamada con pictogramas en la central y pautas para las familias.
   - **0216 Atención sanitaria:** transferencias, disfagia, medicación, olas de calor, registros y banco de ayudas técnicas.
   - **0831 Teleasistencia:** agendas, emergencias (caídas, dolor torácico, DANA), relevo de turnos, contraseñas y ciclo de vida de los terminales.
   - **Comunes:**
     - 0156: residentes británicos e irlandeses, prospectos, manuales y llamadas en inglés;
     - 1708: residuos sanitarios, desperdicio alimentario, absorbentes, soledad no deseada y ODS;
     - 1710: bolsas de empleo públicas, marca personal, entrevistas de problema e innovación social.
3. **Redacción.** Hay 153 relaciones en cinco archivos (`relaciones_01.json` a `relaciones_05.json`), agrupados por módulo de origen y con una actividad bilingüe por relación. Cada desarrollo cita todos los criterios de los dos lados, con las mismas citas y en el mismo orden en castellano y en catalán.
4. **Validación.**
   - La primera pasada del generador encontró dos pares de RA repetidos y cuatro metodologías iguales en los dos idiomas («aula invertida», «lectura cooperativa»…). Se corrigieron reescribiendo esas relaciones a mano.
   - El resultado final no tiene errores ni avisos: todos los criterios están cubiertos y citados.
   - Una búsqueda más amplia de palabras del otro idioma solo dio falsos positivos: pronombres como «les» en castellano y enclíticos como «-los» en catalán.

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgm_atencion_dependencia_2.json`: 8 módulos, 38 RA y 306 conexiones (153 actividades distintas).
- `scripts/mapa-intermodular/fuentes/CFGM_ATENCION_DEPENDENCIA_2/`: `config.json` y `relaciones_01.json` a `relaciones_05.json`. `ficha.md` no se versiona.
- `backend/src/migrations/41_ingest_mapa_cfgm_atencion_dependencia_2.ts`: sustituye solo la pestaña `CFGM_ATENCION_DEPENDENCIA_2` y se puede volver a ejecutar.
- `backend/src/data/niveles.ts`: `mapas` del ciclo con la pestaña de 2.º, que se abre en `0211_RA1`.
- Tests:
  - `mapa.test.ts`, migración 41: idempotencia, otras pestañas intactas, 306 conexiones bidireccionales, de 6 a 15 conexiones por RA, como máximo 3 criterios relacionados, textos de RA iguales a los del archivo de datos y orden de módulos del endpoint;
  - `niveles-catalogo.test.ts` y `ras-atencion-dependencia.test.ts`: la nueva pestaña.
- Documentación: `mapas_intermodulares_pendientes.md`, `niveles_educativos_y_catalogo.md` y `procesamiento_actividades_mapa_intermodular.md`.
- `scripts/mapa-intermodular/prompt_cfgs_acondicionamiento_fisico_2.md`: prompt de la tarea 227, actualizado.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 2.º | 153 | 306 | 6-12 | 284 de 284 |

## Decisiones

- **Solo 2.º.** El 1.º del ciclo (40 RA) sigue pendiente. Mientras tanto, el selector del mapa muestra únicamente la pestaña de 2.º, que es lo que admite el catálogo cuando la entrada `mapas` lleva `curso`.
- **Familia «cliente» para 0214.** 0211 ya ocupa «comunicación», y el apoyo a la comunicación se centra en la persona usuaria. Así las conexiones que llegan a cada módulo se distinguen por familia.
- **Cinco archivos de relaciones.** Escribir por bloques evitó truncar la salida y facilitó revisar por pares de módulos. El generador une todos los `relaciones*.json`.
