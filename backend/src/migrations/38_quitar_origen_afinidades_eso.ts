import { AfinidadEso } from '../models/AfinidadEso';

/**
 * Elimina el campo `origen` (documento del centro o ampliación) de las fichas de afinidades
 * de la ESO: ya no forma parte de los datos ni se muestra (tarea 230). Solo toca ese campo de
 * la colección `afinidadesos`, así que es seguro reejecutarla.
 */
export const up = async () => {
  const res = await AfinidadEso.collection.updateMany(
    { origen: { $exists: true } },
    { $unset: { origen: '' } },
  );
  console.log(`✅ Afinidades ESO: campo origen eliminado de ${res.modifiedCount} fichas.`);
};
