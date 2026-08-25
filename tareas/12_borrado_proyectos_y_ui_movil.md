# 12. Borrado de Proyectos y Refinamiento Móvil

## Propósito
- Implementar funcionalidad para que los usuarios puedan eliminar sus propios proyectos (o los admins puedan borrar cualquiera).
- Optimizar el espacio visual en dispositivos móviles eliminando márgenes y paddings excesivos para aprovechar el ancho total de la pantalla.
- Eliminar el uso de emojis en los botones para mantener un tono profesional en la plataforma.

## Archivos Modificados
- \`backend/src/controllers/project.controller.ts\`: Se añade método \`deleteProject\`.
- \`backend/src/routes/project.routes.ts\`: Se añade endpoint \`DELETE /api/projects/:id\`.
- \`backend/src/tests/projects.test.ts\`: Tests unitarios comprobando flujos de éxito (200), no encontrado (404), y acceso denegado (403).
- \`frontend/src/app/services/pai.service.ts\`: Conexión de Angular con el endpoint DELETE.
- \`frontend/src/app/app.ts\`: Se añade la función \`deleteProject()\` con confirmación por alerta (\`confirm\`).
- \`frontend/src/app/app.html\`: Inserción del botón "Eliminar" en el listado de historial (para FP y ESO) visible condicionalmente. Se elimina emoji de papelera.
- \`frontend/src/styles.scss\`: Media queries extremas de \`margin: 0\` y \`padding: 5px\` sobre \`main\`, \`section\` y \`body\` bajo la directiva de 768px.

## Detalles Técnicos
Se ha utilizado el JWT inyectado en \`req.user\` para validar que \`project.userId\` coincide con el usuario actual antes de efectuar el \`findByIdAndDelete\`. En frontend se utilizan las clases CSS refactorizadas anteriormente para ajustar de forma granular el padding de la *Toolbar* y las *History Cards* a 10px máximos en móvil.
