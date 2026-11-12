import type { Request, Response, NextFunction } from 'express';
import { resolveApiToken, type ResolvedToken } from '../services/api-token.service';
import { resolveOAuthToken } from './oauth/oauth-token.service';
import { protectedResourceMetadataUrl } from './oauth/oauth-config';

export interface McpRequest extends Request {
  mcp?: ResolvedToken;
}

const bearerToken = (req: Request): string => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' && token ? token : '';
};

/** Token personal (`plp_…`) o token de acceso OAuth (`plpa_…`). */
const resolveToken = async (token: string): Promise<ResolvedToken | null> =>
  (await resolveApiToken(token)) ?? (await resolveOAuthToken(token));

/**
 * Cabecera del 401: anuncia los metadatos OAuth (descubrimiento de la especificación MCP) y, si
 * llegó un token, `invalid_token` para que el cliente lo renueve con su token de refresco.
 */
const challenge = (hadToken: boolean): string =>
  `Bearer realm="plappin"${hadToken ? ', error="invalid_token"' : ''}, resource_metadata="${protectedResourceMetadataUrl()}"`;

/**
 * Autenticación del servidor MCP: tokens personales o tokens OAuth (conectores de claude.ai).
 * Deja en `req.mcp` el usuario con su rol actual y el nombre del token o de la aplicación.
 */
export const mcpAuth = async (req: McpRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = bearerToken(req);
    const resolved = token ? await resolveToken(token) : null;
    if (!resolved) {
      res.status(401).set('WWW-Authenticate', challenge(Boolean(token))).json({
        error: 'Token de Plappin no válido o revocado. Créalo en «Área Personal → Conectar con IA».'
      });
      return;
    }
    if (resolved.user.role === 'pending') {
      res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por un administrador.' });
      return;
    }
    req.mcp = resolved;
    next();
  } catch {
    res.status(500).json({ error: 'Error al comprobar el token' });
  }
};
