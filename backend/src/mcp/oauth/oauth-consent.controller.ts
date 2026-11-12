import type { Response } from 'express';
import { OAuthRequest } from '../../models/OAuthRequest';
import { OAuthGrant } from '../../models/OAuthGrant';
import { hashToken } from '../../services/api-token.service';
import { clientsStore, randomToken } from './oauth-provider';
import { AUTH_CODE_TTL_MS, publicUrl } from './oauth-config';

const findRequest = (requestId: string) =>
  OAuthRequest.findOne({ requestId, expiresAt: { $gt: new Date() } }).lean<any>();

/** Nombre visible del cliente: el que declaró al registrarse o, si no, el dominio de vuelta. */
const clientNameOf = (client: any, redirectUri: string): string => client?.client_name || new URL(redirectUri).host;

/**
 * URL de vuelta al cliente con los parámetros de la respuesta OAuth y siempre `iss` (RFC 9207),
 * igual que el `issuer` de los metadatos: así el cliente sabe qué servidor le responde.
 */
const callbackUrl = (redirectUri: string, params: Record<string, string | undefined>): string => {
  const url = new URL(redirectUri);
  for (const [key, value] of Object.entries(params)) if (value) url.searchParams.set(key, value);
  url.searchParams.set('iss', publicUrl().href);
  return url.href;
};

/** GET /api/oauth/requests/:id — datos de la petición para la pantalla de consentimiento. */
export const getAuthorizationRequest = async (req: any, res: Response) => {
  try {
    const request = await findRequest(String(req.params.id));
    if (!request) return res.status(404).json({ error: 'La petición de autorización no existe o ha caducado' });
    const client = await clientsStore.getClient(request.clientId);
    res.json({
      clientName: clientNameOf(client, request.redirectUri),
      clientUri: client?.client_uri ?? null,
      redirectHost: new URL(request.redirectUri).host,
      scopes: request.scopes
    });
  } catch {
    res.status(500).json({ error: 'Error al cargar la petición de autorización' });
  }
};

/** Crea la autorización con su código de un solo uso y devuelve el código. */
const createGrant = async (request: any, userId: any): Promise<string> => {
  const code = randomToken();
  const client = await clientsStore.getClient(request.clientId);
  await OAuthGrant.create({
    userId,
    clientId: request.clientId,
    clientName: clientNameOf(client, request.redirectUri),
    scopes: request.scopes,
    resource: request.resource,
    redirectUri: request.redirectUri,
    codeChallenge: request.codeChallenge,
    codeHash: hashToken(code),
    expiresAt: new Date(Date.now() + AUTH_CODE_TTL_MS)
  });
  return code;
};

/**
 * POST /api/oauth/requests/:id — `{ approve }`: el docente acepta o rechaza. La petición se consume
 * (un solo uso) y se responde con la URL a la que el navegador debe volver.
 */
export const answerAuthorizationRequest = async (req: any, res: Response) => {
  try {
    const request = await OAuthRequest.findOneAndDelete({ requestId: String(req.params.id), expiresAt: { $gt: new Date() } }).lean<any>();
    if (!request) return res.status(404).json({ error: 'La petición de autorización no existe o ha caducado' });
    if (req.body?.approve !== true) {
      return res.json({ redirectUrl: callbackUrl(request.redirectUri, { error: 'access_denied', state: request.state }) });
    }
    const code = await createGrant(request, req.user._id);
    res.json({ redirectUrl: callbackUrl(request.redirectUri, { code, state: request.state }) });
  } catch {
    res.status(500).json({ error: 'Error al responder a la petición de autorización' });
  }
};

/** GET /api/oauth/grants — aplicaciones conectadas por OAuth (las que ya canjearon su código). */
export const listGrants = async (req: any, res: Response) => {
  try {
    const grants = await OAuthGrant.find({ userId: req.user._id, refreshHash: { $exists: true } })
      .sort({ createdAt: -1 })
      .lean<any[]>();
    res.json(grants.map((g) => ({ _id: String(g._id), clientName: g.clientName, createdAt: g.createdAt, lastUsedAt: g.lastUsedAt ?? null })));
  } catch {
    res.status(500).json({ error: 'Error al cargar las aplicaciones conectadas' });
  }
};

/** DELETE /api/oauth/grants/:id — desconecta una aplicación: sus tokens dejan de servir. */
export const revokeGrant = async (req: any, res: Response) => {
  try {
    const result = await OAuthGrant.deleteOne({ _id: String(req.params.id), userId: req.user._id }).catch(() => ({ deletedCount: 0 }));
    if (result.deletedCount !== 1) return res.status(404).json({ error: 'Aplicación no encontrada' });
    res.json({ message: 'Aplicación desconectada' });
  } catch {
    res.status(500).json({ error: 'Error al desconectar la aplicación' });
  }
};
