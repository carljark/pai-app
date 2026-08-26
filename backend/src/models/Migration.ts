import mongoose from 'mongoose';

const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: Date.now }
});

export const Migration = mongoose.model('Migration', migrationSchema);
