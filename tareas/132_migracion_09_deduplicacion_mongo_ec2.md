# 132 — Automatización de Migración 09 para Deduplicación de Actividades en MongoDB (EC2 / Producción)

## Propósito

El usuario reportó que, tras desplegar y construir en la instancia EC2 de producción, continuaban apareciendo más de 10.000 *"Actividades Innovadoras"* en los ciclos de Peluquería. Se solicitó revisar el sistema de migraciones para verificar por qué no se estaban ejecutando automáticamente al hacer el despliegue/build en EC2.

---

## Causa Raíz

En el servidor de producción (EC2):
1. **Persistencia del volumen de base de datos:** MongoDB persiste sus datos en el volumen host `./mongo_data:/data/db`.
2. **Registro previo de la migración 08:** La migración original `08_ingest_mapa_intermodular.ts` ya se había ejecutado una vez durante el despliegue anterior de la tarea 126, registrando `{ name: '08_ingest_mapa_intermodular' }` en la colección `migrations`.
3. **Mecanismo de omisión del runner (`runner.ts`):**
   ```typescript
   const exists = await Migration.findOne({ name: migrationName });
   if (!exists) { ... }
   ```
   Al reiniciar los contenedores en EC2 tras un nuevo build, el motor de migraciones detectaba que `08_ingest_mapa_intermodular` ya existía en la base de datos, por lo que **la omitía por completo** (`[SKIP]`).
4. **Ausencia de nueva migración versionada:** Como no existía un archivo de migración posterior (ej. `09_...`), el MongoDB de EC2 nunca ejecutaba el reemplazo con los ficheros JSON deduplicados y seguía sirviendo los documentos antiguos con 13.212 y 11.055 actividades.
5. **Doble motor de migraciones en el backend:**
   - `scripts/migrate.ts`: Ejecutado por `npm run prestart` antes de `npm start`, buscando en `backend/migrations/`.
   - `src/migrations/runner.ts`: Ejecutado por `src/server.ts` al arrancar Express y conectar a Mongoose, buscando en `backend/src/migrations/`.

---

## Solución Técnica

Para garantizar que **tanto en local como en EC2** (independientemente del runner que se invoque) la deduplicación se aplique de forma 100% automática y desatendida al arrancar los contenedores:

### 1. Creación de `backend/src/migrations/09_deduplicate_mapa_peluqueria.ts`
- Registrado para el runner principal de `server.ts` (`src/migrations/runner.ts`).
- Al desplegar en EC2, el runner comprueba `Migration.findOne({ name: '09_deduplicate_mapa_peluqueria' })`. Al no existir en la base de datos de producción, **se ejecutará inmediatamente**.
- Carga los datasets `mapa_cfgm_peluqueria.json` y `mapa_cfgm_peluqueria_2.json`, aplica el algoritmo determinista de deduplicación por RA (conservando la primera aparición y vaciando las redundancias), elimina las colecciones anteriores de esos dos tabs y reinserta los documentos limpios en `pai_db`.
- Registra el nombre `09_deduplicate_mapa_peluqueria` en MongoDB para no repetirse en arranques posteriores.

### 2. Creación de `backend/migrations/04_deduplicate_mapa_peluqueria.ts`
- Registrado para el runner secundario `scripts/migrate.ts` (invocado en el paso `prestart` de npm).
- Garantiza cobertura redundante en caso de que se ejecuten comandos manuales como `npm run migrate` en el host o en el contenedor.

---

## Archivos Modificados y Creados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| [`backend/src/migrations/09_deduplicate_mapa_peluqueria.ts`](file:///Users/csgj/dev/pai-app/backend/src/migrations/09_deduplicate_mapa_peluqueria.ts) | **CREADO** | Nueva migración 09 para actualizar y deduplicar las actividades de Peluquería 1º y 2º en MongoDB al iniciar `server.ts`. |
| [`backend/migrations/04_deduplicate_mapa_peluqueria.ts`](file:///Users/csgj/dev/pai-app/backend/migrations/04_deduplicate_mapa_peluqueria.ts) | **CREADO** | Nueva migración 04 compatible con `scripts/migrate.ts` (`prestart`). |
| [`backend/src/tests/mapa.test.ts`](file:///Users/csgj/dev/pai-app/backend/src/tests/mapa.test.ts) | **MODIFICADO** | Añadido bloque de prueba unitaria para validar la ejecución de la migración 09 y verificar que las actividades queden exactamente en 557 (1º) y 417 (2º). |
| [`tareas/132_migracion_09_deduplicacion_mongo_ec2.md`](file:///Users/csgj/dev/pai-app/tareas/132_migracion_09_deduplicacion_mongo_ec2.md) | **CREADO** | Este documento de diseño técnico. |

---

## Verificación

1. **Prueba de `npm run migrate` (`scripts/migrate.ts`):**
   ```text
   [START] Ejecutando migración: 04_deduplicate_mapa_peluqueria.ts...
   ✅ Tab CFGM_PELUQUERIA: 8 módulos guardados en MongoDB (557 -> 557 actividades).
   ✅ Tab CFGM_PELUQUERIA_2: 8 módulos guardados en MongoDB (417 -> 417 actividades).
   [DONE] Migración 04_deduplicate_mapa_peluqueria.ts completada exitosamente.
   ```
2. **Prueba de `src/migrations/runner.ts` (`server.ts`):**
   ```text
   Ejecutando migración: 09_deduplicate_mapa_peluqueria
   ✅ Tab CFGM_PELUQUERIA: 8 módulos guardados en MongoDB (557 -> 557 actividades).
   ✅ Tab CFGM_PELUQUERIA_2: 8 módulos guardados en MongoDB (417 -> 417 actividades).
   ✅ Migración 09_deduplicate_mapa_peluqueria completada.
   ```
3. **Tests unitarios del backend (`mapa.test.ts`):**
   - 6 tests pasados (100%), incluyendo la verificación exhaustiva de la migración 09.
