import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: String,
  modules: [String],
  ras: [String],
  methodology: String,
  tipoNivel: { type: String, enum: ['FP_BASICA', 'DIVERSIFICACION_CURRICULAR'], default: 'FP_BASICA' },
  status: { type: String, enum: ['borrador', 'publicado'], default: 'borrador' },
  generatedContent: {
    rawText: String,
    jsonStructure: Object
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', ProjectSchema);
