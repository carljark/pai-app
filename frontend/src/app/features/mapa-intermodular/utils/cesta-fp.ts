import type { ClavesPorUnidad, GrupoCesta } from '../models/cesta.model';
import type { FPBModule, IntermodularConnection } from '../models/mapa-intermodular.model';
import { unirClaves } from './cesta';
import type { RaReference } from './curriculum-match';

/** RA de origen y RA de destino de una conexión, por módulo. */
export function rasDeConexion(
  modulo: string,
  ra: string,
  conexion: IntermodularConnection,
): ClavesPorUnidad {
  return unirClaves({ [modulo]: [ra] }, { [conexion.targetModuleCode]: [conexion.targetRaCode] });
}

/**
 * RA en común entre los módulos de la cesta: los dos extremos de cada conexión entre dos de
 * ellos. Solo cuentan las conexiones en las que participa algún módulo arrastrado.
 */
export function comunesFp(
  modulos: FPBModule[],
  enCesta: string[],
  arrastrados: string[],
): ClavesPorUnidad {
  const comunes: ClavesPorUnidad = {};
  for (const m of modulos.filter((x) => enCesta.includes(x.code))) {
    for (const ra of m.learningOutcomes) {
      for (const c of ra.connections) {
        const destino = c.targetModuleCode;
        const cuenta = arrastrados.includes(m.code) || arrastrados.includes(destino);
        if (destino !== m.code && enCesta.includes(destino) && cuenta) {
          unirClaves(comunes, rasDeConexion(m.code, ra.code, c));
        }
      }
    }
  }
  return comunes;
}

/** RA de la cesta con sus textos, listos para buscarlos en el currículum del generador. */
export function referenciasDeGrupos(grupos: GrupoCesta[], modulos: FPBModule[]): RaReference[] {
  const refs: RaReference[] = [];
  for (const g of grupos) {
    const modulo = modulos.find((m) => m.code === g.unidad);
    for (const clave of g.claves) {
      const ra = modulo?.learningOutcomes.find((r) => r.code === clave);
      if (!modulo || !ra) continue;
      refs.push({
        moduleCode: modulo.code,
        moduleName: modulo.name_es,
        raCode: ra.code,
        textEs: ra.text_es,
        textCa: ra.text_ca,
      });
    }
  }
  return refs;
}
