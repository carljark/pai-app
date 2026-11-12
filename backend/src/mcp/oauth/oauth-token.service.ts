import { OAuthGrant } from '../../models/OAuthGrant';
import { loadTokenUser, shouldRefreshLastUsed, type ResolvedToken } from '../../services/api-token.service';
import { ACCESS_TOKEN_PREFIX } from './oauth-config';
import { oauthProvider } from './oauth-provider';

/**
 * Usuario de un token de acceso OAuth (`plpa_…`), con su rol actual, o `null` si el token no es
 * válido, ha caducado o su usuario se borró. El nombre del token es el de la aplicación conectada.
 */
export const resolveOAuthToken = async (token: string): Promise<ResolvedToken | null> => {
  if (!token.startsWith(ACCESS_TOKEN_PREFIX)) return null;
  const info = await oauthProvider.verifyAccessToken(token).catch(() => null);
  if (!info) return null;
  const { userId, grantId, clientName } = info.extra as { userId: string; grantId: string; clientName?: string };
  const user = await loadTokenUser(userId);
  if (!user) return null;
  const grant: any = await OAuthGrant.findById(grantId, { lastUsedAt: 1 }).lean();
  if (shouldRefreshLastUsed(grant?.lastUsedAt)) await OAuthGrant.updateOne({ _id: grantId }, { lastUsedAt: new Date() });
  return { user, tokenName: `OAuth: ${clientName || info.clientId}` };
};
