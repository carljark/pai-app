import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';
import { CFGM_PELUQUERIA_RAS_DATA } from '../data/ras_cfgm_peluqueria.data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIPO_NIVEL = 'CFGM_PELUQUERIA';
const MAP_TAB = 'CFGM_PELUQUERIA_2';

/**
 * Sincroniza los campos en catalán de los RA de Peluquería con los datos corregidos
 * (2.º curso: 0640, 0643, 0843, 0848, 0636, 1708 y 1710). No toca los campos en castellano.
 */
const syncCatalanRas = async () => {
  for (const ra of CFGM_PELUQUERIA_RAS_DATA) {
    await RA.updateOne(
      { tipoNivel: TIPO_NIVEL, moduleCode: ra.moduleCode, id: ra.id },
      {
        $set: {
          module_ca: ra.module_ca,
          description: ra.description_ca,
          description_ca: ra.description_ca,
          criterios_ca: ra.criterios_ca,
        },
      },
    );
  }
  console.log(`✅ ${CFGM_PELUQUERIA_RAS_DATA.length} RA de Peluquería sincronizados en catalán.`);
};

/** Recarga el mapa de 2.º de Peluquería desde su JSON con el catalán corregido. */
const reloadMap = async () => {
  const file = path.resolve(__dirname, '../data/mapa-intermodular/mapa_cfgm_peluqueria_2.json');
  const modules = JSON.parse(fs.readFileSync(file, 'utf-8'));
  await MapaModule.deleteMany({ tab: MAP_TAB });
  await MapaModule.insertMany(
    modules.map((m: any, idx: number) => ({
      tab: MAP_TAB,
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
  console.log(`✅ Mapa ${MAP_TAB}: ${modules.length} módulos recargados.`);
};

export const up = async () => {
  console.log('🔄 Corrigiendo el catalán de 2.º de CFGM Peluquería...');
  await syncCatalanRas();
  await reloadMap();
};
