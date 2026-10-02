import type { Response } from 'express';
import { User } from '../models/User';

/** Directorio ligero de usuarios para invitar como colaboradores. */
export const getUserDirectory = async (req: any, res: Response) => {
  try {
    const users = await User.find({ _id: { $ne: req.user?._id } })
      .select('name email role')
      .sort({ name: 1 })
      .limit(200)
      .lean();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Error al obtener el directorio de usuarios' });
  }
};
