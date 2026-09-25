# Tarea 116: Traducción y Corrección Integral al Catalán de RAs, Actividades y Conexiones en el Mapa Intermodular

## Propósito
Garantizar una experiencia bilingüe rigurosa, natural y coherente en el **Mapa Intermodular** (tanto para la oferta de **Formación Profesional Básica - FPB** como para el ciclo de **Grado Medio de Estética y Belleza - CFGM**), eliminando por completo las palabras e inconsistencias en castellano que se mostraban cuando la aplicación estaba configurada en idioma catalán.

Específicamente, se ha resuelto:
1. **Resultados de Aprendizaje (RAs):**
   - En CFGM, los 52 RAs de los 9 módulos (incluyendo 0636, 0640, 0641, 1664, 1709 y 0156) tenían en catalán textos parafraseados o desalineados respecto al currículo oficial. Se han re-traducido fielmente y de forma directa a partir de la redacción oficial en castellano del BOE (RD de título de Estética y Belleza).
   - En FPB, se subsanaron erratas tipográficas y castellanismos en las descripciones de RAs en catalán (`las seva` -> `la seua`, `naturta` -> `natura`, `instalacions` -> `instal·lacions`, `d'l'estudi` -> `de l'estudi`, `actusal` -> `actual`, `siglo XIX` -> `segle XIX`, `menus` -> `menús`, etc.) y se sincronizaron los `targetRaText_ca` en todas las conexiones.
2. **Conexiones Intermodulares Coincidentes (Paso 3):**
   - En FPB, los 2.604 criterios de evaluación enlazados en `relatedCriteria` carecían del campo `criteria_ca` (únicamente poseían `criteria` en castellano). Por ello, al cambiar a catalán, la interfaz mostraba los criterios relacionados 100% en castellano. Se incorporó a los 2.604 registros su traducción oficial canónica en `criteria_ca` y `criteria_es`, además de `moduleName_ca` y `moduleName_es`.
   - En CFGM, se aseguró la consistencia total de `criteria_ca` y `criteria_es` alineada con la base de datos oficial de RAs.
3. **Propuestas de Actividades y Retos:**
   - En FPB, se eliminaron más de 1.400 ocurrencias de palabras en castellano (`colocan` -> `col·loquen`, `justifican` -> `justifiquen`, `corrigen` -> `corregeixen`, `acomodan` -> `acomoden`, `presionan` -> `pressionen`, `retiran` -> `retiren`, `cronómetro` -> `cronòmetre`, `decolorante` -> `decolorant`, `desinfectante` -> `desinfectant`, `a contrapelo` -> `a contrapèl`, etc.) en los campos `description_ca`, `motivatingFactor_ca`, `title_ca`, `evidence_ca` y `diversitySupport_ca`.
   - Se tradujeron íntegramente las 5 notas metodológicas curriculares que se encontraban con párrafos en castellano dentro de `diversitySupport_ca`.
   - En CFGM, se reemplazaron los castellanismos recurrentes en descripciones de actividades (`a partir de una` -> `a partir d'una`, `a partir de un` -> `a partir d'un`, `explican` -> `expliquen`).

---

## Arquitectura y Flujo

```
                             [Usuario selecciona Catalán]
                                          │
                                          ▼
                         ┌──────────────────────────────────┐
                         │      TranslationService (i18n)   │
                         └────────────────┬─────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                     ┌────────────────────────┐
     │   Pestaña FP Básica    │                     │ Pestaña CFGM Estètica  │
     │ mapa-intermodular.seed │                     │ mapa-intermodular-cfgm │
     └───────────┬────────────┘                     └───────────┬────────────┘
                 │                                              │
                 ├─ Paso 1: Mòduls i RAs (text_ca)              ├─ Paso 1: Mòduls i RAs (text_ca oficial)
                 ├─ Paso 2: Criteris propis (criteria_ca)       ├─ Paso 2: Criteris propis (criteria_ca)
                 └─ Paso 3: Connexions coincidents              └─ Paso 3: Connexions coincidents
                     ├─ targetRaText_ca                             ├─ targetRaText_ca
                     ├─ relatedCriteria:                            ├─ relatedCriteria:
                     │   ├─ moduleName_ca                           │   ├─ moduleName_ca
                     │   └─ criteria_ca (100% en val/cat)           │   └─ criteria_ca
                     ├─ justification_ca                            ├─ justification_ca
                     └─ activities:                                 └─ activities:
                         ├─ title_ca                                    ├─ title_ca
                         ├─ motivatingFactor_ca                         ├─ motivatingFactor_ca
                         ├─ description_ca                              ├─ description_ca
                         ├─ evidence_ca                                 ├─ evidence_ca
                         └─ diversitySupport_ca                         └─ diversitySupport_ca
                             (inclou notes metodològiques)
```

1. **Selector de Idioma / Componente (`mapa-intermodular-view`):**
   - El template evalúa `isCa()` a través del layout signal.
   - En el Paso 1 y Paso 2 se consumen `mod.name_ca`, `ra.text_ca` y `ra.criteria_ca`.
   - En el Paso 3, para cada tarjeta de conexión intermodular, se presentan `conn.targetModuleName_ca`, `conn.targetRaText_ca`, `conn.title_ca`, `conn.justification_ca`, `rel.criteria_ca` y todos los campos `_ca` de `activities`.
2. **Sincronización con el Backend:**
   - La base de datos curricular de CFGM en `backend/src/data/ras_cfgm_estetica.data.ts` mantiene sincronizadas las descripciones en catalán (`description_ca`) idénticas al seed del frontend, garantizando coherencia al generar proyectos automáticos desde el mapa intermodular.

---

## Archivos Modificados

| Archivo | Cambio Realizado |
|---|---|
| `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts` | Corrección de erratas en los RAs; inyección de `criteria_ca`, `criteria_es` y nombres modulares en los 2.604 `relatedCriteria`; traducción completa de las 5 notas metodológicas en `diversitySupport_ca`; eliminación sistemática de castellanismos en actividades. |
| `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular-cfgm.seed.ts` | Traducción oficial directa de los 52 RAs desde el currículo en castellano (BOE); sincronización de `targetRaText_ca` en conexiones; corrección de castellanismos en actividades (`a partir d'una`, `a partir d'un`, `expliquen`). |
| `backend/src/data/ras_cfgm_estetica.data.ts` | Sincronización de las descripciones en catalán (`description_ca` y `description`) de los 52 RAs de CFGM para mantener paridad estricta con el frontend. |
| `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts` | En el método `exportConnectionSummary`, se actualizó la exportación de criterios relacionados para respetar el idioma activo (`isCa ? rel.criteria_ca : rel.criteria_es`). |

---

## Detalles Técnicos

1. **Construcción del Diccionario Canónico de Criterios (FPB):**
   - Se recopilaron los criterios oficiales desde las definiciones de `learningOutcomes` de los módulos del ciclo, complementados con la matriz de 145 criterios específicos y los 129 criterios de los módulos transversales `3012` (Comunicación y Sociedad II) y `3067` (Formación en Centros de Trabajo).
   - Se indexó cada criterio tanto por su código compuesto (p. ej., `3061-1a`, `3067-2d`) como por su texto canónico.
   - El resultado cubrió el 100% de las 2.604 referencias de criterios relacionados en las conexiones de FPB sin dejar ningún criterio en castellano.
2. **Traducción Directa de RAs de CFGM:**
   - Se detectó que los módulos `0636`, `0640`, `0641`, `1664`, `1709` y `0156` tenían descripciones en catalán desfasadas o parafraseadas. Se reconstruyeron las 52 traducciones a partir del texto normativo en castellano (`text_es`), aplicando terminología oficial de la formación profesional en el ámbito lingüístico catalán/valenciano (DNV / IEC / Decret de currículum).
3. **Auditoría Estricta Automatizada:**
   - Se diseñó un script de verificación léxica con detección de marcadores estrictos en castellano (`de los`, `de las`, `se ha`, `se han`, `colocan`, `justifican`, `corrigen`, `acomodan`, `cronómetro`, `decolorante`, etc.).
   - Tras el procesamiento, el escáner reportó **0 incidencias** tanto en el seed de FPB como en el de CFGM.
4. **Verificación de Cobertura y Suites de Tests:**
   - Backend: **15/15 archivos de test, 123/123 tests superados**.
   - Frontend: **31/31 archivos de test, 388/388 tests superados, con 94.97% de cobertura de ramas (threshold >= 90.00% cumplido)**.
