import type { Response } from 'express';
import { Feedback } from '../models/Feedback';
import { ActivityLog } from '../models/ActivityLog';

export const createFeedback = async (req: any, res: Response) => {
  try {
    const { type, title, description } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'El título o asunto es obligatorio' });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'La descripción es obligatoria' });
    }

    const feedbackType = type === 'error' ? 'error' : 'sugerencia';

    const feedback = new Feedback({
      userId: req.user._id,
      userName: req.user.name || 'Usuario',
      userEmail: req.user.email || '',
      type: feedbackType,
      title: title.trim(),
      description: description.trim(),
      status: 'pendiente'
    });

    const saved = await feedback.save();

    await new ActivityLog({
      userId: req.user._id,
      action: 'FEEDBACK_SUBMITTED',
      details: { type: feedbackType, title: saved.title, feedbackId: saved._id }
    }).save();

    return res.status(201).json(saved);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al enviar feedback: ' + error.message });
  }
};

export const listFeedback = async (req: any, res: Response) => {
  try {
    const filter: any = {};
    if (req.user?.role !== 'admin') {
      filter.userId = req.user._id;
    } else {
      if (req.query.type) filter.type = req.query.type;
      if (req.query.status) filter.status = req.query.status;
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    return res.json(feedbacks);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al listar feedback: ' + error.message });
  }
};

export const updateFeedbackStatus = async (req: any, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden cambiar el estado del feedback' });
    }

    const { status, adminNotes } = req.body;
    const allowedStatuses = ['pendiente', 'en_revision', 'resuelto', 'descartado'];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Feedback no encontrado' });
    }

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al actualizar feedback: ' + error.message });
  }
};

export const deleteFeedback = async (req: any, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback no encontrado' });
    }

    const isAuthor = feedback.userId.toString() === req.user?._id?.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ error: 'Acceso denegado: solo el creador o administrador puede eliminarlo' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Feedback eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al eliminar feedback: ' + error.message });
  }
};
