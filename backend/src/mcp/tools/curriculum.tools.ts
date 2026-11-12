import { z } from 'zod';
import { apiResult, type ToolDefinition } from '../tool-helpers';

const language = z.enum(['castellano', 'catalan']).optional().describe('Idioma de los textos (castellano por defecto).');

/** Niveles del catálogo, sin datos internos del mapa. */
const summarizeLevels = (levels: any[]) =>
  levels.map(({ id, etapa, nombre_es, nombre_ca, unidad, terminologia, cursos }) => ({ id, etapa, nombre_es, nombre_ca, unidad, terminologia, cursos }));

/** Sin módulo: lista de módulos de la pestaña; con módulo: ese módulo con sus RA, conexiones y actividades. */
const filterMap = (moduleCode?: string) => (modules: any[]) => {
  if (moduleCode) return modules.filter((m) => m.code === moduleCode);
  return modules.map((m) => ({ code: m.code, name_es: m.name_es, name_ca: m.name_ca, type: m.type, ras: m.learningOutcomes?.length ?? 0 }));
};

/** Sin materia: curso y materias; con materia: las fichas de afinidad en las que participa. */
const filterAffinities = (subjectCode?: string) => (data: any) =>
  subjectCode
    ? { curso: data.curso, afinidades: data.afinidades.filter((a: any) => a.materias?.includes(subjectCode)) }
    : { curso: data.curso, materias: data.materias };

const searchOffer = (search?: string) => (offer: any[]) => {
  const needle = (search || '').toLowerCase();
  return needle ? offer.filter((c) => JSON.stringify(c).toLowerCase().includes(needle)) : offer;
};

export const curriculumTools: ToolDefinition[] = [
  {
    name: 'list_levels',
    title: 'Niveles educativos',
    description: 'Lista los ciclos de FP y niveles de ESO disponibles en Plappin (id de `tipoNivel`, nombre, unidad RA/CE y cursos con sus códigos de módulo).',
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/niveles'), summarizeLevels)
  },
  {
    name: 'list_learning_outcomes',
    title: 'Resultados de aprendizaje (FP)',
    description: 'Resultados de aprendizaje (RA) oficiales de un ciclo, con sus criterios de evaluación. El campo `description` es el texto que espera `generate_project` en `selectedRas`.',
    kind: 'read',
    input: {
      tipoNivel: z.string().describe('Id del nivel (ver list_levels), p. ej. CFGM_ESTETICA.'),
      moduleCode: z.string().optional().describe('Código del módulo para filtrar, p. ej. 0633.'),
      language
    },
    run: async ({ tipoNivel, moduleCode, language: lang }, { api }) =>
      apiResult(await api.request('GET', '/api/ras', { query: { lang } }), (ras: any[]) =>
        ras.filter((r) => r.tipoNivel === tipoNivel && (!moduleCode || r.moduleCode === moduleCode)))
  },
  {
    name: 'list_eso_competences',
    title: 'Competencias específicas (ESO)',
    description: 'Competencias específicas y criterios de evaluación de las materias de un curso de la ESO ordinaria.',
    kind: 'read',
    input: { curso: z.enum(['1º', '2º', '3º', '4º']).describe('Curso de la ESO.'), language },
    run: async ({ curso, language: lang }, { api }) =>
      apiResult(await api.request('GET', '/api/ces', { query: { tipoNivel: 'ESO_ORDINARIA', curso, lang } }))
  },
  {
    name: 'get_intermodular_map',
    title: 'Mapa intermodular (FP)',
    description: 'Mapa intermodular de una pestaña (ver `mapas` en list_levels). Sin `moduleCode` devuelve los módulos; con él, los RA del módulo con sus conexiones a otros módulos y las actividades propuestas.',
    kind: 'read',
    input: { tab: z.string().describe('Pestaña del mapa, p. ej. FPB o CFGM_PELUQUERIA_2.'), moduleCode: z.string().optional() },
    run: async ({ tab, moduleCode }, { api }) =>
      apiResult(await api.request('GET', '/api/mapa-intermodular', { query: { tab } }), filterMap(moduleCode))
  },
  {
    name: 'get_eso_affinities',
    title: 'Mapa de afinidades (ESO)',
    description: 'Mapa de afinidades entre materias de un curso de la ESO. Sin `subjectCode` devuelve las materias; con él, las fichas de afinidad en las que participa esa materia.',
    kind: 'read',
    input: { tab: z.string().describe('Pestaña, p. ej. ESO_1.'), subjectCode: z.string().optional() },
    run: async ({ tab, subjectCode }, { api }) =>
      apiResult(await api.request('GET', '/api/afinidades-eso', { query: { tab } }), filterAffinities(subjectCode))
  },
  {
    name: 'list_ai_models',
    title: 'Modelos de IA',
    description: 'Proveedores y modelos de IA que se pueden elegir al generar, traducir o revisar proyectos.',
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/ai/models'))
  },
  {
    name: 'get_fp_offer',
    title: 'Oferta de FP de las Illes Balears',
    description: 'Ciclos de la oferta de FP con su código CAIB y si ya están disponibles en Plappin. Útil para solicitar centros y ciclos.',
    kind: 'read',
    input: { search: z.string().optional().describe('Texto para filtrar (nombre, código, familia…).') },
    run: async ({ search }, { api }) => apiResult(await api.request('GET', '/api/solicitudes/oferta'), searchOffer(search))
  }
];
