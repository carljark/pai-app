import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASETS = [
  { tab: 'CFGS_EDUCACION_INFANTIL', filename: 'mapa_cfgs_educacion_infantil.json' },
  { tab: 'CFGS_EDUCACION_INFANTIL_2', filename: 'mapa_cfgs_educacion_infantil_2.json' },
] as const;

/**
 * Carga el mapa intermodular (1.º y 2.º) del CFGS Educación Infantil.
 * Solo sustituye las pestañas de este ciclo, así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Cargando el mapa intermodular del CFGS Educación Infantil...');
  const dataDir = path.resolve(__dirname, '../data/mapa-intermodular');

  for (const ds of DATASETS) {
    const modules = JSON.parse(fs.readFileSync(path.join(dataDir, ds.filename), 'utf-8'));
    await MapaModule.deleteMany({ tab: ds.tab });
    await MapaModule.insertMany(
      modules.map((m: any, idx: number) => ({
        tab: ds.tab,
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
    console.log(`✅ Tab ${ds.tab}: ${modules.length} módulos guardados en MongoDB.`);
  }
};
