# Tarea 118: Verificación y Pulido Lingüístico Integral de las Propuestas de Actividades en el Mapa Intermodular

## Propósito
Revisar, depurar y traducir íntegramente al catalán normativo (estándar pedagógico de FP de la Generalitat Valenciana y de las Illes Balears) todas las propuestas de actividades del Mapa Intermodular (`mapa-intermodular.seed.ts` para Formación Profesional Básica y `mapa-intermodular-cfgm.seed.ts` para Ciclo Formativo de Grado Medio de Estètica i Bellesa).

El objetivo principal consistió en erradicar cualquier residuo léxico u ortográfico en castellano, calcos fonéticos o hispanismos que persistían en los campos catalanes de actividades (`title_ca`, `motivatingFactor_ca`, `description_ca`, `evidence_ca`, `diversitySupport_ca`), garantizando al 100% una experiencia pedagógica impecable, natural y fiel a la normativa curricular en catalán.

---

## Arquitectura / Flujo de Revisión y Traducción

El proceso de saneamiento y verificación lingüística siguió un flujo por capas automatizado y de alta precisión:

```
┌────────────────────────────────────────────────────────┐
│     Extracción y Escaneo Morfosintáctico Profundo      │
│  - 3.357 actividades en FPB (457 actividades únicas)  │
│  - 1.230 actividades en CFGM (1.230 únicas)            │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│           CFGM            │   │           FPB             │
│ Detección de 12 entidades │   │ Detección de 109 únicas   │
│ con términos residuales   │   │ con vocabulario castellano│
└───────────┬───────────────┘   └───────────┬───────────────┘
            │                               │
            ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│ Reemplazo léxico directo  │   │ Segmentación en 4 lotes   │
│ en `mapa-intermodular-    │   │ Traducción desde versión  │
│ cfgm.seed.ts`             │   │ castellana con subagentes │
│                           │   │ catalan_translator        │
└───────────┬───────────────┘   └───────────┬───────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ Consolidación y Verificación contra Diccionario         │
│ - Validación de ausencia de signos invertidos (¿ / ¡)   │
│ - 0 ocurrencias de términos diacríticos o calcos       │
│ - Preservación estricta de códigos (Aprenentatges: ...)│
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ Ejecución de Baterías de Tests y Cobertura (Vitest/v8) │
│ - Frontend: 389/389 tests OK (94.97% branch coverage)  │
│ - Backend: 123/123 tests OK                            │
└────────────────────────────────────────────────────────┘
```

---

## Archivos Modificados

1. **`frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts`**:
   - Actualización de las 109 actividades únicas afectadas (769 instancias de actividades en conexiones intermodulares).
   - Sustitución de títulos, ideas motivadoras, descripciones de 4 pasos, evidencias y medidas DUA en catalán.

2. **`frontend/src/app/features/mapa-intermodular/data/mapa-intermodular-cfgm.seed.ts`**:
   - Corrección de términos residuales en actividades de CFGM (`Clienta marejada`, `Proposta de mascareta`, `principis actius de mascaretes`, `Matriu de permisos` y `verificant`).

---

## Detalles Técnicos y Decisiones Lingüísticas

### 1. Erradicación de Hispanismos y Calcos Léxicos en FPB
Entre las correcciones clave efectuadas a partir de la fuente en castellano se encuentran:
- **Herramientas y Mobiliario:**
  - `maletín` $\rightarrow$ `maletí` (p. ej., *El maletí de l'ajudant de manicura*).
  - `reloj visual` $\rightarrow$ `rellotge visual`.
  - `gorro` (en peluquería / mechas) $\rightarrow$ `casquet` (p. ej., *casquet de metxes*).
  - `bolsas, cajas, cajones` $\rightarrow$ `bosses, caixes, calaixos`.
  - `balanza` $\rightarrow$ `balança`.
  - `mazo` $\rightarrow$ `baralla de targetes` / `mall`.
- **Perfiles y Roles:**
  - `ayudante / ayudantes` $\rightarrow$ `ajudant / ajudants`.
  - `autónomo/a` $\rightarrow$ `autònom/a`.
  - `perfiles` $\rightarrow$ `perfils`.
  - `portavoz` $\rightarrow$ `portaveu`.
  - `cazadors` $\rightarrow$ `caçadors`.
- **Terminología Técnica y Curricular:**
  - `californianas` $\rightarrow$ `californianes` (mechas).
  - `requisitos` $\rightarrow$ `requisits`.
  - `tipologías` $\rightarrow$ `tipologies`.
  - `aislament / aislar` $\rightarrow$ `aïllament / aïllar`.
  - `plano` $\rightarrow$ `plànol` (del salón).
  - `matriz / matrices` $\rightarrow$ `matriu / matrius` (de decisión o de permisos).
  - `bachillerato` $\rightarrow$ `batxillerat`.
  - `grat medi` $\rightarrow$ `grau mitjà`.
  - `il·lustrat / il·lustrada` (corregida la grafía con punto geminado `l·l`).
  - `assenyalats / assenyalar` $\rightarrow$ corrección de raíces con `ñ`.
  - `puntos rojos` $\rightarrow$ `punts vermells`.
- **Verbos y Expresiones Idiomáticas:**
  - `entender` $\rightarrow$ `entendre`.
  - `pedir` $\rightarrow$ `demanar`.
  - `dejar` $\rightarrow$ `deixar`.
  - `llegar a acords` $\rightarrow$ `arribar a acords`.
  - `tomar una decisió` $\rightarrow$ `prendre una decisió`.
  - `ocurrir` $\rightarrow$ `ocórrer`.
  - `cuesta` $\rightarrow$ `costa` (*¿Quant cuesta estar guapa/o?* $\rightarrow$ *Quant costa estar guapa/o?*).
  - `despedida` $\rightarrow$ `comiat`.
  - `ensayan` $\rightarrow$ `assagen`.
  - `encajar` $\rightarrow$ `encaixar`.
  - `explicarlo` $\rightarrow$ `explicar-ho`.
  - `cada uno` $\rightarrow$ `cadascun`.
  - `mantener` $\rightarrow$ `mantenir`.
  - Concordancia de género: corrección de géneros no concordes como *el meu imatge* $\rightarrow$ *la meua imatge*, *el seu estructura* $\rightarrow$ *la seua estructura*.

### 2. Puntuación Normativa
- Se eliminaron todos los signos de interrogación y exclamación de apertura (`¿` y `¡`), inexistentes en la tipografía catalana.

### 3. Integridad Pedagógica
- Se validó que las referencias de criterios y resultados de aprendizaje (fórmulas `(Aprenentatges: 3060-1a + ...)`) y el formato Markdown en negrita (`**...**`) permanecieran intactos sin corrupción de literales ni sintaxis.

---

## Verificación y Calidad

- **Verificador de Ausencia de Hispanismos:**
  Ejecución del script de análisis léxico exhaustivo sobre los seeds de FPB y CFGM:
  - FPB: 3.357 actividades revisadas $\rightarrow$ **0 actividades problemáticas**.
  - CFGM: 1.230 actividades revisadas $\rightarrow$ **0 actividades problemáticas**.
- **Frontend Unit & Component Tests:**
  - 31 archivos de pruebas superados (389 tests pasados, 0 fallos).
  - **94.97%** de Branch Coverage (supera el requisito de $\ge 90\%$).
- **Backend Tests:**
  - 15 suites de pruebas pasadas (123 tests superados, 0 fallos).
