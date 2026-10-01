# Extracción de plantilla y estilos de GeneratorView

## Propósito
Separar el marcado HTML y las reglas de presentación del código TypeScript de `GeneratorViewComponent`, manteniendo su comportamiento y las opciones existentes.

## Arquitectura y flujo
El decorador Angular carga ahora la plantilla externa mediante `templateUrl` y el stylesheet local mediante `styleUrls`. La plantilla conserva las vinculaciones, directivas de control de flujo y eventos del componente. Los atributos de estilos inline se sustituyeron por clases locales en la plantilla y sus reglas equivalentes se trasladaron al SCSS del componente.

## Archivos modificados
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`: referencias `templateUrl` y `styleUrls`.
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.html`: plantilla externa y clases para los estilos trasladados.
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.scss`: estilos locales para disposición, márgenes, controles y etiqueta de instrucciones opcionales.

## Decisiones técnicas
- Se conservó el uso de estilos encapsulados por componente y SCSS.
- Los estilos de color reutilizan `$color-text-muted` desde `frontend/src/styles/_variables.scss`.
- No se modificó la lógica ni el comportamiento funcional del componente.
