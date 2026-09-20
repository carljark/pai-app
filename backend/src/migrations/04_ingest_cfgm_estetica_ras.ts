import { RA } from '../models/RA';
import { CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';

export const up = async () => {
  console.log('🔄 Sincronizando RAs de CFGM Estética i Bellesa...');
  
  await RA.deleteMany({ tipoNivel: 'CFGM_ESTETICA' });
  
  const docs = CFGM_ESTETICA_RAS_DATA.map((ra: any) => ({
    id: ra.id,
    module: ra.module,
    module_es: ra.module_es,
    module_ca: ra.module_ca,
    moduleCode: ra.moduleCode,
    tipoNivel: ra.tipoNivel,
    description: ra.description_ca || ra.description,
    description_ca: ra.description_ca,
    description_es: ra.description_es,
    criterios_es: ra.criterios_es,
    criterios_ca: ra.criterios_ca
  }));

  await RA.insertMany(docs);
  console.log(`✅ Insertados ${docs.length} RAs para CFGM_ESTETICA.`);
};
