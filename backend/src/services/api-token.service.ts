import crypto from 'crypto';
import { ApiToken } from '../models/ApiToken';
import { User } from '../models/User';

/** Prefijo de los tokens de Plappin: permite reconocerlos (y detectarlos si se filtran). */
export const TOKEN_PREFIX = 'plp_';
/** Tokens activos por usuario como máximo. */
export const MAX_TOKENS_PER_USER = 5;
export const MAX_TOKEN_NAME_LENGTH = 60;
/** `lastUsedAt` se actualiza como mucho una vez por este intervalo, para no escribir en cada petición. */
export const LAST_USED_REFRESH_MS = 60_000;
const VISIBLE_PREFIX_LENGTH = TOKEN_PREFIX.length + 6;

export class ApiTokenError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const hashToken = (token: string): string => crypto.createHash('sha256').update(token).digest('hex');

const generateToken = (): string => `${TOKEN_PREFIX}${crypto.randomBytes(32).toString('base64url')}`;

/** Datos públicos de un token (nunca el hash). */
const toPublic = (doc: any) => ({
  _id: String(doc._id),
  name: doc.name,
  prefix: doc.prefix,
  createdAt: doc.createdAt,
  lastUsedAt: doc.lastUsedAt ?? null
});

export const listApiTokens = async (userId: any) =>
  (await ApiToken.find({ userId }).sort({ createdAt: -1 }).lean()).map(toPublic);

/** Crea un token y devuelve sus datos públicos más el token completo, que no se puede recuperar después. */
export const createApiToken = async (userId: any, rawName: unknown) => {
  const name = typeof rawName === 'string' ? rawName.trim().slice(0, MAX_TOKEN_NAME_LENGTH) : '';
  if (!name) throw new ApiTokenError(400, 'Ponle un nombre al token');
  if ((await ApiToken.countDocuments({ userId })) >= MAX_TOKENS_PER_USER) {
    throw new ApiTokenError(409, `Ya tienes ${MAX_TOKENS_PER_USER} tokens: revoca alguno antes de crear otro`);
  }
  const token = generateToken();
  const doc = await ApiToken.create({ userId, name, tokenHash: hashToken(token), prefix: token.slice(0, VISIBLE_PREFIX_LENGTH) });
  return { ...toPublic(doc), token };
};

/** Revoca (borra) un token del usuario; `false` si no existe o es de otra persona. */
export const revokeApiToken = async (userId: any, tokenId: string): Promise<boolean> => {
  const result = await ApiToken.deleteOne({ _id: tokenId, userId }).catch(() => ({ deletedCount: 0 }));
  return result.deletedCount === 1;
};

export const deleteUserTokens = (userId: any) => ApiToken.deleteMany({ userId });

export interface ResolvedToken {
  user: { _id: unknown; name: string; email: string; role: string; canUseAi: boolean };
  tokenName: string;
}

/** Usuario con su rol y permiso de IA **actuales**, o `null` si se borró. */
export const loadTokenUser = async (userId: unknown): Promise<ResolvedToken['user'] | null> => {
  const user: any = await User.findById(userId).select('name email role canUseAi').lean();
  return user
    ? { _id: user._id, name: user.name, email: user.email, role: user.role, canUseAi: user.canUseAi !== false }
    : null;
};

/** `true` si toca actualizar `lastUsedAt` (como mucho una vez por `LAST_USED_REFRESH_MS`). */
export const shouldRefreshLastUsed = (lastUsedAt?: Date | null): boolean =>
  !lastUsedAt || Date.now() - lastUsedAt.getTime() > LAST_USED_REFRESH_MS;

/**
 * Usuario de un token, con su rol y permisos **actuales** (se leen en cada petición, no se guardan
 * en el token). `null` si el token no existe o su usuario se borró.
 */
export const resolveApiToken = async (token: string): Promise<ResolvedToken | null> => {
  if (!token.startsWith(TOKEN_PREFIX)) return null;
  const doc = await ApiToken.findOne({ tokenHash: hashToken(token) });
  if (!doc) return null;
  const user = await loadTokenUser(doc.userId);
  if (!user) return null;
  if (shouldRefreshLastUsed(doc.lastUsedAt)) await ApiToken.updateOne({ _id: doc._id }, { lastUsedAt: new Date() });
  return { user, tokenName: doc.name };
};
