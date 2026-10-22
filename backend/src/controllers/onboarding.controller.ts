import type { Response } from 'express';
import { User } from '../models/User';
import { isTourId } from '../data/tours';

/** Bienvenida y visitas guiadas del usuario. Ver documentation/visita_guiada.md. */
const toOnboarding = (user: any) => ({
  welcomeDismissed: user?.onboarding?.welcomeDismissed === true,
  completedTours: user?.onboarding?.completedTours ?? []
});

/** Cambios válidos del cuerpo del PATCH, o `null` si no hay ninguno. */
const buildUpdate = (body: any): Record<string, any> | null => {
  const update: Record<string, any> = {};
  if (typeof body?.welcomeDismissed === 'boolean') {
    update.$set = { 'onboarding.welcomeDismissed': body.welcomeDismissed };
  }
  if (isTourId(body?.completedTour)) {
    update.$addToSet = { 'onboarding.completedTours': body.completedTour };
  }
  return Object.keys(update).length ? update : null;
};

/** GET /api/users/me/onboarding */
export const getOnboarding = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('onboarding');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(toOnboarding(user));
  } catch {
    res.status(500).json({ error: 'Error al cargar la bienvenida' });
  }
};

/** PATCH /api/users/me/onboarding — `{ welcomeDismissed?: boolean, completedTour?: TourId }` */
export const updateOnboarding = async (req: any, res: Response) => {
  try {
    const update = buildUpdate(req.body);
    if (!update) return res.status(400).json({ error: 'No hay cambios válidos' });
    const user = await User.findByIdAndUpdate(req.user?._id, update, { returnDocument: 'after' }).select('onboarding');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(toOnboarding(user));
  } catch {
    res.status(500).json({ error: 'Error al guardar la bienvenida' });
  }
};
