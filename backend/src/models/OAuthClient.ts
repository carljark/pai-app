import mongoose from 'mongoose';

/** Cliente OAuth registrado dinámicamente (p. ej. el conector de claude.ai de un docente). */
const OAuthClientSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  /** Datos completos del registro (`OAuthClientInformationFull`), tal como los devuelve el SDK. */
  info: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const OAuthClient = mongoose.model('OAuthClient', OAuthClientSchema);
