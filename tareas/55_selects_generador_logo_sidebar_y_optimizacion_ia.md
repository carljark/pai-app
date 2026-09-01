# Tarea 55: Selects de Curso/Metodología, Reubicación de Logo IES en Sidebar y Optimización de Reescritura IA

## Propósito
1. **Transformación a Controles Select:** Reemplazar las pestañas de selección de **Curso** y **Metodología** en el Generador de Proyectos por elementos desplegables `<select class="form-select">` para una interfaz más compacta y clara.
2. **Reubicación y Responsividad del Logotipo del IES:**
   - Retirar el logotipo del IES de la página principal (Home).
   - Ubicar el logotipo en la parte inferior del **Sidebar izquierdo**, exactamente entre el botón de *"Cerrar Sesión / Salir"* y el nombre del usuario.
   - Si el sidebar está desplegado, se muestra en tamaño completo/grande (`max-height: 52px; max-width: 140px`).
   - Si el sidebar está colapsado, se reduce proporcionalmente (`max-height: 24px; max-width: 32px`).
3. **Optimización de Alta Velocidad para la Reescritura IA (`/api/projects/rewrite`):**
   - Modificar el controlador de reescritura para que Gemini modifique **exclusivamente el fragmento de texto seleccionado** en lugar de forzarlo a regenerar el documento completo de miles de palabras.
   - El backend realiza el reemplazo preciso del fragmento en el documento (`context.replace`), reduciendo el tiempo de respuesta a 1-2 segundos e impidiendo que el asistente se quede bloqueado o en espera prolongada.
   - Se añadió captura y notificación visual de errores con modal de alerta para evitar bloqueos silenciosos.

## Archivos Modificados
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts`
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`
- `frontend/src/app/layout/components/sidebar/sidebar.component.ts`
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.ts`
- `backend/src/controllers/project.controller.ts`
- `backend/src/tests/projects.test.ts`

## Verificación
- **Frontend:** 239/239 tests unitarios pasados (98.18% cobertura global).
- **Backend:** 60/60 tests unitarios pasados (97.09% statements, 91.32% branches).
- **Build Frontend:** Compilación satisfactoria sin errores.
