/** Criterio de evaluación con su texto oficial en el curso de la ficha. */
export interface CriterioTexto {
  id: string;
  text_es: string;
  text_ca: string;
}

/** Criterios relacionados de cada materia y la relación que fundamenta el ámbito. */
export interface VinculoAfinidad {
  criterios: Record<string, string[]>;
  criteriosTexto: Record<string, CriterioTexto[]>;
  resumen_es: Record<string, string>;
  resumen_ca: Record<string, string>;
  relacion_es: string;
  relacion_ca: string;
}

/** Materia y opción del documento de origen, con el nombre del ámbito desde esa materia. */
export interface FuenteAfinidad {
  materia: string;
  opcion?: number;
  ambito_es: string;
  ambito_ca: string;
}

/** Ficha de afinidad curricular entre dos o tres materias de un curso de la ESO. */
export interface AfinidadEso {
  id: string;
  curso: string;
  materias: string[];
  ambito_es: string;
  ambito_ca: string;
  vinculos: VinculoAfinidad[];
  saberes: Record<string, { es: string[]; ca: string[] }>;
  conceptos_es: string[];
  conceptos_ca: string[];
  /** `documento` (IES Cap de Llevant) o `ampliacion` (propuesta nueva). */
  origen: 'documento' | 'ampliacion';
  fuentes: FuenteAfinidad[];
}

/** Materia que se imparte en el curso, con el número de fichas en que aparece. */
export interface MateriaAfinidades {
  code: string;
  name_es: string;
  name_ca: string;
  tipo: string;
  total: number;
}

/** Respuesta de `GET /api/afinidades-eso?tab=…`. */
export interface AfinidadesCurso {
  curso: string;
  materias: MateriaAfinidades[];
  afinidades: AfinidadEso[];
}
