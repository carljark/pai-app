import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MapaModule } from '../models/MapaModule';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const up = async () => {
  console.log('🔄 Ejecutando migración 09: Deduplicación y actualización de Mapa Peluquería 1º y 2º...');

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

    console.log(`⏳ Cargando y deduplicando ${ds.tab} desde ${ds.filename}...`);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const modules = JSON.parse(rawContent);

    let totalActsBefore = 0;
    let totalActsAfter = 0;

    // Deduplicar actividades por RA: solo la primera conexión en cada RA conserva la actividad única
    for (const m of modules) {
      for (const lo of m.learningOutcomes || []) {
        const seenTitles = new Set<string>();
        for (const c of lo.connections || []) {
          totalActsBefore += (c.activities || []).length;
          const uniqueConnActs: any[] = [];
          for (const a of c.activities || []) {
            const title = (a.title_es || a.title_ca || '').trim();
            if (title && !seenTitles.has(title)) {
              seenTitles.add(title);
              uniqueConnActs.push(a);
            }
          }
          c.activities = uniqueConnActs;
          totalActsAfter += uniqueConnActs.length;
        }
      }
    }

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
    console.log(`✅ Tab ${ds.tab}: ${docs.length} módulos guardados en MongoDB (${totalActsBefore} -> ${totalActsAfter} actividades).`);
  }
};
