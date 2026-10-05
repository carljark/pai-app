import mongoose from 'mongoose';

/** Criterio de evaluación de ESO con los cursos en los que se aplica (Decreto 42/2025, anexo 2). */
const CriterioCursoSchema = new mongoose.Schema({
  id: String,
  cursos: [String],
  text_es: String,
  text_ca: String,
  aclaraciones_es: [String],
  aclaraciones_ca: [String]
}, { _id: false });

const CESchema = new mongoose.Schema({
  /** Nivel al que pertenece: `DIVERSIFICACION_CURRICULAR` (PDC) o `ESO_ORDINARIA`. */
  tipoNivel: String,
  area: String,
  subject: String,
  ce_id: String,
  description_es: String,
  description_ca: String,
  criterios_es: Array,
  criterios_ca: Array,
  // Campos de la ESO ordinaria
  subjectCode: String,
  subject_es: String,
  subject_ca: String,
  /** Tipo de la materia en cada curso: `comun`, `opcion` u `optativa`. */
  subjectTipos: { type: Map, of: String },
  ce_num: Number,
  /** Descriptores operativos del perfil de salida (anexo 1) con los que se conecta la CE. */
  descriptores: [String],
  criteriosPorCurso: [CriterioCursoSchema]
});

export const CE = mongoose.model('CE', CESchema);
