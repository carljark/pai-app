# Tarea 257: OAuth en el servidor MCP para conectar Plappin a claude.ai

> **Plan:** [257 — OAuth en el servidor MCP para conectar Plappin a claude.ai](../planes/257_plan_oauth_servidor_mcp.md)

## Propósito
Los conectores personalizados de claude.ai (web, escritorio y móvil) no permiten configurar cabeceras, así que no pueden usar los tokens personales de la tarea 256: exigen la autorización OAuth 2.1 de la especificación MCP. Con esta tarea, el docente añade el conector con la URL `https://plappin.org/api/mcp`, autoriza el acceso en una pantalla de Plappin y Claude usa las mismas herramientas MCP con sus permisos.

## Arquitectura y flujo
1. claude.ai llama a `/api/mcp` sin credenciales. El 401 lleva `resource_metadata`, que apunta a `/.well-known/oauth-protected-resource/api/mcp`, y de ahí al servidor de autorización (`/.well-known/oauth-authorization-server`).
2. Registro dinámico en `/register`: solo se admiten las redirecciones permitidas (claude.ai, claude.com y loopback).
3. `/authorize` (PKCE `S256`): el proveedor guarda la petición (`OAuthRequest`, 10 min) y redirige a `https://plappin.org/?view=oauth-consent&request=<id>`.
4. Pantalla de consentimiento en Angular (vista `oauth-consent`):
   - si no hay sesión, primero aparece el login;
   - muestra el cliente, el dominio de vuelta y lo que podrá hacer;
   - `POST /api/oauth/requests/:id` consume la petición y responde la URL de vuelta, con `code` o con `error=access_denied`.
5. `/token` canjea el código (un solo uso, 10 min) con el verificador PKCE por un token de acceso (`plpa_…`, 1 h) y uno de refresco (`plpr_…`, 30 días). El refresco rota en cada uso.
6. `mcpAuth` acepta los tokens personales y los de acceso OAuth, y en ambos casos lee el rol actual del usuario. Las herramientas no cambian.
7. «Área Personal → Conectar con IA → Aplicaciones conectadas» lista las autorizaciones y permite desconectarlas. Al borrar un usuario se borran también sus autorizaciones.

El servidor de autorización es el del SDK (`mcpAuthRouter`), montado en la raíz del dominio. El Nginx del contenedor del frontend reenvía esas rutas al backend.

## Archivos modificados
1. `backend/src/mcp/oauth/` (nuevo):
   - `oauth-config.ts`: URL pública, duraciones y lista de redirecciones;
   - `oauth-provider.ts`: proveedor del SDK con almacenamiento en Mongo;
   - `oauth-router.ts`: `mcpAuthRouter`;
   - `oauth-token.service.ts`: token de acceso → usuario;
   - `oauth-consent.controller.ts`: consentimiento y aplicaciones conectadas.
2. `backend/src/models/OAuthClient.ts`, `OAuthRequest.ts` y `OAuthGrant.ts` (nuevos, con índices TTL).
3. `backend/src/routes/oauth.routes.ts` (nuevo) y `server.ts`: `trust proxy` para direcciones privadas, `oauthRouter()` en la raíz y `/api/oauth` con la sesión web.
4. `backend/src/mcp/mcp-auth.middleware.ts`: dos tipos de token, y `WWW-Authenticate` con `resource_metadata` y `invalid_token`.
5. `backend/src/services/api-token.service.ts`: se extraen `loadTokenUser` y `shouldRefreshLastUsed`, que ahora se usan para los dos tipos de token.
6. `backend/src/controllers/admin.controller.ts`: borrar un usuario borra sus `OAuthGrant`.
7. `backend/src/tests/mcp-oauth.test.ts` (nuevo): 14 tests, incluido el flujo completo de descubrimiento → registro → autorización → consentimiento → token → cliente MCP real → renovación → revocación.
8. `frontend/nginx.conf`: `location` que reenvía `/.well-known/oauth-*`, `/authorize`, `/token`, `/register` y `/revoke` a `backend:3000`. `frontend/proxy.conf.json`: lo mismo en desarrollo.
9. `frontend/src/app/services/view-route.ts` (+ spec): vista `oauth-consent` con su `request`, y `TRANSIENT_VIEWS`. `layout.service.ts` (+ spec): esa vista no se recuerda como la última.
10. `frontend/src/app/features/oauth/` (nuevo): `OAuthConsentService` y `OAuthConsentComponent`, con specs.
11. `frontend/src/app/app.ts` y `app.html`: la vista nueva.
12. `frontend/src/app/features/personal/components/connected-apps/` (nuevo, con spec), incluido en `ai-connection` (y su spec).
13. `frontend/src/app/services/translations.{es,ca}.ts`: consentimiento, aplicaciones conectadas e instrucciones de claude.ai.
14. `documentation/servidor_mcp.md`: secciones de claude.ai y de OAuth.

## Decisiones técnicas
- **SDK en lugar de endpoints propios:** reutiliza la validación de PKCE, `redirect_uri`, errores y límites de peticiones del SDK oficial. El precio es servir rutas en la raíz del dominio, que se resuelve en el `nginx.conf` del frontend, versionado y desplegado por CI, sin tocar el Nginx del host.
- **Tokens opacos con hash** en lugar de JWT: se revocan al instante y el rol se lee en cada petición, igual que con los tokens personales.
- **Lista de redirecciones:** el registro dinámico es abierto, así que la lista evita que una web ajena use el consentimiento de Plappin para llevarse tokens. Es configurable con `MCP_OAUTH_REDIRECT_ALLOWLIST`.
- **Revocar un token** (`/revoke`) o desconectar desde el Área Personal borra la autorización entera (acceso y refresco).
- **Un único alcance (`plappin`):** equivale a la cuenta, como el token personal.
- **Límite de registro:** se sube de 20 a 200 por IP y hora, porque todos los docentes que conectan claude.ai se registran desde las IP de Anthropic.
- **`trust proxy` solo para direcciones privadas** (loopback, link-local y ULA/RFC 1918): la IP real llega en `X-Forwarded-For` a través de uno o dos Nginx.

## Verificación
- `cd backend && npm run typecheck`: 0 errores, tras corregir tres de tipos en el test.
- `cd backend && npx vitest run --coverage`: 45 archivos y 571 tests en verde; cobertura del 99,1 % en instrucciones, 93,9 % en ramas, 100 % en funciones y 99,2 % en líneas. Después de la corrección de tipos se repitió `mcp-oauth.test.ts` (14 en verde).
- `cd frontend`: `npx eslint` sobre lo tocado, `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`, sin errores.
- `cd frontend && npm test`: 135 archivos y 1223 tests en verde, cobertura global y por archivo cumplida y comprobación zoneless correcta. Antes se añadieron dos casos a `oauth-consent`, que no llegaba al 90 % por archivo.
- `frontend/nginx.conf`, comprobado en un contenedor `nginx:alpine`:
  - `nginx -t` correcto;
  - las seis rutas OAuth van al backend (502, porque no había backend);
  - `/`, `/?view=oauth-consent`, `/tokens` y `/authorize/x` siguen sirviendo el Angular.
- Pendiente tras el despliegue: comprobar los metadatos con `curl` en producción. La conexión real desde claude.ai la tiene que hacer el usuario, con su sesión.

## Desviaciones respecto al plan
- `OAuthRequest` y `OAuthGrant` caducan con índices TTL sobre un único campo `expiresAt`: es la caducidad del código y, tras canjearlo, la del refresco.
- Se añade `oauth-token.service.ts` para resolver los tokens OAuth en `mcpAuth`; no estaba en la tabla del plan.
- La vista de consentimiento usa la navegación propia de la aplicación (`?view=`) y no el router de Angular, que no se usa. Se añade `TRANSIENT_VIEWS` para que no se recuerde como la última pantalla.
- El límite de registro de clientes se sube a 200 por IP y hora (no estaba previsto en el plan).
