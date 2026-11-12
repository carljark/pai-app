import type { RequestHandler } from 'express';
import { mcpAuthRouter } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { oauthProvider } from './oauth-provider';
import { OAUTH_RESOURCE_NAME, OAUTH_SCOPE, REGISTRATION_RATE_LIMIT, mcpResourceUrl, publicUrl } from './oauth-config';

/**
 * Servidor de autorización OAuth 2.1 del SDK, montado en la raíz del dominio:
 * `/.well-known/oauth-authorization-server`, `/.well-known/oauth-protected-resource/api/mcp`,
 * `/authorize`, `/token`, `/register` y `/revoke` (el Nginx del frontend los reenvía al backend).
 */
export const oauthRouter = (): RequestHandler =>
  mcpAuthRouter({
    provider: oauthProvider,
    issuerUrl: publicUrl(),
    resourceServerUrl: mcpResourceUrl(),
    scopesSupported: [OAUTH_SCOPE],
    resourceName: OAUTH_RESOURCE_NAME,
    clientRegistrationOptions: { rateLimit: { max: REGISTRATION_RATE_LIMIT } }
  });
