import type { Request, Response, NextFunction } from 'express';
import { resolveApiToken, type ResolvedToken } from '../services/api-token.service';

export interface McpRequest extends Request {
  mcp?: ResolvedToken;
}

const bearerToken = (req: Request): string => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' && token ? token : '';
};

/**
 * Autenticación del servidor MCP con tokens personales (`Authorization: Bearer plp_…`).
 * Deja en `req.mcp` el usuario con su rol actual y el nombre del token.
 */
export const mcpAuth = async (req: McpRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = bearerToken(req);
    const resolved = token ? await resolveApiToken(token) : null;
    if (!resolved) {
      res.status(401).set('WWW-Authenticate', 'Bearer realm="plappin"').json({
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
