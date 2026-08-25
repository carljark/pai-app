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
});
