# 128 – Eliminación de Dependencia Obsoleta `@angular/platform-browser-dynamic`

## Propósito

Eliminar el warning de deprecación emitido por npm al instalar dependencias:
```text
npm warn deprecated @angular/platform-browser-dynamic@22.1.4: @angular/platform-browser-dynamic is deprecated. Use `@angular/platform-browser` instead.
```
Además de suprimir el warning, esta dependencia generaba conflictos de resolución de peer dependencies (`ERESOLVE`) en npm contra `@angular/common` al intentar actualizar paquetes de pruebas o herramientas de desarrollo.

---

## Análisis Técnico y Diagnóstico

1. **Evolución de Angular:**
   - En versiones clásicas de Angular (basadas en `NgModule`), la inicialización de la aplicación requería `platformBrowserDynamic().bootstrapModule(AppModule)` proveniente de `@angular/platform-browser-dynamic`.
   - Desde la introducción de aplicaciones *standalone* (Angular 17+ y formalizado en Angular 18/19+), el bootstrap oficial se realiza directamente mediante `bootstrapApplication(App, appConfig)` importado desde `@angular/platform-browser`.
2. **Uso en el proyecto:**
   - Se analizó la totalidad del código fuente (`frontend/src/`) y archivos de configuración:
     - [`src/main.ts`](file:///Users/csgj/dev/pai-app/frontend/src/main.ts): ya utilizaba `bootstrapApplication` de `@angular/platform-browser`.
     - [`test-setup.ts`](file:///Users/csgj/dev/pai-app/frontend/test-setup.ts): utiliza `platformBrowserTesting` de `@angular/platform-browser/testing`.
     - No existía ningún import de `@angular/platform-browser-dynamic` en todo el repositorio.
   - La dependencia figuraba únicamente como residuo en `devDependencies` dentro de `package.json`.

---

## Archivos Modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| [`frontend/package.json`](file:///Users/csgj/dev/pai-app/frontend/package.json) | **MODIFICADO** | Eliminada la entrada `"@angular/platform-browser-dynamic": "^22.1.4"` de `devDependencies`. |
| [`frontend/package-lock.json`](file:///Users/csgj/dev/pai-app/frontend/package-lock.json) | **MODIFICADO** | Eliminada la referencia y árbol de dependencias asociado al paquete. |

---

## Verificación y Pruebas

1. **Instalación limpia de dependencias:**
   - Ejecutado `npm install --legacy-peer-deps` tanto en host como en el contenedor Docker `pai_frontend`.
   - **Resultado:** 0 advertencias de deprecación.

2. **Compilación de producción (`ng build`):**
   - Ejecutado `npm run build` en host y contenedor.
   - **Resultado:** Bundle generado en ~6 segundos sin incidencias.

3. **Suite completa de tests unitarios y cobertura:**
   - Ejecutado `docker exec pai_frontend npm test`:
     - **33 test suites** ejecutadas.
     - **420 tests** ejecutados.
     - **33 passed (100%), 420 passed (100%)**.
     - Cobertura global de ramas: **95.77%** (superando el umbral de 90%).
