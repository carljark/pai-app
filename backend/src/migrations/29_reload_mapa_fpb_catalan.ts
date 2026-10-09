import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TAB = 'FPB';

/**
 * Recarga el mapa de FP Básica con el catalán corregido (tarea 211): castellanismos («Mantener»,
 * «apoyades», «es entrenan»…), apóstrofos que faltaban («del Itinerari» → «de l'Itinerari»),
 * pronombres sin elidir y formas valencianas («ací», «obtindre») en justificaciones y en las copias
 * de criterios. No toca los RA ni otras pestañas, así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Recargando el mapa de FP Básica con el catalán corregido...');
  const file = path.resolve(__dirname, '../data/mapa-intermodular/mapa_fpb.json');
  const modules = JSON.parse(fs.readFileSync(file, 'utf-8'));
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
  console.log(`✅ Mapa ${TAB}: ${modules.length} módulos recargados.`);
};
