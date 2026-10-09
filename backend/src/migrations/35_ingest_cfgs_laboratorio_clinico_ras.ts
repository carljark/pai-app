import { RA } from '../models/RA';
import { CFGS_LABORATORIO_CLINICO_RAS_DATA } from '../data/ras_cfgs_laboratorio_clinico.data';

const TIPO_NIVEL = 'CFGS_LABORATORIO_CLINICO';

/**
 * Carga los RA y criterios de evaluación (ES/CA) del CFGS Laboratorio Clínico y Biomédico.
 * Solo toca los documentos de este nivel, así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Sincronizando RAs de CFGS Laboratorio Clínico y Biomédico...');
  await RA.deleteMany({ tipoNivel: TIPO_NIVEL });

  const docs = CFGS_LABORATORIO_CLINICO_RAS_DATA.map((ra) => ({
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
  console.log(`✅ Insertados ${docs.length} RAs para ${TIPO_NIVEL}.`);
};
