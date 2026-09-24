import { CE } from '../models/CE';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const up = async () => {
  console.log('🔄 Sincronizando Competencias Específicas (CE) de ESO / Diversificación Curricular...');

  const count = await CE.countDocuments();
  if (count >= 60) {
    console.log(`ℹ️ Ya existen ${count} CEs en la base de datos. Saltando inserción.`);
    return;
  }

  const possiblePaths = [
    path.join(process.cwd(), 'ces_eso_bilingual.json'),
    path.join(process.cwd(), 'backend', 'ces_eso_bilingual.json'),
    path.join(__dirname, '..', '..', 'ces_eso_bilingual.json'),
    path.join(__dirname, '..', 'ces_eso_bilingual.json')
  ];

  const jsonPath = possiblePaths.find(p => fs.existsSync(p));
  if (!jsonPath) {
    console.warn('⚠️ No se encontró ces_eso_bilingual.json. Saltando migración.');
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const ces = JSON.parse(rawData);

  if (count === 0) {
    await CE.insertMany(ces);
    console.log(`✅ Insertadas ${ces.length} CEs bilingües para ESO / Diversificación.`);
  } else {
    // Si había registros incompletos, limpiar y reinsertar
    await CE.deleteMany({});
    await CE.insertMany(ces);
    console.log(`✅ Reinsertadas ${ces.length} CEs bilingües completas para ESO.`);
  }
};
