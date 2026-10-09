import { RA } from '../models/RA';
import { CFGM_ATENCION_DEPENDENCIA_RAS_DATA } from '../data/ras_cfgm_atencion_dependencia.data';

const TIPO_NIVEL = 'CFGM_ATENCION_DEPENDENCIA';

/**
 * Carga los RA y criterios de evaluación (ES/CA) del CFGM Atención a Personas en Situación de Dependencia.
 * Solo toca los documentos de este nivel, así que es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Sincronizando RAs de CFGM Atención a Personas en Situación de Dependencia...');
  await RA.deleteMany({ tipoNivel: TIPO_NIVEL });

  const docs = CFGM_ATENCION_DEPENDENCIA_RAS_DATA.map((ra) => ({
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
