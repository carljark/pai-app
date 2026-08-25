# 13. Gestión de Usuarios y Permisos de IA

## Propósito
- Habilitar un panel de control para que los administradores puedan dar de alta o aprobar a los usuarios nuevos (cambiándolos de estado "pending" a "teacher").
- Añadir la capacidad granular de activar o desactivar el uso del motor generativo de Inteligencia Artificial para cada usuario.
- Limitar el acceso a los modos de edición/creación si la IA está desactivada, permitiendo sin embargo visualizar y descargar proyectos preexistentes.

## Archivos Modificados
- \`backend/src/models/User.ts\`: Se añade el campo booleano \`canUseAi\` (por defecto \`true\` para mantener compatibilidad con usuarios existentes).
- \`backend/src/controllers/auth.controller.ts\`: Se inyecta \`canUseAi\` en el token JWT.
- \`backend/src/controllers/admin.controller.ts\`: Se renombra \`updateUserRole\` a \`updateUserPermissions\` para soportar la actualización de \`role\` y \`canUseAi\` simultáneamente.
- \`backend/src/routes/admin.routes.ts\`: Se actualiza la ruta PUT a \`/users/:id/permissions\`.
- \`backend/src/middlewares/auth.middleware.ts\`: Se añade \`requireAiAccess\` que bloquea a nivel de backend las peticiones si el usuario no tiene permisos de IA.
- \`backend/src/routes/project.routes.ts\`: Se protege la ruta \`/generate\` con \`requireAiAccess\`.
- \`frontend/src/app/services/pai.service.ts\`: Se actualiza el método para realizar la llamada al nuevo endpoint de permisos.
- \`frontend/src/app/app.ts\`: Se añade el método \`toggleAiAccess\` para gestionar la habilitación de IA desde la interfaz.
- \`frontend/src/app/app.html\`:
  - Se añade un botón y un indicador de estado en el panel de administrador para controlar la IA de cada usuario.
  - Se oculta/bloquea el botón principal "Generar Proyecto" mostrando un aviso en su lugar si la IA está desactivada.
  - Se oculta la sección completa del Asistente de IA (reescritura) en el taller (Workshop) y se reemplaza por un cuadro de aviso si la IA está desactivada, manteniendo intacta la zona inferior de Archivos Adjuntos.

## Detalles Técnicos
La seguridad se implementa tanto en frontend (ocultando los elementos de la interfaz condicionalmente mediante los claims del JWT de \`authService.currentUser()\`) como en backend (con un middleware \`requireAiAccess\` que inspecciona los permisos extraídos del JWT en cada petición). El usuario administrador actúa como "superusuario" saltándose los bloqueos de \`canUseAi\`.
