import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Pestañas ampliadas a tres actividades por conexión y el JSON de cada una. */
export const TABS_TRES_ACTIVIDADES: Record<string, string> = {
  CFGM_PELUQUERIA: 'mapa_cfgm_peluqueria.json',
  CFGM_PELUQUERIA_2: 'mapa_cfgm_peluqueria_2.json',
  CFGM_ATENCION_DEPENDENCIA: 'mapa_cfgm_atencion_dependencia.json',
  CFGM_ATENCION_DEPENDENCIA_2: 'mapa_cfgm_atencion_dependencia_2.json',
  CFGM_CUIDADOS_AUXILIARES_ENFERMERIA: 'mapa_cfgm_cuidados_auxiliares_enfermeria.json',
  CFGM_GUIA_MEDIO_NATURAL: 'mapa_cfgm_guia_medio_natural.json',
  CFGM_GUIA_MEDIO_NATURAL_2: 'mapa_cfgm_guia_medio_natural_2.json',
  CFGS_ACONDICIONAMIENTO_FISICO: 'mapa_cfgs_acondicionamiento_fisico.json',
  CFGS_ACONDICIONAMIENTO_FISICO_2: 'mapa_cfgs_acondicionamiento_fisico_2.json',
  CFGS_ANIMACION_SOCIODEPORTIVA: 'mapa_cfgs_animacion_sociodeportiva.json',
  CFGS_ANIMACION_SOCIODEPORTIVA_2: 'mapa_cfgs_animacion_sociodeportiva_2.json',
  CFGS_INTEGRACION_SOCIAL: 'mapa_cfgs_integracion_social.json',
  CFGS_INTEGRACION_SOCIAL_2: 'mapa_cfgs_integracion_social_2.json',
  CFGS_LABORATORIO_CLINICO: 'mapa_cfgs_laboratorio_clinico.json',
  CFGS_LABORATORIO_CLINICO_2: 'mapa_cfgs_laboratorio_clinico_2.json',
};

/** Sustituye los módulos de una pestaña por los de su JSON. */
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
 * Recarga los mapas intermodulares ampliados a tres actividades por conexión (tarea 245).
 * Solo sustituye esas pestañas, de una en una para no cargar todos los JSON a la vez,
 * así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Recargando los mapas intermodulares con tres actividades por conexión...');
  const dataDir = path.resolve(__dirname, '../data/mapa-intermodular');
  for (const [tab, filename] of Object.entries(TABS_TRES_ACTIVIDADES)) {
    await reloadTab(dataDir, tab, filename);
  }
};
