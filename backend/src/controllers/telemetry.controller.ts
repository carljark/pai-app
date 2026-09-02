import type { Response } from 'express';
import { UserSession } from '../models/UserSession';
import { ActivityLog } from '../models/ActivityLog';

export const heartbeat = async (req: any, res: Response) => {
  try {
    const { sessionId, activeSeconds, currentPage, isClosing } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId es requerido' });
    }

    const userId = req.user?._id;
    const addedSeconds = Math.max(0, Number(activeSeconds) || 0);

    let session = await UserSession.findOne({ sessionId, userId });
    if (!session) {
      session = new UserSession({
        userId,
        sessionId,
        startTime: new Date(),
        lastHeartbeat: new Date(),
        durationSeconds: addedSeconds,
        userAgent: req.headers['user-agent'] || '',
        pagesVisited: currentPage ? [currentPage] : []
      });
    } else {
      session.durationSeconds += addedSeconds;
      session.lastHeartbeat = new Date();
      if (currentPage && !session.pagesVisited.includes(currentPage)) {
        session.pagesVisited.push(currentPage);
      }
    }

    if (isClosing) {
      session.endTime = new Date();
    }

    await session.save();
    res.json({ ok: true, durationSeconds: session.durationSeconds });
  } catch (error) {
    res.status(500).json({ error: 'Error procesando heartbeat' });
  }
};

export const logEvent = async (req: any, res: Response) => {
  try {
    const { action, projectId, details } = req.body;
    if (!action) {
      return res.status(400).json({ error: 'action es requerida' });
    }

    const log = await ActivityLog.create({
      userId: req.user?._id,
      action,
      projectId: projectId || undefined,
      details: details || {},
      createdAt: new Date()
    });

    res.json({ ok: true, log });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando evento de telemetría' });
  }
};