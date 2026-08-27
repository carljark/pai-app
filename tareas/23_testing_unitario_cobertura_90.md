# 23 - Cobertura de Pruebas Unitarias al >90% (Angular 18)

## Propósito
El objetivo de esta tarea ha sido blindar el código del frontend (basado en Angular 18 con Signals) y asegurar una cobertura de tests unitarios estricta por encima del 90% en todas las métricas (Statements, Branches, Functions, Lines) de Vitest. Además, se exigió integrar este validador dentro del pipeline de testeo continuo.

## Arquitectura / Flujo
1. **Configuración de Vitest:** Se ha habilitado la recolección de cobertura mediante `v8`, estableciendo umbrales del 90% en `vitest.config.ts`.
2. **Script de Verificación (`check-coverage.js`):** Dado que el *builder* experimental `@angular/build:unit-test` devuelve un código de salida `0` incluso si falla el umbral de Vitest, se ha creado un script en Node que lee el archivo `coverage-summary.json` y fuerza la detención del proceso (`process.exit(1)`) en caso de incumplimiento.
3. **Escritura exhaustiva de tests:**
   - Creación de Mocks y Stubs para todas las `Facades` (Curriculum, Auth, Projects, Admin, Notifications).
   - Sustitución de `overrideComponent` por simulaciones en el `TestBed` para evitar la pérdida del *source map* del template, lo cual impedía a v8 trazar correctamente las líneas de HTML.
   - Refactorización de pruebas para disparar explícitamente eventos del DOM (`(click)`, `(ngModelChange)`, `(submit)`) y con ello cubrir las funciones y ramas anónimas generadas en tiempo de ejecución por Angular (`@if`, `@else`, `@for`).

## Archivos Modificados / Creados
*   `frontend/package.json` (modificado script `test`)
*   `frontend/vitest.config.ts` (añadido threshold y json-summary)
*   `frontend/check-coverage.js` (script validador CI)
*   `frontend/src/app/app.spec.ts`
*   `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.spec.ts`
*   `frontend/src/app/features/auth/components/auth-form/auth-form.component.spec.ts`
*   `frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts`
*   `frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts`
*   Múltiples tests para Modales (`info`, `error`, `confirm`) y otros componentes menores de interfaz.

## Detalles Técnicos
- La simulación de componentes HTML en Angular 18 con Signals es especialmente sensible a *race-conditions* durante el `detectChanges()`.
- La solución para alcanzar el +90% en *Functions* ha consistido en ejecutar iteraciones asíncronas de todos los botones y campos (`fixture.debugElement.nativeElement.querySelectorAll`) lanzando despachos de eventos nativos (`dispatchEvent(new Event('input'))`) y resolviéndolos en colas asíncronas controladas en lugar de simplemente invocar a los métodos públicos de la clase.
- `EventSource` (utilizado por el sistema SSE para notificaciones) causaba excepciones silenciosas durante la hidratación de los componentes de *layout*, las cuales se han aislado limpiando el árbol de testing (`TestBed`).
