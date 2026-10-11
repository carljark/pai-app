# Tarea 222: mapa intermodular plegado al abrir

## Propósito

Al abrir el mapa intermodular de un ciclo de FP, los pasos «Módulos», «Resultados de aprendizaje» y «Conexiones intermodulares coincidentes» (los RA de otros módulos relacionados con el RA preseleccionado del curso) aparecían desplegados y ocupaban la pantalla. Deben mostrarse todos plegados.

## Cambios

- `MapaIntermodularViewComponent`: `step1Open`, `step2Open` y `step3Open` se inicializan a `false`. En una primera versión el paso 3 quedó desplegado y era lo que seguía viéndose al entrar; se pliega también. El módulo y el RA predeterminados de cada curso (`niveles.mapaTab`) siguen preseleccionados.
- Al elegir un módulo (`onSelectModule`) se despliega el paso 2 para mostrar sus RA, del mismo modo que elegir un RA ya desplegaba los pasos 2 y 3.
- La vista se monta con `@if` en `app.html`, por lo que se crea de nuevo en cada apertura del mapa y siempre parte del estado plegado.

- Al entrar en otro curso o ciclo desde las pestañas del mapa (`setTab` de la vista), los tres pasos vuelven a plegarse. Antes la vista conservaba el estado del curso anterior, porque no se recrea al cambiar de pestaña.

## Archivos

- `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.{ts,spec.ts}`

## Verificación

- Frontend: lint, typecheck y `npm test` (870 tests, umbrales de cobertura cumplidos), con tests del estado inicial plegado, del plegado al cambiar de curso y del despliegue al elegir módulo.
