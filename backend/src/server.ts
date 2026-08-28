import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import settingsRoutes from './routes/settings.routes';
import projectRoutes from './routes/project.routes';

import { authMiddleware } from './middlewares/auth.middleware';

import curriculumRoutes from './routes/curriculum.routes';

const app = express();
app.use(cors());
app.use(express.json());

import { runMigrations } from './migrations/runner';

// Conexión a Base de Datos local
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db')
    .then(async () => {
      console.log('MongoDB Conectado');
      await runMigrations();
      const { initQueue } = await import('./services/queue.service');
      await initQueue();
    })
    .catch(err => console.error(err));
}

// Rutas Públicas
app.use('/api/auth', authRoutes);

// Rutas Protegidas
app.use('/api', authMiddleware);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', curriculumRoutes);

const PORT = process.env.PORT || 3000;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Backend PAI escuchando en puerto ${PORT}`));
}

export { app };
