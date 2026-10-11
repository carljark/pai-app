# Tarea 222: mapa intermodular plegado al abrir

## Propósito

Al abrir el mapa intermodular de un ciclo de FP, los pasos «Módulos» y «Resultados de aprendizaje» aparecían desplegados y ocupaban la pantalla. Deben mostrarse plegados.

## Cambios

- `MapaIntermodularViewComponent`: `step1Open` y `step2Open` se inicializan a `false`. El paso 3 (conexiones) mantiene su estado inicial.
- Al elegir un módulo (`onSelectModule`) se despliega el paso 2 para mostrar sus RA, del mismo modo que elegir un RA ya desplegaba los pasos 2 y 3.
- La vista se monta con `@if` en `app.html`, por lo que se crea de nuevo en cada apertura del mapa y siempre parte del estado plegado.

## Archivos

- `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.{ts,spec.ts}`

## Verificación

- Frontend: lint, typecheck y `npm test` (869 tests, umbrales de cobertura cumplidos), con test del estado inicial plegado y del despliegue al elegir módulo.
