import mongoose from 'mongoose';

export const CONTENT_LANGUAGES = ['castellano', 'catalan'] as const;
export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number];

/**
 * Versión del contenido en otro idioma. `sourceVersion` es el `contentVersion` del original
 * que se tradujo: si el original cambia después, la traducción queda desactualizada.
 */
const TranslationSchema = new mongoose.Schema({
  rawText: String,
  sourceVersion: Number,
  translatedAt: Date,
  editedAt: Date,
  /** Estado de la última traducción solicitada; `traduciendo` actúa como bloqueo. */
  status: { type: String, enum: ['traduciendo', 'completada', 'error'] },
  startedAt: Date,
  error: String
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: String,
  modules: [String],
  ras: [String],
  methodology: String,
  tipoNivel: { type: String, enum: ['FP_BASICA', 'DIVERSIFICACION_CURRICULAR', 'CFGM_ESTETICA', 'CFGM_PELUQUERIA'], default: 'FP_BASICA' },
  courseLevel: String,
  status: { type: String, enum: ['en_cola', 'generando', 'borrador', 'publicado', 'error'], default: 'en_cola' },
  generatedContent: {
    rawText: String,
    jsonStructure: Object
  },
  /** Idioma en el que se generó (y se edita) `generatedContent`. */
  language: { type: String, enum: CONTENT_LANGUAGES, default: 'castellano' },
  /** Se incrementa cada vez que cambia el texto original. */
  contentVersion: { type: Number, default: 0 },
  translations: {
    castellano: TranslationSchema,
    catalan: TranslationSchema
  },
  aiPrompt: String,
  aiInstruction: String,
  extraInstructions: String,
  errorDetail: String,
  generationStartedAt: Date,
  generationTimeMs: Number,
  aiProvider: { type: String, enum: ['gemini', 'openrouter'], default: 'gemini' },
  aiModel: String,
  aiPromptChars: Number,
  aiInstructionChars: Number,
  usedAiProvider: String,
  usedModel: String,
  phase: String,
  errorCascadeLog: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', ProjectSchema);
