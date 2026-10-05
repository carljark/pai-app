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

export interface CursoNivel {
  curso: string;
  /** Edad orientativa del alumnado (solo donde la normativa fija una edad ordinaria). */
  edad?: string;
}

export interface NivelEducativo {
  id: string;
  etapa: Etapa;
  /** Comunidad cuyo currículo se aplica: `IB` (Illes Balears) o `estatal`. */
  comunidad: 'IB' | 'estatal';
  nombre_es: string;
  nombre_ca: string;
  unidad: UnidadCurricular;
  terminologia: Terminologia;
  cursos: readonly CursoNivel[];
}

export const NIVELES: readonly NivelEducativo[] = [
  {
    id: 'FP_BASICA',
    etapa: 'FPB',
    comunidad: 'IB',
    nombre_es: 'CFGB Peluquería y Estética',
    nombre_ca: 'CFGB Perruqueria i Estètica',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    cursos: [{ curso: '1º' }, { curso: '2º' }],
  },
  {
    id: 'CFGM_ESTETICA',
    etapa: 'CFGM',
    comunidad: 'IB',
    nombre_es: 'CFGM Estética y Belleza',
    nombre_ca: 'CFGM Estètica i Bellesa',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    cursos: [{ curso: '1º' }],
  },
  {
    id: 'CFGM_PELUQUERIA',
    etapa: 'CFGM',
    comunidad: 'IB',
    nombre_es: 'CFGM Peluquería y Cosmética Capilar',
    nombre_ca: 'CFGM Perruqueria i Cosmètica Capil·lar',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    cursos: [{ curso: '1º' }, { curso: '2º' }],
  },
  {
    id: 'CFGS_EDUCACION_INFANTIL',
    etapa: 'CFGS',
    comunidad: 'IB',
    nombre_es: 'CFGS Educación Infantil',
    nombre_ca: 'CFGS Educació Infantil',
    unidad: 'RA',
    terminologia: 'proyecto_intermodular',
    cursos: [{ curso: '1º' }, { curso: '2º' }],
  },
  {
    // ESO ordinaria: Decreto 42/2025 (BOIB n.º 103, de 4/8/2025).
    id: 'ESO_ORDINARIA',
    etapa: 'ESO',
    comunidad: 'IB',
    nombre_es: 'ESO',
    nombre_ca: 'ESO',
    unidad: 'CE',
    terminologia: 'situacion_aprendizaje',
    cursos: [
      { curso: '1º', edad: '12-13 años' },
      { curso: '2º', edad: '13-14 años' },
      { curso: '3º', edad: '14-15 años' },
      { curso: '4º', edad: '15-16 años' },
    ],
  },
  {
    // Programa de Diversificación Curricular (3.º y 4.º de ESO).
    id: 'DIVERSIFICACION_CURRICULAR',
    etapa: 'ESO',
    comunidad: 'IB',
    nombre_es: 'ESO (PDC)',
    nombre_ca: 'ESO (PDC)',
    unidad: 'CE',
    terminologia: 'situacion_aprendizaje',
    cursos: [{ curso: '3º' }, { curso: '4º' }],
  },
];

export const NIVEL_IDS: readonly string[] = NIVELES.map((n) => n.id);

export const findNivel = (id?: string | null): NivelEducativo | undefined =>
  NIVELES.find((n) => n.id === id);

/** Curso por defecto de un nivel: el primero de su lista. */
export const defaultCurso = (id?: string | null): string => findNivel(id)?.cursos[0]?.curso ?? '1º';

/** Edad orientativa del alumnado de un curso, si el nivel la define. */
export const edadDeCurso = (id: string | undefined, curso: string): string | undefined =>
  findNivel(id)?.cursos.find((c) => c.curso === curso)?.edad;
