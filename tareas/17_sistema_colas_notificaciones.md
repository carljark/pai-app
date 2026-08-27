# 17. Sistema de Colas y Notificaciones en Tiempo Real (SSE)

**Propósito:** 
Evitar que las solicitudes simultáneas de generación de proyectos saturen los recursos del servidor y agoten los límites de la cuota de la API de IA (Google Gemini). También se buscaba mejorar la experiencia de usuario (UX) para que no tuvieran que esperar frente a una pantalla bloqueada durante minutos.

**Arquitectura/Flujo:**
1. **Límite de Concurrencia:** Un usuario solo puede tener 1 proyecto "en cola" o "generando" al mismo tiempo.
2. **Límite de Generación Diaria:** Un usuario estándar no puede solicitar más de 10 proyectos al día (el límite se comprueba en el ActivityLog diario).
3. **Persistencia Asíncrona:** Cuando el frontend llama al endpoint de generación, el servidor guarda el registro del proyecto en estado `en_cola` (nuevo enum), guarda los `aiPrompt` y `aiInstruction` construidos con RAG dentro del modelo, y devuelve HTTP 202 (Accepted) inmediatamente.
4. **Queue Worker:** Un servicio interno de Node (`queue.service.ts`) procesa secuencialmente en segundo plano los proyectos pendientes. Al coger uno, lo marca como `generando`, llama a Gemini y al terminar, lo guarda como `borrador`.
5. **Server-Sent Events (SSE):** Se ha habilitado la ruta `/api/projects/stream` y el frontend (`pai.service.ts`) se conecta permanentemente mediante `EventSource` al entrar. Cuando el *Queue Worker* termina de procesar, dispara un evento unidireccional por SSE que el cliente atrapa, lanzando una notificación tipo *toast* (alert por ahora) que indica que su proyecto está listo, y refresca la lista.

**Archivos Modificados:**
- `backend/src/models/Project.ts`: Añadidos los estados `en_cola`, `generando`, `error` y soporte para guardar los campos `aiPrompt` y `aiInstruction`.
- `backend/src/services/queue.service.ts` (Nuevo): Procesador que recoge los proyectos en cola y ejecuta el modelo Gemini sin bloquear el Hilo Principal web.
- `backend/src/services/sse.service.ts` (Nuevo): Gestor en memoria de clientes SSE (`Response` objects de Express) unidos a su `userId`.
- `backend/src/routes/project.routes.ts`: Habilitado `/api/projects/stream`.
- `backend/src/controllers/project.controller.ts`: Refactorizado `generateProject` para guardar en DB sin esperar y añadido sistema de límites.
- `frontend/src/app/services/pai.service.ts`: Añadida conexión SSE mediante `listenToProjectUpdates()`.
- `frontend/src/app/app.ts`: Adaptada la UX en `generateProject()` y registrada la escucha de SSE en el `ngOnInit()`.
- `frontend/src/app/app.html`: Ocultado el botón de "Ver Proyecto" cuando el estado del proyecto es asíncrono, mostrando *badges* informativos (`En cola` o `Generando...`).

**Detalles Técnicos:**
Para evitar que `EventSource` estándar rompa la autenticación por cabeceras (no soportado nativamente), el token JWT ahora es procesado legalmente desde `req.query.token` en `auth.middleware.ts`, lo que permite una autenticación robusta y segura del stream de datos.
Los tests de backend continúan por encima del 92% de cobertura de código.
