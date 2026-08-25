import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import mongoose from 'mongoose';

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: '# Mocked Project\nEsto es un proyecto de prueba generado por IA.'
      })
    }
  }
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Projects Endpoints', () => {
  it('POST /api/projects/generate - Debería generar un proyecto (MOCK AI)', async () => {
    const { token } = await createTestUser('teacher', 'prof@test.com');
    const res = await request(app)
      .post('/api/projects/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Proyecto IA',
        modules: ['M1'],
        ras: ['RA1'],
        methodology: 'ABP',
        tipoNivel: 'FP_BASICA',
        contextInfo: 'Contexto'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.generatedContent.rawText).toContain('Mocked Project');
  });

  it('GET /api/projects - Debería listar los proyectos del usuario', async () => {
    const { token, user } = await createTestUser('teacher', 'prof2@test.com');
    const Project = mongoose.model('Project');
    await new Project({ title: 'Mi Proyecto', userId: user._id, status: 'borrador' }).save();

    const res = await request(app).get('/api/projects').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Mi Proyecto');
  });

  it('PUT /api/projects/:id - Debería actualizar un proyecto', async () => {
    const { token, user } = await createTestUser('teacher', 'prof3@test.com');
    const Project = mongoose.model('Project');
    const proj = await new Project({ title: 'Antiguo', userId: user._id }).save();

    const res = await request(app)
      .put(`/api/projects/${proj._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rawText: 'Nuevo texto', status: 'publicado' });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('publicado');
    expect(res.body.generatedContent.rawText).toBe('Nuevo texto');
  });

  it('GET /api/projects/:id - Debería obtener un proyecto específico', async () => {
    const { token, user } = await createTestUser('teacher', 'prof4@test.com');
    const Project = mongoose.model('Project');
    const proj = await new Project({ title: 'Detalle', userId: user._id }).save();

    const res = await request(app).get(`/api/projects/${proj._id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Detalle');
  });

  it('GET /api/projects/:id - 404 y 403', async () => {
    const { token, user } = await createTestUser('teacher', 'prof5@test.com');
    const { user: user2 } = await createTestUser('teacher', 'prof6@test.com');
    const Project = mongoose.model('Project');
    
    // 404
    const fakeId = new mongoose.Types.ObjectId();
    const res404 = await request(app).get(`/api/projects/${fakeId}`).set('Authorization', `Bearer ${token}`);
    expect(res404.status).toBe(404);

    // 403 Forbbiden (intentar ver el proyecto de otro profesor)
    const proj = await new Project({ title: 'Otro', userId: user2._id }).save();
    const res403 = await request(app).get(`/api/projects/${proj._id}`).set('Authorization', `Bearer ${token}`);
    expect(res403.status).toBe(403);
  });

  it('Errores 500 en endpoints de proyectos', async () => {
    const { token } = await createTestUser('teacher', 'prof7@test.com');
    const Project = mongoose.model('Project');
    const fakeId = new mongoose.Types.ObjectId();
    
    let spy = vi.spyOn(Project.prototype, 'save').mockRejectedValueOnce(new Error('DB'));
    let res = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({ title: 'A', modules: [], ras: [], methodology: '', tipoNivel: 'FP', contextInfo: '' });
    expect(res.status).toBe(500);
    spy.mockRestore();

    spy = vi.spyOn(Project, 'find').mockRejectedValueOnce(new Error('DB'));
    res = await request(app).get('/api/projects').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
    spy.mockRestore();

    spy = vi.spyOn(Project, 'findById').mockRejectedValueOnce(new Error('DB'));
    res = await request(app).get(`/api/projects/${fakeId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
    spy.mockRestore();

    spy = vi.spyOn(Project, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('DB'));
    res = await request(app).put(`/api/projects/${fakeId}`).set('Authorization', `Bearer ${token}`).send({ rawText: 'A' });
    expect(res.status).toBe(500);
    spy.mockRestore();
  });
});
