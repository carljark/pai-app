import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CE } from '../models/CE';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIPO_NIVEL = 'ESO_ORDINARIA';

interface MateriaEso {
  code: string;
  name_es: string;
  name_ca: string;
  cursos: Record<string, string>;
  competencias: {
    ce_id: string;
    ce_num: number;
    description_es: string;
    description_ca: string;
    descriptores: string[];
    criterios: Record<string, unknown>[];
  }[];
}

/** Documentos CE de una materia de ESO (un documento por competencia específica). */
export const ceDocsFromMateria = (materia: MateriaEso) =>
  materia.competencias.map((ce) => ({
    tipoNivel: TIPO_NIVEL,
    subjectCode: materia.code,
    subject_es: materia.name_es,
    subject_ca: materia.name_ca,
    subjectTipos: materia.cursos,
    ce_id: ce.ce_id,
    ce_num: ce.ce_num,
    description_es: ce.description_es,
    description_ca: ce.description_ca,
    descriptores: ce.descriptores,
    criteriosPorCurso: ce.criterios,
  }));

/**
 * Carga las competencias específicas y los criterios de evaluación de la ESO ordinaria
 * (Decreto 42/2025, anexo 2, en castellano y catalán). Sustituye solo las CE de
 * `ESO_ORDINARIA`, así que es seguro reejecutarla y no toca las del PDC.
 */
export const up = async () => {
  const dataDir = path.resolve(__dirname, '../data/curriculo-eso');
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json')).sort();
  const materias: MateriaEso[] = files.map((f) => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf-8')));
  const docs = materias.flatMap(ceDocsFromMateria);
  await CE.deleteMany({ tipoNivel: TIPO_NIVEL });
  await CE.insertMany(docs);
  console.log(`✅ ESO ordinaria: ${materias.length} materias y ${docs.length} CE guardadas en MongoDB.`);
};
