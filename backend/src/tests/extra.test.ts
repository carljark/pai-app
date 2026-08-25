import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import mongoose from 'mongoose';
import fs from 'fs';
import { Project } from '../models/Project';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Extra coverage', () => {
  it('admin: updateUserPermissions with empty body', async () => {
    const { token } = await createTestUser('admin', 'ex1@test.com');
    const target = await new (mongoose.model('User'))({ name: 'A', email: 'a@a.com', password: '1', role: 'pending' }).save();
    const res = await request(app).put(`/api/admin/users/${target._id}/permissions`).set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('pending');
  });

  it('docx: exportDocx not found or no content', async () => {
    const { token } = await createTestUser('teacher', 'ex2@test.com');
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/projects/${fakeId}/export-docx`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('docx: importDocx no file', async () => {
    const { token } = await createTestUser('teacher', 'ex3@test.com');
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).post(`/api/projects/${fakeId}/import-docx`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('files: downloadFile not found', async () => {
    const { token } = await createTestUser('teacher', 'ex4@test.com');
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/projects/${fakeId}/files/nonexistent.txt`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('files: deleteFile not found', async () => {
    const { token } = await createTestUser('teacher', 'ex5@test.com');
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/projects/${fakeId}/files/nonexistent.txt`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('settings: getSettings not found / null defaults', async () => {
    const { token } = await createTestUser('admin', 'ex6@test.com');
    const res = await request(app).get('/api/settings').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

  it('admin: updateUserPermissions only canUseAi', async () => {
    const { token } = await createTestUser('admin', 'ex7@test.com');
    const target = await new (mongoose.model('User'))({ name: 'A', email: 'a2@a.com', password: '1', role: 'pending' }).save();
    const res = await request(app).put(`/api/admin/users/${target._id}/permissions`).set('Authorization', `Bearer ${token}`).send({ canUseAi: false });
    expect(res.status).toBe(200);
  });

  it('files: upload second file to cover existing dir', async () => {
    const { token, user } = await createTestUser('teacher', 'ex8@test.com');
    const proj = await new (mongoose.model('Project'))({ title: 'UploadProj', userId: user._id }).save();
    
    // First upload (creates dir)
    await request(app).post(`/api/projects/${proj._id}/files`).set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('test'), 'test1.txt');
      
    // Second upload (dir exists)
    const res = await request(app).post(`/api/projects/${proj._id}/files`).set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('test2'), 'test2.txt');
    expect(res.status).toBe(200);
  });
