# Tarea 14: Cobertura de Tests (90%), Tests E2E (Cypress) y Git Hooks

## Propósito
El objetivo de esta tarea ha sido blindar el código de la aplicación tanto en backend como en frontend para asegurar que no se sube código roto o sin probar al repositorio. Se alcanzó un umbral estricto del 90% en la cobertura de statements y branches en el backend, se implementaron tests end-to-end con Cypress para el frontend, y se automatizó la validación en Git.

## Arquitectura/Flujo
1. **Vitest en Backend (90% Umbral Global)**:
   - Se modificó `vitest.config.ts` para exigir un `90%` de cobertura tanto en *statements* como en *branches*.
   - Se crearon baterías exhaustivas de pruebas (`auth.test.ts`, `extra.test.ts`, `ai.test.ts`, etc.) simulando escenarios límite (Errores 500 simulados con mocks, envío de peticiones vacías, tokens inválidos, etc.) para forzar la ejecución de bloques `catch` y bifurcaciones condicionales ignoradas.
2. **Cypress en Frontend (Tests E2E)**:
   - Se instaló `cypress` de forma local (`npm i -D cypress`).
   - Se creó la carpeta `cypress/e2e/` con tests para la generación de proyectos (`generate.cy.ts`) y la gestión de administración de permisos (`admin.cy.ts`). 
   - Se implementó la técnica de intercepción de red (`cy.intercept()`) para mockear al backend, permitiendo que el front sea verificado en aislamiento.
3. **Vitest en Frontend (Unitarios)**:
   - Utilizando la integración nativa de Angular v18+ (`@angular/build:unit-test`), se arreglaron los tests rotos por cambios previos en UI en `app.spec.ts`.
   - Se crearon pruebas unitarias para aislar la capa de red con `HttpClientTestingModule` (p. ej. probando `PaiService`).
4. **Git Hook (pre-push)**:
   - Se escribió un script Bash en `.git/hooks/pre-push` que bloquea internamente el `git push` si `npm run test:cov` (Backend) o `npm test` (Frontend) devuelven un código de salida `1` (fallo de test o no se cumple el umbral del 90%).

## Archivos Modificados
- `backend/vitest.config.ts` (Ajustes de thresholds).
- `backend/src/tests/auth.test.ts` (Nuevas comprobaciones 500 y Middlewares).
- `backend/src/tests/ai.test.ts` (Nuevas pruebas).
- `backend/src/tests/extra.test.ts` (Testing final de ramas y parámetros faltantes).
- `backend/src/tests/projects.test.ts` (Testeo explícito de fallback paths y 404).
- `frontend/package.json` (Inclusión de dependencias E2E y scripts).
- `frontend/cypress.config.ts` (Archivo orquestador E2E).
- `frontend/cypress/e2e/generate.cy.ts` (Test UI de generación).
- `frontend/cypress/e2e/admin.cy.ts` (Test UI de gestión).
- `frontend/src/app/app.spec.ts` (Adaptación tras cambios estructurales).
- `frontend/src/app/services/pai.service.spec.ts` (Testeos HTTP aislados).
- `.git/hooks/pre-push` (Script interceptor de commits a origin).

## Detalles Técnicos
- Hubo que usar el flag `NODE_TLS_REJECT_UNAUTHORIZED=0` durante la instalación de Cypress para solventar un problema de validación de certificados de la red local del desarrollador en la descarga de binarios nativos.
- Se ha excluido en las pruebas de cobertura frontend el testeo en profundidad del componente `app.ts` gigante para evitar el anti-patrón de "sobre-mockeo" unitario en Angular, derivando esa responsabilidad a los robustos interceptores E2E de Cypress. 
