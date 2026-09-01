import type { Response } from 'express';
import { User } from '../models/User';
import { ActivityLog } from '../models/ActivityLog';

export const getLogs = async (req: any, res: Response) => {
  try {
    const logs = await ActivityLog.find()
      .populate('userId', 'name email role')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los registros de actividad' });
  }
};

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

    const user = await User.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar permisos' });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user?._id?.toString() === id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
