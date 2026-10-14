import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TAB = 'CFGM_CUIDADOS_AUXILIARES_ENFERMERIA';
const FILENAME = 'mapa_cfgm_cuidados_auxiliares_enfermeria.json';

/**
 * Carga el mapa intermodular del CFGM Cuidados Auxiliares de Enfermería (un solo curso),
 * generado con scripts/mapa-intermodular (tarea 223). Solo sustituye su pestaña, así que
 * es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Cargando el mapa intermodular del CFGM Cuidados Auxiliares de Enfermería...');
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
