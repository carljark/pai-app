import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Feedback } from '../models/Feedback';
import { ActivityLog } from '../models/ActivityLog';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Feedback Endpoints', () => {
  it('POST /api/feedback - Debería crear una sugerencia con éxito', async () => {
    const { token, user } = await createTestUser('teacher', 'teacher1@test.com');
    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'sugerencia',
        title: 'Exportar a PDF',
        description: 'Sería genial poder descargar el proyecto directamente en PDF'
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Exportar a PDF');
    expect(res.body.type).toBe('sugerencia');
    expect(res.body.status).toBe('pendiente');
    expect(res.body.userId).toBe(user._id.toString());

    // Verificar ActivityLog
    const log = await ActivityLog.findOne({ action: 'FEEDBACK_SUBMITTED' });
    expect(log).toBeDefined();
    expect(log?.details?.title).toBe('Exportar a PDF');
  });

  it('POST /api/feedback - Debería crear un reporte de error con éxito', async () => {
    const { token } = await createTestUser('teacher', 'teacher2@test.com');
    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'error',
        title: 'Fallo al guardar',
        description: 'Al pulsar guardar no se actualizó el título'
      });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe('error');
    expect(res.body.title).toBe('Fallo al guardar');
  });

  it('POST /api/feedback - Debería validar título y descripción obligatorios', async () => {
    const { token } = await createTestUser('teacher', 'teacher3@test.com');
    
    let res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Solo descripción' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('título');

    res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '   ', description: 'desc' });
    expect(res.status).toBe(400);

    res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título', description: '  ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('descripción');
  });

  it('POST /api/feedback - Debería manejar errores 500 al guardar', async () => {
    const { token } = await createTestUser('teacher', 'teacher_err@test.com');
    vi.spyOn(Feedback.prototype, 'save').mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', description: 'Desc' });

    expect(res.status).toBe(500);
  });

  it('GET /api/feedback - Docente solo debe ver sus propios reportes', async () => {
    const { token: token1, user: user1 } = await createTestUser('teacher', 'prof1@test.com');
    const { token: token2, user: user2 } = await createTestUser('teacher', 'prof2@test.com');

    await new Feedback({
      userId: user1._id,
      userName: user1.name,
      userEmail: user1.email,
      type: 'sugerencia',
      title: 'Idea de user 1',
      description: 'Desc 1'
    }).save();

    await new Feedback({
      userId: user2._id,
      userName: user2.name,
      userEmail: user2.email,
      type: 'error',
      title: 'Bug de user 2',
      description: 'Desc 2'
    }).save();

    const res1 = await request(app).get('/api/feedback').set('Authorization', `Bearer ${token1}`);
    expect(res1.status).toBe(200);
    expect(res1.body.length).toBe(1);
    expect(res1.body[0].title).toBe('Idea de user 1');

    const res2 = await request(app).get('/api/feedback').set('Authorization', `Bearer ${token2}`);
    expect(res2.status).toBe(200);
    expect(res2.body.length).toBe(1);
    expect(res2.body[0].title).toBe('Bug de user 2');
  });

  it('GET /api/feedback - Administrador puede ver todo y filtrar', async () => {
    const { token: adminToken } = await createTestUser('admin', 'admin@test.com');
    const { user: user1 } = await createTestUser('teacher', 'user1@test.com');

    await new Feedback({
      userId: user1._id,
      userName: user1.name,
      userEmail: user1.email,
      type: 'sugerencia',
      title: 'Sugerencia 1',
      description: 'Desc 1',
      status: 'pendiente'
    }).save();

    await new Feedback({
      userId: user1._id,
      userName: user1.name,
      userEmail: user1.email,
      type: 'error',
      title: 'Error 1',
      description: 'Desc error',
      status: 'resuelto'
    }).save();

    // Ver todos
    let res = await request(app).get('/api/feedback').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);

    // Filtrar por tipo
    res = await request(app).get('/api/feedback?type=error').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].type).toBe('error');

    // Filtrar por status
    res = await request(app).get('/api/feedback?status=pendiente').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe('pendiente');
  });

  it('GET /api/feedback - Debería manejar error 500', async () => {
    const { token } = await createTestUser('teacher', 'teacher_get_err@test.com');
    vi.spyOn(Feedback, 'find').mockImplementationOnce(() => {
      throw new Error('Find failed');
    });

    const res = await request(app).get('/api/feedback').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  it('PATCH /api/feedback/:id - Administrador puede actualizar estado y notas', async () => {
    const { token: adminToken } = await createTestUser('admin', 'admin2@test.com');
    const { token: teacherToken, user: teacher } = await createTestUser('teacher', 'teacher4@test.com');

    const fb = await new Feedback({
      userId: teacher._id,
      userName: teacher.name,
      userEmail: teacher.email,
      type: 'error',
      title: 'Bug reportado',
      description: 'Detalle'
    }).save();

    // Denegado a docente
    const resForbidden = await request(app)
      .patch(`/api/feedback/${fb._id}`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ status: 'resuelto' });
    expect(resForbidden.status).toBe(403);

    // Estado inválido
    const resInvalid = await request(app)
      .patch(`/api/feedback/${fb._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'no_valido' });
    expect(resInvalid.status).toBe(400);

    // Éxito por admin
    const resSuccess = await request(app)
      .patch(`/api/feedback/${fb._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'en_revision', adminNotes: 'Investigando problema' });
    expect(resSuccess.status).toBe(200);
    expect(resSuccess.body.status).toBe('en_revision');
    expect(resSuccess.body.adminNotes).toBe('Investigando problema');

    // 404 no encontrado
    const fakeId = new (await import('mongoose')).default.Types.ObjectId();
    const res404 = await request(app)
      .patch(`/api/feedback/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'resuelto' });
    expect(res404.status).toBe(404);
  });

  it('PATCH /api/feedback/:id - Debería manejar error 500', async () => {
    const { token: adminToken } = await createTestUser('admin', 'admin_err@test.com');
    const fakeId = new (await import('mongoose')).default.Types.ObjectId();
    vi.spyOn(Feedback, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('Update failed');
    });

    const res = await request(app)
      .patch(`/api/feedback/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'resuelto' });
    expect(res.status).toBe(500);
  });

  it('DELETE /api/feedback/:id - Creador y admin pueden eliminar, otros denegado', async () => {
    const { token: adminToken } = await createTestUser('admin', 'admin3@test.com');
    const { token: authorToken, user: author } = await createTestUser('teacher', 'author@test.com');
    const { token: otherToken } = await createTestUser('teacher', 'other@test.com');

    const fb1 = await new Feedback({
      userId: author._id,
      userName: author.name,
      userEmail: author.email,
      type: 'sugerencia',
      title: 'Sugerencia para borrar',
      description: 'Test'
    }).save();

    // Otro profesor intenta borrarlo -> 403
    const resOther = await request(app)
      .delete(`/api/feedback/${fb1._id}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(resOther.status).toBe(403);

    // Creador lo borra -> 200
    const resAuthor = await request(app)
      .delete(`/api/feedback/${fb1._id}`)
      .set('Authorization', `Bearer ${authorToken}`);
    expect(resAuthor.status).toBe(200);

    // Admin puede borrar otro
    const fb2 = await new Feedback({
      userId: author._id,
      userName: author.name,
      userEmail: author.email,
      type: 'error',
      title: 'Error para admin',
      description: 'Test'
    }).save();

    const resAdmin = await request(app)
      .delete(`/api/feedback/${fb2._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resAdmin.status).toBe(200);

    // No encontrado -> 404
    const fakeId = new (await import('mongoose')).default.Types.ObjectId();
    const res404 = await request(app)
      .delete(`/api/feedback/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res404.status).toBe(404);
  });

  it('DELETE /api/feedback/:id - Debería manejar error 500', async () => {
    const { token: adminToken } = await createTestUser('admin', 'admin_del_err@test.com');
    const fakeId = new (await import('mongoose')).default.Types.ObjectId();
    vi.spyOn(Feedback, 'findById').mockImplementationOnce(() => {
      throw new Error('Delete find error');
    });

    const res = await request(app)
      .delete(`/api/feedback/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(500);
  });
});
