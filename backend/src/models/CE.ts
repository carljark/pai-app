import mongoose from 'mongoose';

const CESchema = new mongoose.Schema({
  area: String,
  subject: String,
  ce_id: String,
  description_es: String,
  description_ca: String,
  criterios_es: Array,
  criterios_ca: Array
});

export const CE = mongoose.model('CE', CESchema);
