import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TAB = 'CFGS_EDUCACION_INFANTIL';
const FILENAME = 'mapa_cfgs_educacion_infantil.json';

/**
 * Recarga el mapa intermodular de 1.º de Educación Infantil con las relaciones
 * de los mapas de Drive y una actividad coherente por relación (tarea 191).
 * Solo sustituye la pestaña de 1.º, así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Recargando el mapa intermodular de 1.º de Educación Infantil...');
  const dataDir = path.resolve(__dirname, '../data/mapa-intermodular');
  const modules = JSON.parse(fs.readFileSync(path.join(dataDir, FILENAME), 'utf-8'));
  await MapaModule.deleteMany({ tab: TAB });
  await MapaModule.insertMany(
    modules.map((m: any, idx: number) => ({
      tab: TAB,
      order: idx,
      code: m.code,
      name_es: m.name_es,
      name_ca: m.name_ca,
      type: m.type,
      color: m.color,
      icon: m.icon,
      learningOutcomes: m.learningOutcomes || [],
    })),
  );
  console.log(`✅ Tab ${TAB}: ${modules.length} módulos guardados en MongoDB.`);
};
