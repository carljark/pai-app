import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, default: 'Profesor' },
  type: { type: String, required: true }, // 'PROJECT_STATUS' | 'PROJECT_COMPLETED' | 'PROJECT_ERROR' | 'INFO'
  title: { type: String, required: true },
  message: { type: String, required: true },
  modules: [String],
  status: { type: String, required: true }, // 'en_cola' | 'generando' | 'borrador' | 'error' | 'publicado'
  generationTimeMs: { type: Number },
  generationStartedAt: { type: Date },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', NotificationSchema);
