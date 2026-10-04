import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';
import { CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Mapas con el catalán corregido (campos `_ca`) que hay que recargar desde su JSON. */
const MAPS = [
  { tab: 'FPB', filename: 'mapa_fpb.json' },
  { tab: 'CFGM', filename: 'mapa_cfgm_estetica.json' },
  { tab: 'CFGM_PELUQUERIA', filename: 'mapa_cfgm_peluqueria.json' },
] as const;

/**
 * La migración 04 cargó los RA de Estética cuando su fichero aún tenía castellano en
 * `criterios_ca`; el fichero se corrigió después, pero la base de datos no se resincronizó.
 * Solo se actualizan los campos en catalán.
 */
const syncEsteticaCatalan = async () => {
  for (const ra of CFGM_ESTETICA_RAS_DATA) {
    await RA.updateOne(
      { tipoNivel: 'CFGM_ESTETICA', moduleCode: ra.moduleCode, id: ra.id },
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
  console.log(`✅ ${CFGM_ESTETICA_RAS_DATA.length} RA de Estética sincronizados en catalán.`);
};

const reloadMap = async (tab: string, filename: string) => {
  const file = path.resolve(__dirname, '../data/mapa-intermodular', filename);
  const modules = JSON.parse(fs.readFileSync(file, 'utf-8'));
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
  console.log(`✅ Mapa ${tab}: ${modules.length} módulos recargados.`);
};

export const up = async () => {
  console.log('🔄 Corrigiendo el catalán de los mapas FPB, Estética y Peluquería 1.º y de los RA de Estética...');
  await syncEsteticaCatalan();
  for (const map of MAPS) await reloadMap(map.tab, map.filename);
};
