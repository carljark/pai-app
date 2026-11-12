# Tarea 256: Servidor MCP para usar Plappin desde Claude o Gemini

> **Plan:** [256 — Servidor MCP para usar Plappin desde Claude o Gemini](../planes/256_plan_servidor_mcp.md)

## Propósito
Permitir que cada docente conecte un asistente de IA (Claude Code, Claude Desktop, Gemini CLI u otro cliente MCP) con su cuenta de Plappin y trabaje con la aplicación desde él: consultar el currículo y los mapas, y listar, leer, generar, editar, traducir, revisar, clonar y borrar proyectos, con los mismos permisos que en la web. Los administradores disponen además de las herramientas de administración.

## Arquitectura y flujo
- **Tokens personales** (`ApiToken`): se crean y revocan en «Área Personal → Conectar con IA». Formato `plp_` + 32 bytes aleatorios; en Mongo solo queda su hash SHA-256 y un prefijo visible. Máximo 5 por usuario y se borran al borrar al usuario. Endpoints: `GET/POST /api/users/me/tokens` y `DELETE /api/users/me/tokens/:id`.
- **Servidor MCP** en `POST /api/mcp`:
  - Streamable HTTP del SDK oficial, sin estado (un servidor por petición), con respuestas JSON en lugar de SSE;
  - montado antes del `authMiddleware` general, con su propio `mcpAuth`, que resuelve el token y lee el rol y el permiso de IA actuales en cada petición;
  - las herramientas se registran según el rol: las `admin_*` solo para administradores.
- **Herramientas como adaptador fino de la API REST:** `createInternalApi` emite un JWT de 5 minutos del usuario y llama a `http://127.0.0.1:$PORT/api/…`, así que aplica los mismos middlewares y validaciones que la web. Los errores llegan al asistente como `isError` con el mensaje de la API.
- **Turno de edición:** `update_project_content` y `translate_project` liberan el turno al terminar, salvo que el usuario ya lo tuviera.
- **Trazabilidad:** cada herramienta que escribe deja un `ActivityLog` `MCP_TOOL` con el nombre de la herramienta y del token.
- **Frontend:** componente `app-ai-connection` en el Área Personal: crear (el token se ve y se copia una vez), listar con último uso y revocar con doble clic de confirmación, y pestañas con la configuración de cada asistente, que incluye la URL del dominio actual y el token recién creado.

## Archivos modificados
1. `backend/package.json` y `package-lock.json`: dependencias `@modelcontextprotocol/sdk` 1.32 y `zod` 4.
2. `backend/src/models/ApiToken.ts` (nuevo), `services/api-token.service.ts` (nuevo) y `controllers/api-token.controller.ts` (nuevo).
3. `backend/src/routes/user.routes.ts`: rutas de los tokens.
4. `backend/src/controllers/admin.controller.ts`: al borrar un usuario se borran sus tokens.
5. `backend/src/mcp/` (nuevo):
   - `mcp-auth.middleware.ts`, `internal-api.client.ts`, `tool-helpers.ts` y `server.ts`;
   - `tools/` con `curriculum`, `project`, `project-edit`, `user` y `admin`.
6. `backend/src/routes/mcp.routes.ts` (nuevo) y `server.ts`: montaje de `/api/mcp`.
7. `backend/src/tests/mcp.test.ts` (nuevo): 16 tests de extremo a extremo con el cliente MCP del SDK contra la app escuchando en un puerto efímero (tokens, 401/403/405/500, herramientas por rol, bajada de rol, permisos de IA, lectura por apartados e idioma, turno de edición, estado, renombrado y borrado).
8. `backend/src/tests/mcp-tools.test.ts` (nuevo): 20 tests de las herramientas con una API simulada, del registro y del cliente interno.
9. `frontend/src/app/features/personal/`:
   - `components/ai-connection/` (nuevo, con spec);
   - `services/api-tokens.service.ts` (nuevo, con spec);
   - `utils/mcp-client-config.ts` (nuevo, con spec);
   - `personal-view`: incluye el panel.
10. `frontend/src/app/services/translations.{es,ca}.ts`: textos del panel con paridad ES/CA.
11. `documentation/servidor_mcp.md` (nuevo).

## Decisiones técnicas
- **Remoto dentro del backend** en lugar de un paquete local por stdio: una sola URL, nada que instalar y se despliega con el flujo normal.
- **Tokens personales** en lugar de OAuth: funcionan ya con Claude Code, Claude Desktop y Gemini CLI. OAuth, necesario para los conectores de claude.ai web y móvil, queda para una tarea posterior sin cambiar las herramientas.
- **Adaptador sobre la API REST** en lugar de reimplementar lógica: los permisos y las reglas son siempre los de la web. El coste es una petición local adicional.
- **Sin estado y con respuestas JSON:** aguanta reinicios del contenedor y evita depender de que el Nginx no almacene SSE en búfer. Las tareas largas (generar, traducir, revisar) ya son asíncronas y se consultan por estado.
- **Respuestas acotadas:** índice primero y detalle bajo demanda en mapas, afinidades y apartados de proyectos, porque los datos completos pesan cientos de KB.
- **Revocar borra el token** en lugar de marcarlo con `revokedAt`: no se necesita historial.

## Verificación
- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npx vitest run --coverage`: 44 archivos y 557 tests en verde; cobertura del 99 % en instrucciones, 93,9 % en ramas, 100 % en funciones y 99,1 % en líneas. Los archivos de `src/mcp/` tienen el 100 % de líneas. Tras corregir un error de tipos en `mcp-tools.test.ts` se repitieron el typecheck y ese archivo (20 tests en verde).
- `cd frontend && npx eslint src/app/features/personal …`, `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- `cd frontend && npm test`: lint, tests, cobertura global y por archivo y comprobación zoneless, todo en verde.
- No se ha conectado todavía un Claude Code real contra producción. Los tests de extremo a extremo usan el cliente oficial del SDK por HTTP; la prueba real queda para después del despliegue.

## Desviaciones respecto al plan
- **Ubicación del panel:** «Área Personal → Conectar con IA», porque la aplicación no tiene una pantalla «Mi perfil».
- **Trazabilidad:** en lugar de añadir `source`/`tokenName` a `ActivityLog` y tocar todos los controladores, el servidor MCP registra su propia entrada `MCP_TOOL` por cada herramienta que escribe. Los controladores siguen registrando sus acciones habituales.
- **Revocar borra el token**, sin campo `revokedAt`.
- **Exportación e importación de proyectos de administración no incluidas:** manejan ficheros grandes que no encajan en una herramienta de chat.
- **Sin la reescritura de secciones con IA** (`/rewrite`): el propio asistente reescribe y guarda con `update_project_content`.
