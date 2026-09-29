import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { MapaModule } from '../models/MapaModule';
import { connectDB, closeDB, clearDB } from './testSetup';
import { up as runMigration08 } from '../migrations/08_ingest_mapa_intermodular';
import { up as runMigration09 } from '../migrations/09_deduplicate_mapa_peluqueria';
import { up as runMigration10 } from '../migrations/10_ingest_mapa_peluqueria_desarrollados';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Mapa Intermodular Endpoints & Migration', () => {
  describe('GET /api/mapa-intermodular', () => {
    it('debería retornar 400 si falta el parámetro tab', async () => {
      const res = await request(app).get('/api/mapa-intermodular');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Parámetro 'tab' inválido o ausente");
    });

    it('debería retornar 400 si el tab es desconocido', async () => {
      const res = await request(app).get('/api/mapa-intermodular?tab=DESCONOCIDO');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Valores permitidos');
    });

    it('debería retornar 200 con la lista de módulos ordenados y sin campos internos', async () => {
      await MapaModule.create([
        {
          tab: 'FPB',
          order: 1,
          code: '3061',
          name_es: 'Lavado',
          name_ca: 'Rentat',
          type: 'especifico',
          color: '#3498db',
          icon: 'soap',
          learningOutcomes: [{ id: '3061_RA1', code: 'RA1', text_es: 'RA 1', text_ca: 'RA 1', connections: [] }]
        },
        {
          tab: 'FPB',
          order: 0,
          code: '3060',
          name_es: 'Preparación',
          name_ca: 'Preparació',
          type: 'especifico',
          color: '#e74c3c',
          icon: 'cut',
          learningOutcomes: [{ id: '3060_RA1', code: 'RA1', text_es: 'RA 1', text_ca: 'RA 1', connections: [] }]
        },
        {
          tab: 'CFGM',
          order: 0,
          code: '0633',
          name_es: 'Estética',
          name_ca: 'Estètica',
          type: 'especifico',
          color: '#2ecc71',
          icon: 'sparkles',
          learningOutcomes: []
        }
      ]);

      const res = await request(app).get('/api/mapa-intermodular?tab=FPB');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].code).toBe('3060'); // Order 0 first
      expect(res.body[1].code).toBe('3061'); // Order 1 second
      expect(res.body[0]._id).toBeUndefined();
      expect(res.body[0].__v).toBeUndefined();
      expect(res.body[0].tab).toBeUndefined();
      expect(res.body[0].order).toBeUndefined();
    });

    it('debería retornar 500 si la base de datos lanza un error', async () => {
      const spy = vi.spyOn(MapaModule, 'find').mockImplementationOnce(() => {
        throw new Error('Database failure');
      });

      const res = await request(app).get('/api/mapa-intermodular?tab=FPB');
      expect(res.status).toBe(500);
      expect(res.body.error).toContain('Error interno del servidor');

      spy.mockRestore();
    });
  });

  describe('Migration 08_ingest_mapa_intermodular', () => {
    it('debería ejecutar la migración up y cargar los datos desde los archivos JSON', async () => {
      await runMigration08();

      const fpbCount = await MapaModule.countDocuments({ tab: 'FPB' });
      const cfgmCount = await MapaModule.countDocuments({ tab: 'CFGM' });
      const pelu1Count = await MapaModule.countDocuments({ tab: 'CFGM_PELUQUERIA' });
      const pelu2Count = await MapaModule.countDocuments({ tab: 'CFGM_PELUQUERIA_2' });

      expect(fpbCount).toBe(11);
      expect(cfgmCount).toBe(9);
      expect(pelu1Count).toBe(8);
      expect(pelu2Count).toBe(8);

      const mod3060 = await MapaModule.findOne({ tab: 'FPB', code: '3060' });
      expect(mod3060).toBeTruthy();
      expect(mod3060?.learningOutcomes.length).toBeGreaterThan(0);
    });
  });

  describe('Migration 09_deduplicate_mapa_peluqueria and Migration 10_ingest_mapa_peluqueria_desarrollados', () => {
    it('debería ejecutar la deduplicación up de Peluquería 1º y 2º en MongoDB', async () => {
      await runMigration09();

      const pelu1 = await MapaModule.find({ tab: 'CFGM_PELUQUERIA' });
      const pelu2 = await MapaModule.find({ tab: 'CFGM_PELUQUERIA_2' });

      expect(pelu1.length).toBe(8);
      expect(pelu2.length).toBe(8);

      let actsPelu1 = 0;
      let connsPelu1 = 0;
      let emptyConnsPelu1 = 0;
      pelu1.forEach(m => {
        m.learningOutcomes.forEach((lo: any) => {
          connsPelu1 += lo.connections.length;
          lo.connections.forEach((c: any) => {
            const numActs = (c.activities || []).length;
            actsPelu1 += numActs;
            if (numActs === 0) emptyConnsPelu1++;
          });
        });
      });

      let actsPelu2 = 0;
      let connsPelu2 = 0;
      let emptyConnsPelu2 = 0;
      pelu2.forEach(m => {
        m.learningOutcomes.forEach((lo: any) => {
          connsPelu2 += lo.connections.length;
          lo.connections.forEach((c: any) => {
            const numActs = (c.activities || []).length;
            actsPelu2 += numActs;
            if (numActs === 0) emptyConnsPelu2++;
          });
        });
      });

      expect(actsPelu1).toBe(1468);
      expect(actsPelu2).toBe(1376);
      expect(connsPelu1).toBe(385);
      expect(connsPelu2).toBe(375);
      expect(emptyConnsPelu1).toBe(0);
      expect(emptyConnsPelu2).toBe(0);
    });

    it('debería ejecutar la migración 10 up y cargar correctamente los documentos desarrollados', async () => {
      await runMigration10();

      const pelu1 = await MapaModule.find({ tab: 'CFGM_PELUQUERIA' });
      const pelu2 = await MapaModule.find({ tab: 'CFGM_PELUQUERIA_2' });

      expect(pelu1.length).toBe(8);
      expect(pelu2.length).toBe(8);

      let totalConns1 = 0;
      pelu1.forEach(m => {
        m.learningOutcomes.forEach((lo: any) => {
          totalConns1 += lo.connections.length;
        });
      });
      expect(totalConns1).toBe(385);
    });
  });
});
