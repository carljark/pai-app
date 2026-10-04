import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';
import { FPB_RAS_CATALAN, type FpbCatalanRa } from '../data/ras_fpb_catalan.data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Los RA de FPB antiguos no tienen `tipoNivel` guardado; los de 3159 sí (`FP_BASICA`). */
const FPB_FILTER = { tipoNivel: { $in: [null, 'FP_BASICA'] } };

/**
 * Solo toca los campos en catalán; los criterios en castellano se reescriben únicamente en los RA
 * que estaban vacíos o eran copia de otro RA (texto oficial del BOE, RD 127/2014).
 */
const fpbRaUpdate = (ra: FpbCatalanRa) => ({
  module: ra.module_ca,
  module_ca: ra.module_ca,
  description: ra.description_ca,
  description_ca: ra.description_ca,
  criterios_ca: ra.criterios_ca,
  ...(ra.criterios_es ? { criterios_es: ra.criterios_es } : {}),
});

const syncFpbRas = async () => {
  let updated = 0;
  for (const ra of FPB_RAS_CATALAN) {
    const res = await RA.updateOne({ ...FPB_FILTER, module_es: ra.module_es, id: ra.id }, { $set: fpbRaUpdate(ra) });
    updated += res.matchedCount;
  }
  console.log(`✅ ${updated}/${FPB_RAS_CATALAN.length} RA de FPB actualizados en catalán.`);
};

const reloadFpbMap = async () => {
  const file = path.resolve(__dirname, '../data/mapa-intermodular/mapa_fpb.json');
  const modules = JSON.parse(fs.readFileSync(file, 'utf-8'));
  await MapaModule.deleteMany({ tab: 'FPB' });
  await MapaModule.insertMany(
    modules.map((m: any, idx: number) => ({
      tab: 'FPB',
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
  console.log(`✅ Mapa FPB: ${modules.length} módulos recargados.`);
};

export const up = async () => {
  console.log('🔄 Traduciendo al catalán los RA de FPB y corrigiendo el mapa de FPB...');
  await syncFpbRas();
  await reloadFpbMap();
};
