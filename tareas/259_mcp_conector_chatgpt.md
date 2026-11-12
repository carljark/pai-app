# Tarea 259: Conectar ChatGPT al servidor MCP

## Propósito
Poder conectar Plappin desde chatgpt.com, igual que desde claude.ai. ChatGPT usa el OAuth 2.1 con registro dinámico de la tarea 257, pero lo habríamos rechazado por dos motivos:
- su URL de vuelta no estaba en la lista permitida;
- solo usa su URL fija si el servidor de autorización cumple la identificación del emisor de la RFC 9207 (según la [documentación de OpenAI](https://developers.openai.com/apps-sdk/build/auth)).

## Arquitectura y flujo
- **Redirecciones:** se permiten `https://chatgpt.com/connector_platform_oauth_redirect` (fija) y las de la forma `https://chatgpt.com/connector/oauth/{id}`. Estas últimas se aceptan con un patrón estricto: solo letras, números, `_` y `-` en el identificador.
- **Identificación del emisor (RFC 9207):**
  - los metadatos del servidor de autorización los sirve un manejador propio, antes del router del SDK, con los del SDK (`createOAuthMetadata`) más `authorization_response_iss_parameter_supported: true`;
  - la respuesta del consentimiento añade siempre `iss` (el mismo `issuer` de los metadatos, `https://plappin.org/`), tanto con `code` como con `error=access_denied`;
  - `issuer` y `authorization_servers` coinciden exactamente.
- **Metadatos del recurso también en la raíz:** se sirven en `/.well-known/oauth-protected-resource` además de en `/.well-known/oauth-protected-resource/api/mcp`, por los clientes que los buscan ahí. El `nginx.conf` del frontend ya reenviaba esa ruta.
- **Panel:** las instrucciones de «Aplicaciones conectadas» explican también cómo crear la aplicación en ChatGPT (modo desarrollador).

## Archivos modificados
1. `backend/src/mcp/oauth/oauth-config.ts`: URL fija de ChatGPT en la lista por defecto y patrón de las URL por conexión.
2. `backend/src/mcp/oauth/oauth-router.ts`: `authorizationServerMetadata` y `protectedResourceMetadata` propios, y metadatos del recurso en la raíz.
3. `backend/src/mcp/oauth/oauth-consent.controller.ts`: `iss` en todas las respuestas del consentimiento.
4. `backend/src/tests/mcp-oauth.test.ts`: redirecciones de ChatGPT (válidas y trucadas), el campo nuevo de los metadatos, la coincidencia `issuer`/`authorization_servers`, los metadatos en la raíz y `iss` en las respuestas.
5. `frontend/src/app/services/translations.{es,ca}.ts`: instrucciones de ChatGPT.
6. `documentation/servidor_mcp.md`: sección de ChatGPT.

## Decisiones técnicas
- **Cumplir la RFC 9207** para que ChatGPT use su URL fija, en lugar de pedir al usuario que copie la URL de cada conexión a la lista.
- **Se admite también la URL por conexión**, con un patrón estricto sobre el dominio `chatgpt.com`, por si cambian las condiciones.
- **Sin CIMD:** no se anuncia `client_id_metadata_document_supported`, así que ChatGPT usa el registro dinámico, que ya funciona.
- **Errores previos al consentimiento sin `iss`:** las redirecciones con error que genera el propio SDK en `/authorize` (parámetros mal formados) no llevan `iss`. Son peticiones inválidas que fallarían de todos modos.
- **Audiencia:** no se ha añadido una comprobación de la audiencia (`resource`) del token, porque solo hay un recurso protegido. Queda anotado por si se añaden más.

## Verificación
- `cd backend && npm run typecheck`: 0 errores. `npx vitest run`: 45 archivos y 571 tests en verde.
- `cd frontend && npm test`: 135 archivos y 1225 tests en verde, con la cobertura y la comprobación zoneless cumplidas.
- La conexión real desde chatgpt.com la tiene que hacer el usuario, con su cuenta.
