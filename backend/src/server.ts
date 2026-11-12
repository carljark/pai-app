import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import settingsRoutes from './routes/settings.routes';
import projectRoutes from './routes/project.routes';
import telemetryRoutes from './routes/telemetry.routes';
import notificationRoutes from './routes/notification.routes';
import feedbackRoutes from './routes/feedback.routes';
import solicitudesRoutes from './routes/solicitudes.routes';
import mapaRoutes from './routes/mapa.routes';
import afinidadesRoutes from './routes/afinidades.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';
import mcpRoutes from './routes/mcp.routes';
import oauthRoutes from './routes/oauth.routes';
import { oauthRouter } from './mcp/oauth/oauth-router';

import { authMiddleware } from './middlewares/auth.middleware';

import curriculumRoutes from './routes/curriculum.routes';

const app = express();
// Detrás del Nginx del host (y, en las rutas OAuth, del del frontend): la IP real llega en
// X-Forwarded-For desde direcciones privadas. La usan los límites de peticiones del SDK de OAuth.
app.set('trust proxy', 'loopback, linklocal, uniquelocal');
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// OAuth 2.1 del servidor MCP (conectores de claude.ai): metadatos y endpoints en la raíz del dominio
app.use(oauthRouter());

import { runMigrations } from './migrations/runner';

// Conexión a Base de Datos local
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db')
    .then(async () => {
      console.log('MongoDB Conectado');
      await runMigrations();
      const { failInterruptedTranslations } = await import('./controllers/translation.controller');
      await failInterruptedTranslations();
      const { failInterruptedReviews } = await import('./controllers/project-review.controller');
      await failInterruptedReviews();
      const { initQueue } = await import('./services/queue.service');
      await initQueue();
    })
    .catch(err => console.error(err));
}

// Rutas Públicas
app.use('/api/auth', authRoutes);
app.use('/api/mapa-intermodular', mapaRoutes);
app.use('/api/afinidades-eso', afinidadesRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/users', authMiddleware, userRoutes);
// Servidor MCP para asistentes de IA: se autentica con tokens personales, no con la sesión web
app.use('/api/mcp', mcpRoutes);

// Rutas Protegidas
app.use('/api', authMiddleware);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api', curriculumRoutes);

const PORT = process.env.PORT || 3000;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => console.log(`Backend PAI escuchando en puerto ${PORT}`));
  server.requestTimeout = 1_260_000; // 21 minutos para tolerar respuestas IA de hasta 20 minutos
  server.headersTimeout = 1_270_000;
}

export { app };
