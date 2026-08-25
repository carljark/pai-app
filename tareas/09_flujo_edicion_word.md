# Diseño Técnico: Flujo de Edición Seguro con MS Word

## 1. Propósito de la Tarea
- **Mejora de la Experiencia de Usuario:** Eliminar el editor de texto plano (Markdown) manual de la plataforma y sustituirlo por un flujo de descarga/subida de Microsoft Word (`.docx`). Esto permite a los profesores editar los proyectos con la herramienta que mejor conocen.
- **Sanitización Estricta (Prevención de Estilos Rotos):** Los archivos de Word suelen contener código XML invisible y estilos basura (mso-styles, fuentes raras, alineaciones) que romperían el visor web de Markdown si se incrustaran directamente. El objetivo es "purificar" ese contenido al subirlo.

## 2. Arquitectura de Exportación (Descarga DOCX)
- Se ha añadido la librería `html-to-docx` en el backend.
- En el nuevo endpoint `GET /api/projects/:id/export-docx`, se toma el Markdown almacenado, se convierte temporalmente a HTML usando `marked`, y luego se empaqueta en un archivo `.docx` binario que se descarga en el navegador con los encabezados HTTP apropiados (`Content-Disposition: attachment`).

## 3. Arquitectura de Importación (La "Purificadora")
- Se utiliza `multer` para recepcionar el archivo `.docx` en el endpoint `POST /api/projects/:id/import-docx` sin guardarlo en disco duro (se almacena en RAM con `memoryStorage`).
- **Conversión Semántica:** Se utiliza la librería `mammoth.js`. A diferencia de otros conversores, `mammoth` está diseñado explícitamente para ignorar el formato visual (colores, tamaños, tipografías) y extraer únicamente la estructura semántica pura del documento (Párrafos, Listas, Encabezados, Negritas y Tablas).
- **Traducción Inversa:** El HTML semántico extraído se pasa por la librería `turndown` configurada con formato ATX para convertirlo de nuevo en código Markdown puro.
- **Resultado:** Se sobrescribe el contenido del proyecto en la base de datos con este nuevo Markdown. Al volver a la web, el proyecto mantiene su diseño limpio original y su integración perfecta con los estilos del portal.

## 4. Cambios en el Frontend
- **app.html:** Se han eliminado la caja de `<textarea>` manual y el botón de edición interactivo. Se han añadido botones de "Bajar como Word" y "Subir Word editado" junto a un `<input type="file" hidden>`.
- **app.ts & pai.service.ts:** Se han programado las lógicas de interacción con los nuevos endpoints del API mediante observables HTTP que manejan los buffers de datos y la notificación visual de éxito.
