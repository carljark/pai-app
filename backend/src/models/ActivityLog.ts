import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // 'GENERATE_PROJECT', 'DELETE_PROJECT', 'VALIDATE_PROJECT', etc.
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  details: { type: mongoose.Schema.Types.Mixed }, // Para guardar tiempos de generación u otros datos JSON
  createdAt: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
