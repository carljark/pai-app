/**
 * Catálogo único de niveles educativos (titulaciones) de la plataforma.
 *
 * Es la fuente de verdad para los identificadores de nivel (`tipoNivel`), sus nombres
 * oficiales en castellano y catalán, sus cursos y la edad orientativa del alumnado.
 * El frontend lo obtiene de `GET /api/niveles`. Para añadir un nivel nuevo se añade
 * aquí su entrada y se cargan sus datos curriculares con una migración
 * (ver `documentation/niveles_educativos_y_catalogo.md`).
 */

export type Etapa = 'FPB' | 'CFGM' | 'CFGS' | 'ESO';
/** Unidad curricular que se selecciona al crear un proyecto. */
export type UnidadCurricular = 'RA' | 'CE';
/** Nombre del proyecto en la normativa del nivel. */
export type Terminologia = 'proyecto_intermodular' | 'situacion_aprendizaje';

/** Mapa intermodular de un nivel: pestaña del mapa y selección inicial. */
export interface MapaNivel {
  /** Identificador histórico de la pestaña (`MapaModule.tab`); no se renombra para no migrar datos. */
  tab: string;
  /** Curso que cubre el mapa; sin curso, el mapa abarca todo el ciclo. */
  curso?: string;
  /**
   * Formato del mapa: `modulos` (FP: módulos, RA, conexiones y actividades; por defecto) o
   * `afinidades` (ESO: fichas de afinidad entre materias, sin actividades).
   */
  formato?: 'modulos' | 'afinidades';
  /** Módulo (o materia, en las afinidades) seleccionado al abrir el mapa. */
  moduleCode: string;
  /** RA seleccionado al abrir el mapa; vacío en las afinidades. */
  raId: string;
}

export interface CursoNivel {
  curso: string;
  /** Edad orientativa del alumnado (solo donde la normativa fija una edad ordinaria). */
  edad?: string;
  /** Códigos de los módulos del curso en su orden oficial (FP). Sin lista, se muestran todos. */
  modulos?: readonly string[];
}

export interface NivelEducativo {
  id: string;
  etapa: Etapa;
  /** Comunidad cuyo currículo se aplica: `IB` (Illes Balears) o `estatal`. */
  comunidad: 'IB' | 'estatal';
  nombre_es: string;
  nombre_ca: string;
  /** Nombre del nivel en el prompt («2º de …»); si falta, se usa `nombre_es`/`nombre_ca`. */
  nombrePrompt_es?: string;
  nombrePrompt_ca?: string;
  /** Familia profesional o etapa, para elegir ejemplos INTEF relevantes. */
  palabrasClave?: string;
  unidad: UnidadCurricular;
  terminologia: Terminologia;
  cursos: readonly CursoNivel[];
  /** Mapas intermodulares del nivel, en el orden en que se muestran. */
  mapas?: readonly MapaNivel[];
}

export const NIVELES: readonly NivelEducativo[] = [
  {
    id: 'FP_BASICA',
    etapa: 'FPB',
    comunidad: 'IB',
    nombre_es: 'CFGB Peluquería y Estética',
    nombre_ca: 'CFGB Perruqueria i Estètica',
    nombrePrompt_es: 'FP Básica (Formación Profesional Básica)',
    nombrePrompt_ca: 'FP Básica (Formación Profesional Básica)',
    palabrasClave: 'formación profesional básica peluquería estética',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    cursos: [{ curso: '1º' }, { curso: '2º' }],
    mapas: [{ tab: 'FPB', moduleCode: '3060', raId: '3060_RA1' }],
  },
  {
    id: 'CFGM_ESTETICA',
    etapa: 'CFGM',
    comunidad: 'IB',
    nombre_es: 'CFGM Estética y Belleza',
    nombre_ca: 'CFGM Estètica i Bellesa',
    palabrasClave: 'formación profesional estética belleza',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    cursos: [
      { curso: '1º', modulos: ['0633', '0635', '0636', '0638', '0640', '0641', '1664', '1709', '0156'] },
    ],
    mapas: [{ tab: 'CFGM', moduleCode: '0633', raId: '0633_RA1' }],
  },
  {
    id: 'CFGM_PELUQUERIA',
    etapa: 'CFGM',
    comunidad: 'IB',
    nombre_es: 'CFGM Peluquería y Cosmética Capilar',
    nombre_ca: 'CFGM Perruqueria i Cosmètica Capil·lar',
    palabrasClave: 'formación profesional peluquería cosmética capilar',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    cursos: [
      { curso: '1º', modulos: ['0845', '0842', '0844', '0846', '0849', '1664', '1709', '0156'] },
      { curso: '2º', modulos: ['0640', '0643', '0843', '0848', '0636', '1708', '1710', '1713'] },
    ],
    mapas: [
      { tab: 'CFGM_PELUQUERIA', curso: '1º', moduleCode: '0845', raId: '0845_RA1' },
      { tab: 'CFGM_PELUQUERIA_2', curso: '2º', moduleCode: '0640', raId: '0640_RA1' },
    ],
  },
  {
    id: 'CFGM_ATENCION_DEPENDENCIA',
    etapa: 'CFGM',
    comunidad: 'IB',
    nombre_es: 'CFGM Atención a Personas en Situación de Dependencia',
    nombre_ca: 'CFGM Atenció a persones en situació de dependència',
    palabrasClave: 'formación profesional atención personas dependencia sociosanitaria',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    // Módulos de cada curso según FP Illes Balears (SSC21, matriculados desde 2026-27).
    cursos: [
      { curso: '1º', modulos: ['0020', '0210', '0212', '0213', '0215', '0217', '1664', '1709'] },
      { curso: '2º', modulos: ['0211', '0214', '0216', '0831', '0156', '1708', '1710', '1713'] },
    ],
  },
  {
    id: 'CFGM_GUIA_MEDIO_NATURAL',
    etapa: 'CFGM',
    comunidad: 'IB',
    nombre_es: 'CFGM Guía en el Medio Natural y de Tiempo Libre',
    nombre_ca: 'CFGM Guia en el medi natural i de temps lliure',
    palabrasClave: 'formación profesional actividades físicas deportivas medio natural tiempo libre',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    // Módulos de cada curso según FP Illes Balears (AFD21, matriculados desde 2026-27).
    cursos: [
      { curso: '1º', modulos: ['1325', '1327', '1329', '1333', '1334', '1335', '1336', '1664', '1709'] },
      { curso: '2º', modulos: ['1328', '1337', '1338', '1339', '0156', '1708', '1710', '1713'] },
    ],
  },
  {
    id: 'CFGS_EDUCACION_INFANTIL',
    etapa: 'CFGS',
    comunidad: 'IB',
    nombre_es: 'CFGS Educación Infantil',
    nombre_ca: 'CFGS Educació Infantil',
    palabrasClave: 'formación profesional educación infantil',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    // Módulos de cada curso según FP Illes Balears.
    cursos: [
      { curso: '1º', modulos: ['0011', '0012', '0014', '0015', '1665', '1709'] },
      { curso: '2º', modulos: ['0013', '0016', '0017', '0018', '0020', '0019', '0179', '1708', '1710'] },
    ],
    mapas: [
      { tab: 'CFGS_EDUCACION_INFANTIL', curso: '1º', moduleCode: '0011', raId: '0011_RA1' },
      { tab: 'CFGS_EDUCACION_INFANTIL_2', curso: '2º', moduleCode: '0013', raId: '0013_RA1' },
    ],
  },
  {
    // ESO ordinaria: Decreto 42/2025 (BOIB n.º 103, de 4/8/2025).
    id: 'ESO_ORDINARIA',
    etapa: 'ESO',
    comunidad: 'IB',
    nombre_es: 'ESO',
    nombre_ca: 'ESO',
    nombrePrompt_es: 'ESO (Educación Secundaria Obligatoria)',
    nombrePrompt_ca: 'ESO (Educación Secundaria Obligatoria)',
    palabrasClave: 'educación secundaria obligatoria situación aprendizaje',
    unidad: 'CE',
    terminologia: 'situacion_aprendizaje',
    cursos: [
      { curso: '1º', edad: '12-13 años' },
      { curso: '2º', edad: '13-14 años' },
      { curso: '3º', edad: '14-15 años' },
      { curso: '4º', edad: '15-16 años' },
    ],
    // Afinidades curriculares por curso (documento del IES Cap de Llevant, ampliado).
    mapas: [
      { tab: 'ESO_1', curso: '1º', formato: 'afinidades', moduleCode: 'biologia_geologia', raId: '' },
      { tab: 'ESO_2', curso: '2º', formato: 'afinidades', moduleCode: 'educacion_fisica', raId: '' },
      { tab: 'ESO_3', curso: '3º', formato: 'afinidades', moduleCode: 'biologia_geologia', raId: '' },
      { tab: 'ESO_4', curso: '4º', formato: 'afinidades', moduleCode: 'biologia_geologia', raId: '' },
    ],
  },
  {
    // Programa de Diversificación Curricular (3.º y 4.º de ESO).
    id: 'DIVERSIFICACION_CURRICULAR',
    etapa: 'ESO',
    comunidad: 'IB',
    nombre_es: 'ESO (PDC)',
    nombre_ca: 'ESO (PDC)',
    nombrePrompt_es: 'ESO (Diversificación Curricular / PDC)',
    nombrePrompt_ca: 'ESO (Diversificación Curricular / PDC)',
    unidad: 'CE',
    terminologia: 'situacion_aprendizaje',
    cursos: [{ curso: '3º' }, { curso: '4º' }],
  },
];

/** Nivel de los proyectos y RA antiguos que no guardan `tipoNivel`. */
export const DEFAULT_TIPO_NIVEL = 'FP_BASICA';

export const NIVEL_IDS: readonly string[] = NIVELES.map((n) => n.id);

const tabsDeFormato = (formato: 'modulos' | 'afinidades'): readonly string[] =>
  NIVELES.flatMap((n) => (n.mapas ?? []).filter((m) => (m.formato ?? 'modulos') === formato).map((m) => m.tab));

/** Pestañas del mapa por módulos declaradas en el catálogo (valores válidos de `MapaModule.tab`). */
export const MAPA_TABS: readonly string[] = tabsDeFormato('modulos');

/** Pestañas del mapa de afinidades (valores válidos de `AfinidadEso.tab`), con su curso. */
export const AFINIDADES_TABS: readonly string[] = tabsDeFormato('afinidades');

/** Curso de una pestaña del catálogo (`ESO_3` → `3º`). */
export const cursoDeTab = (tab: string): string | undefined =>
  NIVELES.flatMap((n) => n.mapas ?? []).find((m) => m.tab === tab)?.curso;

export const findNivel = (id?: string | null): NivelEducativo | undefined =>
  NIVELES.find((n) => n.id === id);

/** Nombre del nivel para el prompt en el idioma del proyecto. */
export const nombrePrompt = (nivel: NivelEducativo, language?: string): string =>
  language === 'catalan'
    ? nivel.nombrePrompt_ca ?? nivel.nombre_ca
    : nivel.nombrePrompt_es ?? nivel.nombre_es;

/** Curso por defecto de un nivel: el primero de su lista. */
export const defaultCurso = (id?: string | null): string => findNivel(id)?.cursos[0]?.curso ?? '1º';

/** Edad orientativa del alumnado de un curso, si el nivel la define. */
export const edadDeCurso = (id: string | undefined, curso: string): string | undefined =>
  findNivel(id)?.cursos.find((c) => c.curso === curso)?.edad;
