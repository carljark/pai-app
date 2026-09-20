import mongoose from 'mongoose';

const RaSchema = new mongoose.Schema({
  id: String,
  module: String, // Valor por defecto (actualmente catalán por la migración)
  module_es: String,
  module_ca: String,
  moduleCode: String,
  tipoNivel: { type: String, default: 'FP_BASICA' },
  description: String,
  description_es: String,
  description_ca: String,
  criterios_es: [String],
  criterios_ca: [String]
});

export const RA = mongoose.model('RA', RaSchema);
