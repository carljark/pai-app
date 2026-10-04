# 194 · Selector de ciclo y curso en el mapa intermodular

## Propósito

El mapa intermodular mostraba una pestaña por cada combinación de ciclo y curso: 6 botones en una fila sin salto de línea, con nombres largos como «CFGM Peluquería y Cosmética Capilar 1º». En el móvil se desbordaba, y cada ciclo nuevo de dos cursos añade dos pestañas más.

## Diseño

La pestaña mezclaba dos dimensiones. Ahora se separan:

- **Ciclo:** un desplegable (`select.form-select`). En el móvil abre el selector nativo, admite nombres largos y crece sin romper el diseño.
- **Curso:** un control segmentado (1.º / 2.º en castellano, 1r / 2n en catalán) que **solo aparece si el ciclo tiene dos cursos**. En FPB y Estética no se muestra.
- **Al cambiar de ciclo** se conserva el curso actual si el ciclo nuevo lo tiene; si no, se elige el primero.
- **Distribución:** en el móvil el desplegable ocupa todo el ancho y el curso queda debajo. A partir del breakpoint `sm` (mixin `mq`, mobile-first) los dos controles van en la misma fila y el desplegable tiene un máximo de 28rem.
- **Accesibilidad:** cada control tiene etiqueta visible. Los botones de curso usan `aria-pressed`, el grupo está etiquetado con `aria-labelledby` y el foco es visible.
- **Estilos:** BEM con el bloque `.mapa-tabs` y variables de `_variables.scss`.

## Implementación

- **Sin cambios en backend, datos ni migraciones:** los identificadores de pestaña (`CFGS_EDUCACION_INFANTIL`, `CFGS_EDUCACION_INFANTIL_2`…) y la fachada no cambian.
- `services/mapa-tabs.config.ts`:
  - nuevos campos `ciclo_es`/`ciclo_ca`, el nombre del ciclo sin el curso;
  - nuevo `MAPA_CICLOS`, que agrupa las pestañas por `tipoNivel` en el orden de `MAPA_TABS`.
- `components/ui/tabs/`: el componente `app-mapa-tabs` conserva su API (`activeTab` y `tabChange`) y deriva el ciclo activo y sus cursos con `computed`.
- `mapa-intermodular-view.component.spec.ts`: el test cambia el ciclo desde el `select` real y pulsa los botones de curso del DOM. Comprueba también los textos en catalán, que se conserve el curso al cambiar de ciclo, la ausencia de selector de curso en ciclos de un solo curso y que un valor desconocido no cambie la pestaña.

## Verificación

- ESLint, `ngc` y `tsc` del spec sin errores.
- `npm test` del frontend en verde, con los umbrales de cobertura y la comprobación zoneless.
- Revisión visual con Playwright a 390 px y a 1280 px.
