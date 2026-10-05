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

export interface CurriculumSelection {
  ras: string[];
  ces: string[];
}
