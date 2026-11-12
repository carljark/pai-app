# Tarea 258: Conectar otras IA al servidor MCP (Gemini, DeepSeek…)

## Propósito
Que se pueda usar Plappin desde cualquier IA, no solo desde Claude. El servidor MCP de las tareas 256 y 257 ya es estándar; faltaba:
- facilitar la configuración de los clientes MCP con los que se usan Gemini, DeepSeek u otros modelos;
- poder admitir nuevos clientes web con OAuth sin tocar código.

## Arquitectura y flujo
- **Lista de redirecciones OAuth:** `MCP_OAUTH_REDIRECT_ALLOWLIST` ahora **amplía** la lista de claude.ai en lugar de sustituirla.
  - `docker-compose.prod.yml` pasa al backend esa variable y `PUBLIC_URL` (por defecto `https://plappin.org`).
  - Para admitir otro cliente web basta con añadir su URL de vuelta en el `.env` del servidor y volver a desplegar.
  - En `docker-compose.yml` (desarrollo), `PUBLIC_URL` vale por defecto `http://localhost:4200`, para que el consentimiento se abra en el frontend de desarrollo.
- **Panel «Conectar con IA»:** dos pestañas nuevas.
  - **LibreChat**: `librechat.yaml` con `type: streamable-http`; sirve con cualquier modelo de LibreChat, como DeepSeek o Gemini.
  - **Otro cliente MCP**: URL, transporte «Streamable HTTP» y cabecera `Authorization`, para Cherry Studio, Cline, Continue, etc.
  - Cada pestaña lleva una nota explicativa en castellano y catalán.
- **URL de vuelta de Gemini:** no se ha añadido ninguna al `.env`, porque no existe.
  - Gemini CLI, el único cliente de Gemini que se conecta a servidores MCP propios, vuelve a `localhost` al autorizar, y eso ya está permitido.
  - La web de Gemini no admite conectores MCP.

## Archivos modificados
1. `backend/src/mcp/oauth/oauth-config.ts`: la variable amplía la lista de claude.ai.
2. `backend/src/tests/mcp-oauth.test.ts`: el test comprueba que la lista ampliada conserva claude.ai y sigue rechazando dominios ajenos.
3. `docker-compose.prod.yml` y `docker-compose.yml`: `PUBLIC_URL` y `MCP_OAUTH_REDIRECT_ALLOWLIST`.
4. `frontend/src/app/features/personal/utils/mcp-client-config.ts` (+ spec): clientes `librechat` y `other`.
5. `frontend/src/app/features/personal/components/ai-connection/` (`.ts`, `.html`, `.scss`, spec): nota de cada cliente (`clientNote`).
6. `frontend/src/app/services/translations.{es,ca}.ts`: nombres de las pestañas y sus notas.
7. `documentation/servidor_mcp.md`: clientes, IA que se pueden conectar y cómo ampliar la lista.

## Decisiones técnicas
- **Ampliar en lugar de sustituir** la lista: evita que, al añadir un cliente, se pierda claude.ai por error.
- **Sin URL de vuelta de Gemini:** añadir una URL inventada solo abriría un hueco de seguridad.
- **Instrucciones genéricas** en lugar de una pestaña por aplicación: los clientes MCP cambian a menudo y todos piden los mismos tres datos (URL, transporte y cabecera).

## Verificación
- `cd backend && npm run typecheck`: 0 errores. `npx vitest run`: 45 archivos y 571 tests en verde.
- `cd frontend`: `npx eslint`, `ngc` y `tsc` sin errores. `npm test`: 135 archivos y 1225 tests en verde, con la cobertura y la comprobación zoneless cumplidas.
