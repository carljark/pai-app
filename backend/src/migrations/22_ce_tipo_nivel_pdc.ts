import { CE } from '../models/CE';

/**
 * Las CE existentes son del Programa de Diversificación Curricular (migración 06) y no
 * guardaban su nivel. Se marca para distinguirlas de las de la ESO ordinaria (migración 23).
 * Solo toca los documentos sin `tipoNivel`, así que es seguro reejecutarla.
 */
export const up = async () => {
  const result = await CE.updateMany(
    { tipoNivel: { $exists: false } },
    { $set: { tipoNivel: 'DIVERSIFICACION_CURRICULAR' } },
  );
  console.log(`✅ CE del PDC marcadas con su nivel: ${result.modifiedCount}.`);
};
