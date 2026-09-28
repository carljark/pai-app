# 127 – Skeleton Loader para el Mapa Intermodular

## Propósito

Mejorar la experiencia de usuario (UX) del **Mapa Intermodular** mostrando un indicador visual de carga mientras se obtienen los datos de la API REST (`GET /api/mapa-intermodular?tab=...`). En lugar de mostrar una pantalla en blanco, se muestra un componente de "skeleton" con animación shimmer y el texto "Cargando datos..." (ES) / "Carregant dades..." (CA).

Se ha creado el componente `SkeletonLoaderComponent` como un **componente compartido reutilizable** que puede emplearse en cualquier otra sección de la app que requiera un estado de carga (Generador, Historial, Vista Personal, etc.).

---

## Arquitectura / Flujo

```
Usuario navega a /mapa  →  MapaIntermodularViewComponent
                               │
                               ├─ facade.isLoadingSeed() = true  →  <app-skeleton-loader [lines]="6" [text]="trans.t().loadingData" />
                               │                                        └─ animación shimmer, texto bilingüe
                               │
                               └─ facade.isLoadingSeed() = false →  <div class="mapa-vertical-accordions"> ... contenido completo ...
```

**`isLoadingSeed`** ya existía como `signal<boolean>(false)` en `MapaIntermodularFacade`. Se pone a `true` justo antes de llamar a la API y a `false` tras la respuesta (éxito o error).

---

## Archivos Modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `frontend/src/app/components/skeleton-loader/skeleton-loader.component.ts` | **CREADO** | Componente standalone con inputs `lines: number` y `text: string` |
| `frontend/src/app/components/skeleton-loader/skeleton-loader.component.html` | **CREADO** | Template con `@for` sobre `lineArray`, texto condicional, `aria-label` |
| `frontend/src/app/components/skeleton-loader/skeleton-loader.component.scss` | **CREADO** | Animación `@keyframes shimmer`, clases `.skeleton-line--short/.medium` para variedad visual |
| `frontend/src/app/components/skeleton-loader/skeleton-loader.component.spec.ts` | **CREADO** | 8 tests: render por defecto, inputs, texto condicional, aria-label |
| `frontend/src/app/services/translations.es.ts` | **MODIFICADO** | Añadida clave `loadingData: 'Cargando datos...'` |
| `frontend/src/app/services/translations.ca.ts` | **MODIFICADO** | Añadida clave `loadingData: 'Carregant dades...'` |
| `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.ts` | **MODIFICADO** | Import + declaración `SkeletonLoaderComponent` en el decorador `imports` |
| `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html` | **MODIFICADO** | Bloque `@if (facade.isLoadingSeed())` con skeleton / `@else` con contenido |
| `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.scss` | **MODIFICADO** | Añadida clase `.mapa-loading-skeleton` (padding + centrado) |
| `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.spec.ts` | **MODIFICADO** | 2 tests nuevos: skeleton visible/oculto según `isLoadingSeed` |

---

## Detalles Técnicos

### SkeletonLoaderComponent

- **Standalone** Angular 17+, usa `CommonModule` para poder usar `@for` (aunque en standalone se puede usar `NgFor` directamente; se usa CommonModule para compatibilidad).
- **Inputs** declarados con la nueva API `input()` signal-based de Angular 17 (no `@Input` decorator):
  - `lines = input<number>(4)` — número de barras placeholder
  - `text = input<string>('')` — texto descriptivo (bilingüe, lo pasa el padre)
- **`lineArray` getter** devuelve `Array.from({ length: this.lines() }, ...)` para usar en el `@for`.
- **SCSS shimmer**: usa `linear-gradient` con `background-size: 1200px` y `animation: shimmer 1.6s infinite linear`. Usa CSS custom properties (`--border-color`, `--bg-hover`) del design system para compatibilidad automática con modo oscuro/claro.
- **Accesibilidad**: `role="status"` y `[attr.aria-label]` con fallback a "Carregant..." si no hay texto.

### Integración en Mapa Intermodular View

El bloque `@if/@else` en el template envuelve el **contenido de los 3 acordeones** (Paso 1, 2, 3). El header del mapa (tabs, título, estadísticas) se mantiene visible durante la carga para que el usuario no pierda contexto de navegación.

### Bilingüismo

La clave `trans.t().loadingData` se traduce automáticamente:
- ES → `"Cargando datos..."`
- CA → `"Carregant dades..."`

El componente `TranslationService` ya gestiona el cambio reactivo mediante señales, por lo que el texto se actualiza al vuelo si el usuario cambia el idioma durante la carga.

### Reutilización futura

El `SkeletonLoaderComponent` se ubica en `frontend/src/app/components/` (carpeta de componentes compartidos). Para usarlo en otra vista:

```ts
// En el componente destino:
import { SkeletonLoaderComponent } from '../../../../components/skeleton-loader/skeleton-loader.component';
// Añadir a imports: [SkeletonLoaderComponent]
```

```html
<!-- En el template: -->
<app-skeleton-loader [lines]="4" [text]="trans.t().loadingData" />
```
