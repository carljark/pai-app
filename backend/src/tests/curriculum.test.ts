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

    it('debería traducir módulo de castellano a catalán', async () => {
      const ra = new RA({
        id: 'RA3160',
        module: 'Proyecto inter modular de aprendizaje colaborativo',
        description: 'Desc'
      });
      await ra.save();

      const res = await request(app)
        .get('/api/ras?lang=catalan')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body[0].module).toBe("Projecte inter modular d'aprenentatge col·laboratiu");
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

    it('debería traducir Ámbito Sociolingüístico al catalán', async () => {
      const ce = new CE({
        area: 'Ámbito Sociolingüístico',
        subject: 'Llengua Catalana i Literatura',
        ce_id: 'CE3',
        description: 'Desc',
        description_ca: 'Desc CA'
      });
      await ce.save();

      const res = await request(app)
        .get('/api/ces?lang=catalan')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body[0].area).toBe('Àmbit Sociolingüístic');
    });

    it('debería manejar RAs con criterios_ca y criterios_es', async () => {
      const ra = new RA({
        id: 'RA_EXP',
        module: 'Custom Mod',
        module_ca: 'Custom Mod CA',
        module_es: 'Custom Mod ES',
        description: 'Desc base',
        criterios_ca: ['Crit CA 1'],
        criterios_es: ['Crit ES 1']
      });
      await ra.save();

      const resCa = await request(app)
        .get('/api/ras?lang=catalan')
        .set('Authorization', `Bearer ${token}`);
      expect(resCa.status).toBe(200);
      const itemCa = resCa.body.find((x: any) => x.id === 'RA_EXP');
      expect(itemCa.module).toBe('Custom Mod CA');
      expect(itemCa.criterios).toEqual(['Crit CA 1']);

      const resEs = await request(app)
        .get('/api/ras?lang=castellano')
        .set('Authorization', `Bearer ${token}`);
      expect(resEs.status).toBe(200);
      const itemEs = resEs.body.find((x: any) => x.id === 'RA_EXP');
      expect(itemEs.module).toBe('Custom Mod ES');
      expect(itemEs.criterios).toEqual(['Crit ES 1']);
    });

    it('debería obtener CEs con fallbacks si faltan campos específicos', async () => {
      const ce = new CE({
        area: 'Área Desconocida',
        subject: 'Física Clásica',
        ce_id: 'CE_FALLBACK',
        description_es: 'Desc default ES',
        criterios_es: ['Crit default ES']
      });
      await ce.save();

      const resEs = await request(app)
        .get('/api/ces?lang=castellano')
        .set('Authorization', `Bearer ${token}`);
      expect(resEs.status).toBe(200);
      const itemEs = resEs.body.find((x: any) => x.ce_id === 'CE_FALLBACK');
      expect(itemEs.area).toBe('Área Desconocida');
      expect(itemEs.subject).toBe('Física Clásica');
      expect(itemEs.description).toBe('Desc default ES');

      const resCa = await request(app)
        .get('/api/ces?lang=catalan')
        .set('Authorization', `Bearer ${token}`);
      expect(resCa.status).toBe(200);
      const itemCa = resCa.body.find((x: any) => x.ce_id === 'CE_FALLBACK');
      expect(itemCa.area).toBe('Área Desconocida');
      expect(itemCa.description).toBe('Desc default ES');
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
