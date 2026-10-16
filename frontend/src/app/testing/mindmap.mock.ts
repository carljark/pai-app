import type {
  CompetenceType,
  IntermodularActivity,
  FPBModule,
  IntermodularConnection,
  LearningOutcome,
} from '../features/mapa-intermodular/models/mapa-intermodular.model';

/** Conexión mínima hacia `module`/`ra` con una actividad. */
export function mockConnection(
  module: string,
  ra: string,
  relationType: CompetenceType,
  title?: string,
): IntermodularConnection {
  return {
    ...(title ? { title_es: title, title_ca: `${title} (ca)` } : {}),
    targetModuleCode: module,
    targetModuleName_es: `Módulo ${module}`,
    targetModuleName_ca: `Mòdul ${module}`,
    targetRaCode: ra,
    targetRaText_es: `Texto ${module} ${ra}`,
    targetRaText_ca: `Text ${module} ${ra}`,
    relationType,
    justification_es: `Justificación ${module} ${ra}`,
    justification_ca: `Justificació ${module} ${ra}`,
    activities: [mockActivity(module, ra)],
  };
}

function mockActivity(module: string, ra: string): IntermodularActivity {
  return {
    id: `act-${module}-${ra}`,
    title_es: `Actividad ${module} ${ra}`,
    title_ca: `Activitat ${module} ${ra}`,
    description_es: 'Descripción',
    description_ca: 'Descripció',
    evidence_es: 'Evidencia',
    evidence_ca: 'Evidència',
    diversitySupport_es: 'Diversidad',
    diversitySupport_ca: 'Diversitat',
  };
}

function mockRa(
  module: string,
  code: string,
  connections: IntermodularConnection[],
): LearningOutcome {
  return {
    id: `${module}_${code}`,
    code,
    text_es: `Resultado ${code} de ${module}`,
    text_ca: `Resultat ${code} de ${module}`,
    connections,
  };
}

const ANALISIS: FPBModule = {
  code: '0001',
  name_es: 'Análisis clínico',
  name_ca: 'Anàlisi clínica',
  type: 'especifico',
  color: '#2563eb',
  icon: 'flask',
  learningOutcomes: [],
};

const CALIDAD: FPBModule = {
  code: '0002',
  name_es: 'Calidad en el laboratorio',
  name_ca: 'Qualitat al laboratori',
  type: 'comun',
  color: '',
  icon: 'check',
  learningOutcomes: [],
};

/**
 * Dos módulos: 0001 (específico) con RA1 → dos conexiones a 0002 y una a 0009 (ajeno al mapa),
 * RA2 → una conexión a 0002 y RA3 sin conexiones; 0002 (común, sin color) con un RA sin conexiones.
 */
export function mindmapModules(): FPBModule[] {
  const ra1 = mockRa('0001', 'RA1', [
    mockConnection('0002', 'RA1', 'tecnica', 'Muestras compartidas'),
    mockConnection('0009', 'RA4', 'digital'),
    mockConnection('0002', 'RA2', 'comunicacion'),
  ]);
  const ra2 = mockRa('0001', 'RA2', [mockConnection('0002', 'RA1', 'ciencias')]);
  return [
    { ...ANALISIS, learningOutcomes: [ra1, ra2, mockRa('0001', 'RA3', [])] },
    { ...CALIDAD, learningOutcomes: [mockRa('0002', 'RA1', [])] },
  ];
}
