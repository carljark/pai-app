# Servidor MCP de Plappin

Plappin expone un servidor **MCP** (Model Context Protocol) en `https://plappin.org/api/mcp` para que cada docente conecte un asistente de IA (Claude Code, Claude Desktop, Gemini CLI…) con su cuenta y trabaje con la aplicación desde él. Los permisos son los mismos que en la web; los administradores tienen además herramientas de administración.

## Conexión
1. **Área Personal → Conectar con IA → Crear token.** El token (`plp_…`) se muestra **una sola vez**; en Mongo (`apitokens`) solo se guarda su hash SHA-256 y un prefijo visible. Máximo 5 tokens por usuario; las cuentas pendientes no pueden crearlos.
2. Configuración en cada asistente (el panel la genera con el token ya puesto):
   - **Claude Code:** `claude mcp add --transport http plappin https://plappin.org/api/mcp --header "Authorization: Bearer plp_…"`
   - **Claude Desktop** (`claude_desktop_config.json`, a través de `mcp-remote`): `{"mcpServers":{"plappin":{"command":"npx","args":["-y","mcp-remote","https://plappin.org/api/mcp","--header","Authorization: Bearer plp_…"]}}}`
   - **Gemini CLI** (`~/.gemini/settings.json`): `{"mcpServers":{"plappin":{"httpUrl":"https://plappin.org/api/mcp","headers":{"Authorization":"Bearer plp_…"}}}}`
3. Revocar un token en el mismo panel lo invalida al instante. Al borrar un usuario se borran sus tokens.

### claude.ai (web, escritorio y móvil): OAuth
Los conectores personalizados de claude.ai no admiten cabeceras propias: usan **OAuth 2.1** (tarea 257).
1. En claude.ai: Ajustes → Conectores → Añadir conector personalizado → URL `https://plappin.org/api/mcp`.
2. Claude descubre el servidor de autorización, se registra, abre `https://plappin.org/authorize` y el navegador llega a la pantalla de consentimiento de Plappin (`?view=oauth-consent&request=…`). Si no hay sesión, primero aparece el login.
3. Al pulsar «Autorizar», Plappin vuelve a claude.ai con un código, que Claude canjea por los tokens. Desde entonces usa las mismas herramientas con los permisos del docente.
4. Las conexiones aparecen en «Área Personal → Conectar con IA → Aplicaciones conectadas», desde donde se pueden desconectar.

## OAuth 2.1 (tarea 257)
- **Servidor de autorización del SDK** (`mcpAuthRouter`, en `mcp/oauth/oauth-router.ts`), montado en la raíz del dominio:
  - `/.well-known/oauth-authorization-server` y `/.well-known/oauth-protected-resource/api/mcp` (metadatos);
  - `/authorize`, `/token`, `/register` (registro dinámico) y `/revoke`.

  El SDK valida los parámetros, PKCE (`S256`) y las `redirect_uri`, y aplica límites de peticiones (registro: 200 por IP y hora, porque claude.ai registra un cliente por cada docente).
- **Enrutado:** esas rutas las sirve el Nginx del **contenedor del frontend** (`frontend/nginx.conf`), que las reenvía a `backend:3000`; en desarrollo, `frontend/proxy.conf.json`. El Nginx del host no cambia. Express confía en `X-Forwarded-For` de direcciones privadas (`trust proxy`) para que los límites usen la IP real.
- **Proveedor** (`mcp/oauth/oauth-provider.ts`), con datos en Mongo:
  - `OAuthClient`: clientes registrados;
  - `OAuthRequest`: peticiones pendientes de consentimiento (10 min, TTL);
  - `OAuthGrant`: autorizaciones, con el hash del código (10 min, un solo uso), del token de acceso (`plpa_…`, 1 h) y del de refresco (`plpr_…`, 30 días, con rotación). Mongo las borra al caducar (TTL).
- **Redirecciones permitidas:** el registro es abierto, así que solo se aceptan las URL de vuelta de claude.ai y claude.com (`/api/mcp/auth_callback`) y las de loopback `http://localhost|127.0.0.1|[::1]` (clientes de escritorio). Se puede cambiar con `MCP_OAUTH_REDIRECT_ALLOWLIST` (lista separada por comas).
- **Consentimiento** (`mcp/oauth/oauth-consent.controller.ts`, con la sesión web): `GET/POST /api/oauth/requests/:id` (las cuentas pendientes no pueden autorizar) y `GET/DELETE /api/oauth/grants` (aplicaciones conectadas).
- **Servidor MCP:** `mcpAuth` acepta tokens personales (`plp_…`) y tokens de acceso OAuth (`plpa_…`); con ambos lee el rol actual en cada petición. El 401 lleva `WWW-Authenticate: Bearer … resource_metadata="https://plappin.org/.well-known/oauth-protected-resource/api/mcp"` (y `error="invalid_token"` si llegó un token), que es lo que usa el cliente para descubrir OAuth o renovar el token.
- **URL pública:** `PUBLIC_URL` (por defecto `https://plappin.org`) es el emisor OAuth y la base de la pantalla de consentimiento. En desarrollo: `PUBLIC_URL=http://localhost:4200`.

## Arquitectura
- `routes/mcp.routes.ts`: `POST /api/mcp` con `StreamableHTTPServerTransport` de `@modelcontextprotocol/sdk` en modo **sin estado** (un servidor por petición) y `enableJsonResponse` (respuestas JSON, sin SSE, para no depender del búfer del Nginx). `GET` y `DELETE` → 405. Se monta antes del `authMiddleware` general porque usa su propia autenticación.
- `mcp/mcp-auth.middleware.ts`: `Authorization: Bearer plp_…` → usuario con su **rol y permiso de IA actuales** (se leen de `User` en cada petición; no se guardan en el token). 401 si el token no existe o su usuario se borró; 403 si la cuenta está pendiente. `lastUsedAt` se actualiza como mucho una vez por minuto.
- `mcp/internal-api.client.ts`: las herramientas **no reimplementan lógica**. Llaman a la API REST local (`http://127.0.0.1:$PORT/api/…`) con un JWT interno de 5 minutos del usuario, así que pasan por los mismos middlewares y validaciones que la web (`requireApproved`, `requireAiAccess`, `projectEditGuards`, `requireAdmin`, límites diarios…). Lo nuevo en la API llega al MCP añadiendo solo la definición de la herramienta.
- `mcp/server.ts`: `buildMcpServer` registra las herramientas según el rol (`toolsFor`) e incluye instrucciones para el asistente.
- `mcp/tool-helpers.ts`: definición de herramientas (`kind`: `read`, `write` o `destructive` → anotaciones `readOnlyHint`/`destructiveHint`), resultados y errores (`isError` con el mensaje de la API) y registro en `ActivityLog` (`action: 'MCP_TOOL'`, `details: { tool, tokenName }`) de cada herramienta que escribe.

## Herramientas
| Grupo | Herramientas |
|---|---|
| Cuenta (`user.tools.ts`) | `whoami`, `find_users`, `get_school_settings`, `list_my_center_requests`, `request_center`, `send_feedback` |
| Currículo (`curriculum.tools.ts`) | `list_levels`, `list_learning_outcomes`, `list_eso_competences`, `get_intermodular_map`, `get_eso_affinities`, `list_ai_models`, `get_fp_offer` |
| Proyectos, lectura (`project.tools.ts`) | `list_projects`, `get_project` (con `section` y `language`), `get_project_status`, `list_project_changes`, `get_project_review` |
| Proyectos, cambios (`project-edit.tools.ts`) | `generate_project`, `retry_project`, `update_project_content`, `rename_project`, `translate_project`, `review_project`, `clone_project`, `delete_project`, `add_collaborator`, `remove_collaborator` |
| Administración (`admin.tools.ts`, solo `admin`) | `admin_list_users`, `admin_update_user`, `admin_delete_user`, `admin_get_activity_logs`, `admin_get_analytics`, `admin_list_center_requests`, `admin_update_center_request`, `admin_list_feedback`, `admin_update_feedback`, `admin_delete_feedback`, `admin_update_school_settings` |

Detalles:
- **Respuestas grandes:** `get_project` permite pedir un solo apartado (`section`); los mapas y las afinidades devuelven primero un índice (módulos o materias) y el detalle solo de lo pedido.
- **Turno de edición:** `update_project_content` y `translate_project` dejan que la API tome el turno y lo liberan al terminar, salvo que el usuario ya lo tuviera (p. ej. con el proyecto abierto en la web). Si otra persona edita, devuelven el 409 sin escribir.
- **Administración en dos capas:** las herramientas `admin_*` no se registran para no administradores y la API vuelve a exigir `requireAdmin`. Si un administrador pierde el rol, deja de verlas en la siguiente petición.

## Seguridad
- Un token da acceso a la cuenta entera: se guarda solo como hash, se puede revocar y se muestra una vez.
- No hay herramientas que ejecuten código ni lean archivos del servidor.
- El contenido de los proyectos vuelve al asistente como datos; las instrucciones del servidor y de `get_project` lo advierten (inyección de instrucciones).
- Las herramientas de IA (generar, traducir, revisar) usan la cola, los permisos y los límites de siempre.
