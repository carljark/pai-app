import mongoose from 'mongoose';

/**
 * Autorización de un docente a un cliente OAuth («aplicación conectada»). Primero guarda el código
 * de autorización; al canjearlo, los tokens de acceso y de refresco. Solo se guardan hashes.
 */
const OAuthGrantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  clientId: { type: String, required: true },
  clientName: String,
  scopes: [String],
  resource: String,
  redirectUri: String,
  codeChallenge: String,
  codeHash: { type: String, index: { unique: true, sparse: true } },
  accessHash: { type: String, index: { unique: true, sparse: true } },
  accessExpiresAt: Date,
  refreshHash: { type: String, index: { unique: true, sparse: true } },
  /** Caducidad del código y, tras canjearlo, del refresco: Mongo borra la autorización al vencer (TTL). */
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: Date
});

export const OAuthGrant = mongoose.model('OAuthGrant', OAuthGrantSchema);
