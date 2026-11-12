import crypto from 'crypto';
import type { Response } from 'express';
import type { OAuthServerProvider, AuthorizationParams } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import type { OAuthRegisteredClientsStore } from '@modelcontextprotocol/sdk/server/auth/clients.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { OAuthClientInformationFull, OAuthTokenRevocationRequest, OAuthTokens } from '@modelcontextprotocol/sdk/shared/auth.js';
import { CustomOAuthError, InvalidGrantError, InvalidTokenError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { OAuthClient } from '../../models/OAuthClient';
import { OAuthRequest } from '../../models/OAuthRequest';
import { OAuthGrant } from '../../models/OAuthGrant';
import { hashToken } from '../../services/api-token.service';
import {
  ACCESS_TOKEN_PREFIX,
  ACCESS_TOKEN_TTL_SECONDS,
  AUTH_REQUEST_TTL_MS,
  OAUTH_SCOPE,
  REFRESH_TOKEN_PREFIX,
  REFRESH_TOKEN_TTL_MS,
  consentUrl,
  isAllowedRedirect
} from './oauth-config';

const randomToken = (prefix = ''): string => `${prefix}${crypto.randomBytes(32).toString('base64url')}`;

/** Clientes registrados en Mongo; solo se aceptan redirecciones permitidas (ver `isAllowedRedirect`). */
export const clientsStore: OAuthRegisteredClientsStore = {
  async getClient(clientId) {
    const doc: any = await OAuthClient.findOne({ clientId }).lean();
    return doc?.info;
  },
  async registerClient(client) {
    const rejected = client.redirect_uris.find((uri) => !isAllowedRedirect(String(uri)));
    if (rejected) throw new CustomOAuthError('invalid_redirect_uri', `Redirección no permitida: ${rejected}`);
    const info = client as OAuthClientInformationFull;
    await OAuthClient.create({ clientId: info.client_id, info });
    return info;
  }
};

/** Emite un par nuevo de tokens para la autorización (rota el refresco anterior). */
const issueTokens = async (grantId: unknown, scopes: string[]): Promise<OAuthTokens> => {
  const accessToken = randomToken(ACCESS_TOKEN_PREFIX);
  const refreshToken = randomToken(REFRESH_TOKEN_PREFIX);
  await OAuthGrant.updateOne({ _id: grantId }, {
    $set: {
      accessHash: hashToken(accessToken),
      accessExpiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000),
      refreshHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    }
  });
  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken,
    scope: (scopes.length > 0 ? scopes : [OAUTH_SCOPE]).join(' ')
  };
};

const pendingCode = (clientId: string, code: string) =>
  ({ clientId, codeHash: hashToken(code), expiresAt: { $gt: new Date() } });

/**
 * Proveedor OAuth 2.1 del servidor MCP para el router del SDK (`mcpAuthRouter`): el SDK valida
 * PKCE, parámetros y errores estándar; aquí se guardan clientes, códigos y tokens en Mongo.
 */
export const oauthProvider: OAuthServerProvider = {
  clientsStore,

  /** Guarda la petición y manda al navegador a la pantalla de consentimiento de Plappin. */
  async authorize(client: OAuthClientInformationFull, params: AuthorizationParams, res: Response) {
    const requestId = randomToken();
    await OAuthRequest.create({
      requestId,
      clientId: client.client_id,
      redirectUri: params.redirectUri,
      codeChallenge: params.codeChallenge,
      scopes: params.scopes ?? [],
      ...(params.state ? { state: params.state } : {}),
      ...(params.resource ? { resource: params.resource.href } : {}),
      expiresAt: new Date(Date.now() + AUTH_REQUEST_TTL_MS)
    });
    res.redirect(302, consentUrl(requestId));
  },

  async challengeForAuthorizationCode(client, code) {
    const grant: any = await OAuthGrant.findOne(pendingCode(client.client_id, code)).lean();
    if (!grant) throw new InvalidGrantError('Código de autorización no válido o caducado');
    return grant.codeChallenge;
  },

  /** Canjea el código (un solo uso: se borra de forma atómica) por el primer par de tokens. */
  async exchangeAuthorizationCode(client, code, _verifier, redirectUri) {
    const grant: any = await OAuthGrant.findOneAndUpdate(pendingCode(client.client_id, code), { $unset: { codeHash: '' } }).lean();
    if (!grant) throw new InvalidGrantError('Código de autorización no válido o caducado');
    if (redirectUri && redirectUri !== grant.redirectUri) throw new InvalidGrantError('redirect_uri no coincide');
    return issueTokens(grant._id, grant.scopes ?? []);
  },

  /** Rotación: el refresco usado deja de servir y se emite un par nuevo. */
  async exchangeRefreshToken(client, refreshToken) {
    const filter = { clientId: client.client_id, refreshHash: hashToken(refreshToken), expiresAt: { $gt: new Date() } };
    const grant: any = await OAuthGrant.findOneAndUpdate(filter, { $unset: { refreshHash: '' } }).lean();
    if (!grant) throw new InvalidGrantError('Token de refresco no válido o caducado');
    return issueTokens(grant._id, grant.scopes ?? []);
  },

  async verifyAccessToken(token): Promise<AuthInfo> {
    const grant: any = await OAuthGrant.findOne({ accessHash: hashToken(token), accessExpiresAt: { $gt: new Date() } }).lean();
    if (!grant) throw new InvalidTokenError('Token de acceso no válido o caducado');
    return {
      token,
      clientId: grant.clientId,
      scopes: grant.scopes?.length ? grant.scopes : [OAUTH_SCOPE],
      expiresAt: Math.floor(grant.accessExpiresAt.getTime() / 1000),
      extra: { userId: String(grant.userId), grantId: String(grant._id), clientName: grant.clientName }
    };
  },

  /** Revocar cualquiera de los dos tokens elimina la autorización completa. */
  async revokeToken(client, request: OAuthTokenRevocationRequest) {
    const hash = hashToken(request.token);
    await OAuthGrant.deleteOne({ clientId: client.client_id, $or: [{ accessHash: hash }, { refreshHash: hash }] });
  }
};

export { randomToken };
