import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AfinidadEso, type AfinidadEsoData } from '../models/AfinidadEso';
import { AFINIDADES_TABS, cursoDeTab } from '../data/niveles';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AFINIDADES_DIR = path.resolve(__dirname, '../data/afinidades-eso');

/** Fichas de todos los cursos, en el orden de sus archivos (`afinidades_eso_1.json`…). */
export const loadAfinidades = (dir = AFINIDADES_DIR): AfinidadEsoData[] =>
  fs
    .readdirSync(dir)
    .filter((f) => /^afinidades_eso_\d\.json$/.test(f))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as AfinidadEsoData[]);

const tabDeCurso = (curso: string): string => {
  const tab = AFINIDADES_TABS.find((t) => cursoDeTab(t) === curso);
  if (!tab) throw new Error(`No hay pestaña de afinidades para el curso ${curso}`);
  return tab;
};

/** Documentos de MongoDB de las fichas, con su pestaña y orden dentro del curso. */
export const afinidadDocs = (fichas: AfinidadEsoData[]) =>
  fichas.map(({ id, ...ficha }, order) => ({ ...ficha, code: id, tab: tabDeCurso(ficha.curso), order }));

/**
 * Carga las fichas de afinidades curriculares de la ESO (1.º-4.º). Sustituye solo la
 * colección `afinidadesos`, así que es seguro reejecutarla.
 */
export const up = async () => {
  const docs = afinidadDocs(loadAfinidades());
  await AfinidadEso.deleteMany({});
  await AfinidadEso.insertMany(docs);
  console.log(`✅ Afinidades ESO: ${docs.length} fichas guardadas en MongoDB.`);
};
