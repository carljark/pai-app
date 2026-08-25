import mongoose from 'mongoose';

const RaSchema = new mongoose.Schema({
  id: String,
  module: String, // Valor por defecto (actualmente catalán por la migración)
  module_es: String,
  module_ca: String,
  description: String,
  description_es: String,
  description_ca: String
});

export const RA = mongoose.model('RA', RaSchema);
