import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NIVELES } from './niveles';

/**
 * Oferta de ciclos de FP de las Illes Balears (FP Illes Balears, CAIB), con los nombres
 * en castellano de TodoFP. Se genera una sola vez (ver `documentation/solicitudes_de_centros.md`).
 */
export interface CicloOferta {
  codigo: string;
  etapa: 'FPB' | 'CFGM' | 'CFGS';
  familia_es: string;
  familia_ca: string;
  nombre_es: string;
  nombre_ca: string;
}

const dir = path.dirname(fileURLToPath(import.meta.url));

export const OFERTA_FP_IB: readonly CicloOferta[] = JSON.parse(
  fs.readFileSync(path.join(dir, 'oferta-fp-ib.json'), 'utf-8'),
);

export const findCicloOferta = (codigo?: string): CicloOferta | undefined =>
  OFERTA_FP_IB.find((c) => c.codigo === codigo);

/** Nivel del catálogo que ya incorpora el ciclo de la oferta, si existe. */
export const tipoNivelDeCodigo = (codigo?: string): string | null =>
  (codigo && NIVELES.find((n) => n.codigoCaib === codigo)?.id) || null;
