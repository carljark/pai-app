import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { createTestUser } from './testUtils';
import { RA } from '../models/RA';
import { CE } from '../models/CE';
import mongoose from 'mongoose';
import { connectDB, closeDB, clearDB } from './testSetup';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Curriculum Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    const user = await createTestUser('teacher', `testcurriculum@example.com`);
    token = user.token;
  });

  beforeEach(async () => {
    await RA.deleteMany({});
    await CE.deleteMany({});
  });

  describe('GET /api/ras', () => {
    it('debería obtener RAs en castellano (fallback si no existe)', async () => {
      const ra1 = new RA({
        id: 'RA1',
        module: 'Preparació de l\'entorn professional',
        module_es: 'Preparación del entorno profesional',
        description: 'Desc',
        description_es: 'Desc es'
      });
      const ra2 = new RA({
        id: 'RA2',
        module: 'Módulo Desconocido',
        description: 'Desc cat'
      });
      await RA.insertMany([ra1, ra2]);

      const res = await request(app)
        .get('/api/ras?lang=castellano')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].module).toBe('Preparación del entorno profesional');
      expect(res.body[0].description).toBe('Desc es');
      expect(res.body[1].module).toBe('Módulo Desconocido'); // Fallback
      expect(res.body[1].description).toBe('Desc cat'); // Fallback
    });

    it('debería obtener RAs en catalán', async () => {
      const ra = new RA({
        id: 'RA1',
        module: 'Preparació de l\'entorn professional',
        description: 'Desc genérica',
        description_ca: 'Desc cat'
      });
      await ra.save();

      const res = await request(app)
        .get('/api/ras?lang=catalan')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body[0].module).toBe('Preparació de l\'entorn professional');
      expect(res.body[0].description).toBe('Desc cat');
    });

    it('debería manejar errores de base de datos en RAs', async () => {
      // Forzar error mockeando find
      const spy = vi.spyOn(RA, 'find').mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app)
        .get('/api/ras')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      spy.mockRestore();
    });
  });

  describe('GET /api/ces', () => {
    it('debería obtener CEs en castellano', async () => {
      const ce = new CE({
        area: 'Àmbit Científic i Tecnològic',
        subject: 'Biologia i Geologia',
        ce_id: 'CE1',
        description: 'Desc',
        description_es: 'Desc ES',
        criterios_es: ['Crit1 ES']
      });
      await ce.save();

      const res = await request(app)
        .get('/api/ces?lang=castellano')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body[0].area).toBe('Ámbito Científico y Tecnológico');
      expect(res.body[0].subject).toBe('Biología y Geología');
      expect(res.body[0].description).toBe('Desc ES');
      expect(res.body[0].criterios[0]).toBe('Crit1 ES');
    });

    it('debería obtener CEs en catalán (y manejar Matemàtiques)', async () => {
      const ce = new CE({
        area: 'Àmbit',
        subject: 'Matemàtiques A',
        ce_id: 'CE2',
        description: 'Desc',
        description_ca: 'Desc CA',
        criterios_ca: ['Crit CA']
      });
      await ce.save();

      const res = await request(app)
        .get('/api/ces?lang=catalan')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body[0].subject).toBe('Matemàtiques');
      expect(res.body[0].description).toBe('Desc CA');
      expect(res.body[0].criterios[0]).toBe('Crit CA');
    });

    it('debería manejar errores de base de datos en CEs', async () => {
      const spy = vi.spyOn(CE, 'find').mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app)
        .get('/api/ces')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      spy.mockRestore();
    });
  });
});
