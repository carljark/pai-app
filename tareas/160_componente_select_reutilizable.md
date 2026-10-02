# Tarea 160: Componente reutilizable `<app-select>`

## Propósito

Crear un componente de selección reutilizable que centralice el aspecto (flecha propia, bordes, foco, tamaños) y el comportamiento (`valueChange`), y migrar los selects de la aplicación.

## Componente

- `frontend/src/app/components/app-select/`:
  - `app-select.component.ts` (`AppSelectComponent`, standalone) con `templateUrl`/`styleUrls`.
  - `app-select.component.html`: control `<select>` con placeholder y opciones.
  - `app-select.component.scss`: estilos BEM (`.app-select`, `.app-select__label`, `.app-select__control`, `.app-select--sm`, `.app-select--disabled`).
- API:
  - inputs: `inputId`, `label`, `options: SelectOption[]`, `value`, `placeholder`, `size: 'sm' | 'md'`, `disabled`.
  - output: `valueChange: string`.
- La flecha es un SVG propio (`appearance: none` + `background-image`), a 16px y 12px del borde; variante `sm` más compacta (flecha a 8px).

## Migraciones

- **Generador** (`generator-view`): curso, metodología, motor IA y modelo. Se añaden `courseOptions`, `methodologyOptions`, `aiOptions` y `modelOptions`, y los handlers pasan a recibir `string`.
- **Taller** (`taller-view`): motor IA y modelo (variante `sm`).
- **Historial** (`history-view`): filtros de módulo y RA (variante `sm`), usando `placeholder` para «Todos…».

Se mantienen los `id` (`inputId`) de cada select para no romper tests ni etiquetas `for`.

## Limpieza

- Se elimina `.history-view__select` (duplicaba el estilo del select).
- Queda la clase global `.form-select` sin uso; podría retirarse más adelante.

## Tests

- `app-select.component.spec.ts` (**nuevo**): render de opciones/placeholder, emisión de `valueChange`, label y modificadores `sm`/`disabled`.
- Actualizados los handlers en los specs de taller e historial (ahora reciben `string`).
- El spec del generador sigue funcionando porque el `<select>` conserva su `id`.

## Verificación

El dev server de Angular recompila correctamente. No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).
