import mongoose from 'mongoose';
import { DEFAULT_TIPO_NIVEL, NIVEL_IDS } from '../data/niveles';

const RaSchema = new mongoose.Schema({
  id: String,
  module: String, // Valor por defecto (actualmente catalán por la migración)
  module_es: String,
  module_ca: String,
  moduleCode: String,
  /** Nivel del catálogo `data/niveles.ts`. */
  tipoNivel: { type: String, enum: NIVEL_IDS as string[], default: DEFAULT_TIPO_NIVEL },
  description: String,
  description_es: String,
  description_ca: String,
  criterios_es: [String],
  criterios_ca: [String]
});

export const RA = mongoose.model('RA', RaSchema);
