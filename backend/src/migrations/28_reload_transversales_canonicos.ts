import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';
import type { CfgmRaData } from '../data/ras_cfgm_peluqueria.data';
import { CFGM_PELUQUERIA_RAS_DATA } from '../data/ras_cfgm_peluqueria.data';
import { CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';
import { CFGS_EDUCACION_INFANTIL_RAS_DATA } from '../data/ras_cfgs_educacion_infantil.data';
import { CFGM_ATENCION_DEPENDENCIA_RAS_DATA } from '../data/ras_cfgm_atencion_dependencia.data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NIVELES: Array<{ tipoNivel: string; datos: CfgmRaData[] }> = [
  { tipoNivel: 'CFGM_ESTETICA', datos: CFGM_ESTETICA_RAS_DATA },
  { tipoNivel: 'CFGM_PELUQUERIA', datos: CFGM_PELUQUERIA_RAS_DATA },
  { tipoNivel: 'CFGS_EDUCACION_INFANTIL', datos: CFGS_EDUCACION_INFANTIL_RAS_DATA },
  { tipoNivel: 'CFGM_ATENCION_DEPENDENCIA', datos: CFGM_ATENCION_DEPENDENCIA_RAS_DATA },
];
const MAPAS = [
  { tab: 'CFGM', file: 'mapa_cfgm_estetica.json' },
  { tab: 'CFGM_PELUQUERIA', file: 'mapa_cfgm_peluqueria.json' },
  { tab: 'CFGM_PELUQUERIA_2', file: 'mapa_cfgm_peluqueria_2.json' },
  { tab: 'CFGS_EDUCACION_INFANTIL', file: 'mapa_cfgs_educacion_infantil.json' },
];

/** Recarga los RA de un nivel desde su fichero de datos. */
const reloadRas = async (tipoNivel: string, datos: CfgmRaData[]) => {
  await RA.deleteMany({ tipoNivel });
  await RA.insertMany(
    datos.map((ra) => ({
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
    })),
  );
  console.log(`✅ ${datos.length} RA de ${tipoNivel} recargados.`);
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
 * Unifica el texto de los módulos transversales compartidos (tarea 210): castellano literal del
 * RD 659/2023 consolidado y una única traducción catalana de 1664, 1709 y 0156 en Estética,
 * Peluquería, Educación Infantil (1709) y Atención a la Dependencia. Recarga también los mapas
 * afectados, con sus textos sincronizados y las conexiones de Peluquería que apuntaban a un RA6
 * inexistente del 0636 redirigidas a su RA5. En Estética, además, los posesivos valencianos
 * («seua», «seues») pasan a los baleares («seva», «seves»). Solo toca estos niveles y pestañas:
 * es reejecutable.
 */
export const up = async () => {
  console.log('🔄 Unificando los módulos transversales de los ciclos de FP...');
  for (const { tipoNivel, datos } of NIVELES) await reloadRas(tipoNivel, datos);
  for (const { tab, file } of MAPAS) await reloadMap(tab, file);
};
