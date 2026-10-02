# Tarea 166: Corregir umbrales de cobertura (frontend)

## Propósito

`check-coverage.js` fallaba en varios archivos (líneas/statements/branches < 90; functions < 90, y < 80 para plantillas). Se añadieron tests para cubrir las ramas, funciones y líneas no ejercitadas, sin tocar lógica de producción.

## Cambios (specs)

- `projects/utils/selection-match.spec.ts`: entradas vacías y `ras` no-array.
- `components/duplicate-projects-modal.component.spec.ts`: click en backdrop, fallbacks de `projectTitle`/`projectModules` y condición de módulos en plantilla.
- `app.spec.ts`: render del modal de duplicados y eventos `cancel`/`proceed`/`openProject`.
- `curriculum-selector.component.spec.ts`: coincidencia sin título y aviso de generación larga.
- `generator-view.component.spec.ts`: pestaña Diversificación, colaboradores seleccionados (checkbox y botón ×), opciones de `CFGM_ESTETICA` y `getUserName`.
- `history-view.component.spec.ts`: historial vacío, usuario nulo, fallback de `labelFor`, filtros y eventos del toolbar (pills, búsqueda, `app-select`).
- `history-project-card.component.spec.ts`: usuario nulo/admin, `userId` string y `user.id`, fallbacks de título/módulos/proveedor, error de colaboradores, acciones de tarjeta, estado de error y panel de compartir.

## Resultado

- `npm test` (ng test + check-coverage + check-zoneless): **41 archivos, 600 tests en verde** (1 skipped) y **"All coverage thresholds met."**
- `git diff --check` limpio.
