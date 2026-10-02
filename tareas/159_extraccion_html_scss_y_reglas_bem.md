# Tarea 159: Extracción de plantillas/estilos a ficheros propios y convención BEM

## Propósito

Separar el HTML y el SCSS del componente `history-view` (y de la tarjeta `history-project-card`) a ficheros propios, y establecer en `AGENTS.md` dos reglas: vistas/estilos siempre en archivos externos y estilos bajo convención BEM.

## Cambios

### Componentes
- `history-view`:
  - `history-view.component.ts`: pasa a `templateUrl`/`styleUrls` (sin `template:`/`styles:`).
  - `history-view.component.html` (**nuevo**): plantilla con clases BEM.
  - `history-view.component.scss` (**nuevo**): estilos con BEM (`&__`, `&--`), sin estilos inline.
- `history-project-card`:
  - `history-project-card.component.ts`: pasa a `templateUrl`/`styleUrls`.
  - `history-project-card.component.html` (**nuevo**): plantilla BEM.
  - `history-project-card.component.scss` (**nuevo**): estilos BEM usando la paleta corporativa (`--c-*`).

### Clases BEM resultantes
- `.history-view`, `.history-view__header`, `.history-view__title`, `.history-view__toolbar`, `.history-view__scope-pills`, `.history-view__pill(--active)`, `.history-view__search(-icon/-input)`, `.history-view__filters`, `.history-view__filter-label`, `.history-view__select`, `.history-view__results`, `.history-view__tabs`, `.history-view__tab(--active)`, `.history-view__list`, `.history-view__empty`.
- `.history-project-card`, `.history-project-card__main/title-row/title/meta-row/meta/tag(--mine/--shared/--ai/--time/--soft)/participants/error/actions/retry/view-error/delete/share-toggle/share/share-title/share-list/share-option/share-email/share-empty`.

### Documentación
- `AGENTS.md` (sección 5): dos reglas nuevas:
  1. Plantillas y estilos siempre en archivos propios (`templateUrl`, `styleUrls`/`styleUrl`); prohibido `template:`/`styles:`.
  2. Estilos con convención BEM.

### Tests
- `history-view.component.spec.ts`: actualizado el selector de pestañas a `.history-view__tab`.

## Verificación

El dev server de Angular recompila correctamente. No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).
