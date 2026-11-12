import type { Response } from 'express';
import { ApiTokenError, createApiToken, listApiTokens, revokeApiToken } from '../services/api-token.service';

/** GET /api/users/me/tokens — tokens de conexión del usuario (sin el token completo). */
export const getMyTokens = async (req: any, res: Response) => {
  try {
    res.json(await listApiTokens(req.user._id));
  } catch {
    res.status(500).json({ error: 'Error al cargar los tokens' });
  }
};

/** POST /api/users/me/tokens — crea un token; la respuesta es la única vez que se ve completo. */
export const createMyToken = async (req: any, res: Response) => {
  try {
    res.status(201).json(await createApiToken(req.user._id, req.body?.name));
  } catch (error: any) {
    if (error instanceof ApiTokenError) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Error al crear el token' });
  }
};

/** DELETE /api/users/me/tokens/:id — revoca un token propio. */
export const revokeMyToken = async (req: any, res: Response) => {
  try {
    if (!(await revokeApiToken(req.user._id, String(req.params.id)))) {
      return res.status(404).json({ error: 'Token no encontrado' });
    }
    res.json({ message: 'Token revocado' });
  } catch {
    res.status(500).json({ error: 'Error al revocar el token' });
  }
};
