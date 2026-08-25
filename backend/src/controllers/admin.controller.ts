import type { Response } from 'express';
import { User } from '../models/User';

export const getUsers = async (req: any, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const updateUserPermissions = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { role, canUseAi } = req.body;
    
    // Solo actualizar los campos que se envíen
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (canUseAi !== undefined) updateData.canUseAi = canUseAi;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar permisos' });
  }
};
