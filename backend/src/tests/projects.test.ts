import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { FpbMatch } from '../models/FpbMatch';

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
    
    expect(res.status).toBe(202);
    expect(res.body.project.status).toBe('en_cola');
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

    spy = vi.spyOn(Project, 'findById').mockRejectedValueOnce(new Error('DB'));
    res = await request(app).delete(`/api/projects/${fakeId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
    spy.mockRestore();
  });

  it('DELETE /api/projects/:id - Debería borrar el proyecto si es el autor', async () => {
    const { token, user } = await createTestUser('teacher', 'prof8@test.com');
    const Project = mongoose.model('Project');
    const proj = await new Project({ title: 'A borrar', userId: user._id }).save();

    const res = await request(app).delete(`/api/projects/${proj._id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    
    const check = await Project.findById(proj._id);
    expect(check).toBeNull();
  });

  it('DELETE /api/projects/:id - 404 y 403', async () => {
    const { token, user } = await createTestUser('teacher', 'prof9@test.com');
    const { user: user2 } = await createTestUser('teacher', 'prof10@test.com');
    const Project = mongoose.model('Project');
    
    // 404
    const fakeId = new mongoose.Types.ObjectId();
    const res404 = await request(app).delete(`/api/projects/${fakeId}`).set('Authorization', `Bearer ${token}`);
    expect(res404.status).toBe(404);

    // 403 (intentar borrar proyecto de otro siendo teacher)
    const proj = await new Project({ title: 'No tocar', userId: user2._id }).save();
    const res403 = await request(app).delete(`/api/projects/${proj._id}`).set('Authorization', `Bearer ${token}`);
    expect(res403.status).toBe(403);

    // 200 (admin borra el proyecto de otro profesor)
    const { token: adminToken } = await createTestUser('admin', 'el_admin@test.com');
    const resAdmin = await request(app).delete(`/api/projects/${proj._id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(resAdmin.status).toBe(200);
  });

  it('Cobertura de bifurcaciones en Projects', async () => {
    const { token } = await createTestUser('admin', 'admin@projects.com');
    const Project = mongoose.model('Project');
    
    // 1. generateProject sin parámetros opcionales y con proyectos publicados previos
    await new Project({ title: 'Pub', status: 'publicado', generatedContent: { rawText: 'A' } }).save();
    const resGen = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({ language: 'catalan' });
    expect(resGen.status).toBe(202);
    expect(resGen.body.project.title).toBe('Proyecto Generado');
    expect(resGen.body.project.tipoNivel).toBe('FP_BASICA');
    
    // 2. updateProject sin status
    const proj = await new Project({ title: 'UpdateMe' }).save();
    const resUpd = await request(app).put(`/api/projects/${proj._id}`).set('Authorization', `Bearer ${token}`).send({ rawText: 'B' });
    expect(resUpd.status).toBe(200);
    expect(resUpd.body.status).toBe('borrador');

    // 3. listProjects como admin
    const resList = await request(app).get('/api/projects').set('Authorization', `Bearer ${token}`);
    expect(resList.status).toBe(200);
    expect(resList.body.length).toBeGreaterThan(0);
  });

  it('Cobertura de ActivityLog y criterios RA', async () => {
    const { token } = await createTestUser('teacher', 'actlog@test.com');
    const RA = mongoose.model('RA');
    const CE = mongoose.model('CE');
    const Project = mongoose.model('Project');
    
    // Crear RAs simulados con criterios_es y criterios_ca
    await new RA({ description: 'RA ES', description_es: 'RA ES', criterios_es: ['a)', 'b)'], module: 'Mod A' }).save();
    await new RA({ description_ca: 'RA CA', criterios_es: ['1)', '2)'], criterios_ca: ['cat1', 'cat2'], module_ca: 'Mod B' }).save();
    await new RA({ description_es: 'RA Nulo', module_es: 'Mod C' }).save();

    // Crear CEs simulados
    await new CE({ description_es: 'CE ES', subject: 'Sub A', criterios_es: ['x', 'y'] }).save();
    await new CE({ description_ca: 'CE CA', area: 'Area B', criterios_ca: ['z'], criterios_es: ['z_es'] }).save();
    await new CE({ description_es: 'CE Nulo', subject: 'Sub C' }).save();

    // Generar proyecto con esos RAs y CEs
    const res = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({
      selectedRas: ['RA ES', 'RA CA', 'RA Nulo', 'CE ES', 'CE CA', 'CE Nulo', 'RA Inventado'],
      language: 'catalan'
    });
    expect(res.status).toBe(202);

    // Limpiar proyectos en cola para evitar 429 (Límite de concurrencia de cola)
    await Project.deleteMany({});

    await Project.deleteMany({});
    // Test ActivityLog error
    const spy = vi.spyOn(Project.prototype, 'save').mockRejectedValueOnce(new Error('Fallo simulado para log'));
    const resErr = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({ selectedRas: [] });
    expect(resErr.status).toBe(500);
    spy.mockRestore();

    // Test Delete Project con log nulo
    const proj = await new Project({ title: 'A borrar con log' }).save();
    await request(app).delete(`/api/projects/${proj._id}`).set('Authorization', `Bearer ${token}`);
  });

  it('debería rechazar streamUpdates si no hay usuario', async () => {
    const res = await request(app).get('/api/projects/stream');
    expect(res.status).toBe(401);
  });

  it('debería responder 429 si ya hay un proyecto en cola', async () => {
    const { token, user } = await createTestUser('teacher', 'teacher_queue@test.com');
    await new Project({ title: 'En Cola', userId: user._id, status: 'en_cola' }).save();
    
    const res = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({ selectedRas: [] });
    expect(res.status).toBe(429);
  });

  it('debería responder 429 si excedió el límite diario', async () => {
    const { token, user } = await createTestUser('teacher', 'teacher_limit@test.com');
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(new ActivityLog({ userId: user._id, action: 'GENERATE_PROJECT' }).save());
    }
    await Promise.all(promises);
    
    const res = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({ selectedRas: [] });
    expect(res.status).toBe(429);
  });

  it('debería consultar e inyectar coincidencias de FPB si tipoNivel es FP_BASICA', async () => {
    const { token } = await createTestUser('teacher', 'teacher_fpb@test.com');
    const RA = mongoose.model('RA');
    const FpbMatch = mongoose.model('FpbMatch');

    // Crear RAs para FP Básica
    await new RA({ id: '3060_RA1', description: 'RA 3060', module: 'Módulo 3060' }).save();

    // Crear FpbMatch
    await new FpbMatch({
      fileName: 'Prompt Coincidencias.docx',
      title: 'Instrucciones generales',
      rawText: 'Instrucciones generales de prueba',
      type: 'prompt_coincidencias'
    }).save();

    await new FpbMatch({
      fileName: 'Coincidencias_3060.docx',
      title: 'Coincidencias de 3060',
      code: '3060',
      rawText: 'Contenido de coincidencia de prueba',
      type: 'coincidencia'
    }).save();

    const res = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({
      selectedRas: ['RA 3060'],
      tipoNivel: 'FP_BASICA'
    });
    expect(res.status).toBe(202);
  });

  it('POST /api/projects/rewrite - Debería reescribir el proyecto completo con IA', async () => {
    const { token } = await createTestUser('teacher', 'teacher_rewrite@test.com');
    
    // Caso éxito: devuelve el nuevo markdown completo
    const res = await request(app)
      .post('/api/projects/rewrite')
      .set('Authorization', `Bearer ${token}`)
      .send({
        context: '# Proyecto Actual con Texto a cambiar aquí',
        instruction: 'Añade una sección de evaluación'
      });
    expect(res.status).toBe(200);
    expect(res.body.newText).toBeDefined();

    // Caso 400 (falta contexto o instrucción)
    const res400_1 = await request(app)
      .post('/api/projects/rewrite')
      .set('Authorization', `Bearer ${token}`)
      .send({ context: '# Proyecto' });
    expect(res400_1.status).toBe(400);

    const res400_2 = await request(app)
      .post('/api/projects/rewrite')
      .set('Authorization', `Bearer ${token}`)
      .send({ instruction: 'Mejorar' });
    expect(res400_2.status).toBe(400);

    // Caso 500
    const aiModule = await import('../services/ai.service');
    const spy = vi.spyOn(aiModule, 'generateGeminiContent').mockRejectedValueOnce(new Error('AI Failure'));
    const res500 = await request(app)
      .post('/api/projects/rewrite')
      .set('Authorization', `Bearer ${token}`)
      .send({
        context: '# Proyecto',
        instruction: 'Cambiar'
      });
    expect(res500.status).toBe(500);
    spy.mockRestore();
  });

  it('GET /api/projects/stream - Debería establecer SSE para usuario autenticado', async () => {
    const { user } = await createTestUser('teacher', 'teacher_stream@test.com');
    const { streamUpdates } = await import('../controllers/project.controller');
    
    let closeCallback: any;
    const mockReq = {
      user: user,
      on: vi.fn((event, cb) => {
        if (event === 'close') closeCallback = cb;
      })
    };
    const mockRes = {
      setHeader: vi.fn(),
      flushHeaders: vi.fn(),
      write: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    streamUpdates(mockReq as any, mockRes as any);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(mockRes.write).toHaveBeenCalled();
    if (closeCallback) closeCallback();
  });
});
