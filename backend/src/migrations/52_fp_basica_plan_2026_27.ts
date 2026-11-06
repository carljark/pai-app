import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';
import { FP_BASICA_RAS_DATA } from '../data/ras_fp_basica.data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Los RA antiguos de FP Básica no guardan `tipoNivel`; los más recientes, `FP_BASICA`. */
const FPB_FILTER = { tipoNivel: { $in: [null, 'FP_BASICA'] } };

/** Pestañas del mapa de FP Básica (1.º conserva el id histórico `FPB`) y su JSON. */
export const TABS_FP_BASICA: Record<string, string> = {
  FPB: 'mapa_fp_basica.json',
  FPB_2: 'mapa_fp_basica_2.json',
};

/**
 * Sustituye el currículo de FP Básica por el del plan 2026/27 (`ras_fp_basica.data.ts`): módulos
 * con código y nivel, el 3159, el 3160 y los ámbitos 3161-3164 con sus competencias específicas en
 * lugar de los RA del RD 127/2014. Los proyectos guardan el texto de los RA, no su documento.
 */
const replaceFpbRas = async () => {
  const removed = await RA.deleteMany(FPB_FILTER);
  await RA.insertMany(FP_BASICA_RAS_DATA);
  console.log(`✅ RA de FP Básica: ${removed.deletedCount} sustituidos por ${FP_BASICA_RAS_DATA.length}.`);
};

/** Sustituye una pestaña del mapa por los módulos de su JSON. */
const reloadTab = async (dataDir: string, tab: string, filename: string) => {
  const modules = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));
  await MapaModule.deleteMany({ tab });
  await MapaModule.insertMany(
    modules.map((m: any, idx: number) => ({
      tab,
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
  console.log(`✅ Tab ${tab}: ${modules.length} módulos guardados en MongoDB.`);
};

/**
 * FP Básica al plan 2026/27 (tarea 250): currículo nuevo y mapa en dos pestañas, 1.º (`FPB`) y
 * 2.º (`FPB_2`). Solo toca los RA de FP Básica y esas dos pestañas, así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Actualizando FP Básica al plan 2026/27 (currículo y mapa por cursos)...');
  await replaceFpbRas();
  const dataDir = path.resolve(__dirname, '../data/mapa-intermodular');
  for (const [tab, filename] of Object.entries(TABS_FP_BASICA)) await reloadTab(dataDir, tab, filename);
};
