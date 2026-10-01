# Extracción de plantilla y estilos de CurriculumSelector

## Propósito
Separar la plantilla y los estilos del componente `CurriculumSelectorComponent` de su archivo TypeScript, facilitando su mantenimiento y evitando estilos estáticos inline.

## Arquitectura y flujo
El decorador Angular referencia `curriculum-selector.component.html` y `curriculum-selector.component.scss`. La plantilla conserva las expresiones, eventos, inputs/outputs y bloques de control Angular. Las reglas de presentación estáticas se trasladaron al SCSS del componente; el hover de los elementos de selección ahora se aplica mediante `:hover`.

## Archivos modificados
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.ts`: referencias a los recursos externos.
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.html`: plantilla externa y clases semánticas.
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.scss`: estilos locales y animación de carga.

## Decisiones técnicas
- Se conservaron los bindings dinámicos `[style.background]` y `[style.color]` para los colores de categoría calculados por `CurriculumFacade`.
- Los estilos estáticos usan la paleta corporativa de `frontend/src/styles/_variables.scss`.
- No se ejecutaron tests ni build, conforme a `AGENTS.md`.
