# Restauración de Estilos - Mapa Intermodular

## Fecha
2026-09-30

## Resumen
Tras la refactorización a Arquitectura Hexagonal del módulo `mapa-intermodular` (ver `refactorizacion_arquitectura_hexagonal.md`), los estilos de la vista se perdieron: solo el componente `tabs` recibió su propio `.scss`, mientras que el resto de reglas permanecieron en `mapa-intermodular-view.component.scss`. Debido a la encapsulación de estilos de Angular (*emulated*), los estilos del componente padre **no alcanzan los elementos internos de los componentes hijos**, por lo que la página se renderizaba sin estilos.

Adicionalmente, el archivo `mapa-intermodular-view.component.html` había quedado huérfano (código muerto de la versión monolítica). El componente padre usa una plantilla *inline* que únicamente compone los componentes hijos.

## Causa Raíz

1. El commit `43ead71` ("hexagonal mapa-intermodular") dividió la página monolítica en 7 componentes hijos.
2. **Solo `tabs` tenía `.scss` propio.** El resto de componentes no referenciaban ningún `styleUrl`, así que clases como `.mapa-header`, `.mapa-step-header`, `.mapa-module-card`, `.mapa-criterion-pill`, `.mapa-connection-card`, etc. no se aplicaban.
3. Aunque el padre sí tenía `styleUrl`, la encapsulación de Angular impide que sus reglas lleguen al interior de los componentes hijos.
4. `mapa-intermodular-view.component.html` ya no era el template (el padre usa `template` inline), por lo que sus estilos tampoco se aplicaban.

## Cambios Realizados

### 1. Partial de estilos compartidos
**Archivo creado:** `frontend/src/app/features/mapa-intermodular/components/ui/_step-shared.scss`

Contiene los estilos comunes de los tres acordeones verticales (Pasos 1/2/3), evitando duplicación:

- `.mapa-step-header` (incluye variantes sticky `--1`, `--2`, `--3`, y `&.open`)
- `.mapa-step-toggle-btn`, `.mapa-step-chevron`, `.mapa-step-title`
- `.mapa-step-count-badge`, `.mapa-step-subtitle-hint`, `.mapa-step-pill-tag`
- `.mapa-step-body` (+ `&.collapsed`)
- `.mapa-active-criterion-badge`, `.mapa-btn-action` (`--primary`, `--sm`)
- `.mapa-empty-state`

Se importa con `@use '../step-shared';` desde cada componente que lo necesita.

### 2. Estilos por componente hijo
**Archivos creados:**

| Componente | Archivo SCSS | Contenido principal |
|-----------|--------------|---------------------|
| `MapaHeaderComponent` | `header/header.component.scss` | `.mapa-header`, `.mapa-controls`, `.mapa-search`, `.filter-pill`, `.mapa-stats-toggle-btn`, `.mapa-stats*` |
| `ModuloListComponent` | `modulo-list/modulo-list.component.scss` | `@use ../step-shared` + `.mapa-step-body--1`, `.mapa-modules-list`, `.mapa-module-*`, `.mapa-ra-*`, `.mapa-badge-code` |
| `RaDetailComponent` | `ra-detail/ra-detail.component.scss` | `@use ../step-shared` + `.mapa-step-body--2`, `.mapa-active-ra-*`, `.mapa-pill-primary`, criterios (`.mapa-criterion-pill`, `.mapa-crit-*`) |
| `ConnectionsListComponent` | `connections-list/connections-list.component.scss` | `@use ../step-shared` + `.mapa-connection-card`, `.mapa-conn-*`, `.mapa-relation-type-tag`/`.tag-*`, `.mapa-criteria-breakdown`, `.mapa-related-*`, `.mapa-justification-box` |
| `ActivitiesGridComponent` | `activities-grid/activities-grid.component.scss` | `.mapa-activities-*`, `.mapa-activity-item`, `.mapa-act-*`, `.mapa-meta-*` |
| `CriterionSelectorComponent` | `criterion-selector/criterion-selector.component.scss` | Selector de criterios (`.mapa-criterion-pill`, `.mapa-crit-*`) |
| `MapaTabsComponent` | `tabs/tabs.component.scss` | *(ya existía)* |

### 3. Wiring de los componentes
**Archivos modificados:** los `.ts` de cada componente hijo.

- Añadido `styleUrl` a cada componente (y `:host { display: contents; }` en los pasos, ver punto 6).
- **`tabs.component.ts`**: ahora usa `templateUrl: './tabs.component.html'` + `styleUrl: './tabs.component.scss'`, eliminando la plantilla inline con estilos hardcodeados.

### 4. Limpieza del SCSS del padre
**Archivo modificado:** `mapa-intermodular-view.component.scss`

Reducido a los estilos realmente usados por el contenedor:

- `:host { --mapa-step-header-h: 46px; }` (variable heredada por los hijos por herencia de *custom properties*)
- `.mapa-vertical-accordions`
- `.mapa-loading-skeleton`
- `.mapa-container`

El resto de reglas se movieron a los componentes hijos.

### 5. Eliminación de archivo huérfano
**Archivo eliminado:** `mapa-intermodular-view.component.html`

No tenía ninguna referencia (el componente padre usa plantilla inline). Se verificó que no existían referencias antes de borrarlo.

## Archivos

**Creados:**
1. `frontend/src/app/features/mapa-intermodular/components/ui/_step-shared.scss`
2. `frontend/src/app/features/mapa-intermodular/components/ui/header/header.component.scss`
3. `frontend/src/app/features/mapa-intermodular/components/ui/modulo-list/modulo-list.component.scss`
4. `frontend/src/app/features/mapa-intermodular/components/ui/ra-detail/ra-detail.component.scss`
5. `frontend/src/app/features/mapa-intermodular/components/ui/connections-list/connections-list.component.scss`
6. `frontend/src/app/features/mapa-intermodular/components/ui/activities-grid/activities-grid.component.scss`
7. `frontend/src/app/features/mapa-intermodular/components/ui/criterion-selector/criterion-selector.component.scss`

**Modificados:**
1. `.../mapa-intermodular-view/mapa-intermodular-view.component.scss`
2. `.../ui/tabs/tabs.component.ts`
3. `.../ui/header/header.component.ts`
4. `.../ui/modulo-list/modulo-list.component.ts`
5. `.../ui/ra-detail/ra-detail.component.ts`
6. `.../ui/connections-list/connections-list.component.ts`
7. `.../ui/activities-grid/activities-grid.component.ts`
8. `.../ui/criterion-selector/criterion-selector.component.ts`

**Eliminado:**
1. `.../mapa-intermodular-view/mapa-intermodular-view.component.html`

## Verificación

- `npm run build`: correcto (*Application bundle generation complete*).
- Los estilos quedan emitidos en el bundle (`.mapa-step-header`, `.mapa-header__title`, `.mapa-module-card`, `.mapa-criterion-pill`, `.mapa-connection-card`, `.mapa-activity-item`, `.mapa-tabs`, `.filter-pill`, etc.).
- Tests del feature: 3 archivos / 53 tests pasan.
- Suite completa: 35 archivos / 543 tests pasan + 1 *skipped* y *coverage thresholds met*.

## 6. Corrección del comportamiento "sticky" de los acordeones

### Problema
Tras repartir los estilos, los acordeones 1 y 2 no se quedaban fijos al hacer scroll vertical (el 3 sí parecía fijo). Causa: cada `.mapa-step-header` quedó dentro del *host* de su componente hijo (`app-modulo-list`, `app-ra-detail`, `app-connections-list`), que estaba como `display: block`. El *containing block* de un elemento `position: sticky` es su padre, y como cada host abarcaba solo su propio paso, la cabecera solo podía pegarse dentro de su región y desaparecía al salir de ella. El acordeón 3, al ser el último, parecía estable.

### Solución
Se cambió el `:host` de los tres pasos a `display: contents`, de modo que sus hijos (cabecera y cuerpo) pasan a ser ítems directos del contenedor `.mapa-vertical-accordions` (mismo *layout* que la versión monolítica, donde el sticky sí funcionaba). Así el *containing block* de cada cabecera abarca todos los pasos y el apilado de cabeceras (`top: 0`, `top: 46px`, `top: 92px`) funciona como se espera.

**Archivos modificados:**
1. `.../ui/modulo-list/modulo-list.component.scss`
2. `.../ui/ra-detail/ra-detail.component.scss`
3. `.../ui/connections-list/connections-list.component.scss`

## Notas
- La variable `--mapa-step-header-h` se define en el `:host` del padre y los hijos la heredan a través del DOM (las *custom properties* CSS se heredan aunque haya encapsulación de estilos).
- Se siguieron las convenciones del refactor: un `.scss` por componente, reutilizable y aislado.
