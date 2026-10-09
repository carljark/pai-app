# Tarea 215: tsconfig del backend y typecheck a cero errores

## Propósito

El `backend/tsconfig.json` era la plantilla de `tsc --init` sin adaptar, y `tsc --noEmit` daba **651 errores**. Por eso el typecheck no servía de nada: el backend se ejecuta con `tsx`, que no comprueba tipos, y los errores reales pasaban inadvertidos.

## Problemas del tsconfig anterior

- `"types": []`: no cargaba `@types/node` ni los globales de Vitest (aparecían cientos de «Cannot find module 'fs'» y similares).
- `"module": "nodenext"`: exige extensiones en los imports relativos, pero el código importa sin extensión, como permite `tsx` (240 errores TS2835).
- Sin `include`: incluía los scripts sueltos de la raíz del backend (`scratch_controller.ts`, `run_mig3.ts`…) y `scripts/`.
- Opciones de emisión irrelevantes (`declaration`, `sourceMap`, `jsx: react-jsx`), cuando no hay paso de build.

## Nueva configuración

- `module: esnext` + `moduleResolution: bundler`: coincide con la resolución de `tsx`.
- `types: ["node", "vitest/globals"]`, `lib: ["esnext"]`, `resolveJsonModule`, `esModuleInterop` y `noEmit`.
- Se mantienen las opciones estrictas (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`).
- `include: src/**/*.ts` y `vitest.config.ts`; `exclude: src/migrations/legacy` (congelada, no se edita).
- Nuevo script `npm run typecheck` (`tsc --noEmit`).

## Errores reales corregidos (45 tras el cambio de configuración)

- **Bug funcional:** `project.controller.ts` pasaba `selectedRas` a `buildContexts`, pero `ExampleCriteria` espera `ras`. Los RA seleccionados se ignoraban al elegir los ejemplos INTEF relevantes. Ahora se pasa `ras: selectedRas`.
- `html-to-docx` no tiene tipos: se añade la declaración mínima `src/types/html-to-docx.d.ts`.
- `exactOptionalPropertyTypes`: se añade `| undefined` a las propiedades opcionales de `NotificationExtra`, `AiGenerationResult` y `SingleAiResult`. El backfill de notificaciones usa `?? null`.
- `noUncheckedIndexedAccess`: aserciones `!` donde el índice está acotado por el bucle (`modelsToTry[i]`, `order[i]`, `mongoose.models.RA`).
- `EXPORTABLE_STATUSES` se tipa con los estados del enum de `Project`, y `req.params.id` se tipa como `string` en multer.
- `MapaModule.learningOutcomes`: `[{ type: Schema.Types.Mixed }]`, equivalente en Mongoose a `[Schema.Types.Mixed]` pero aceptado por los tipos.
- Tests: tipados puntuales (`any` en callbacks y helpers, `!` en accesos indexados). `clearDB` recorre `Object.values(collections)`.

No hay cambios de comportamiento, salvo la corrección del bug de `selectedRas`.

## Verificación

- `npm run typecheck`: 0 errores.
- `backend`: 381 tests en verde. `frontend`: suite completa en verde con los umbrales de cobertura cumplidos.
