import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['pending', 'teacher', 'admin'], default: 'pending' },
  canUseAi: { type: Boolean, default: true },
  /** Bienvenida y visitas guiadas (ver documentation/visita_guiada.md). */
  onboarding: {
    welcomeDismissed: { type: Boolean, default: false },
    completedTours: { type: [String], default: [] }
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
