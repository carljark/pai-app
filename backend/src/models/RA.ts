import mongoose from 'mongoose';

const RaSchema = new mongoose.Schema({
  id: String,
  module: String,
  description: String,
  description_es: String,
  description_ca: String
});

export const RA = mongoose.model('RA', RaSchema);
