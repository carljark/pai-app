/** Criterio de evaluación de una CE, con su numeración oficial («1.1»). */
export interface CriterioItem {
  id: string;
  text: string;
}

export interface EvaluativeCriteria {
  _id: string;
  description: string;
  number?: string;
  subject?: string;
  area?: string;
  // Campos de la ESO ordinaria (GET /api/ces?tipoNivel=ESO_ORDINARIA)
  subjectCode?: string;
  /** Tipo de la materia en el curso: común, de opción u optativa. */
  tipo?: 'comun' | 'opcion' | 'optativa';
  ce_num?: number;
  /** Valor único de selección: «Materia · CEn. Descripción». */
  value?: string;
  criterios?: string[];
  /** Criterios del curso con su número oficial, en el idioma pedido. */
  criteriosDetalle?: CriterioItem[];
}

export interface LearningOutcome {
  _id?: string;
  id?: string;
  description: string;
  number?: string;
  subject?: string;
  module?: string;
  // Clasificación y variantes bilingües que devuelven la API o los seeds CFGM
  tipoNivel?: string;
  moduleCode?: string;
  module_es?: string;
  module_ca?: string;
  subject_es?: string;
  subject_ca?: string;
  description_es?: string;
  description_ca?: string;
  criterios?: string[];
  criterios_es?: string[];
  criterios_ca?: string[];
}

/** Criterios elegidos de una CE (`ce` es el valor con el que se selecciona la CE). */
export interface CriterioSeleccionado {
  ce: string;
  ids: string[];
}

export interface CurriculumSelection {
  ras: string[];
  ces: string[];
}
