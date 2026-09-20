import mongoose from 'mongoose';
import { RA } from '../models/RA';
import fs from 'fs';
import path from 'path';

export const up = async () => {
  console.log('Sincronizando RAs de CFGM Estética...');
  
  const filePath = path.join(process.cwd(), 'ras_cfgm_estetica.json');
  if (!fs.existsSync(filePath)) {
    console.log('No se encontró ras_cfgm_estetica.json. Saltando migración.');
    return;
  }

  const rasData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  await RA.deleteMany({ tipoNivel: 'CFGM_ESTETICA' });
  
  const docs = rasData.map((ra: any) => ({
    id: ra.id,
    module: ra.module,
    module_es: ra.module_es,
    module_ca: ra.module_ca,
    moduleCode: ra.moduleCode,
    tipoNivel: ra.tipoNivel,
    description: ra.description_es,
    description_ca: ra.description_ca,
    description_es: ra.description_es,
    criterios_es: ra.criterios_es,
    criterios_ca: ra.criterios_ca
  }));

  await RA.insertMany(docs);
  console.log(`✅ Insertados ${docs.length} RAs para CFGM_ESTETICA.`);
};
