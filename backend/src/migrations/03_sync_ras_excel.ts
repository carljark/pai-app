import mongoose from 'mongoose';
import { RA } from '../models/RA';
import fs from 'fs';
import path from 'path';

export const up = async () => {
  console.log('Sincronizando todos los RAs desde el Excel oficial...');
  
  const filePath = path.join(process.cwd(), 'ras_excel.json');
  if (!fs.existsSync(filePath)) {
    console.log('No se encontró ras_excel.json. Saltando migración.');
    return;
  }

  const rasData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  await RA.deleteMany({}); // Borrar todos los antiguos
  
  const docs = rasData.map((ra: any) => ({
    id: ra.id,
    module: ra.module,
    description: ra.description,
    description_ca: ra.description,
    description_es: ra.description // Como fallback si se pide en castellano
  }));

  await RA.insertMany(docs);
  console.log(`✅ Insertados ${docs.length} RAs desde el Excel.`);
};
