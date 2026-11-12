import { Router, type RequestHandler } from 'express';
import { createOAuthMetadata, mcpAuthRouter } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { oauthProvider } from './oauth-provider';
import { OAUTH_RESOURCE_NAME, OAUTH_SCOPE, REGISTRATION_RATE_LIMIT, mcpResourceUrl, publicUrl } from './oauth-config';

/**
 * Metadatos del servidor de autorización (RFC 8414): los del SDK más
 * `authorization_response_iss_parameter_supported` (RFC 9207), porque el consentimiento devuelve
 * `iss` en cada respuesta. ChatGPT lo exige para usar su URL de vuelta fija.
 */
export const authorizationServerMetadata = () => ({
  ...createOAuthMetadata({ provider: oauthProvider, issuerUrl: publicUrl(), scopesSupported: [OAUTH_SCOPE] }),
  authorization_response_iss_parameter_supported: true
});

/** Metadatos del recurso protegido (RFC 9728); `authorization_servers` coincide exactamente con `issuer`. */
export const protectedResourceMetadata = () => ({
  resource: mcpResourceUrl().href,
  authorization_servers: [publicUrl().href],
  scopes_supported: [OAUTH_SCOPE],
  resource_name: OAUTH_RESOURCE_NAME
});

/**
 * Servidor de autorización OAuth 2.1 del SDK, montado en la raíz del dominio:
 * `/.well-known/oauth-authorization-server`, `/.well-known/oauth-protected-resource[/api/mcp]`,
 * `/authorize`, `/token`, `/register` y `/revoke` (el Nginx del frontend los reenvía al backend).
 * Los metadatos propios van antes que los del SDK para añadir los campos que este no publica.
 */
export const oauthRouter = (): RequestHandler => {
  const router = Router();
  router.get('/.well-known/oauth-authorization-server', (_req, res) => {
    res.json(authorizationServerMetadata());
  });
  // Algunos clientes consultan los metadatos del recurso en la raíz, sin la ruta del servidor MCP
  router.get('/.well-known/oauth-protected-resource', (_req, res) => {
    res.json(protectedResourceMetadata());
  });
  router.use(mcpAuthRouter({
    provider: oauthProvider,
    issuerUrl: publicUrl(),
    resourceServerUrl: mcpResourceUrl(),
    scopesSupported: [OAUTH_SCOPE],
    resourceName: OAUTH_RESOURCE_NAME,
    clientRegistrationOptions: { rateLimit: { max: REGISTRATION_RATE_LIMIT } }
  }));
  return router;
};
