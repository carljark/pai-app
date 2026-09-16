import mongoose, { Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  type: 'sugerencia' | 'error';
  title: string;
  description: string;
  status: 'pendiente' | 'en_revision' | 'resuelto' | 'descartado';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  type: { 
    type: String, 
    enum: ['sugerencia', 'error'], 
    default: 'sugerencia',
    required: true 
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: ['pendiente', 'en_revision', 'resuelto', 'descartado'], 
    default: 'pendiente' 
  },
  adminNotes: { type: String, default: '' }
}, {
  timestamps: true
});

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
