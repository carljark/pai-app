export type CompetenceType = 'tecnica' | 'ciencias' | 'comunicacion' | 'empleabilidad' | 'cliente' | 'sostenibilidad' | 'digital';

export interface IntermodularActivity {
  id: string;
  title_es: string;
  title_ca: string;
  description_es: string;
  description_ca: string;
  stepByStep_es?: string[];
  stepByStep_ca?: string[];
  evidence_es: string;
  evidence_ca: string;
  diversitySupport_es: string;
  diversitySupport_ca: string;
  motivatingFactor_es?: string;
  motivatingFactor_ca?: string;
}

export interface IntermodularConnection {
  targetModuleCode: string;
  targetModuleName_es: string;
  targetModuleName_ca: string;
  targetRaCode: string;
  targetRaText_es: string;
  targetRaText_ca: string;
  targetCriteria_es?: string;
  targetCriteria_ca?: string;
  relationType: CompetenceType;
  justification_es: string;
  justification_ca: string;
  activities: IntermodularActivity[];
}

export interface LearningOutcome {
  id: string;
  code: string;
  text_es: string;
  text_ca: string;
  criteria_es?: string[];
  criteria_ca?: string[];
  importance_es?: string;
  importance_ca?: string;
  connections: IntermodularConnection[];
}

export interface FPBModule {
  code: string;
  name_es: string;
  name_ca: string;
  type: 'especifico' | 'comun' | 'transversal';
  color: string;
  icon: string;
  learningOutcomes: LearningOutcome[];
}
