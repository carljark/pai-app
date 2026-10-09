import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';
import { CFGM_PELUQUERIA_RAS_DATA } from '../data/ras_cfgm_peluqueria.data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIPO_NIVEL = 'CFGM_PELUQUERIA';
const MAPAS = [
  { tab: 'CFGM_PELUQUERIA', file: 'mapa_cfgm_peluqueria.json' },
  { tab: 'CFGM_PELUQUERIA_2', file: 'mapa_cfgm_peluqueria_2.json' },
];

/** Recarga todos los RA de Peluquería con los transversales corregidos (tarea 209). */
const reloadRas = async () => {
  await RA.deleteMany({ tipoNivel: TIPO_NIVEL });
  const docs = CFGM_PELUQUERIA_RAS_DATA.map((ra) => ({
    id: ra.id,
    module: ra.module,
    module_es: ra.module_es,
    module_ca: ra.module_ca,
    moduleCode: ra.moduleCode,
    tipoNivel: ra.tipoNivel,
    description: ra.description_ca,
    description_ca: ra.description_ca,
    description_es: ra.description_es,
    criterios_es: ra.criterios_es,
    criterios_ca: ra.criterios_ca,
  }));
  await RA.insertMany(docs);
  console.log(`✅ ${docs.length} RA de ${TIPO_NIVEL} recargados.`);
};

/** Recarga una pestaña del mapa desde su JSON (el mapa es de solo lectura en la app). */
const reloadMap = async (tab: string, file: string) => {
  const modules = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/mapa-intermodular', file), 'utf-8'));
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

/**
 * Corrige los módulos transversales de Peluquería (1664, 1709, 0156, 1708, 1710 y 1713) con el
 * texto oficial del BOE y el catalán revisado, y sincroniza sus mapas: textos copiados, etiquetas
 * catalanas de los criterios y conexiones de los criterios 1709-3h/3i, que no existen en el BOE.
 * Solo toca los RA y mapas de Peluquería, así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Corrigiendo los módulos transversales de CFGM Peluquería...');
  await reloadRas();
  for (const { tab, file } of MAPAS) await reloadMap(tab, file);
};
