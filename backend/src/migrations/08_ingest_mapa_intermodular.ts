import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const up = async () => {
  console.log('🔄 Ingestionando semillas de Mapa Intermodular en MongoDB...');

  const dataDir = path.resolve(__dirname, '../data/mapa-intermodular');
  const datasets: { tab: 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2'; filename: string }[] = [
    { tab: 'FPB', filename: 'mapa_fpb.json' },
    { tab: 'CFGM', filename: 'mapa_cfgm_estetica.json' },
    { tab: 'CFGM_PELUQUERIA', filename: 'mapa_cfgm_peluqueria.json' },
    { tab: 'CFGM_PELUQUERIA_2', filename: 'mapa_cfgm_peluqueria_2.json' }
  ];

  for (const ds of datasets) {
    const filePath = path.join(dataDir, ds.filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Archivo ${ds.filename} no encontrado en ${dataDir}`);
      continue;
    }

    console.log(`⏳ Cargando ${ds.tab} desde ${ds.filename}...`);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const modules = JSON.parse(rawContent);

    await MapaModule.deleteMany({ tab: ds.tab });

    const docs = modules.map((m: any, idx: number) => ({
      tab: ds.tab,
      order: idx,
      code: m.code,
      name_es: m.name_es,
      name_ca: m.name_ca,
      type: m.type,
      color: m.color,
      icon: m.icon,
      learningOutcomes: m.learningOutcomes || []
    }));

    await MapaModule.insertMany(docs);
    console.log(`✅ Tab ${ds.tab}: ${docs.length} módulos guardados en MongoDB.`);
  }
};
