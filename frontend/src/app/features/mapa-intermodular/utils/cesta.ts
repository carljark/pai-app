import type { CestaEstado, ClavesPorUnidad, GrupoCesta } from '../models/cesta.model';

/** Une dos listas conservando el orden y sin repetir. */
export function sinRepetir(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

/** Ordena «1.10» después de «1.2» y «RA10» después de «RA2». */
function ordenar(claves: string[]): string[] {
  return [...claves].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function sinClave(registro: ClavesPorUnidad, unidad: string): ClavesPorUnidad {
  return Object.fromEntries(Object.entries(registro).filter(([u]) => u !== unidad));
}

/** Acumula en `destino` las claves de `origen`, sin repetir. */
export function unirClaves(destino: ClavesPorUnidad, origen: ClavesPorUnidad): ClavesPorUnidad {
  for (const [unidad, claves] of Object.entries(origen)) {
    destino[unidad] = sinRepetir(destino[unidad] ?? [], claves);
  }
  return destino;
}

/** Materias o módulos presentes en la cesta, arrastrados o añadidos con botón. */
export function todasLasUnidades(estado: CestaEstado): string[] {
  return sinRepetir(estado.unidades, Object.keys(estado.extras));
}

/** Mete una unidad arrastrada; si se había vaciado a mano, recupera sus claves. */
export function anadirUnidad(estado: CestaEstado, unidad: string): CestaEstado {
  if (estado.unidades.includes(unidad)) return estado;
  return {
    ...estado,
    unidades: [...estado.unidades, unidad],
    excluidas: sinClave(estado.excluidas, unidad),
  };
}

/** Añade las claves de una ficha, conexión o RA; vuelven aunque se hubieran quitado antes. */
export function anadirClaves(estado: CestaEstado, porUnidad: ClavesPorUnidad): CestaEstado {
  const excluidas = { ...estado.excluidas };
  for (const [unidad, claves] of Object.entries(porUnidad)) {
    excluidas[unidad] = (excluidas[unidad] ?? []).filter((c) => !claves.includes(c));
  }
  return { ...estado, extras: unirClaves({ ...estado.extras }, porUnidad), excluidas };
}

export function quitarUnidad(estado: CestaEstado, unidad: string): CestaEstado {
  return {
    unidades: estado.unidades.filter((u) => u !== unidad),
    extras: sinClave(estado.extras, unidad),
    excluidas: sinClave(estado.excluidas, unidad),
  };
}

export function quitarClave(estado: CestaEstado, unidad: string, clave: string): CestaEstado {
  const excluidas = sinRepetir(estado.excluidas[unidad] ?? [], [clave]);
  return { ...estado, excluidas: { ...estado.excluidas, [unidad]: excluidas } };
}

/** Grupos de la cesta: claves añadidas con botón y en común, menos las quitadas a mano. */
export function agrupar(estado: CestaEstado, comunes: ClavesPorUnidad): GrupoCesta[] {
  return todasLasUnidades(estado).map((unidad) => {
    const quitadas = estado.excluidas[unidad] ?? [];
    const claves = sinRepetir(estado.extras[unidad] ?? [], comunes[unidad] ?? []);
    return {
      unidad,
      claves: ordenar(claves.filter((c) => !quitadas.includes(c))),
      arrastrada: estado.unidades.includes(unidad),
    };
  });
}

/** Todas las claves de `porUnidad` están ya en la cesta (y no hay ninguna vacía). */
export function contieneClaves(grupos: GrupoCesta[], porUnidad: ClavesPorUnidad): boolean {
  const entradas = Object.entries(porUnidad);
  if (entradas.length === 0) return false;
  return entradas.every(([unidad, claves]) => {
    const grupo = grupos.find((g) => g.unidad === unidad);
    return !!grupo && claves.every((c) => grupo.claves.includes(c));
  });
}
