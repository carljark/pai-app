import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const up = async () => {
  console.log('🔄 Ejecutando migración 11: Actividades corregidas del Mapa Peluquería 1º y 2º...');

  const dataDir = path.resolve(__dirname, '../data/mapa-intermodular');
  const datasets: { tab: 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2'; filename: string }[] = [
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

    // Reemplazar en MongoDB
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
