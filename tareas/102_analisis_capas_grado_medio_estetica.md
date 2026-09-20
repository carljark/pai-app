# 102 — Análisis de capas para incorporar Grado Medio de Estética

## Propósito

Documento de referencia generado a petición del usuario para repasar qué habría que hacer para incorporar **Grado Medio de Estética** a la plataforma. No es una implementación, sino un análisis técnico previo.

---

## Capas necesarias

### 1. 📚 Datos curriculares (lo más laborioso)

- **Recopilar los Resultados de Aprendizaje (RAs)** oficiales de los módulos del ciclo de Grado Medio de Estética y Belleza (o el título exacto que corresponda en la comunidad autónoma).
- Crear un JSON similar a los existentes (como los RAs de FPB o las CEs de ESO) con la estructura:
  - `module` / `module_es` / `module_ca` (nombre del módulo)
  - `description` / `description_es` / `description_ca` (texto del RA)
  - `criterios_es` / `criterios_ca` (criterios de evaluación oficiales)
- **Ingestar ese JSON** en la colección `RA` de MongoDB (o crear una colección nueva si se prefiere aislar).

---

### 2. 🔧 Backend

- **Modelo `Project.ts`**: Añadir `'GRADO_MEDIO_ESTETICA'` al enum de `tipoNivel`.
- **Controlador `project.controller.ts`**:
  - En `generateProject`: añadir la rama para el nuevo nivel en la construcción de `targetCourseDescription` (ej: `"1º de Grado Medio de Estética y Belleza"`).
  - Decidir si necesita instrucciones específicas en el prompt del sistema (como FPB tiene la Carpeta de Aprendizaje).
  - Decidir los cursos válidos (1º y 2º, como FPB).
- **Controlador `curriculum.controller.ts`**: Decidir si los RAs del Grado Medio se sirven por el mismo endpoint `/api/ras` (filtrando por nivel) o si se crea uno nuevo.
- **Coincidencias FPB (`FpbMatch`)**: Valorar si se quieren crear coincidencias y actividades de referencia específicas para este ciclo.

---

### 3. 🖥️ Frontend

- **`generator-view.component.ts`**: Añadir una tercera pestaña/tab "Grado Medio" junto a "FP Básica" y "ESO (PDC)".
- **`curriculum.facade.ts`**:
  - Añadir `'GRADO_MEDIO_ESTETICA'` como valor posible de `tipoNivel`.
  - Definir los cursos válidos (`['1º', '2º']`).
  - Cargar los RAs correspondientes al seleccionar este nivel.
- **`curriculum-selector.component.ts`**: Asegurar que muestra los RAs del Grado Medio agrupados por módulo.
- **Traducciones** (`translations.es.ts` / `translations.ca.ts`): Añadir las etiquetas del nuevo nivel.
- **Vistas de historial, personal, home, taller**: Ya muestran dinámicamente el nivel con `tipoNivel`, solo habría que añadir la nueva etiqueta al ternario o convertirlo en un mapa/diccionario.
- **Mapa Intermodular**: Decidir si se incorpora un mapa de relaciones para los módulos del Grado Medio.

---

## Resumen de esfuerzo

| Bloque | Esfuerzo estimado |
|---|---|
| Recopilación y estructuración del currículo oficial (RAs + criterios) | **Alto** – depende de cuántos módulos tiene el título |
| Ingesta en MongoDB | Bajo |
| Backend (enum + prompt + controlador) | Medio |
| Frontend (tab + facade + traducciones + vistas) | Medio |
| Tests (actualizar enums, añadir tests del nuevo nivel) | Medio |

> **Nota**: La parte más costosa con diferencia es la primera: localizar, digitalizar y estructurar los RAs y criterios de evaluación oficiales de cada módulo del ciclo. El código en sí es una extensión natural de lo que ya existe para FPB.

---

## Archivos clave a tocar (cuando se implemente)

| Archivo | Cambio |
|---|---|
| `backend/src/models/Project.ts` | Añadir `'GRADO_MEDIO_ESTETICA'` al enum `tipoNivel` |
| `backend/src/controllers/project.controller.ts` | Nueva rama en `generateProject` para el nivel |
| `backend/src/controllers/curriculum.controller.ts` | Servir RAs del nuevo ciclo |
| `backend/src/data/` | Nuevo JSON con RAs y criterios del ciclo |
| `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts` | Nueva tab "Grado Medio" |
| `frontend/src/app/features/curriculum/services/curriculum.facade.ts` | Nuevo `tipoNivel` + cursos |
| `frontend/src/app/shared/i18n/translations.*.ts` | Etiquetas del nuevo nivel |
| `backend/src/tests/projects.test.ts` | Tests del nuevo nivel |
