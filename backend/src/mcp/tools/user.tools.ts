import { z } from 'zod';
import { apiResult, jsonResult, type ToolDefinition } from '../tool-helpers';

const searchUsers = (search?: string) => (users: any[]) => {
  const needle = (search || '').toLowerCase();
  return needle ? users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(needle)) : users;
};

export const userTools: ToolDefinition[] = [
  {
    name: 'whoami',
    title: 'Mi cuenta',
    description: 'Cuenta de Plappin conectada: nombre, correo, rol (teacher o admin), si puede usar la IA y el nombre del token.',
    kind: 'read',
    run: async (_args, { user, tokenName }) =>
      jsonResult({ _id: user._id, name: user.name, email: user.email, role: user.role, canUseAi: user.canUseAi, tokenName })
  },
  {
    name: 'find_users',
    title: 'Buscar docentes',
    description: 'Busca docentes de Plappin por nombre o correo (para invitarlos a colaborar).',
    kind: 'read',
    input: { search: z.string().optional() },
    run: async ({ search }, { api }) => apiResult(await api.request('GET', '/api/users/directory'), searchUsers(search))
  },
  {
    name: 'get_school_settings',
    title: 'Contexto del centro',
    description: 'Nombre, ciudad y contexto del centro educativo que se usan al generar los proyectos.',
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/settings'))
  },
  {
    name: 'list_my_center_requests',
    title: 'Mis solicitudes de centro',
    description: 'Solicitudes de centros y ciclos que has hecho y su estado.',
    kind: 'read',
    run: async (_args, { api }) => apiResult(await api.request('GET', '/api/solicitudes/mias'))
  },
  {
    name: 'request_center',
    title: 'Solicitar centro y ciclos',
    description: 'Pide que se incorporen a Plappin los ciclos de tu centro. Usa los códigos CAIB de get_fp_offer en `ciclos`; los que no estén en la oferta, por su nombre en `otros`.',
    kind: 'write',
    input: {
      centro: z.object({ nombre: z.string(), municipio: z.string().optional(), web: z.string().optional() }),
      ciclos: z.array(z.string()).optional().describe('Códigos CAIB de la oferta.'),
      otros: z.array(z.string()).optional().describe('Ciclos que no están en la oferta, por su nombre.'),
      comentario: z.string().optional(),
      idioma: z.enum(['es', 'ca']).optional().describe('Idioma de los avisos que recibirás.')
    },
    run: async (args, { api }) => apiResult(await api.request('POST', '/api/solicitudes', { body: args }))
  },
  {
    name: 'send_feedback',
    title: 'Enviar una sugerencia o error',
    description: 'Envía al equipo de Plappin una sugerencia o un aviso de error.',
    kind: 'write',
    input: { type: z.enum(['sugerencia', 'error']), title: z.string().min(1), description: z.string().min(1) },
    run: async (args, { api }) => apiResult(await api.request('POST', '/api/feedback', { body: args }))
  }
];
