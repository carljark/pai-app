# Plan 257: OAuth en el servidor MCP para conectar Plappin a claude.ai

> **Fecha:** 12 de noviembre de 2026
> **Estado:** Implementado (tarea 257)
> **Partes afectadas:** backend / frontend / despliegue (Nginx del contenedor del frontend)

---

## 1. Objetivo
Que un docente pueda añadir Plappin como **conector personalizado en claude.ai** (web, escritorio y móvil) con solo pegar la URL `https://plappin.org/api/mcp`. Claude le enviará a una pantalla de Plappin para iniciar sesión y autorizar el acceso, y desde entonces usará las mismas herramientas de la tarea 256 con sus permisos. Para ello el servidor MCP implementa la autorización de la especificación MCP: OAuth 2.1 con PKCE, registro dinámico de clientes y los metadatos estándar de descubrimiento. Los tokens personales `plp_…` siguen funcionando igual para Claude Code, Claude Desktop y Gemini CLI.

## 2. Escenarios
- **Escenario: descubrimiento**
  - **Dado** un cliente MCP sin credenciales
  - **Cuando** llama a `POST /api/mcp`
  - **Entonces** recibe 401 con `WWW-Authenticate: Bearer resource_metadata="https://plappin.org/.well-known/oauth-protected-resource/api/mcp"`.
  - **Y además** esa URL y `/.well-known/oauth-authorization-server` devuelven los metadatos (endpoints, `S256`, registro dinámico).
- **Escenario: registro dinámico de claude.ai**
  - **Cuando** claude.ai se registra en `POST /register` con `redirect_uris: ["https://claude.ai/api/mcp/auth_callback"]`
  - **Entonces** recibe su `client_id` y queda guardado en Mongo.
- **Escenario: redirección no permitida**
  - **Cuando** un cliente se registra con una `redirect_uri` fuera de la lista permitida (claude.ai, claude.com y loopback `localhost`/`127.0.0.1` para clientes de escritorio)
  - **Entonces** el registro se rechaza con `invalid_redirect_uri`.
- **Escenario: autorización con consentimiento**
  - **Dado** un cliente registrado
  - **Cuando** el navegador abre `/authorize` con PKCE
  - **Entonces** se redirige a `https://plappin.org/?view=oauth-consent&request=<id>`.
  - **Y cuando** el docente, ya con la sesión iniciada (si no la tiene, primero ve el login), pulsa «Autorizar»
  - **Entonces** vuelve a `redirect_uri?code=…&state=…`.
- **Escenario: el docente deniega**
  - **Cuando** pulsa «Cancelar»
  - **Entonces** vuelve a `redirect_uri?error=access_denied&state=…` y no se emite ningún código.
- **Escenario: canje del código con PKCE**
  - **Cuando** el cliente canjea el código en `POST /token` con el `code_verifier` correcto
  - **Entonces** recibe un `access_token` (1 h) y un `refresh_token` (30 días).
  - **Y si** el verificador es incorrecto, el código ha caducado (10 min) o ya se usó, recibe `invalid_grant`.
- **Escenario: uso del token de acceso**
  - **Dado** un `access_token` vigente
  - **Cuando** el cliente llama a `/api/mcp`
  - **Entonces** ve las herramientas de su rol actual, igual que con un token personal.
- **Escenario: renovación con rotación**
  - **Cuando** el cliente usa el `refresh_token`
  - **Entonces** recibe un par nuevo y el refresco anterior deja de servir.
- **Escenario: cuenta pendiente**
  - **Dado** un usuario `pending`
  - **Cuando** intenta autorizar
  - **Entonces** el consentimiento responde 403 y no se emite código.
- **Escenario: revocar la aplicación conectada**
  - **Dado** un docente con claude.ai conectado
  - **Cuando** lo revoca en «Área Personal → Conectar con IA → Aplicaciones conectadas»
  - **Entonces** sus tokens de acceso y de refresco dejan de servir.
- **Escenario: usuario borrado**
  - **Cuando** un administrador borra la cuenta
  - **Entonces** se borran también sus autorizaciones OAuth.

## 3. Alternativas
1. **Servidor de autorización del SDK (`mcpAuthRouter`) con un proveedor propio en Mongo** (**recomendada**). El SDK ya resuelve metadatos, registro dinámico, validación de PKCE y de `redirect_uri`, y los errores OAuth estándar. Nosotros solo implementamos el almacenamiento y la pantalla de consentimiento. La pega es que publica sus rutas en la raíz del dominio (`/authorize`, `/token`, `/register`, `/revoke`, `/.well-known/oauth-*`), que hoy sirve el Angular. Se resuelve con `location` en `frontend/nginx.conf`, que está en el repositorio y se despliega solo, sin tocar el Nginx del host.
2. **Endpoints OAuth propios bajo `/api/oauth/*`.** No hay que tocar Nginx, pero los metadatos `/.well-known/…` tienen que estar igualmente en la raíz, y reimplementar la validación de OAuth y PKCE a mano es arriesgado.
3. **Proveedor externo** (Auth0, Cognito…). Habría que federar las cuentas propias de Plappin, con coste y dependencia nueva. Descartada.

Otras decisiones:
- **Tokens opacos aleatorios** (`plpa_…` de acceso y `plpr_…` de refresco) guardados como hash, no JWT: se revocan al instante y el rol se lee en cada petición, igual que con los tokens personales.
- **Lista de redirecciones permitidas** (`MCP_OAUTH_REDIRECT_ALLOWLIST`, configurable): como el registro dinámico es abierto, evita que una web ajena use la pantalla de consentimiento de Plappin para conseguir tokens. Por defecto incluye `https://claude.ai/api/mcp/auth_callback`, `https://claude.com/api/mcp/auth_callback` y redirecciones de loopback.
- **Un único alcance (`plappin`):** el acceso equivale a la cuenta, como el token personal. Más adelante se podrían separar lectura y escritura.

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/models/OAuthClient.ts` (nuevo) | Cliente registrado (`client_id`, metadatos, `redirect_uris`, fecha) | domain |
| `backend/src/models/OAuthRequest.ts` (nuevo) | Petición de autorización pendiente de consentimiento (cliente, `redirect_uri`, `code_challenge`, `state`, `scopes`, `resource`); caduca en 10 min con índice TTL | domain |
| `backend/src/models/OAuthGrant.ts` (nuevo) | Autorización de un usuario a un cliente, con el hash del código (10 min, un solo uso), del token de acceso (1 h) y del de refresco (30 días), y `lastUsedAt` | domain |
| `backend/src/mcp/oauth/oauth-provider.ts` (nuevo) | `OAuthServerProvider` del SDK: `clientsStore` (con la lista de redirecciones), `authorize` (guarda la petición y redirige al consentimiento), `challengeForAuthorizationCode`, `exchangeAuthorizationCode`, `exchangeRefreshToken` (rotación), `verifyAccessToken`, `revokeToken` | application |
| `backend/src/mcp/oauth/oauth-consent.controller.ts` (nuevo) | `GET /api/oauth/requests/:id` (datos para la pantalla: nombre y dominio del cliente), `POST /api/oauth/requests/:id` (`{ approve }` → URL de vuelta con `code` o `error`), `GET/DELETE /api/oauth/grants` (aplicaciones conectadas) | presentation |
| `backend/src/mcp/oauth/oauth-config.ts` (nuevo) | URL pública (`PUBLIC_URL`, por defecto `https://plappin.org`), duraciones y lista de redirecciones | config |
| `backend/src/mcp/mcp-auth.middleware.ts` | Acepta `plp_…` (token personal) o un `access_token` OAuth; en el 401 añade `resource_metadata` | presentation |
| `backend/src/server.ts` | Monta `mcpAuthRouter` en la raíz, las rutas de consentimiento con `authMiddleware` y `app.set('trust proxy', 1)` (límite de peticiones del SDK detrás de Nginx) | config |
| `backend/src/controllers/admin.controller.ts` | Borrar usuario → borrar también sus `OAuthGrant` | application |
| `backend/src/tests/mcp-oauth.test.ts` (nuevo) | Escenarios de §2, incluido el flujo completo con el cliente OAuth del SDK | test |
| `frontend/nginx.conf` | `location` para `/.well-known/oauth-*`, `/authorize`, `/token`, `/register` y `/revoke` → `http://backend:3000` | config |
| `frontend/proxy.conf.json` | Las mismas rutas en desarrollo | config |
| `frontend/src/app/services/view-route.ts` | Vista nueva `oauth-consent` | presentation |
| `frontend/src/app/features/oauth/components/oauth-consent/` (nuevo) | Pantalla «¿Autorizar a Claude a usar tu cuenta de Plappin?» con el cliente, su dominio, lo que podrá hacer y los botones Autorizar/Cancelar | presentation |
| `frontend/src/app/features/oauth/services/oauth-consent.service.ts` (nuevo) | Llamadas a `/api/oauth/requests/:id` | application |
| `frontend/src/app/features/personal/components/ai-connection/` | Bloque «Aplicaciones conectadas» (nombre, último uso y revocar) e instrucciones para claude.ai | presentation |
| `frontend/src/app/services/translations.{es,ca}.ts` | Textos de la pantalla de consentimiento y del bloque nuevo | presentation |
| `documentation/servidor_mcp.md` | Sección OAuth: flujo, endpoints, Nginx, lista de redirecciones y cómo añadir el conector en claude.ai | docs |

## 5. Tareas
- [ ] Crear la rama `feature/257_oauth_servidor_mcp`.
- [ ] Modelos y configuración OAuth.
- [ ] Proveedor del SDK con almacenamiento en Mongo, rotación de refresco y lista de redirecciones, con sus tests unitarios.
- [ ] Endpoints de consentimiento y aplicaciones conectadas; `mcpAuth` con los dos tipos de token y `resource_metadata`.
- [ ] Test de extremo a extremo: descubrimiento → registro → autorización → consentimiento → token → `tools/list` → renovación → revocación.
- [ ] Nginx del frontend y proxy de desarrollo.
- [ ] Pantalla de consentimiento (login previo si no hay sesión) y bloque de aplicaciones conectadas, con ES/CA y specs.
- [ ] Documentación, lint y typecheck, suites completas y registro de la tarea 257.
- [ ] Commit, push, CI en verde, integración en `main` y seguimiento del despliegue.
- [ ] En producción: comprobar los metadatos con `curl` y añadir el conector en claude.ai con tu cuenta (esta prueba la tienes que hacer tú, porque requiere tu sesión).

## 6. Riesgos y verificación prevista
- **Rutas en la raíz del dominio:** si el Nginx del host atendiera `/.well-known/` por su cuenta (p. ej. por certbot), los metadatos no llegarían al backend. Hoy `https://plappin.org/.well-known/oauth-protected-resource` responde el `index.html` del Angular, así que llega al contenedor del frontend y su `nginx.conf` puede reenviarlo. Se verificará con `curl` tras el despliegue. `acme-challenge` no se toca.
- **Límite de peticiones del SDK detrás de un proxy:** `express-rate-limit` necesita `trust proxy` para leer la IP real; sin él, avisa o limita a todos por igual. Lo cubrirá un test.
- **Seguridad:**
  - lista de redirecciones;
  - PKCE obligatorio (`S256`);
  - códigos de un solo uso con 10 min;
  - tokens solo como hash;
  - rotación del refresco;
  - consentimiento explícito con el dominio del cliente visible;
  - las cuentas pendientes no pueden autorizar.
- **Compatibilidad con claude.ai:** usa el registro dinámico y la URL de vuelta `https://claude.ai/api/mcp/auth_callback`. Si cambiara, bastaría con actualizar la lista de redirecciones por variable de entorno.
- **Sin migraciones de datos:** solo colecciones nuevas, con índices TTL para la limpieza.
- **Frontend:** la vista nueva respeta el modo zoneless (signals), los componentes por debajo de 200 líneas y la cobertura por archivo; el bloque nuevo del Área Personal puede ir en un subcomponente para no engordar `ai-connection`.
- **Verificación:**
  - `cd backend && npm run typecheck && npm test`;
  - `cd frontend && npx eslint … && npm test`;
  - tras desplegar, `curl https://plappin.org/.well-known/oauth-authorization-server`, `curl -i -X POST https://plappin.org/api/mcp` (cabecera `resource_metadata`) y la conexión real desde claude.ai.
