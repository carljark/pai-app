# Tarea 230: quitar el origen de las fichas de afinidades de la ESO

## Propósito

Las fichas del mapa de afinidades de la ESO mostraban una etiqueta «Documento del centro» o «Ampliación» según su campo `origen`. Primero se quitó la etiqueta de la vista (commit `342363f`, en la rama de la tarea 229) y, en esta tarea, se elimina también el campo de los datos para que no quede información sin uso.

## Cambios

- **Datos:** se quita `"origen"` de las 125 fichas de `backend/src/data/afinidades-eso/afinidades_eso_{1,2,3,4}.json` (21, 29, 37 y 38 fichas). El resto del contenido no cambia.
- **Modelos:** se elimina el campo de `AfinidadEsoData` y del esquema Mongoose (`backend/src/models/AfinidadEso.ts`) y del modelo del frontend (`afinidad-eso.model.ts`).
- **Migración `38_quitar_origen_afinidades_eso.ts`:** `$unset` de `origen` en la colección `afinidadesos`. Usa la colección nativa porque el esquema ya no declara el campo. Es idempotente y no toca ningún otro campo. La migración 25 no se modifica ni se reejecuta: en una base nueva ya carga los JSON sin el campo.
- **Tests:** el test de datos comprueba que ninguna ficha tiene `origen`; hay un test nuevo de la migración 38 (elimina el campo y se puede reejecutar); se limpian los mocks del frontend y del backend.
- **Documentación:** `documentation/mapa_afinidades_eso.md` y la skill `agregar-ciclo-educativo` (las fichas nuevas ya no llevan `origen`).
