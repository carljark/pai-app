import type { Response } from 'express';
import { User } from '../models/User';
import { ActivityLog } from '../models/ActivityLog';
import { UserSession } from '../models/UserSession';

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

export const getAnalytics = async (req: any, res: Response) => {
  try {
    // 1. Global totals
    const [totalUsageData] = await UserSession.aggregate([
      { $group: { _id: null, totalSeconds: { $sum: '$durationSeconds' }, totalSessions: { $sum: 1 } } }
    ]);
    const totalUsageSeconds = totalUsageData?.totalSeconds || 0;
    const totalSessions = totalUsageData?.totalSessions || 0;

    const totalDocxExports = await ActivityLog.countDocuments({ action: 'EXPORT_DOCX' });
    const totalPdfExports = await ActivityLog.countDocuments({ action: 'EXPORT_PDF' });
    const totalProjectsGenerated = await ActivityLog.countDocuments({ action: 'GENERATE_PROJECT' });

    // 2. Per-user aggregations
    const userSessionStats = await UserSession.aggregate([
      {
        $group: {
          _id: '$userId',
          totalDurationSeconds: { $sum: '$durationSeconds' },
          sessionCount: { $sum: 1 },
          lastActive: { $max: '$lastHeartbeat' }
        }
      }
    ]);

    const userActivityStats = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$userId',
          docxExportsCount: { $sum: { $cond: [{ $eq: ['$action', 'EXPORT_DOCX'] }, 1, 0] } },
          pdfExportsCount: { $sum: { $cond: [{ $eq: ['$action', 'EXPORT_PDF'] }, 1, 0] } },
          projectsGeneratedCount: { $sum: { $cond: [{ $eq: ['$action', 'GENERATE_PROJECT'] }, 1, 0] } },
          lastActivityDate: { $max: '$createdAt' }
        }
      }
    ]);

    // Fetch all users to merge
    const users = await User.find().select('-password');
    const userMetrics = users.map(u => {
      const uId = u._id.toString();
      const sStat = userSessionStats.find(s => s._id?.toString() === uId) || { totalDurationSeconds: 0, sessionCount: 0, lastActive: null };
      const aStat = userActivityStats.find(a => a._id?.toString() === uId) || { docxExportsCount: 0, pdfExportsCount: 0, projectsGeneratedCount: 0, lastActivityDate: null };

      return {
        userId: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        canUseAi: u.canUseAi,
        createdAt: u.createdAt,
        totalDurationSeconds: sStat.totalDurationSeconds,
        sessionCount: sStat.sessionCount,
        lastActive: sStat.lastActive || aStat.lastActivityDate || u.createdAt,
        docxExportsCount: aStat.docxExportsCount,
        pdfExportsCount: aStat.pdfExportsCount,
        projectsGeneratedCount: aStat.projectsGeneratedCount
      };
    });

    // 3. Export timeline (last 50 exports)
    const exportTimeline = await ActivityLog.find({ action: { $in: ['EXPORT_DOCX', 'EXPORT_PDF'] } })
      .populate('userId', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      summary: {
        totalUsageSeconds,
        totalSessions,
        totalDocxExports,
        totalPdfExports,
        totalProjectsGenerated,
        totalUsers: users.length
      },
      userMetrics,
      exportTimeline
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las métricas de analítica' });
  }
};
