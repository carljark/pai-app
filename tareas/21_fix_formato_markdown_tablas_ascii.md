# 21. Corrección de Formato Markdown en Recuadros ASCII

## Propósito
Se ha corregido un problema de visualización en los proyectos generados por la IA. El modelo tendía a dibujar "recuadros" utilizando caracteres ASCII (como `+-----`), especialmente en la sección de Secuenciación Didáctica. El renderizador `ngx-markdown` interpretaba los caracteres `+` como listas desordenadas, rompiendo por completo el diseño de las tablas/cajas.

## Arquitectura / Flujo
Se ha abordado la solución desde dos frentes (Backend para el futuro, Frontend para el pasado):

1. **Backend (Prevención)**: Se ha añadido una instrucción explícita y crítica en el *System Prompt* del controlador (`project.controller.ts`) para prohibir terminantemente el uso de recuadros de texto dibujados con caracteres ASCII y forzar el uso de tablas Markdown estándar (`| columna |`) o bloques de cita (`>`).
2. **Frontend (Corrección retroactiva)**: Para arreglar la visualización de los proyectos *que ya están guardados en la base de datos* con este formato roto, se ha creado una señal computada en `projects.facade.ts` llamada `formattedGeneratedProject`.
   - Esta señal aplica una expresión regular (Regex) robusta que detecta bloques de texto enmarcados con `+---+` y `|`.
   - En lugar de dejar que `ngx-markdown` los rompa, los envuelve dinámicamente en bloques de código puro (```` ```text ... ``` ````) para que se visualicen intactos manteniendo su estructura original.

## Archivos Modificados
- `backend/src/controllers/project.controller.ts`: Actualización del prompt del sistema (`baseInstruction`).
- `frontend/src/app/features/projects/services/projects.facade.ts`: Añadido el computed `formattedGeneratedProject` con la lógica Regex de formateo.
- `frontend/src/app/app.html`: Actualizado el *binding* de `<markdown>` para usar el nuevo estado formateado en lugar del texto crudo de la DB.
