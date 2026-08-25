import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export const JWT_SECRET = process.env.JWT_SECRET || 'pai_super_secret_key_2026';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.path.startsWith('/auth')) {
    return next();
  }
  
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    return;
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' });
    return;
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Requiere permisos de administrador' });
    return;
  }
  next();
};

export const requireApproved = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role === 'pending') {
    res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por un administrador.' });
    return;
  }
  next();
};

export const requireAiAccess = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin' && !req.user?.canUseAi) {
    res.status(403).json({ error: 'No tienes permisos para usar las funciones de IA. Solicítalos a un administrador.' });
    return;
  }
  next();
};
