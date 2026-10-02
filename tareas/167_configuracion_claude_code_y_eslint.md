# Tarea 167: Configuración de Claude Code (CLAUDE.md, skills, hooks) y ESLint en el frontend

## Propósito
Preparar el repositorio para trabajar con Claude Code respetando las reglas existentes de `AGENTS.md`, convertir en controles deterministas las reglas más fáciles de incumplir (no hacer commits, no ejecutar tests/builds, formato) e incorporar un linter al frontend.

## Arquitectura y flujo
- **`CLAUDE.md`** importa `@AGENTS.md` (fuente única de reglas) y añade solo lo que no recoge: comandos por paquete, puertos Docker, los dos sistemas de migraciones, el control de cobertura por archivo y el catálogo de modelos de IA.
- **Skills** (`.claude/skills/`):
  - `agregar-fp`: enlace simbólico a `.agents/skills/agregar-fp`, de modo que haya una sola copia compartida con otros agentes.
  - `nueva-tarea`: crea el documento numerado de `tareas/` con la estructura exigida.
- **Hooks** (`.claude/settings.json`):
  - `PreToolUse/Bash` → `.claude/hooks/guard-bash.sh`: deniega `git commit` (incluido `git -C dir commit`) y `npm test|build|e2e`, `ng test|build`, `vitest` y `cypress`.
  - `PostToolUse/Write|Edit` → `prettier --write` sobre `frontend/src/**/*.{ts,html,scss}`.
- **ESLint**: `ng add angular-eslint@22` (con `legacy-peer-deps`) crea `frontend/eslint.config.js`, el target `lint` en `angular.json` y el script `npm run lint`.

## Archivos modificados
1. `CLAUDE.md` (nuevo).
2. `.claude/settings.json`, `.claude/hooks/guard-bash.sh`, `.claude/skills/nueva-tarea/SKILL.md`, `.claude/skills/agregar-fp` (symlink).
3. `frontend/eslint.config.js` (nuevo): configuración recomendada más las reglas de la casa (`max-lines-per-function` 25 como aviso; `component-max-inline-declarations` con template/styles a 0), excluyendo specs.
4. `frontend/package.json`, `frontend/package-lock.json`, `frontend/angular.json`: dependencias y target de ESLint. El schematic también reformateó algunos arrays de `angular.json`.

## Decisiones técnicas
- **Hook de Prettier pese al formato heterogéneo**: 127 de 144 archivos del frontend no cumplen Prettier, así que la primera edición de cada archivo lo reformateará entero. Se aceptó este ruido en los diffs; como alternativa, conviene aplicar `prettier --write` a todo el frontend en un commit aislado.
- **Sin linter en backend**: el backend usa TypeScript 7 y `typescript-eslint` 8.x solo admite `typescript <6.1.0`.
- **Deuda de lint existente**: 538 hallazgos (308 `no-explicit-any`, 19 componentes con plantilla/estilos inline). No se corrigieron en esta tarea.
- **Migraciones**: CLAUDE.md documenta ambos sistemas (`backend/src/migrations` + `runner.ts` y `backend/migrations` + `scripts/migrate.ts`) y pide al agente consultar cuál usar.

## Verificación
- Hook guard probado con comandos permitidos y denegados, y en vivo con `git commit --dry-run` (denegado).
- Hook Prettier probado en vivo: una edición con indentación incorrecta en `auth.model.ts` quedó corregida.
- `npx eslint src` ejecuta correctamente. No se han ejecutado tests ni builds.
