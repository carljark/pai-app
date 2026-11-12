/**
 * Configuración de OAuth del servidor MCP (ver documentation/servidor_mcp.md).
 * `PUBLIC_URL` es la URL pública de la aplicación: emisor OAuth y base de la pantalla de consentimiento.
 */
export const DEFAULT_PUBLIC_URL = 'https://plappin.org';
export const MCP_RESOURCE_PATH = '/api/mcp';
export const OAUTH_SCOPE = 'plappin';
export const OAUTH_RESOURCE_NAME = 'Plappin';

/** La petición de autorización espera el consentimiento como mucho este tiempo. */
export const AUTH_REQUEST_TTL_MS = 10 * 60 * 1000;
/** El código de autorización caduca a los 10 minutos y es de un solo uso. */
export const AUTH_CODE_TTL_MS = 10 * 60 * 1000;
export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** Registros de clientes por IP y hora: claude.ai registra un cliente por cada docente que conecta. */
export const REGISTRATION_RATE_LIMIT = 200;

export const ACCESS_TOKEN_PREFIX = 'plpa_';
export const REFRESH_TOKEN_PREFIX = 'plpr_';

/** URL de vuelta de los conectores de claude.ai (web, escritorio y móvil). */
export const DEFAULT_REDIRECT_ALLOWLIST = [
  'https://claude.ai/api/mcp/auth_callback',
  'https://claude.com/api/mcp/auth_callback'
];

export const publicUrl = (): URL => new URL(process.env.PUBLIC_URL || DEFAULT_PUBLIC_URL);

export const mcpResourceUrl = (): URL => new URL(MCP_RESOURCE_PATH, publicUrl());

/** Metadatos del recurso protegido que se anuncian en el 401 del servidor MCP. */
export const protectedResourceMetadataUrl = (): string =>
  new URL(`/.well-known/oauth-protected-resource${MCP_RESOURCE_PATH}`, publicUrl()).href;

/** Pantalla de consentimiento del frontend para una petición de autorización. */
export const consentUrl = (requestId: string): string => {
  const url = new URL('/', publicUrl());
  url.search = new URLSearchParams({ view: 'oauth-consent', request: requestId }).toString();
  return url.href;
};

const redirectAllowlist = (): string[] => {
  const configured = (process.env.MCP_OAUTH_REDIRECT_ALLOWLIST || '').split(',').map((u) => u.trim()).filter(Boolean);
  return configured.length > 0 ? configured : DEFAULT_REDIRECT_ALLOWLIST;
};

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

/**
 * Redirecciones permitidas al registrar un cliente: las de la lista (claude.ai por defecto) y las de
 * loopback, que usan los clientes de escritorio y de terminal. El registro es abierto, así que esto
 * evita que una web ajena use el consentimiento de Plappin para llevarse tokens.
 */
export const isAllowedRedirect = (uri: string): boolean => {
  if (redirectAllowlist().includes(uri)) return true;
  try {
    const url = new URL(uri);
    return url.protocol === 'http:' && LOOPBACK_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
};
