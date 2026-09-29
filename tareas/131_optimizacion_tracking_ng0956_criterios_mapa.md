# 131 — Optimización de Expresión de Seguimiento (`track`) en Criterios de Evaluación y Resolución de Advertencia NG0956

## Propósito

Resolver la advertencia de rendimiento de Angular v22:
```text
NG0956: The configured tracking expression (track by identity) caused re-creation of the entire collection of size 7.
This is an expensive operation requiring destruction and subsequent creation of DOM nodes, directives, components etc.
Please review the "track expression" and make sure that it uniquely identifies items in a collection.
Find more at https://v22.angular.dev/errors/NG0956
```
emitida durante el cambio de idioma (castellano / catalán) y actualización de listas en el componente `MapaIntermodularViewComponent`.

---

## Causa Raíz

En [`mapa-intermodular-view.component.html`](../frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html), el selector de criterios de evaluación utilizaba el valor literal de la cadena de texto como expresión de seguimiento:

```html
@for (crit of (isCa() ? (ra.criteria_ca || ra.criteria_es) : ra.criteria_es); track crit) {
  <button class="mapa-criterion-pill" ...>
    ...
  </button>
}
```

Al cambiar de idioma (`isCa()` cambia entre `true` y `false`), el array evaluado cambia de `ra.criteria_es` a `ra.criteria_ca`. Dado que `crit` es un string primitivo (ej. `"a) Se han caracterizado..."` vs `"a) S'han caracteritzat..."`), Angular compara los elementos por identidad de valor. Como ningún string en catalán coincide con los strings en castellano, el algoritmo de reconciliación determinaba que el 100% de la colección (7 de 7 elementos) había cambiado, forzando la destrucción y recreación completa de los 7 elementos del DOM (`<button>`, `<span>`, directivas y listeners asociados) en lugar de una actualización quirúrgica en el lugar (*in-place DOM patching*).

---

## Solución Técnica

Se actualizó la expresión de seguimiento de `@for` para utilizar `$index` en lugar de `crit`:

```html
@for (crit of (isCa() ? (ra.criteria_ca || ra.criteria_es) : ra.criteria_es); track $index) {
  <button 
    class="mapa-criterion-pill" 
    [class.active]="facade.selectedCriterion() === crit"
    (click)="onSelectCriterion(crit)">
    <span class="mapa-crit-letter">{{ getCriterionCode(crit) }}</span>
    <span class="mapa-crit-label">{{ crit }}</span>
    <span class="mapa-crit-badge-count">{{ facade.getConnectionsCountForCriterion(crit) }}</span>
  </button>
}
```

### Justificación de `$index`:
1. **Estabilidad posicional:** Los criterios de evaluación de un RA tienen un orden fijo (criterio `a` en índice 0, `b` en índice 1, etc.).
2. **Reutilización del DOM:** Al conmutar el idioma, el elemento en el índice 0 sigue estando en el índice 0. Angular conserva intacto el nodo `<button>` del DOM y únicamente actualiza los nodos de texto de los spans interiores (`mapa-crit-label`), eliminando la sobrecarga de destrucción y reasignación de manejadores de eventos.
3. **Eliminación de NG0956:** Angular no detecta reemplazo de identidades artificiales y desaparece por completo la advertencia de la consola de desarrollo y de los logs de pruebas.

---

## Archivos Modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| [`frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html) | **MODIFICADO** | Actualizado `@for (...; track crit)` a `@for (...; track $index)`. |
| [`tareas/131_optimizacion_tracking_ng0956_criterios_mapa.md`](file:///Users/csgj/dev/pai-app/tareas/131_optimizacion_tracking_ng0956_criterios_mapa.md) | **CREADO** | Este documento de diseño técnico. |

---

## Verificación

1. **Pruebas de Frontend en Docker (`pai_frontend`):**
   - Ejecutado `docker exec pai_frontend npm test -- --reporter=verbose -t mapa-intermodular-view`.
   - **Resultado:** 0 apariciones de la advertencia `NG0956` en el log de salida.
   - **33 test suites pasadas (100%)**, **424 tests pasados (100%)**.
   - Cobertura global de ramas: **95,85%** (superando el 90% requerido).
