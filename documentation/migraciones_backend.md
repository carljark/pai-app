# Migraciones de datos del backend

## Resumen

El backend aplica migraciones de MongoDB con un único runner: `backend/src/migrations/runner.ts`. Cada migración es un módulo TypeScript que exporta `up()`. Las que ya se han ejecutado quedan registradas en la colección `migrations` (modelo `backend/src/models/Migration.ts`) y no vuelven a ejecutarse.

## Carpetas y nombres registrados

| Carpeta | Contenido | Nombre registrado | Estado |
| --- | --- | --- | --- |
| `backend/src/migrations/legacy/` | Migraciones que antes vivían en `backend/migrations/` y ejecutaba `scripts/migrate.ts` | Nombre de archivo **con** `.ts` (p. ej. `04_deduplicate_mapa_peluqueria.ts`) | Congelada |
| `backend/src/migrations/` | Migraciones actuales (`NN_descripcion.ts`) | Nombre **sin** `.ts` (p. ej. `09_deduplicate_mapa_peluqueria`) | Activa |

Las dos convenciones de nombre vienen de los dos runners que existían antes de unificarlos. Se conservan para que las bases de datos ya migradas (local y EC2) no reejecuten nada. Por eso:

- No se añaden ni se renombran archivos en `legacy/`.
- Las migraciones nuevas van en `backend/src/migrations/` con el siguiente número secuencial de dos dígitos. El scaffold de la skill `agregar-fp` lo calcula solo.
- Dentro de cada carpeta el orden es lexicográfico. `legacy/` mezcla `001_`/`002_` con `01_`…`06_` y se mantiene tal cual.

## Cuándo se ejecutan

1. **Antes de arrancar** (`npm run dev` / `npm start`): los hooks `predev`/`prestart` lanzan `npm run migrate` (`backend/scripts/migrate.ts`). El script conecta, llama a `runMigrations()` y termina. Así las migraciones se completan antes de que el servidor atienda peticiones.
2. **Al conectar el servidor** (`backend/src/server.ts`): se vuelve a llamar a `runMigrations()` antes de iniciar la cola de generación. Si ya se ejecutaron en el paso anterior, no hay nada pendiente.

Si una migración falla, el proceso termina con código 1 y no continúa con las siguientes.

## Pruebas

`backend/vitest.config.ts` excluye `src/migrations/**` de la cobertura. Los tests (`src/tests/migrations.test.ts`, `src/tests/mapa.test.ts`) importan y ejecutan migraciones concretas contra `mongodb-memory-server`.
