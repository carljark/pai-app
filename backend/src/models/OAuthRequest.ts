import mongoose from 'mongoose';

/** Petición de autorización a la espera de que el docente la acepte o la rechace en Plappin. */
const OAuthRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  redirectUri: { type: String, required: true },
  codeChallenge: { type: String, required: true },
  state: String,
  scopes: [String],
  resource: String,
  /** Mongo borra la petición al caducar (índice TTL). */
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

export const OAuthRequest = mongoose.model('OAuthRequest', OAuthRequestSchema);
