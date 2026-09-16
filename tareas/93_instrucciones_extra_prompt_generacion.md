# Diseño Técnico: Incorporación de Instrucciones Adicionales del Docente en el Prompt de Generación de Proyectos

## Propósito
Permitir a los docentes introducir indicaciones e instrucciones personalizadas desde la interfaz de usuario antes de generar un proyecto intermodular. Estas instrucciones se integran directamente en el prompt curricular enviado a la IA (tanto al motor primario como al secundario), permitiendo condicionar la temática del proyecto, dinámicas de aula, herramientas digitales específicas (p. ej., Canva, Genially), metodologías complementarias o adaptaciones para necesidades específicas de apoyo educativo (DUA).

---

## Arquitectura y Flujo de Datos

El flujo de información abarca desde la captura reactiva en el formulario del generador hasta el procesamiento de la cola en MongoDB y la ejecución en el motor de IA:

```mermaid
flowchart TD
    A["GeneratorViewComponent (#generator-extra-instructions textarea)"] -->|Event input| B["ProjectsFacade.extraInstructions (Signal)"]
    B -->|Click en Generar Proyecto| C["AppFacade.generateProject()"]
    C -->|POST /api/projects/generate (payload.extraInstructions)| D["Express Router / project.controller.ts"]
    
    D -->|Construcción aiInstruction| E["Regla estricta sobre Instrucciones Extra en System Prompt"]
    D -->|Construcción userPrompt| F["Sección 'INSTRUCCIONES EXTRA DEL DOCENTE (OBLIGATORIAS)'"]
    D -->|Persistencia| G["Mongoose Project Model (campo extraInstructions)"]
    
    G -->|Cola de tareas (en_cola)| H["QueueWorker / ai.service.ts"]
    H -->|Invocación IA| I["Gemini / OpenRouter con contexto enriquecido"]
    
    C -->|onGenerateSuccess| J["Reset de extraInstructions signal y selección"]
```

---

## Componentes y Archivos Modificados

| Archivo | Tipo de Cambio | Descripción |
| :--- | :--- | :--- |
| `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts` | Modificación | Adición del elemento `<textarea id="generator-extra-instructions">` con estilos responsivos, enlace bidireccional al signal y manejador `onExtraInstructionsChange`. |
| `frontend/src/app/features/projects/services/projects.facade.ts` | Modificación | Creación del signal reactivo `extraInstructions` y su envío condicional en el payload del método `generateProject`. |
| `frontend/src/app/app.facade.ts` | Modificación | Limpieza de `extraInstructions` con encadenamiento seguro (`?.set('')`) tras encolar exitosamente un proyecto. |
| `frontend/src/app/services/translations.es.ts` | Modificación | Adición de etiquetas bilingües en castellano (`generatorExtraInstructionsLabel`, `generatorExtraInstructionsOptional`, `generatorExtraInstructionsPlaceholder`). |
| `frontend/src/app/services/translations.ca.ts` | Modificación | Adición de etiquetas bilingües en catalán/valenciano. |
| `backend/src/models/Project.ts` | Modificación | Incorporación del campo `extraInstructions: String` en el esquema de MongoDB `ProjectSchema`. |
| `backend/src/controllers/project.controller.ts` | Modificación | Recepción de `extraInstructions` en `req.body`, inyección de directiva obligatoria en `baseInstruction`, concatenación al `userPrompt` y persistencia en el documento `Project`. |
| `frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts` | Modificación | Pruebas unitarias para el nuevo textarea y enlace con el facade. |
| `frontend/src/app/features/projects/services/projects.facade.spec.ts` | Modificación | Pruebas unitarias verificando la inclusión de `extraInstructions` en la petición HTTP. |
| `frontend/src/app/app.spec.ts` y `app.facade.spec.ts` | Modificación | Actualización de mocks para contemplar `extraInstructions`. |
| `backend/src/tests/projects.test.ts` | Modificación | Test de integración verificando la recepción y persistencia de `extraInstructions` en el prompt del proyecto. |
| `tareas/93_instrucciones_extra_prompt_generacion.md` | Creación | Documentación técnica del diseño e implementación. |

---

## Detalles Técnicos y Decisiones

1. **Ubicación en el Formulario del Generador:**
   - El cuadro de texto se sitúa estratégicamente entre la fila de configuración (Nivel, Curso, Metodología y Motor IA) y el acordeón curricular flotante de selección de RAs/CEs.
   - Cuenta con una indicación visual de `(Opcional)` para no forzar su uso a los docentes que deseen la generación estándar basada puramente en el currículo.

2. **Inyección Dual en el Prompt:**
   - **System Instruction (`baseInstruction`):** Se añade una regla explícita que instruye al modelo a cumplir con carácter prioritario las pautas dadas por el docente (temáticas, productos entregables o enfoques didácticos específicos).
   - **User Prompt (`userPrompt`):** Se adjunta un bloque estructurado y claramente delimitado `--- INSTRUCCIONES EXTRA DEL DOCENTE (OBLIGATORIAS) ---` al final de la definición de RAs y criterios de evaluación.

3. **Ciclo de Vida y Limpieza:**
   - Cuando el proyecto se encola con éxito (`onGenerateSuccess`), el signal `extraInstructions` se resetea a cadena vacía, evitando que instrucciones personalizadas de un proyecto se arrastren accidentalmente a generaciones posteriores.

4. **Verificación y Cobertura:**
   - Verificación ejecutada con éxito a través del hook `./.git/hooks/pre-push`:
     - **Backend:** 14 suites, 103 tests pasados (100%). Cobertura: 98.14% Stmts, 90.77% Branches, 100% Funcs, 98.64% Lines.
     - **Frontend:** 28 suites, 333 tests pasados (100%). Cobertura: 99.05% Stmts, 95.52% Branches, 97.82% Funcs, 99.59% Lines.
