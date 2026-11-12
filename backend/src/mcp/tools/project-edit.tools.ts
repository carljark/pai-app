import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { apiResult, type McpContext, type ToolDefinition } from '../tool-helpers';
import { aiModel, aiProvider, contentLanguage, projectId, summarizeProject } from './project.tools';

const path = (id: string, suffix = '') => `/api/projects/${encodeURIComponent(id)}${suffix}`;

/**
 * Ejecuta `action` con el turno de edición (que toma la propia API al modificar) y después lo libera,
 * salvo que el usuario ya lo tuviera antes (p. ej. porque tiene el proyecto abierto en la web).
 */
export const withEditLock = async (ctx: McpContext, id: string, action: () => Promise<CallToolResult>): Promise<CallToolResult> => {
  const before = await ctx.api.request('GET', path(id, '/edit-lock'));
  const heldByMe = before.ok && String(before.data?.lock?.userId) === String(ctx.user._id);
  try {
    return await action();
  } finally {
    if (!heldByMe) await ctx.api.request('DELETE', path(id, '/edit-lock'));
  }
};

const updateContent = async (ctx: McpContext, args: { projectId: string; rawText: string; language?: string }) => {
  const current = await ctx.api.request('GET', path(args.projectId));
  if (!current.ok) return apiResult(current);
  const body = { rawText: args.rawText, status: current.data.status, language: args.language ?? current.data.language };
  return apiResult(await ctx.api.request('PUT', path(args.projectId), { body }), summarizeProject);
};

const generateInput = {
  tipoNivel: z.string().describe('Id del nivel (ver list_levels).'),
  courseLevel: z.string().describe('Curso, p. ej. «1º».'),
  modules: z.array(z.string()).min(1).describe('Nombres de los módulos o materias implicados.'),
  selectedRas: z.array(z.string()).min(1).describe('Textos exactos (`description`) de los RA o competencias específicas elegidos.'),
  criteriosSeleccionados: z.array(z.object({ ce: z.string(), ids: z.array(z.string()) })).optional()
    .describe('Solo ESO: criterios elegidos de cada competencia específica.'),
  title: z.string().optional(),
  methodology: z.string().optional().describe('Metodología, p. ej. ABP o Aprendizaje-Servicio.'),
  language: contentLanguage.optional(),
  extraInstructions: z.string().optional().describe('Indicaciones del docente para la IA.'),
  collaboratorIds: z.array(z.string()).optional().describe('Ids de docentes con quienes compartir (ver find_users).'),
  aiProvider,
  aiModel
};

export const projectEditTools: ToolDefinition[] = [
  {
    name: 'generate_project',
    title: 'Generar un proyecto',
    description: 'Encola la generación de un proyecto con IA (tarda varios minutos). Devuelve el proyecto en cola: consulta su avance con get_project_status. Límite de 10 generaciones al día salvo administradores.',
    kind: 'write',
    input: generateInput,
    run: async (args, { api }) =>
      apiResult(await api.request('POST', '/api/projects/generate', { body: args }), (data) => ({ message: data.message, project: summarizeProject(data.project) }))
  },
  {
    name: 'retry_project',
    title: 'Reintentar la generación',
    description: 'Vuelve a encolar un proyecto cuya generación falló.',
    kind: 'write',
    input: { projectId, aiProvider },
    run: async ({ projectId: id, aiProvider: provider }, { api }) =>
      apiResult(await api.request('POST', path(id, '/retry'), { body: { aiProvider: provider } }), (data) => ({ message: data.message, project: summarizeProject(data.project) }))
  },
  {
    name: 'update_project_content',
    title: 'Guardar el contenido',
    description: 'Sustituye el Markdown completo del proyecto (lee antes el actual con get_project y conserva lo que no cambies). Si `language` no es el original, se guarda en esa traducción. Respeta el turno de edición: si otra persona está editando, falla sin escribir.',
    kind: 'write',
    input: { projectId, rawText: z.string().min(1).describe('Markdown completo del proyecto.'), language: contentLanguage.optional() },
    run: async (args, ctx) => withEditLock(ctx, args.projectId, () => updateContent(ctx, args))
  },
  {
    name: 'rename_project',
    title: 'Renombrar un proyecto',
    description: 'Cambia el título del proyecto.',
    kind: 'write',
    input: { projectId, title: z.string().min(1) },
    run: async ({ projectId: id, title }, { api }) => apiResult(await api.request('PATCH', path(id, '/title'), { body: { title } }), summarizeProject)
  },
  {
    name: 'translate_project',
    title: 'Traducir un proyecto',
    description: 'Inicia la traducción del original al otro idioma (castellano ↔ catalán) en segundo plano. Consulta el avance con get_project_status.',
    kind: 'write',
    input: { projectId, target: contentLanguage.describe('Idioma de destino.'), aiProvider, aiModel },
    run: async ({ projectId: id, ...body }, ctx) =>
      withEditLock(ctx, id, async () => apiResult(await ctx.api.request('POST', path(id, '/translate'), { body }), summarizeProject))
  },
  {
    name: 'review_project',
    title: 'Revisar un proyecto con IA',
    description: 'Inicia la revisión con IA del proyecto en segundo plano (nota de 1 a 5, justificación y sugerencias en nueve aspectos). Consulta el resultado con get_project_review. No cambia el texto.',
    kind: 'write',
    input: { projectId, aiProvider, aiModel },
    run: async ({ projectId: id, ...body }, { api }) =>
      apiResult(await api.request('POST', path(id, '/review'), { body }), (p) => ({ ...summarizeProject(p), review: p.review?.status }))
  },
  {
    name: 'clone_project',
    title: 'Clonar un proyecto',
    description: 'Crea una copia propia de un proyecto (también de otro docente), opcionalmente en otro idioma.',
    kind: 'write',
    input: { projectId, language: contentLanguage.optional() },
    run: async ({ projectId: id, language }, { api }) => apiResult(await api.request('POST', path(id, '/clone'), { body: { language } }))
  },
  {
    name: 'delete_project',
    title: 'Borrar un proyecto',
    description: 'Borra definitivamente un proyecto. No se puede deshacer: confirma antes con el docente.',
    kind: 'destructive',
    input: { projectId },
    run: async ({ projectId: id }, { api }) => apiResult(await api.request('DELETE', path(id)))
  },
  {
    name: 'add_collaborator',
    title: 'Invitar a colaborar',
    description: 'Añade un docente como colaborador del proyecto (ver find_users para su id).',
    kind: 'write',
    input: { projectId, userId: z.string() },
    run: async ({ projectId: id, userId }, { api }) => apiResult(await api.request('POST', path(id, '/collaborators'), { body: { userId } }))
  },
  {
    name: 'remove_collaborator',
    title: 'Quitar un colaborador',
    description: 'Quita a un colaborador del proyecto.',
    kind: 'destructive',
    input: { projectId, userId: z.string() },
    run: async ({ projectId: id, userId }, { api }) =>
      apiResult(await api.request('DELETE', path(id, `/collaborators/${encodeURIComponent(userId)}`)))
  }
];
