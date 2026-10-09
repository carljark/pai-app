import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware';
import {
  SolicitudError, actualizarSolicitud, crearSolicitud, listarDeUsuario, listarTodas, ofertaConDisponibilidad,
} from '../services/solicitudes.service';

const responderError = (res: Response, error: unknown) => {
  if (error instanceof SolicitudError) return res.status(error.status).json({ error: error.message });
  console.error('[Solicitudes]', error);
  return res.status(500).json({ error: 'Error al procesar la solicitud' });
};

/** `GET /api/solicitudes/oferta`: ciclos que se pueden pedir y si ya están disponibles. */
export const getOferta = (_req: AuthRequest, res: Response) => res.json(ofertaConDisponibilidad());

/** `POST /api/solicitudes`: un docente pide su centro y sus ciclos. */
export const createSolicitud = async (req: AuthRequest, res: Response) => {
  try {
    return res.status(201).json(await crearSolicitud(req.user, req.body));
  } catch (error) {
    return responderError(res, error);
  }
};

/** `GET /api/solicitudes/mias`: solicitudes del docente autenticado. */
export const listMisSolicitudes = async (req: AuthRequest, res: Response) => {
  try {
    return res.json(await listarDeUsuario(req.user._id));
  } catch (error) {
    return responderError(res, error);
  }
};

/** `GET /api/admin/solicitudes`: todas las solicitudes (solo administradores). */
export const listSolicitudes = async (_req: AuthRequest, res: Response) => {
  try {
    return res.json(await listarTodas());
  } catch (error) {
    return responderError(res, error);
  }
};

/** `PATCH /api/admin/solicitudes/:id`: estado, notas y ciclos (solo administradores). */
export const updateSolicitud = async (req: AuthRequest, res: Response) => {
  try {
    return res.json(await actualizarSolicitud(String(req.params.id), req.body));
  } catch (error) {
    return responderError(res, error);
  }
};
