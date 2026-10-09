import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { MapaModule } from '../models/MapaModule';
import { connectDB, closeDB, clearDB } from './testSetup';
import { up as runMigration08 } from '../migrations/08_ingest_mapa_intermodular';
import { up as runMigration09 } from '../migrations/09_deduplicate_mapa_peluqueria';
import { up as runMigration10 } from '../migrations/10_ingest_mapa_peluqueria_desarrollados';
import { up as runMigration11 } from '../migrations/11_ingest_mapa_peluqueria_actividades_corregidas';
import { up as runMigration14 } from '../migrations/14_fix_catalan_peluqueria_1708_1710';
import { up as runMigration15 } from '../migrations/15_ingest_mapa_educacion_infantil';
import { up as runMigration16 } from '../migrations/16_fix_catalan_peluqueria_segundo_curso';
import { up as runMigration17 } from '../migrations/17_fix_catalan_mapas_y_ras_estetica';
import { up as runMigration18 } from '../migrations/18_fix_catalan_ras_y_mapa_fpb';
import { up as runMigration19 } from '../migrations/19_reload_mapa_infantil_primer_curso';
import { up as runMigration20 } from '../migrations/20_reload_mapa_infantil_segundo_curso';
import { up as runMigration21 } from '../migrations/21_reload_mapa_infantil_primer_curso_tres_actividades';
import { up as runMigration27 } from '../migrations/27_reload_cfgm_peluqueria_transversales';
import { up as runMigration28 } from '../migrations/28_reload_transversales_canonicos';
import { up as runMigration29 } from '../migrations/29_reload_mapa_fpb_catalan';
import { RA } from '../models/RA';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

/** Comprueba relaciones bidireccionales, actividades mínimas y títulos sin repetir en cada RA. */
const expectBidirectionalMap = async (tab: string, modules: number, connections: number, minActivities: number) => {
  const docs = await MapaModule.find({ tab });
  expect(docs).toHaveLength(modules);
  const pairs = new Set<string>();
  for (const doc of docs) {
    for (const lo of doc.learningOutcomes) {
      const titles = lo.connections.flatMap((c: any) => c.activities.map((a: any) => a.title_es));
      expect(new Set(titles).size).toBe(titles.length);
      for (const c of lo.connections) {
        expect(c.activities.length).toBeGreaterThanOrEqual(minActivities);
        expect(c.relatedCriteria.every((r: any) => r.moduleCode === c.targetModuleCode)).toBe(true);
        pairs.add(`${doc.code}_${lo.code}>${c.targetModuleCode}_${c.targetRaCode}`);
      }
    }
  }
  expect(pairs.size).toBe(connections);
  for (const p of pairs) {
    const [from, to] = p.split('>');
    expect(pairs.has(`${to}>${from}`)).toBe(true);
  }
};

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

      expect(actsPelu1).toBe(843);
      expect(actsPelu2).toBe(1407);
      expect(connsPelu1).toBe(375);
      expect(connsPelu2).toBe(367);
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
      expect(totalConns1).toBe(375);
    });

    it('debería ejecutar la migración 11 y cargar las actividades corregidas', async () => {
      await runMigration11();

      const pelu1 = await MapaModule.find({ tab: 'CFGM_PELUQUERIA' });
      const pelu2 = await MapaModule.find({ tab: 'CFGM_PELUQUERIA_2' });

      expect(pelu1.length).toBe(8);
      expect(pelu2.length).toBe(8);

      const mod848 = await MapaModule.findOne({ tab: 'CFGM_PELUQUERIA_2', code: '0848' });
      expect(mod848).toBeTruthy();

      let conns848 = 0;
      let empty848 = 0;
      const titles = new Set<string>();
      mod848!.learningOutcomes.forEach((lo: any) => {
        lo.connections.forEach((c: any) => {
          conns848++;
          if (!c.activities || c.activities.length === 0) empty848++;
          c.activities.forEach((a: any) => titles.add(a.title_ca));
        });
      });

      expect(conns848).toBe(51);
      expect(empty848).toBe(0);
      expect(titles.size).toBe(108);
    });

    it('debería corregir con la migración 14 el catalán de 1708 y 1710 en Peluquería 2º', async () => {
      await runMigration14();

      const mod1708 = await MapaModule.findOne({ tab: 'CFGM_PELUQUERIA_2', code: '1708' });
      const ra1 = mod1708!.learningOutcomes.find((lo: any) => lo.code === 'RA1');
      expect(ra1.text_ca).toMatch(/^Identifica els aspectes ambientals/);
      expect(ra1.criteria_ca[0]).toMatch(/^a\) S'ha descrit/);
    });

    it('debería corregir con la migración 27 los transversales de Peluquería en RA y mapas', async () => {
      await RA.create({ id: 'RA1', moduleCode: '0020', tipoNivel: 'CFGS_EDUCACION_INFANTIL', description: 'Ajeno' });

      await runMigration27();
      await runMigration27();

      expect(await RA.countDocuments({ tipoNivel: 'CFGS_EDUCACION_INFANTIL' })).toBe(1);
      const ra3 = await RA.findOne({ tipoNivel: 'CFGM_PELUQUERIA', moduleCode: '1709', id: 'RA3' });
      expect(ra3?.criterios_es).toHaveLength(7);
      expect(ra3?.criterios_ca).toHaveLength(7);
      const ra1713 = await RA.findOne({ tipoNivel: 'CFGM_PELUQUERIA', moduleCode: '1713', id: 'RA1' });
      expect(ra1713?.criterios_ca[3]).toBe("d) S'han determinat les funcions de cada departament.");

      const mapa1 = JSON.stringify(await MapaModule.find({ tab: 'CFGM_PELUQUERIA' }).lean());
      expect(mapa1).not.toMatch(/1709-3[hi]/);
      expect(mapa1).not.toContain('cloud /nube');
      const mod1709 = await MapaModule.findOne({ tab: 'CFGM_PELUQUERIA', code: '1709' });
      const lo3 = mod1709!.learningOutcomes.find((lo: any) => lo.code === 'RA3');
      expect(lo3.criteria_es).toHaveLength(7);
      expect(lo3.connections.length).toBeGreaterThanOrEqual(6);

      const mapa2 = JSON.stringify(await MapaModule.find({ tab: 'CFGM_PELUQUERIA_2' }).lean());
      expect(mapa2).toContain("Planifica l'execució de les activitats");
    });

    it('debería unificar con la migración 28 los transversales y redirigir las conexiones al 0636 RA5', async () => {
      await RA.create({ id: 'RA1', moduleCode: '3060', tipoNivel: 'FP_BASICA', description: 'Ajeno' });

      await runMigration28();
      await runMigration28();

      expect(await RA.countDocuments({ tipoNivel: 'FP_BASICA' })).toBe(1);
      const ra2 = { moduleCode: '1709', id: 'RA2' };
      const [infantil, estetica] = await Promise.all([
        RA.findOne({ ...ra2, tipoNivel: 'CFGS_EDUCACION_INFANTIL' }),
        RA.findOne({ ...ra2, tipoNivel: 'CFGM_ESTETICA' }),
      ]);
      expect(infantil?.description_es).toMatch(/^Adquiere las competencias necesarias/);
      expect(estetica?.description_ca).toBe(infantil?.description_ca);
      expect(JSON.stringify(await RA.find({ tipoNivel: 'CFGM_ESTETICA' }).lean())).not.toMatch(/seua|seues|cloud \/nube/);

      const mod0643 = await MapaModule.findOne({ tab: 'CFGM_PELUQUERIA_2', code: '0643' });
      const ra5 = mod0643!.learningOutcomes.find((lo: any) => lo.code === 'RA5');
      const conn = ra5.connections.find((c: any) => c.sourceCriteria === '0643-5e');
      expect(conn.targetRaCode).toBe('RA5');
      expect(conn.targetRaText_es).toMatch(/^Realiza la decoración de uñas/);
      expect(JSON.stringify(mod0643)).not.toContain('0636-RA6');
      expect(await MapaModule.countDocuments({ tab: 'CFGM' })).toBeGreaterThan(0);
      expect(await MapaModule.countDocuments({ tab: 'CFGS_EDUCACION_INFANTIL' })).toBeGreaterThan(0);
    });

    it('debería recargar con la migración 29 el mapa de FPB sin castellanismos en catalán', async () => {
      await MapaModule.create({ tab: 'CFGM', order: 0, code: '0633', name_es: 'x', name_ca: 'x', type: 't', color: '#000', icon: 'i' });

      await runMigration29();
      await runMigration29();

      expect(await MapaModule.countDocuments({ tab: 'CFGM' })).toBe(1);
      const fpb = await MapaModule.find({ tab: 'FPB' }).lean();
      expect(fpb).toHaveLength(11);
      const catalan = JSON.stringify(fpb.flatMap((m: any) => m.learningOutcomes.flatMap((lo: any) =>
        lo.connections.flatMap((c: any) => [c.justification_ca, ...c.relatedCriteria.map((r: any) => r.criteria_ca)]))));
      expect(catalan).not.toMatch(/del Itinerari|(^|[^\w'])ací\b|apoyades|Mantener|Favorecer|es entrenan|fácilment/);
      expect(catalan).toContain("de l'Itinerari per a l'ocupabilitat");
    });

    it('debería recargar con la migración 17 los mapas corregidos y el catalán de Estética', async () => {
      await RA.create({
        id: 'RA1',
        module: 'Técnicas de higiene',
        moduleCode: '0633',
        tipoNivel: 'CFGM_ESTETICA',
        description: 'Aplica técnicas',
        description_es: 'Aplica técnicas',
        criterios_ca: ['a) Se ha identificado el tipo de piel'],
      });

      await runMigration17();

      const ra = await RA.findOne({ tipoNivel: 'CFGM_ESTETICA', moduleCode: '0633', id: 'RA1' });
      expect(ra?.criterios_ca[0]).toMatch(/^a\) S'ha identificat/);
      expect(ra?.description_es).toBe('Aplica técnicas');

      expect(await MapaModule.countDocuments({ tab: 'FPB' })).toBeGreaterThan(0);
      expect(await MapaModule.countDocuments({ tab: 'CFGM' })).toBeGreaterThan(0);
      const fpb = JSON.stringify(await MapaModule.find({ tab: 'FPB' }).lean());
      expect(fpb).not.toContain("S'han expuesto");
      expect(fpb).not.toContain('Coincidències_CS_I_Peluqueria_y_Estetica.docx');
    });

    it('debería traducir con la migración 18 los RA de FPB y completar los criterios vacíos o duplicados', async () => {
      const castellano = ['a) Se ha relacionado la imagen personal que precisa un profesional.'];
      await RA.create([
        {
          id: 'RA1',
          module: "Preparació de l'entorn professional",
          module_es: 'Preparación del entorno profesional',
          description: 'Muestra una imagen',
          description_es: 'Muestra una imagen',
          criterios_es: castellano,
          criterios_ca: castellano,
        },
        { id: 'RA5', module_es: 'Lavado y cambios de forma del cabello', criterios_es: ['a) Copia del RA4'] },
        { id: 'RA1', module_es: 'Maquillaje', criterios_es: [], criterios_ca: [] },
        { id: 'RA1', module_es: 'Preparación del entorno profesional', tipoNivel: 'CFGM_ESTETICA', criterios_ca: castellano },
      ]);

      await runMigration18();
      await runMigration18();

      const prep = await RA.findOne({ module_es: 'Preparación del entorno profesional', tipoNivel: 'FP_BASICA' });
      expect(prep?.description_ca).toMatch(/^Mostra una imatge/);
      expect(prep?.criterios_ca[0]).toMatch(/^a\) S'ha relacionat/);
      expect(prep?.criterios_es).toEqual(castellano);

      const lavado = await RA.findOne({ module_es: 'Lavado y cambios de forma del cabello', id: 'RA5' });
      expect(lavado?.criterios_es[0]).toMatch(/cambio de forma permanente/);
      const maquillaje = await RA.findOne({ module_es: 'Maquillaje', id: 'RA1' });
      expect(maquillaje?.criterios_es).toHaveLength(9);
      expect(maquillaje?.criterios_ca).toHaveLength(9);

      const ajeno = await RA.findOne({ tipoNivel: 'CFGM_ESTETICA' });
      expect(ajeno?.criterios_ca).toEqual(castellano);

      const fpb = JSON.stringify(await MapaModule.find({ tab: 'FPB' }).lean());
      expect(fpb).not.toMatch(/el ajudant de manicura|higienitzación|deficiències en el servicio/);
      expect(fpb).not.toContain('Nota metodológica');
      expect(fpb).not.toContain('cera caliente i tibia');
    });

    it('debería corregir con la migración 16 el catalán de 2º de Peluquería en RA y mapa', async () => {
      await RA.create({
        id: 'RA1',
        module: 'Imagen corporal',
        moduleCode: '0640',
        tipoNivel: 'CFGM_PELUQUERIA',
        description: 'Caracteriza la imagen corporal',
        description_es: 'Caracteriza la imagen corporal',
        criterios_ca: ['a) Se han especificado...'],
      });

      await runMigration16();

      const ra = await RA.findOne({ tipoNivel: 'CFGM_PELUQUERIA', moduleCode: '0640', id: 'RA1' });
      expect(ra?.description_ca).toMatch(/^Caracteritza la imatge corporal/);
      expect(ra?.description_es).toBe('Caracteriza la imagen corporal');
      expect(ra?.criterios_ca[0]).toMatch(/^a\) S'han especificat/);

      const mod0843 = await MapaModule.findOne({ tab: 'CFGM_PELUQUERIA_2', code: '0843' });
      const textsCa = JSON.stringify(mod0843!.learningOutcomes, (key, value) =>
        typeof value === 'string' && key.endsWith('_es') ? undefined : value,
      );
      expect(textsCa).not.toContain('traduce la secuencia');
      expect(textsCa).toContain('tradueix la seqüència');
    });

    it('debería cargar con la migración 15 el mapa de Educación Infantil cumpliendo las reglas', async () => {
      await runMigration15();
      await runMigration15();

      for (const [tab, modules, min] of [
        ['CFGS_EDUCACION_INFANTIL', 6, 300],
        ['CFGS_EDUCACION_INFANTIL_2', 9, 300],
      ] as const) {
        const docs = await MapaModule.find({ tab });
        expect(docs).toHaveLength(modules);
        let total = 0;
        for (const doc of docs) {
          for (const lo of doc.learningOutcomes) {
            expect(lo.connections.length).toBeGreaterThanOrEqual(6);
            expect(lo.connections.length).toBeLessThanOrEqual(15);
            for (const c of lo.connections) {
              expect(c.activities.length).toBeGreaterThanOrEqual(1);
              expect(c.relatedCriteria.length).toBeLessThanOrEqual(3);
            }
            total += lo.connections.length;
          }
        }
        expect(total).toBeGreaterThanOrEqual(min);
        expect(total).toBeLessThanOrEqual(600);
      }

      const res = await request(app).get('/api/mapa-intermodular?tab=CFGS_EDUCACION_INFANTIL_2');
      expect(res.status).toBe(200);
      expect(res.body[0].code).toBe('0013');
      expect(res.body[0].name_ca).toBe('El joc infantil i la seva metodologia');
    });

    it('debería recargar con la migración 19 solo el 1.º de Infantil con relaciones bidireccionales', async () => {
      await MapaModule.create({ tab: 'CFGS_EDUCACION_INFANTIL_2', order: 0, code: '0013', name_es: 'X', name_ca: 'X',
        type: 'especifico', color: '#000000', icon: 'book',
      });
      await runMigration19();
      await runMigration19();

      expect(await MapaModule.countDocuments({ tab: 'CFGS_EDUCACION_INFANTIL_2' })).toBe(1);
      await expectBidirectionalMap('CFGS_EDUCACION_INFANTIL', 6, 406, 3);
    });

    it('debería recargar con la migración 21 el 1.º de Infantil con tres actividades por conexión', async () => {
      await runMigration21();
      await runMigration21();
      await expectBidirectionalMap('CFGS_EDUCACION_INFANTIL', 6, 406, 3);
    });

    it('debería recargar con la migración 20 solo el 2.º de Infantil con tres actividades por conexión', async () => {
      await MapaModule.create({ tab: 'CFGS_EDUCACION_INFANTIL', order: 0, code: '0011', name_es: 'X', name_ca: 'X',
        type: 'especifico', color: '#000000', icon: 'book',
      });
      await runMigration20();
      await runMigration20();

      expect(await MapaModule.countDocuments({ tab: 'CFGS_EDUCACION_INFANTIL' })).toBe(1);
      await expectBidirectionalMap('CFGS_EDUCACION_INFANTIL_2', 9, 358, 3);
    });
  });
});
