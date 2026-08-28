import mongoose from 'mongoose';

const FpbMatchSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  title: { type: String, required: true },
  code: { type: String },
  rawText: { type: String, required: true },
  type: { type: String, enum: ['coincidencia', 'actividad_ampliada', 'relacion_criterios', 'prompt_coincidencias'], required: true }
}, {
  timestamps: true
});

export const FpbMatch = mongoose.model('FpbMatch', FpbMatchSchema);
