import { Project } from '../models/Project';
import { detectContentLanguage } from '../services/translation.service';

/**
 * Añade `language` y `contentVersion` a los proyectos anteriores a la traducción por idioma.
 * El idioma se detecta con una heurística sobre el texto generado (castellano si está vacío).
 * Es idempotente: solo toca proyectos que aún no tienen `language`.
 */
export async function up() {
  // `lean()` evita que Mongoose aplique el valor por defecto y oculte los documentos sin campo
  const pending = await Project.find({ language: { $exists: false } })
    .select({ 'generatedContent.rawText': 1, contentVersion: 1 })
    .lean();
  if (pending.length === 0) return;

  const operations = pending.map((project: any) => ({
    updateOne: {
      filter: { _id: project._id },
      update: {
        $set: {
          language: detectContentLanguage(project.generatedContent?.rawText),
          ...(project.contentVersion === undefined ? { contentVersion: 0 } : {})
        }
      }
    }
  }));
  await Project.bulkWrite(operations);
  console.log(`[Migración 12] Idioma asignado a ${operations.length} proyectos.`);
}
