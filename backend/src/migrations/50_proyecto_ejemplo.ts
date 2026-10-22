import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Project } from '../models/Project';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'proyecto-ejemplo');

/** Versión del contenido del ejemplo: súbela al cambiar los textos para que la traducción no quede desfasada. */
export const EXAMPLE_CONTENT_VERSION = 1;

const readText = (file: string) => fs.readFileSync(path.join(EXAMPLE_DIR, file), 'utf-8');

/** Documento del proyecto de ejemplo: original en castellano y traducción al catalán terminada. */
export const buildExampleDoc = () => {
  const meta = JSON.parse(readText('proyecto-ejemplo.json'));
  const { contentFiles, ...fields } = meta;
  const now = new Date();
  return {
    ...fields,
    isExample: true,
    status: 'publicado',
    language: 'castellano',
    contentVersion: EXAMPLE_CONTENT_VERSION,
    generatedContent: { rawText: readText(contentFiles.castellano) },
    translations: {
      catalan: {
        rawText: readText(contentFiles.catalan),
        sourceVersion: EXAMPLE_CONTENT_VERSION,
        translatedAt: now,
        status: 'completada'
      }
    },
    updatedAt: now
  };
};

/**
 * Crea o actualiza el proyecto de ejemplo de la visita guiada del taller.
 * Se puede reejecutar: siempre hay un único documento con `isExample: true`.
 */
export async function up() {
  await Project.updateOne({ isExample: true }, { $set: buildExampleDoc() }, { upsert: true });
  console.log('   Proyecto de ejemplo de la visita guiada creado o actualizado.');
}
