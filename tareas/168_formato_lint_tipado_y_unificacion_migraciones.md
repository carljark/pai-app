# Tarea 168: Formato uniforme, deuda de ESLint a cero, tipado estricto y unificación de migraciones

## Propósito
Aplicar las mejoras propuestas tras configurar Claude Code (tarea 167):

1. Formatear todo el frontend con Prettier para que el hook de formato solo afecte a las líneas editadas.
2. Eliminar la deuda de ESLint (538 hallazgos) y hacer el lint bloqueante.
3. Unificar los dos sistemas de migraciones del backend sin reejecutar ninguna migración ya aplicada.

## Arquitectura y flujo

### 1. Prettier
`prettier --write "src/**/*.{ts,html,scss}"` sobre `frontend/`. Afecta a 127 archivos, casi todo el volumen en `mapa-intermodular.seed.ts` y los datos CFGM. No cambia la semántica del código.

### 2. ESLint: de 538 a 0 hallazgos
- **Plantillas y estilos inline (19 en 16 componentes)** pasan a `.html`/`.scss` propios mediante un script temporal con la API del compilador de TypeScript. Así se respetan exactamente los escapes de los literales.
- **Outputs con nombres nativos o con prefijo `on`**: `close`→`closed`, `cancel`→`cancelled`, `onSelectCriterion`→`criterionSelected`, `onSelectModule`→`moduleSelected`, `onSelectRa`→`raSelected`. Se actualizaron plantillas padre (`app.html`, vista del mapa) y specs.
- **Accesibilidad**: los elementos clicables reciben `role`, `tabindex` y `keydown.enter`. Si contienen botones, el handler solo actúa cuando el foco está en el propio contenedor (`$event.target === $event.currentTarget`). Los fondos de modal, que son decorativos, llevan `aria-hidden`. Las labels se asocian con `for`/`id`, y las etiquetas de grupo pasan a `span.form-group__label` (estilo global en `_components.scss`). `app-select` se declara como control en ESLint.
- **`any` de producción (139)** sustituidos por tipos reales:
  - Modelos ampliados con los campos que ya devuelve la API: `LearningOutcome` (variantes `_es/_ca`, `moduleCode`, `tipoNivel`), `User.id` (legacy), `ActivityLogDetails`/`ActivityLogProject`, `DbNotification`, `RawEventProject`, `ActivityItem` y `MapaStats`.
  - DTOs del mapper de proyectos exportados y usados en `ProjectsService` y `PaiService`.
  - Helper `getOwnerId()` para `userId` poblado o string, que antes se repetía en 5 sitios.
- **Funciones de más de 25 líneas (18)** divididas en helpers. La lógica pura pasa a:
  - `features/curriculum/utils/curriculum-grouping.ts`: agrupación de RAs/CEs y búsqueda aproximada.
  - `features/mapa-intermodular/utils/curriculum-match.ts` y `connection-summary.ts`.
  - `features/notifications/utils/activity-time.ts`.
- **Specs**: se permiten `any` y funciones vacías en `*.spec.ts`. Los objetos parciales se adaptan con helpers como `asProject`, `asLog` y `asEvent`.
- **Bloqueante**: `max-lines-per-function` pasa a error y `npm test` ejecuta `ng lint` antes de los tests.

### 3. Migraciones unificadas
Ver `documentation/migraciones_backend.md`.
- `backend/migrations/*` pasa a `backend/src/migrations/legacy/` con rutas relativas ajustadas, y `data/anexo8.txt` con ellas.
- `runner.ts` recorre primero `legacy/` (registra el nombre con `.ts`) y después `src/migrations/` (sin `.ts`), igual que hacían los dos runners por separado. Usa el modelo único `models/Migration.ts`.
- `scripts/migrate.ts` delega en el runner. Se mantienen `predev`/`prestart`, de modo que las migraciones terminan antes de que el servidor atienda peticiones.

## Archivos modificados (principales)
- `frontend/eslint.config.js`, `frontend/package.json` (lint en `npm test`).
- 16 componentes con plantilla o estilos extraídos, más sus nuevos `.html`/`.scss`.
- Modelos: `curriculum.model.ts`, `auth.model.ts`, `admin.model.ts`, `notification.model.ts`, `project.model.ts`, `mapa-intermodular.model.ts`.
- Servicios y facades: `pai.service.ts`, `projects.service.ts`, `projects.facade.ts`, `curriculum.facade.ts`, `notifications.facade.ts`, `mapa-intermodular.facade.ts`, `telemetry.service.ts`, `layout.service.ts`, `app.facade.ts`.
- Mappers: `projects.mapper.ts` (DTOs exportados, `fromRewriteSectionResponse`, `rewrittenText`) y `notification.mapper.ts`.
- Nuevos utils en `curriculum/`, `mapa-intermodular/` y `notifications/`.
- Specs adaptados a los tipos, y tests nuevos para `getOwnerId`, `rewrittenText`, `fromRewriteSectionResponse` y el nombre vacío de módulo de Peluquería.
- Backend: `src/migrations/runner.ts`, `scripts/migrate.ts`, `src/migrations/legacy/*`.
- Documentación: `documentation/migraciones_backend.md`, `CLAUDE.md`.

## Decisiones técnicas
- **Sin cambios de comportamiento salvo los indicados.** Las refactorizaciones conservan el orden de evaluación y los valores resultantes; las constantes de orden CFGM se verificaron una a una contra el original. Cambios deliberados:
  - `ProjectsFacade.rewriteSection` guarda siempre texto en `generatedProject` (antes guardaba un instante el objeto de respuesta). El estado final del taller no cambia.
  - Un RA sin `subject` ni `module` se agrupa con nombre vacío en lugar de lanzar `undefined.startsWith`.
- **Respuesta de reescritura**: el backend devuelve `{ newText, rewrittenPart, provider, model, fallbackUsed }`, no `rawText`. Se tipa como unión `string | RewriteResultDto` y no se cambia el contrato, para no reescribir specs de áreas con cobertura obligatoria.
- **Cobertura**: en `features/taller/**` y `features/projects/**` se evitaron ramas nuevas sin test. Por ejemplo, `generatedContent!` en la importación DOCX mantiene el comportamiento previo. Queda pendiente decidir qué hacer si el backend no devuelve contenido.
- **Código muerto detectado, no eliminado**: `CriterionSelectorComponent` no se usa en ninguna plantilla, y 17 de los 19 métodos de `PaiService` están duplicados en `ProjectsService`. Ambos se tiparon pero se conservan; su eliminación es una decisión aparte.
- **Seed grande en el bundle**: `mapa-intermodular.seed.ts` (unas 100 000 líneas) sigue en el frontend, en contra de la regla de AGENTS.md. Queda fuera del alcance.

## Verificación
- `npx eslint src`: 0 hallazgos.
- `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- Backend: el typecheck no añade errores nuevos, salvo uno del mismo tipo que los 268 previos (imports sin extensión, la convención del proyecto). El runner y las 8 migraciones legacy cargan con `tsx` y sus rutas de datos existen.
- **Ajustes tras la primera ejecución de `npm test`**:
  - Dos specs de notificaciones buscaban el fondo del modal por `rgba(0,0,0,0.5)`, que Prettier había reformateado. Se actualizó el selector.
  - El control de cobertura por archivo también mide las plantillas extraídas y los utils nuevos. Se añadieron:
    - specs propios para `connection-summary.ts` y `curriculum-match.ts`;
    - tests de teclado (Enter sobre el propio elemento y Enter que sube desde un hijo) en el generador, home y la vista del mapa;
    - tests de renderizado de ramas en auth, personal y admin.
- **Pendiente (usuario)**: `cd frontend && npm test` (incluye lint y cobertura por archivo) y `cd backend && npm run test:cov`. Conviene arrancar el backend en local (`npm run dev`) y comprobar en el log que no se reejecuta ninguna migración.
