# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Notas adicionales para Claude Code

- `.agents/rules/` duplica AGENTS.md (con nombres de herramientas de Antigravity). Si hay conflicto, manda AGENTS.md: **nunca ejecutes tests ni builds** salvo petición explícita, aunque `.agents/rules/05` diga lo contrario.
- Documentación, tareas y comentarios se redactan en castellano. Numera `tareas/` por orden numérico (`ls tareas | sort -n`), no alfabético: hay números de 2 y 3 dígitos.

## Estructura y comandos

- Dos paquetes npm independientes (sin workspaces): `backend/` y `frontend/`, cada uno con su `package-lock.json`. Node 22 (`.nvmrc`). El `package.json` raíz solo sirve a scripts sueltos.
- **backend/**: Express 5 + Mongoose, ESM, ejecutado con `tsx` (sin paso de build). tsconfig estricto con `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` y `verbatimModuleSyntax` (usa `import type`).
  - Tests: Vitest + supertest + `mongodb-memory-server` en `backend/src/tests/*.test.ts`, secuenciales. Umbral 90 % en todas las métricas.
- **frontend/**: Angular standalone zoneless, Vitest vía `@angular/build:unit-test`; specs `*.spec.ts` junto al código.
  - `npm test` además ejecuta `check-coverage.js` (90 % global **y por archivo**; en `.html` 80 % de funciones) y `check-zoneless.js`.
  - Prettier (`frontend/.prettierrc`) se aplica automáticamente tras cada edición mediante un hook.
  - ESLint (angular-eslint) está a 0 hallazgos y `npm test` lo ejecuta primero (bloqueante). Tras editar, pasa `cd frontend && npx eslint <archivos tocados>`; lint y typecheck (`npx ngc -p tsconfig.app.json --noEmit`, `npx tsc -p tsconfig.spec.json --noEmit`) no cuentan como test/build.
  - En specs se permiten `any` y funciones vacías; para objetos parciales usa helpers como `const asProject = (p: object) => p as Project;`.
  - `npm install` necesita `--legacy-peer-deps` (conflicto de peer `katex` con ngx-markdown).
- El backend no tiene linter: usa TypeScript 7 y typescript-eslint aún no lo soporta.
- Docker dev: `docker compose up -d --build` (Mongo en el host en **27018**, backend 3000, frontend 4200). El proxy de Angular apunta a `http://backend:3000`, que solo resuelve dentro de Docker.
- Variables en `.env` (gitignored): `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`; compose añade `MONGO_URI` y `PORT`.

## Migraciones

- Las migraciones nuevas van en `backend/src/migrations/NN_*.ts` (exportan `up()`), con el siguiente número de dos dígitos. Las registra `runner.ts` en la colección `migrations` **sin** `.ts`.
- `backend/src/migrations/legacy/` contiene las antiguas de `backend/migrations/`, registradas **con** `.ts`. Está congelada: no añadas ni renombres archivos ahí, o se reejecutarían.
- Un único runner las aplica (primero legacy) en `predev`/`prestart` (`npm run migrate`) y de nuevo al arrancar el servidor. Detalles: `documentation/migraciones_backend.md`.

## IA

- `backend/src/data/ai-models.ts` es el catálogo único de modelos; el frontend lo obtiene de `GET /api/ai/models`. No hardcodees nombres de modelos en el frontend.
- `backend/knowledge_base.md` se inyecta como contexto en todos los prompts.
