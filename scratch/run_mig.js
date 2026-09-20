const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pai');
  const RA = mongoose.connection.collection('ras');
  console.log('Sincronizando RAs de CFGM Estética...');
  
  const filePath = path.join(process.cwd(), 'backend', 'ras_cfgm_estetica.json');
  if (!fs.existsSync(filePath)) {
    console.log('No se encontró ras_cfgm_estetica.json. Saltando migración.');
    return;
  }

  const rasData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  await RA.deleteMany({ tipoNivel: 'CFGM_ESTETICA' });
  
  const docs = rasData.map((ra) => ({
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
  mongoose.disconnect();
}
run().catch(console.error);
