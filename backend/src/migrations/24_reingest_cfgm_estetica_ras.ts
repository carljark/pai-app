import { RA } from '../models/RA';
import { CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';

const TIPO_NIVEL = 'CFGM_ESTETICA';

/**
 * Recarga los RA (ES/CA) del CFGM Estética y Belleza. La migración 04 los cargó, pero en
 * producción la colección `ras` se quedó sin ellos y el generador los tomaba de la copia de
 * respaldo del bundle del frontend, que la tarea 198 elimina. El fichero de datos ya incluye
 * el catalán corregido de la migración 17. Solo toca los documentos de este nivel, así que
 * es seguro reejecutarla.
 */
export const up = async () => {
  console.log('🔄 Recargando RAs de CFGM Estética y Belleza...');
  await RA.deleteMany({ tipoNivel: TIPO_NIVEL });

  const docs = CFGM_ESTETICA_RAS_DATA.map((ra) => ({
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
