# 107 — Corrección de Carga y Visualización de Módulos del CFGM Estètica i Bellesa en Nuevo Proyecto

## Propósito

Solucionar el problema por el cual no se visualizaban los módulos (asignaturas) y Resultados de Aprendizaje (RA) al seleccionar la pestaña **“CFGM Estètica i Bellesa”** en el apartado de **“Nuevo proyecto”** (`generator-view`).

---

## Causa Raíz

1. **Migración backend dependiente de fichero temporal:** La migración anterior `04_ingest_cfgm_estetica_ras.ts` intentaba leer un archivo volátil `ras_cfgm_estetica.json` en `process.cwd()`. Al ser eliminado dicho archivo auxiliar, la migración se saltaba silenciosamente y la colección `ras` de MongoDB quedó con **0 documentos** con `tipoNivel: 'CFGM_ESTETICA'`.
2. **Filtrado estricto en frontend sin fallback:** En `CurriculumFacade`, `groupedItems` filtraba `ra.tipoNivel === this.tipoNivel()`. Al devolver la API un array vacío para dicho nivel, `groupedItems()` devolvía un array vacío y no se renderizaba ningún acordeón de módulos.
3. **Mapeos de traducción ausentes:** Faltaban las traducciones bidireccionales de los 9 módulos de CFGM en `caToEsModules` y `esToCaModules` dentro de `curriculum.controller.ts`.

---

## Arquitectura y Solución Implementada

```
[enumeracio_moduls_estetica_bellesa_1r_RA_CE.md]
                     │
                     ▼
  [backend/src/data/ras_cfgm_estetica.data.ts] ──► [backend/src/migrations/04_ingest_cfgm_estetica_ras.ts]
  [frontend/src/app/.../ras_cfgm_estetica.data.ts]                 │ (Ejecutada en MongoDB local)
                     │                                             ▼
                     │                                  [MongoDB: pai_db.ras] (52 RAs)
                     │                                             │
                     ▼                                             ▼
       [curriculum.facade.ts]  ◄──────────────────────────  [/api/ras?lang=...]
           ├── Fallback automático si la API no devuelve datos de CFGM
           ├── Prefijado oficial del código de módulo ("0633. Tècniques...")
           └── Ordenación estricta según normativa oficial (0633 -> 0156)
                     │
                     ▼
       [generator-view / curriculum-selector]
           └── Visualización de los 9 módulos con sus 52 RAs y criterios oficiales
```

---

## Archivos Modificados y Creados

| Archivo | Acción | Descripción |
|---|---|---|
| `backend/src/data/ras_cfgm_estetica.data.ts` | Creado | Fuente de datos TypeScript tipada y autocontenida con los 52 RAs y criterios de los 9 módulos de 1r curso en catalán y castellano. |
| `frontend/src/app/features/curriculum/data/ras_cfgm_estetica.data.ts` | Creado | Fuente de datos para el frontend, permitiendo resiliencia offline y fallback instantáneo en `generator-view`. |
| `backend/src/migrations/04_ingest_cfgm_estetica_ras.ts` | Modificado | Actualizada para importar directamente `CFGM_ESTETICA_RAS_DATA` sin depender de ficheros JSON volátiles en el filesystem. |
| `backend/src/controllers/curriculum.controller.ts` | Modificado | Añadidos los 9 módulos del CFGM a las tablas de traducción bilingüe `caToEsModules` y `esToCaModules`. |
| `frontend/src/app/features/curriculum/services/curriculum.facade.ts` | Modificado | Añadida interfaz `GroupedCurriculumItem`, fallback resiliente de datos para `CFGM_ESTETICA`, formateo con código de módulo y ordenación estricta `CFGM_MODULE_ORDER`. |
| `frontend/src/app/features/curriculum/services/curriculum.facade.spec.ts` | Modificado | Añadidos tests unitarios que verifican la agrupación, ordenación, persistencia y fallback para `CFGM_ESTETICA`. |

---

## Verificación de Módulos Disponibles en 1r Curso

Los 9 módulos aparecen ordenados exactamente como exige el currículo oficial:

1. **0633. Tècniques d’higiene facial i corporal** (6 RAs, 42 criterios)
2. **0635. Depilació mecànica i decoloració del borrissol** (6 RAs, 57 criterios)
3. **0636. Estètica de mans i peus** (5 RAs, 37 criterios)
4. **0638. Anàlisi estètica** (6 RAs, 42 criterios)
5. **0640. Imatge corporal i hàbits saludables** (6 RAs, 51 criterios)
6. **0641. Cosmetologia per a estètica i bellesa** (8 RAs, 66 criterios)
7. **1664. Digitalització aplicada als sectors productius** (5 RAs, 33 criterios)
8. **1709. Itinerari personal per a l’ocupabilitat I** (5 RAs, 39 criterios)
9. **0156. Anglès professional** (5 RAs, 46 criterios)

**Total:** 52 RAs y 413 criterios de evaluación bilingües.

---

## Resultados de Tests

- **Frontend:** 376/376 tests pasados con branch coverage >90%.
- **Backend:** 120/120 tests pasados.
