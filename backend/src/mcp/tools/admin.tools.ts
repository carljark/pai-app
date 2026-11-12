import { z } from 'zod';
import { apiResult, type ToolDefinition } from '../tool-helpers';

/**
 * Herramientas de administración: solo se registran para administradores y la API vuelve a
 * comprobar el rol en cada llamada (`requireAdmin`).
 */
const userId = z.string().describe('Id del usuario (ver admin_list_users).');
const MAX_LOGS = 100;

const settingsBody = (current: any, args: any) => ({
  schoolName: args.schoolName ?? current?.schoolName,
  schoolCity: args.schoolCity ?? current?.schoolCity,
  schoolContext: args.schoolContext ?? current?.schoolContext
});

export const adminTools: ToolDefinition[] = [
  {
    name: 'admin_list_users',
    title: 'Usuarios',
    description: '[Admin] Lista los usuarios con su rol (pending, teacher, admin) y su permiso de IA.',
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/admin/users'))
  },
  {
    name: 'admin_update_user',
    title: 'Cambiar rol o permiso de IA',
    description: '[Admin] Aprueba a un usuario (role teacher), lo hace administrador o le da o quita el permiso de IA.',
    kind: 'write',
    input: { userId, role: z.enum(['pending', 'teacher', 'admin']).optional(), canUseAi: z.boolean().optional() },
    run: async ({ userId: id, ...body }, { api }) =>
      apiResult(await api.request('PUT', `/api/admin/users/${encodeURIComponent(id)}/permissions`, { body }))
  },
  {
    name: 'admin_delete_user',
    title: 'Borrar un usuario',
    description: '[Admin] Borra definitivamente una cuenta (y sus tokens de conexión). No se puede deshacer: confirma antes.',
    kind: 'destructive',
    input: { userId },
    run: async ({ userId: id }, { api }) => apiResult(await api.request('DELETE', `/api/admin/users/${encodeURIComponent(id)}`))
  },
  {
    name: 'admin_get_activity_logs',
    title: 'Registro de actividad',
    description: `[Admin] Últimas ${MAX_LOGS} acciones de los usuarios (generaciones, borrados, traducciones…), con tiempos y modelos de IA.`,
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/admin/logs'))
  },
  {
    name: 'admin_get_analytics',
    title: 'Estadísticas de uso',
    description: '[Admin] Tiempo de uso, sesiones y actividad por usuario.',
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/admin/analytics'))
  },
  {
    name: 'admin_list_center_requests',
    title: 'Solicitudes de centro',
    description: '[Admin] Todas las solicitudes de centros y ciclos de los docentes.',
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/admin/solicitudes'))
  },
  {
    name: 'admin_update_center_request',
    title: 'Actualizar una solicitud',
    description: '[Admin] Cambia el estado de una solicitud (el docente recibe un aviso) o sus notas internas.',
    kind: 'write',
    input: {
      requestId: z.string(),
      status: z.enum(['pendiente', 'en_curso', 'completada', 'descartada']).optional(),
      adminNotes: z.string().optional()
    },
    run: async ({ requestId, ...body }, { api }) =>
      apiResult(await api.request('PATCH', `/api/admin/solicitudes/${encodeURIComponent(requestId)}`, { body }))
  },
  {
    name: 'admin_list_feedback',
    title: 'Sugerencias y errores',
    description: '[Admin] Sugerencias y avisos de error enviados por los docentes.',
    kind: 'read',
    input: {
      type: z.enum(['sugerencia', 'error']).optional(),
      status: z.enum(['pendiente', 'en_revision', 'resuelto', 'descartado']).optional()
    },
    run: async (query, { api }) => apiResult(await api.request('GET', '/api/feedback', { query }))
  },
  {
    name: 'admin_update_feedback',
    title: 'Actualizar una sugerencia',
    description: '[Admin] Cambia el estado de una sugerencia o error y sus notas.',
    kind: 'write',
    input: {
      feedbackId: z.string(),
      status: z.enum(['pendiente', 'en_revision', 'resuelto', 'descartado']),
      adminNotes: z.string().optional()
    },
    run: async ({ feedbackId, ...body }, { api }) =>
      apiResult(await api.request('PATCH', `/api/feedback/${encodeURIComponent(feedbackId)}`, { body }))
  },
  {
    name: 'admin_delete_feedback',
    title: 'Borrar una sugerencia',
    description: '[Admin] Borra una sugerencia o aviso de error.',
    kind: 'destructive',
    input: { feedbackId: z.string() },
    run: async ({ feedbackId }, { api }) => apiResult(await api.request('DELETE', `/api/feedback/${encodeURIComponent(feedbackId)}`))
  },
  {
    name: 'admin_update_school_settings',
    title: 'Cambiar el contexto del centro',
    description: '[Admin] Cambia el nombre, la ciudad o el contexto del centro que se usan al generar. Los campos omitidos se conservan.',
    kind: 'write',
    input: { schoolName: z.string().optional(), schoolCity: z.string().optional(), schoolContext: z.string().optional() },
    run: async (args, { api }) => {
      const current = await api.request('GET', '/api/settings');
      if (!current.ok) return apiResult(current);
      return apiResult(await api.request('PUT', '/api/settings', { body: settingsBody(current.data, args) }));
    }
  }
];
