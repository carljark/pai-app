export interface EvaluativeCriteria {
  _id: string;
  description: string;
  number?: string;
  subject?: string;
}

export interface LearningOutcome {
  _id: string;
  description: string;
  number?: string;
  subject?: string;
  criterios_es?: string[];
  criterios_ca?: string[];
}

export interface CurriculumSelection {
  ras: string[];
  ces: string[];
}
