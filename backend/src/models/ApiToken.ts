import mongoose from 'mongoose';

/**
 * Token personal para conectar asistentes de IA a Plappin por MCP (ver documentation/servidor_mcp.md).
 * Solo se guarda el hash SHA-256 del token; el texto completo se muestra una única vez al crearlo.
 */
const ApiTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  tokenHash: { type: String, required: true, unique: true },
  /** Primeros caracteres del token, para reconocerlo en la lista sin poder usarlo. */
  prefix: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: Date
});

export const ApiToken = mongoose.model('ApiToken', ApiTokenSchema);
