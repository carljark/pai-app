# Tarea 71: Presentación Elegante de Errores y Supresión de Stderr en Tests

## Propósito
El usuario reportó la necesidad de revisar el error provocado durante los tests unitarios:
```text
Error en IA Error: Direct error
    at /Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts:492:76
```
y mejorar la elegancia de la presentación de los errores tanto en la ejecución de las pruebas como en la interfaz de usuario de la aplicación.

---

## Causa y Oportunidades de Mejora Identificadas

1. **Fuga de traza a `stderr` en pruebas unitarias:**
   - En [taller-view.component.spec.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts), el test `should handle rewriteWithAI error variants` provocaba deliberadamente variantes de error (incluyendo `new Error('Direct error')`) para verificar que el componente las capturaba.
   - Sin embargo, a diferencia de otros tests, no espiaba `console.error` con `vi.spyOn(console, 'error')`, permitiendo que la llamada legítima `console.error('Error en IA', err)` imprimiera la traza roja completa de `Direct error` por `stderr`.

2. **Presentación rígida y poco contextual en la UI (`ErrorModalComponent`):**
   - El componente modal de error ([error-modal.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/components/error-modal.component.ts)) tenía un título fijo en el HTML: `"Error de Generación"`, incluso si el error se producía en el Taller Editor, al borrar un proyecto o por permisos.
   - El diseño visual era tosco y mostraba mensajes técnicos como `"El servidor devolvió el siguiente error:\n\n..."`.

---

## Arquitectura y Solución Implementada

```
[Acción de Usuario / Error Provocado en Test]
               │
               ▼
[TallerViewComponent / AppFacade]
   ├─► Log seguro (console.error capturado en tests por spy)
   ├─► Define errorTitle contextual (ej: "Error en el Asistente IA")
   └─► Limpia y normaliza el mensaje de error para el usuario
               │
               ▼
[ErrorModalComponent (Rediseñado)]
   ├─► Fondo con desenfoque suave (backdrop-filter: blur(4px))
   ├─► Badge circular con icono de advertencia estilizado (#fee2e2 / #ef4444)
   ├─► Título contextual dinámico: {{ title() }}
   ├─► Contenedor estilizado con borde rojo suave y scroll automático
   └─► Botón principal de acción al 100% de ancho con feedback visual
```

---

## Archivos Modificados

1. [frontend/src/app/components/error-modal.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/components/error-modal.component.ts):
   - Se añadió el input configurable `title = input<string>('Ha ocurrido un error')`.
   - Se modernizó el diseño visual: badge circular para el icono SVG, tipografía de jerarquía moderna, contenedor con fondo sutil `#f8fafc` y botón con ancho completo y transición suave.

2. [frontend/src/app/app.facade.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/app.facade.ts):
   - Se incorporó la señal `errorTitle = signal<string>('Ha ocurrido un error')`.
   - Se contextualizaron los títulos al disparar errores desde notificaciones SSE (`"Error en la Generación"`), al solicitar generación (`"Error al Iniciar Generación"`) o al borrar proyectos (`"Error al Borrar Proyecto"`).

3. [frontend/src/app/app.html](file:///Users/csgj/dev/pai-app/frontend/src/app/app.html):
   - Se enlazó la propiedad `[title]="appFacade.errorTitle()"` al invocar `<app-error-modal>`.

4. [frontend/src/app/features/taller/components/taller-view/taller-view.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.ts):
   - Al fallar el Asistente IA, ahora se asigna el título contextual `"Error en el Asistente IA"` (o `"Error a l'Assistent IA"` en catalán) y se formatea el mensaje de forma amigable.

5. [frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts):
   - Se añadió `vi.spyOn(console, 'error')` en el test de variantes de error de reescritura, eliminando la polución de `stderr` en Vitest y verificando además que `errorTitle` se asigne correctamente.

6. [frontend/src/app/components/error-modal.component.spec.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/components/error-modal.component.spec.ts) y [frontend/src/app/app.spec.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/app.spec.ts):
   - Se actualizaron los tests unitarios para validar la nueva propiedad `title` y la integridad de los mocks de fachada.

---

## Verificación
- **Salida de Vitest:** `npx ng test --include=src/app/features/taller/components/taller-view/taller-view.component.spec.ts` corre 36/36 tests sin emitir trazas de `Direct error` por `stderr`.
- **Suite completa:** `npm test` corre 27 suites con 289 tests pasando al 100% y cobertura global superior al 99% de líneas y 94% de ramas, superando todos los umbrales de control.
