# Tarea 54: Ajustes del Generador (Metodologías), Editor IA, Formato LaTeX y Home Dashboard

## Propósito
Implementar el conjunto de mejoras solicitadas por la dirección de proyecto (Eva Peralta):
1. **Selector de Metodología de Proyecto en el Generador:** Permitir al docente elegir entre *Aprendizaje Basado en Problemas/Proyectos (ABP)*, *Aprendizaje Basado en Retos (ABR)* o *Aprendizaje y Servicio (ApS)*.
2. **Restauración del Endpoint de Reescritura IA (`/api/projects/rewrite`):** Recuperar en el backend la ruta y controlador de reescritura con Gemini que se había omitido durante la refactorización a controladores.
3. **Eliminación de Símbolos Raros / LaTeX en el Prompt:** Prohibir de forma taxativa en las instrucciones del sistema de Gemini la notación LaTeX (`$`, `\text{...}`) para cantidades, minutos, horas y texto habitual, obligando a usar texto plano Markdown.
4. **Indicador de Carga Visual (Spinner / Círculo en Movimiento):** Mostrar un overlay con animación circular y mensaje de estado cuando el usuario solicita una modificación con IA en el Taller de Proyectos.
5. **Rediseño y Alineación de la Home:**
   - Alineación y justificación a la izquierda del contenido principal.
   - Párrafo de descargo pedagógico de la IA (*"La Inteligencia Artificial propone, tú decides"*) separado en un bloque destacado en cursiva.
   - Titular con "plappin" destacado en grande.
   - Inclusión del logotipo del centro (*IES Cap de Llevant*) en la esquina inferior izquierda.

## Arquitectura y Componentes Modificados

### 1. Backend
- `backend/src/controllers/project.controller.ts`:
  - Se sustituyó la antigua regla que forzaba el uso de LaTeX por una regla estricta que exige texto plano Markdown para minutos, horas y acotaciones.
  - Se implementó la función `rewriteSection(req, res)` que invoca a Gemini para modificar únicamente el fragmento seleccionado respetando el resto del documento intacto.
- `backend/src/routes/project.routes.ts`:
  - Se expuso la ruta `POST /api/projects/rewrite` protegida con `requireApproved` y `requireAiAccess`.

### 2. Frontend
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`:
  - Se añadió la botonera de pestañas para la selección de metodología (`ABP`, `ABR`, `ApS`) vinculada bidireccionalmente con `ProjectsFacade.methodology`.
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html` y `styles/_layout.scss`:
  - Se añadió el overlay `@if (projects.isThinking())` con el spinner giratorio y animación CSS `@keyframes spin`.
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`:
  - Se rediseñó el Hero con alineación a la izquierda (`align-items: flex-start; text-align: left;`).
  - Se separó el disclaimer de IA en la clase `.home-hero__disclaimer` con fondo semitransparente, borde verde y tipografía cursiva.
  - Se añadió la sección `.home-footer` con la imagen del logotipo del instituto `logo-ies.png` a la izquierda.
- `frontend/public/logo-ies.png`:
  - Copia del asset oficial del IES Cap de Llevant.
- `frontend/src/app/services/translation.service.ts`:
  - Actualización de textos en catalán y castellano para metodologías, título "plappin" y separación de la descripción.

## Archivos Modificados / Creados
- `backend/src/controllers/project.controller.ts`
- `backend/src/routes/project.routes.ts`
- `frontend/public/logo-ies.png`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts`
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts`
- `frontend/src/app/services/translation.service.ts`
- `frontend/src/app/services/translation.service.spec.ts`
- `frontend/src/app/app.spec.ts`
- `frontend/src/styles/_layout.scss`
- `tareas/54_ajustes_generador_home_y_editor_ia.md`

## Verificación
- Backend Vitest: 58 tests pasados (100% de éxito).
- Frontend Vitest: 239 tests pasados (98.24% de cobertura de sentencias, superando todos los umbrales).
- Build de producción Frontend (`npm run build`): compilación correcta.
