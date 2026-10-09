# Regla obligatoria: numeración común de plan, rama y tarea

Una misma tarea usa **el mismo número NNN** en su plan (`planes/NNN_plan_*.md`), su rama (`feature/NNN_*`) y su registro (`tareas/NNN_*.md`). Detalle completo en `AGENTS.md` §1.1.

1. El número se fija **una sola vez**, en el primer artefacto que se cree (plan; si no hay, la rama; si tampoco, el registro). Es el mayor número usado en `tareas/`, `planes/` o las ramas `feature/` más uno, con 3 dígitos:
   ```bash
   { ls tareas planes; git branch -a; } | grep -oE '(^|feature/)[0-9]+_' | grep -oE '[0-9]+' | sort -n | tail -1 | awk '{printf "%03d\n", $1+1}'
   ```
2. Los artefactos posteriores **no recalculan** el número: lo copian del plan o de la rama ya creados.
3. Si una tarea no tiene plan o rama, ese número no se usa en esa carpeta (los huecos son normales). Un número ocupado por otra tarea nunca se reutiliza.
4. Los artefactos anteriores a esta regla conservan su número; no se renombran.
