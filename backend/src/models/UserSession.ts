import mongoose from 'mongoose';

const UserSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, index: true },
  startTime: { type: Date, default: Date.now },
  lastHeartbeat: { type: Date, default: Date.now },
  endTime: { type: Date },
  durationSeconds: { type: Number, default: 0 },
  pagesVisited: [{ type: String }],
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const UserSession = mongoose.model('UserSession', UserSessionSchema);