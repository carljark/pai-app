# Tarea 204: Numeración común de plan, rama y tarea

## Propósito
Hasta ahora planes (`planes/001-005`), ramas (`feature/001-010`) y tareas (`tareas/…203`) se numeraban por separado, de modo que una misma tarea aparecía como plan 005, rama 010 y tarea 203. Se establece una regla obligatoria para que los tres artefactos de una tarea compartan el mismo número y sea fácil relacionarlos.

## Arquitectura y flujo
- El número se fija una sola vez, en el primer artefacto que se crea (plan, si no rama, si no registro), como el mayor número usado en `tareas/`, `planes/` o las ramas `feature/` más uno, con 3 dígitos.
- Los artefactos posteriores copian ese número (del plan o de la rama) en lugar de recalcularlo.
- Se admiten huecos: una tarea sin plan o sin rama no ocupa ese número en esa carpeta. Los artefactos anteriores conservan su número.

## Archivos modificados
1. `AGENTS.md`: nueva sección §1.1 con la regla y el comando de cálculo; §1 (rama) y §2 (tareas) remiten a ella. Lo leen Claude Code (vía `CLAUDE.md`) y el resto de agentes.
2. `CLAUDE.md`: la nota de numeración de `tareas/` remite a la numeración común.
3. `.claude/skills/proponer-cambio/SKILL.md`: el plan fija el número común (ya no es independiente) y, al aprobarse, se crea la rama `feature/NNN_*` con ese mismo número.
4. `.claude/skills/registrar-tarea/SKILL.md`: reutiliza el número del plan o de la rama; solo calcula uno nuevo si no hay ninguno, y avisa si hay discrepancias.
5. `.agents/skills/agregar-fp/SKILL.md`: el paso de documentación usa el número común.
6. `.agents/rules/06_numeracion_plan_rama_tarea.md`: copia de la regla para Antigravity.

## Decisiones técnicas
- Se toma el máximo de los tres espacios de numeración para evitar colisiones con números ya reservados por planes o ramas en curso; como las tareas iban por la 203, la siguiente tarea con plan será la 204 o posterior en las tres carpetas.
- Comando sin dependencias (`ls`, `git branch -a`, `grep`, `awk`) para que funcione con cualquier modelo o agente.
- No se renombran planes ni ramas antiguos: romperían enlaces, el índice de `planes/README.md` y ramas publicadas.

## Verificación
- Comando de cálculo ejecutado en la sesión: devuelve `204` (máximo actual: tarea 203).
- Cambio solo de documentación e instrucciones: no se han ejecutado las suites de tests ni se ha desplegado, porque no hay código afectado.
