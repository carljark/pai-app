import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Solicitud } from '../models/Solicitud';
import { Notification } from '../models/Notification';
import { OFERTA_FP_IB } from '../data/oferta-fp-ib';
import { NIVELES } from '../data/niveles';
import { MAX_SOLICITUDES_ABIERTAS, resumenPendientes } from '../services/solicitudes.service';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const enviar = (token: string, body: object) =>
  request(app).post('/api/solicitudes').set('Authorization', `Bearer ${token}`).send(body);

const SOLICITUD = {
  centro: { nombre: 'IES Joan Ramis i Ramis', municipio: 'Maó', web: 'https://iesjoanramis.org' },
  ciclos: ['SSC33', 'SAN34'],
  otros: ['Ciclo inventado'],
  comentario: 'Lo necesitamos para el curso que viene',
  idioma: 'ca',
};

describe('Oferta de FP de las Illes Balears', () => {
  it('tiene códigos únicos, grado y nombres en los dos idiomas sin mezclarlos', () => {
    expect(OFERTA_FP_IB.length).toBeGreaterThan(100);
    expect(new Set(OFERTA_FP_IB.map((c) => c.codigo)).size).toBe(OFERTA_FP_IB.length);
    for (const c of OFERTA_FP_IB) {
      expect(['FPB', 'CFGM', 'CFGS']).toContain(c.etapa);
      expect(c.nombre_es && c.nombre_ca && c.familia_es && c.familia_ca).toBeTruthy();
      expect(`${c.nombre_es} ${c.familia_es}`).not.toMatch(/·|ç|(?<!\p{L})i(?!\p{L})|à|è|ò/u);
      expect(`${c.nombre_ca} ${c.familia_ca}`).not.toMatch(/ñ|(?<!\p{L})y(?!\p{L})|ó\b/u);
    }
  });

  it('cada ciclo de FP del catálogo tiene un código que existe en la oferta', () => {
    const fp = NIVELES.filter((n) => n.etapa !== 'ESO');
    expect(fp.length).toBeGreaterThan(0);
    for (const nivel of fp) expect(OFERTA_FP_IB.map((c) => c.codigo)).toContain(nivel.codigoCaib);
  });
});

describe('Solicitudes de centros', () => {
  it('el docente ve la oferta de FP de Baleares y qué ciclos ya están disponibles', async () => {
    const { token } = await createTestUser('teacher', 'docente@test.com');
    const res = await request(app).get('/api/solicitudes/oferta').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.find((c: any) => c.codigo === 'SSC33').disponible).toBe('CFGS_INTEGRACION_SOCIAL');
    expect(res.body.find((c: any) => c.codigo === 'SAN34').disponible).toBeNull();
  });

  it('el docente envía una solicitud y la ve en «Mis solicitudes»', async () => {
    const { token, user } = await createTestUser('teacher', 'docente@test.com');
    const res = await enviar(token, SOLICITUD);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pendiente');
    expect(res.body.userId).toBe(user._id.toString());
    expect(res.body.idioma).toBe('ca');
    expect(res.body.ciclos.map((c: any) => [c.codigo, c.estado])).toEqual([
      ['SSC33', 'disponible'], ['SAN34', 'pendiente'], [undefined, 'pendiente'],
    ]);
    expect(res.body.ciclos[1].nombre_ca).toBe('Higiene bucodental');

    const mias = await request(app).get('/api/solicitudes/mias').set('Authorization', `Bearer ${token}`);
    expect(mias.body).toHaveLength(1);
    expect(mias.body[0].centro.nombre).toBe('IES Joan Ramis i Ramis');
  });

  it('el docente pide un ciclo que no está en la oferta', async () => {
    const { token } = await createTestUser('teacher', 'docente@test.com');
    const res = await enviar(token, { centro: { nombre: 'CEPA' }, ciclos: ['XXX99'], otros: ['Ciclo nuevo', 'Ciclo nuevo'] });
    expect(res.status).toBe(201);
    expect(res.body.ciclos).toHaveLength(1);
    expect(res.body.ciclos[0]).toMatchObject({ nombre: 'Ciclo nuevo', nombre_es: 'Ciclo nuevo', estado: 'pendiente' });
  });

  it('validación del formulario', async () => {
    const { token } = await createTestUser('teacher', 'docente@test.com');
    expect((await enviar(token, { ciclos: ['SSC33'] })).status).toBe(400);
    expect((await enviar(token, { centro: { nombre: '  ' }, ciclos: ['SSC33'] })).status).toBe(400);
    expect((await enviar(token, { centro: { nombre: 'IES' }, ciclos: [], otros: [''] })).status).toBe(400);
    expect((await enviar(token, { centro: { nombre: 'IES' }, ciclos: 'SSC33' })).status).toBe(400);
    expect(await Solicitud.countDocuments()).toBe(0);
  });

  it('limita las solicitudes abiertas de cada docente', async () => {
    const { token } = await createTestUser('teacher', 'docente@test.com');
    for (let i = 0; i < MAX_SOLICITUDES_ABIERTAS; i++) {
      expect((await enviar(token, { centro: { nombre: `IES ${i}` }, ciclos: ['SSC33'] })).status).toBe(201);
    }
    expect((await enviar(token, { centro: { nombre: 'Uno más' }, ciclos: ['SSC33'] })).status).toBe(409);
  });

  it('una cuenta pendiente de aprobación no puede pedir centros', async () => {
    const { token } = await createTestUser('pending', 'pendiente@test.com');
    expect((await enviar(token, SOLICITUD)).status).toBe(403);
  });

  it('solo el administrador gestiona las solicitudes', async () => {
    const { token } = await createTestUser('teacher', 'docente@test.com');
    const creada = await enviar(token, SOLICITUD);
    const lista = await request(app).get('/api/admin/solicitudes').set('Authorization', `Bearer ${token}`);
    const cambio = await request(app).patch(`/api/admin/solicitudes/${creada.body._id}`)
      .set('Authorization', `Bearer ${token}`).send({ status: 'completada' });
    expect(lista.status).toBe(403);
    expect(cambio.status).toBe(403);
  });

  it('el administrador cambia el estado y el docente recibe un aviso', async () => {
    const docente = await createTestUser('teacher', 'docente@test.com');
    const admin = await createTestUser('admin', 'admin@test.com');
    const creada = await enviar(docente.token, SOLICITUD);
    const ciclo = creada.body.ciclos[1];

    const patch = (body: object) => request(app).patch(`/api/admin/solicitudes/${creada.body._id}`)
      .set('Authorization', `Bearer ${admin.token}`).send(body);
    const res = await patch({
      status: 'completada', adminNotes: 'Hecho', ciclos: [{ _id: ciclo._id, estado: 'incorporado', tarea: '219' }],
    });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completada');
    expect(res.body.ciclos[1]).toMatchObject({ estado: 'incorporado', tarea: '219' });

    const aviso = await Notification.findOne({ recipientId: docente.user._id });
    expect(aviso?.type).toBe('INFO');
    expect(aviso?.message).toBe("La sol·licitud del centre «IES Joan Ramis i Ramis» s'ha completat.");

    await patch({ adminNotes: 'Sin cambio de estado' });
    expect(await Notification.countDocuments()).toBe(1);

    const lista = await request(app).get('/api/admin/solicitudes').set('Authorization', `Bearer ${admin.token}`);
    expect(lista.body).toHaveLength(1);
  });

  it('avisa en castellano y no avisa al volver a pendiente', async () => {
    const docente = await createTestUser('teacher', 'docente@test.com');
    const admin = await createTestUser('admin', 'admin@test.com');
    const creada = await enviar(docente.token, { ...SOLICITUD, idioma: 'es' });
    const patch = (body: object) => request(app).patch(`/api/admin/solicitudes/${creada.body._id}`)
      .set('Authorization', `Bearer ${admin.token}`).send(body);
    await patch({ status: 'en_curso' });
    await patch({ status: 'pendiente' });
    const avisos = await Notification.find({ recipientId: docente.user._id });
    expect(avisos.map((n) => n.message)).toEqual(['La solicitud del centro «IES Joan Ramis i Ramis» está en curso.']);
  });

  it('rechaza cambios no válidos del administrador', async () => {
    const docente = await createTestUser('teacher', 'docente@test.com');
    const admin = await createTestUser('admin', 'admin@test.com');
    const creada = await enviar(docente.token, SOLICITUD);
    const patch = (id: string, body: object) => request(app).patch(`/api/admin/solicitudes/${id}`)
      .set('Authorization', `Bearer ${admin.token}`).send(body);
    expect((await patch(creada.body._id, { status: 'otro' })).status).toBe(400);
    expect((await patch(creada.body._id, { ciclos: [{ _id: '64b000000000000000000000', estado: 'incorporado' }] })).status).toBe(400);
    expect((await patch(creada.body._id, { ciclos: [{ _id: creada.body.ciclos[0]._id, estado: 'raro' }] })).status).toBe(400);
    expect((await patch('64b000000000000000000000', { status: 'completada' })).status).toBe(404);
    expect((await patch('no-es-un-id', { status: 'completada' })).status).toBe(404);
  });

  it('el estado de los ciclos se recalcula con el catálogo', async () => {
    const { user } = await createTestUser('teacher', 'docente@test.com');
    await Solicitud.create({
      userId: user._id, userName: 'Docente', centro: { nombre: 'IES' }, ciclos: [{ codigo: 'SSC33', estado: 'pendiente' }],
    });
    const { token } = await createTestUser('admin', 'admin@test.com');
    const res = await request(app).get('/api/admin/solicitudes').set('Authorization', `Bearer ${token}`);
    expect(res.body[0].ciclos[0]).toMatchObject({ estado: 'disponible', tipoNivel: 'CFGS_INTEGRACION_SOCIAL' });
  });

  it('el resumen de pendientes agrupa los ciclos que faltan sin duplicados', async () => {
    const a = await createTestUser('teacher', 'a@test.com');
    const b = await createTestUser('teacher', 'b@test.com');
    const primera = await enviar(a.token, SOLICITUD);
    await enviar(b.token, { centro: { nombre: 'IES Cap de Llevant' }, ciclos: ['SAN34'], otros: ['ciclo INVENTADO'] });
    const cerrada = await enviar(b.token, { centro: { nombre: 'Cerrado' }, ciclos: ['IMP31'] });
    await Solicitud.updateOne({ _id: cerrada.body._id }, { status: 'descartada' });

    const { solicitudes, ciclosPendientes } = await resumenPendientes();
    expect(solicitudes.map((s) => s.centro.nombre)).toEqual(['IES Joan Ramis i Ramis', 'IES Cap de Llevant']);
    expect(ciclosPendientes.map((c) => [c.codigo ?? c.nombre, c.solicitudes.length])).toEqual([
      ['SAN34', 2], ['Ciclo inventado', 2],
    ]);
    expect(ciclosPendientes[0]?.solicitudes[0]).toBe(String(primera.body._id));
  });

  it('responde 500 si falla la base de datos', async () => {
    const { token } = await createTestUser('teacher', 'docente@test.com');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const findSpy = vi.spyOn(Solicitud, 'find').mockImplementationOnce(() => { throw new Error('caída'); });
    const res = await request(app).get('/api/solicitudes/mias').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
    findSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
