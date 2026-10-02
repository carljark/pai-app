import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { authMiddleware } from '../middlewares/auth.middleware';
import { toProjectSummary } from '../services/notification.service';
import { uploadFile, getFiles } from '../controllers/files.controller';
import { updateSettings } from '../controllers/settings.controller';
import { createFeedback, updateFeedbackStatus } from '../controllers/feedback.controller';
import { Settings } from '../models/Settings';
import { Feedback } from '../models/Feedback';
import { CE } from '../models/CE';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';
import { Project } from '../models/Project';

vi.mock('mammoth', () => ({
  default: {
    convertToHtml: vi.fn().mockResolvedValue({ value: '<p>Limpio</p>' })
  }
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  res.download = vi.fn().mockReturnValue(res);
  return res;
};

describe('Cobertura de ramas adicionales', () => {
  it('authMiddleware deja pasar las rutas /auth sin token', () => {
    const next = vi.fn();
    const res = mockRes();
    authMiddleware({ path: '/auth/login', headers: {} } as any, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('toProjectSummary devuelve el valor recibido si es nulo', () => {
    expect(toProjectSummary(null)).toBeNull();
    expect(toProjectSummary(undefined)).toBeUndefined();
  });

  it('files.controller cubre subida sin archivo y directorio inexistente', () => {
    const resNoFile = mockRes();
    uploadFile({}, resNoFile);
    expect(resNoFile.status).toHaveBeenCalledWith(400);

    const resNoDir = mockRes();
    getFiles({ params: { id: 'directorio-inexistente-xyz' } }, resNoDir);
    expect(resNoDir.json).toHaveBeenCalledWith([]);

    const resNoFile2 = mockRes();
    uploadFile({ file: { originalname: 'a.pdf' } }, resNoFile2);
    expect(resNoFile2.json).toHaveBeenCalledWith({ message: 'Archivo subido', filename: 'a.pdf' });
  });

  it('updateSettings actualiza una configuración existente', async () => {
    await Settings.create({ schoolName: 'Antiguo' });
    const res = mockRes();
    await updateSettings({ body: { schoolName: 'Nuevo', schoolCity: 'Ciudad', schoolContext: 'Ctx' } }, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  it('createFeedback usa valores por defecto si el usuario no tiene nombre ni email', async () => {
    const { user } = await createTestUser('teacher', 'fb_direct@test.com');
    const res = mockRes();
    await createFeedback({ user: { _id: user._id }, body: { title: 'Título', description: 'Desc' } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('updateFeedbackStatus actualiza solo adminNotes cuando no se envía status', async () => {
    const { user } = await createTestUser('admin', 'fb_admin_direct@test.com');
    const fb = await Feedback.create({ userId: user._id, userName: 'Admin', userEmail: 'fb_admin_direct@test.com', title: 'F', description: 'D' });
    const res = mockRes();
    await updateFeedbackStatus(
      { user: { role: 'admin' }, params: { id: fb._id.toString() }, body: { adminNotes: 'Nota' } },
      res
    );
    expect(res.json).toHaveBeenCalled();
  });

  it('heartbeat cubre valores por defecto y página repetida', async () => {
    const { token } = await createTestUser('teacher', 'hb_branch@test.com');
    const res1 = await request(app)
      .post('/api/telemetry/heartbeat')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: 'hb-branch' });
    expect(res1.status).toBe(200);
    expect(res1.body.durationSeconds).toBe(0);

    await request(app)
      .post('/api/telemetry/heartbeat')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: 'hb-branch', currentPage: 'home' });

    const res3 = await request(app)
      .post('/api/telemetry/heartbeat')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: 'hb-branch', currentPage: 'home' });
    expect(res3.status).toBe(200);
  });

  it('getAnalytics usa ceros cuando no hay sesiones', async () => {
    const { token } = await createTestUser('admin', 'admin_nosess@test.com');
    const res = await request(app).get('/api/admin/analytics').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.summary.totalUsageSeconds).toBe(0);
    expect(res.body.summary.totalSessions).toBe(0);
  });

  it('curriculum cubre RAs sin criterios y CEs en castellano sin campos ES', async () => {
    await RA.create({ id: 'RA_BRANCH', module: 'Mod', description: 'Desc' });
    const resRa = await request(app).get('/api/ras?lang=castellano').set('Authorization', `Bearer ${await tokenFor('cur_branch@test.com')}`);
    expect(resRa.status).toBe(200);
    const ra = resRa.body.find((x: any) => x.id === 'RA_BRANCH');
    expect(ra.criterios).toEqual([]);

    await CE.create({ area: 'Àrea', subject: 'Assignatura', ce_id: 'CE_BRANCH', description_ca: 'Només CA', criterios_ca: ['Criteri CA'] });
    const resCe = await request(app).get('/api/ces?lang=castellano').set('Authorization', `Bearer ${await tokenFor('cur_branch2@test.com')}`);
    expect(resCe.status).toBe(200);
    const ce = resCe.body.find((x: any) => x.ce_id === 'CE_BRANCH');
    expect(ce.description).toBeUndefined();
    expect(ce.criterios).toEqual([]);
  });

  it('mapa filtra conexiones sin actividades y soporta LO sin connections', async () => {
    await MapaModule.create({
      tab: 'FPB',
      order: 0,
      code: 'BR1',
      name_es: 'M1',
      name_ca: 'M1',
      type: 'especifico',
      color: '#000',
      icon: 'i',
      learningOutcomes: [
        { id: 'BR1_RA1', code: 'RA1', text_es: 't', text_ca: 't' },
        {
          id: 'BR1_RA2',
          code: 'RA2',
          text_es: 't',
          text_ca: 't',
          connections: [{ activities: [] }, { activities: [{ title_es: 'ok' }] }]
        }
      ]
    });

    const res = await request(app).get('/api/mapa-intermodular?tab=FPB');
    expect(res.status).toBe(200);
    const lo2 = res.body[0].learningOutcomes.find((l: any) => l.id === 'BR1_RA2');
    expect(lo2.connections.length).toBe(1);
    const lo1 = res.body[0].learningOutcomes.find((l: any) => l.id === 'BR1_RA1');
    expect(lo1.connections).toEqual([]);
  });

  it('docx usa PAI cuando el proyecto no tiene título e importa 404 si no existe', async () => {
    const { token, user } = await createTestUser('teacher', 'docx_branch@test.com');
    await Project.create({ userId: user._id, status: 'publicado', generatedContent: { rawText: '# Hola' } });

    const resExport = await request(app)
      .get(`/api/projects/${(await Project.findOne({ userId: user._id }))!._id}/export-docx`)
      .set('Authorization', `Bearer ${token}`);
    expect(resExport.status).toBe(200);

    const resImport = await request(app)
      .post(`/api/projects/${new mongoose.Types.ObjectId()}/import-docx`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('fake'), 'a.docx');
    expect(resImport.status).toBe(404);
  });
});

/** Helper local: crea un usuario teacher y devuelve su token. */
async function tokenFor(email: string): Promise<string> {
  const { token } = await createTestUser('teacher', email);
  return token;
}
