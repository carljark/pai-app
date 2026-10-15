# 236 · Crear proyecto desde las fichas de afinidades de la ESO

## Propósito

En el mapa intermodular de FP cada conexión tiene un botón «Crear Proyecto» que abre el generador con los RA de la conexión ya seleccionados. El mapa de afinidades de la ESO no lo tenía: el docente veía qué criterios de evaluación de varias materias encajan en un ámbito, pero tenía que buscarlos uno a uno en el generador.

Ahora cada ficha tiene el botón «Crear Proyecto con estos criterios» / «Crear Projecte amb aquests criteris», que abre el generador con la ESO, el curso de la pestaña y las CE de la ficha seleccionadas, marcando solo los criterios que cita la ficha.

## Flujo

1. `AfinidadCardComponent` emite `crearProyecto` al pulsar el botón.
2. `AfinidadesEsoViewComponent` llama a `AfinidadProyectoService.crearProyecto(ficha, materiaActiva, pestaña)`.
3. El servicio fija nivel (`ESO_ORDINARIA`) y curso en `CurriculumFacade`, lo que vacía la selección anterior.
4. Pide las CE del curso con `CurriculumFacade.fetchEsoCes` y las guarda en `esoCes`. No espera al efecto de `AppFacade` que las recarga al cambiar de curso, porque hasta entonces `esoCes` tiene las del curso anterior.
5. `seleccionDeAfinidad` convierte la ficha en una lista de `{ key, ids, todos }`: una entrada por CE, con los criterios citados en todos los vínculos de la ficha y sin repetir. La CE se localiza por `subjectCode` (el código de materia de la ficha) y `ce_num` (la parte entera del criterio, «2.1» → CE2).
6. `CriteriosFacade.fijar(key, ids, todos)` selecciona la CE y guarda la elección parcial (si coincide con todos los criterios, la CE queda completa y no se guarda nada).
7. `LayoutService.switchView('generator')`.

## Archivos

| Archivo | Cambio |
|---|---|
| `frontend/src/app/features/mapa-intermodular/utils/afinidad-seleccion.ts` | Nuevo: `materiasEnOrden` y `seleccionDeAfinidad` (funciones puras) |
| `frontend/src/app/features/mapa-intermodular/services/afinidad-proyecto.service.ts` | Nuevo: orquesta nivel, curso, carga de CE, selección y cambio de vista |
| `frontend/src/app/features/curriculum/services/curriculum.facade.ts` | `fetchEsoCes` extraído de `loadEsoCes` para pedir las CE sin guardarlas |
| `frontend/src/app/features/curriculum/services/criterios.facade.ts` | `fijar`: selecciona una CE con un subconjunto de criterios |
| `frontend/src/app/features/mapa-intermodular/components/ui/afinidad-card/*` | Botón `btn-primary` en `afinidad-card__acciones`, salida `crearProyecto`; el orden de materias reutiliza `materiasEnOrden` |
| `frontend/src/app/features/mapa-intermodular/components/afinidades-eso-view/*` | Conecta la salida de la ficha con el servicio |
| `documentation/mapa_afinidades_eso.md` | Sección «Crear un proyecto desde una ficha» |

Specs nuevas o ampliadas: `afinidad-seleccion.spec.ts`, `afinidad-proyecto.service.spec.ts`, `afinidad-card.component.spec.ts`, `afinidades-eso-view.component.spec.ts` y `criterios.facade.spec.ts`.

## Decisiones

- **Criterios, no CE completas.** Las fichas relacionan criterios concretos; seleccionar las CE enteras llevaría al prompt criterios que no fundamentan el ámbito. Se usa el mecanismo de elección parcial que ya tenía el generador (tarea de criterios por CE), así el docente puede ampliar la selección desde el propio generador.
- **Orden.** La materia consultada va primero, como en la ficha, y luego las demás; dentro de cada materia, las CE en el orden en que aparecen en la ficha.
- **Datos incompletos.** Una CE o un criterio que no existe en el curso cargado se omite en vez de bloquear; si falla la petición de CE se abre el generador igualmente con el nivel y el curso.
- **Rama.** Sale de `feature/234_mapa_cfgm_atencion_dependencia_1`, que es lo desplegado, y no de la 235, en la que Gemini sigue trabajando con el mapa de Animación Sociodeportiva 2.º. Así se despliega sin arrastrar ese mapa a medias.
