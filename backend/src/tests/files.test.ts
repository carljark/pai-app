import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Mochear mammoth a nivel de módulo
vi.mock('mammoth', () => ({
  default: {
    convertToHtml: vi.fn().mockResolvedValue({ value: '<p>Limpio</p>' })
  }
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('DOCX & Files Endpoints', () => {
  it('GET /api/projects/:id/export-docx - Debería exportar a Word', async () => {
    const { token, user } = await createTestUser('teacher', 'doc@test.com');
    const Project = mongoose.model('Project');
    const proj = await new Project({ 
      title: 'DocxTest', 
      userId: user._id,
      generatedContent: { rawText: '# Hola' } 
    }).save();

    const res = await request(app)
      .get(`/api/projects/${proj._id}/export-docx`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });

  it('POST /api/projects/:id/import-docx - Debería procesar DOCX', async () => {
    const { token, user } = await createTestUser('teacher', 'doc2@test.com');
    const Project = mongoose.model('Project');
    const proj = await new Project({ title: 'ImportTest', userId: user._id }).save();

    const fakeDocxBuffer = Buffer.from('fake-docx-content');

    const res = await request(app)
      .post(`/api/projects/${proj._id}/import-docx`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', fakeDocxBuffer, 'test.docx');
    
    expect(res.status).toBe(200);
    const updated = await Project.findById(proj._id);
    expect(updated?.generatedContent?.rawText).toBe('Limpio');
  });

  it('Files API - POST, GET y DELETE adjuntos', async () => {
    const { token } = await createTestUser('teacher', 'files@test.com');
    const projectId = new mongoose.Types.ObjectId().toString();
    const fakeBuffer = Buffer.from('test pdf');

    // 1. Subir
    const postRes = await request(app)
      .post(`/api/projects/${projectId}/files`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', fakeBuffer, 'test.pdf');
    
    expect(postRes.status).toBe(200);

    // 2. Listar
    const getRes = await request(app).get(`/api/projects/${projectId}/files`).set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].name).toBe('test.pdf');

    // 3. Descargar
    const downloadRes = await request(app).get(`/api/projects/${projectId}/files/test.pdf`).set('Authorization', `Bearer ${token}`);
    expect(downloadRes.status).toBe(200);
    
    // 4. Eliminar
    const delRes = await request(app).delete(`/api/projects/${projectId}/files/test.pdf`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);

    // Verificar que la carpeta uploads quedó vacía
    const getRes2 = await request(app).get(`/api/projects/${projectId}/files`).set('Authorization', `Bearer ${token}`);
    expect(getRes2.body.length).toBe(0);
  });
});
