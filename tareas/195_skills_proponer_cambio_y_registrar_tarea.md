# Tarea 195: Skills proponer-cambio y registrar-tarea

## Propósito

Unificar los nombres de las skills de Claude Code con los de otros proyectos del usuario. Las dos skills copiadas de otro proyecto (`proponer-cambio` y `registrar-tarea`) se adaptan a las convenciones de este repositorio, y `nueva-tarea` desaparece al fusionarse en `registrar-tarea`.

## Arquitectura y flujo

- **`proponer-cambio`:** antes de una tarea grande (los mismos casos que llevan rama `feature/NNN_…` según AGENTS.md §1) escribe `planes/NNN_plan_*.md` con estado _Propuesto_, lo añade al índice `planes/README.md` y espera el OK del usuario.
- **`registrar-tarea`:** al terminar, documenta la tarea en `tareas/NNN_slug.md`. Si viene de un plan, lo enlaza y marca el plan como _Implementado (tarea NNN)_.

## Archivos modificados

1. `.claude/skills/registrar-tarea/SKILL.md`: parte de `nueva-tarea` (carpeta `tareas/`, numeración numérica, estructura del documento) y añade el enlace al plan, la sección «Desviaciones respecto al plan» y la verificación con resultados reales. Se eliminan las instrucciones «no ejecutes tests» y «no hagas commit», que contradecían AGENTS.md §1.
2. `.claude/skills/proponer-cambio/SKILL.md`: se activa solo en tareas grandes, no en cualquier cambio de más de un archivo. Se quitan las referencias del otro proyecto (webpack, manifest, Proteo4, varios repos, rutas absolutas), los enlaces pasan a ser relativos y los riesgos se adaptan a este repo.
3. `.claude/skills/nueva-tarea/SKILL.md`: eliminado.
4. `planes/README.md`: índice de planes, vacío por ahora.

## Decisiones técnicas

- `planes/` tiene su propia numeración de 3 dígitos, independiente de `tareas/`. El enlace entre los dos documentos está en la cabecera de la tarea y en el estado del plan.
- Los documentos de `tareas/` conservan el formato `NNN_slug.md` sin índice; `tareas_realizadas/` no se usa.

## Verificación

Solo cambian archivos Markdown de configuración del agente. No se han ejecutado las suites de backend ni de frontend, y no hay despliegue porque no cambia nada de la aplicación.
