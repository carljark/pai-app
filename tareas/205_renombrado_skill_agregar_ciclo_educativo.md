# Tarea 205: Renombrado de la skill `agregar-fp` a `agregar-ciclo-educativo`

## Propósito
La skill de incorporación de ciclos se usará para la FP (Grado Básico, Medio y Superior) y también para niveles de la ESO cuando haga falta. El nombre `agregar-fp` se quedaba corto, así que pasa a llamarse `agregar-ciclo-educativo`.

## Arquitectura y flujo
- La skill sigue teniendo una sola copia, en `.agents/skills/agregar-ciclo-educativo/`, compartida con Antigravity. Claude Code la ve a través del enlace simbólico `.claude/skills/agregar-ciclo-educativo` (antes `.claude/skills/agregar-fp`).
- El contenido no cambia: solo el nombre, la descripción del frontmatter y el título, que ahora mencionan la ESO (con CE en lugar de RA, como la ESO ordinaria de la tarea 197).

## Archivos modificados
1. `.agents/skills/agregar-fp/` → `.agents/skills/agregar-ciclo-educativo/` (`git mv`, con `references/` y `scripts/`). En `SKILL.md` cambian `name`, `description`, el título y las rutas de los comandos del scaffold.
2. `.claude/skills/agregar-fp` (enlace simbólico) → `.claude/skills/agregar-ciclo-educativo`.
3. `AGENTS.md`: rutas de la skill y redacción de la introducción y de §8 («ciclos educativos (FP y ESO)»).
4. `documentation/uso_skill_agregar_fp.md` → `documentation/uso_skill_agregar_ciclo_educativo.md`, con las invocaciones y rutas actualizadas.
5. `documentation/niveles_educativos_y_catalogo.md`, `documentation/migraciones_backend.md` y `documentation/ciclos_ies_cap_de_llevant.md`: nombre de la skill.

## Decisiones técnicas
- Los registros históricos de `tareas/` y `planes/` conservan el nombre antiguo, porque describen lo que se hizo en su momento.
- Los scripts `scaffold_cfgm.py` y `verify_cfgm_integration.sh` conservan su nombre. Siguen siendo específicos de FP y no contienen la ruta de la skill.
- No se ha adaptado el procedimiento al detalle de la ESO: se hará cuando haga falta incorporar un nivel de ESO.

## Verificación
- `grep` sin referencias a `agregar-fp` fuera de `tareas/` y `planes/`. El enlace simbólico resuelve y Claude Code ya lista la skill con el nombre nuevo.
- Suites completas ejecutadas por el hook de `git push`.
- Cambio solo de documentación e instrucciones: no se despliega en el EC2.
