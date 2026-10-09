import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { connectDB, closeDB, clearDB } from './testSetup';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { up as createAdminUp } from '../migrations/01_create_admin_user';
import { up as ingestEducacionInfantilUp } from '../migrations/13_ingest_cfgs_educacion_infantil_ras';
import { up as reingestEsteticaUp } from '../migrations/24_reingest_cfgm_estetica_ras';
import { up as ingestAtencionDependenciaUp } from '../migrations/26_ingest_cfgm_atencion_dependencia_ras';
import { up as ingestGuiaMedioNaturalUp } from '../migrations/30_ingest_cfgm_guia_medio_natural_ras';
import { up as ingestCuidadosAuxiliaresUp } from '../migrations/31_ingest_cfgm_cuidados_auxiliares_enfermeria_ras';
import { up as ingestAcondicionamientoFisicoUp } from '../migrations/32_ingest_cfgs_acondicionamiento_fisico_ras';
import { up as ingestAnimacionSociodeportivaUp } from '../migrations/33_ingest_cfgs_animacion_sociodeportiva_ras';
import { CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';
import { RA } from '../models/RA';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Migrations Safety & Idempotency', () => {
  it('No debe borrar ni alterar usuarios registrados al ejecutar la migración de admin', async () => {
    const User = mongoose.model('User');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);

    // 1. Simular usuarios que se registraron ellos mismos
    const user1 = await User.create({
      name: 'Profesor Uno',
      email: 'profesor1@ies.es',
      password: hash,
      role: 'pending',
      canUseAi: false
    });

    const user2 = await User.create({
      name: 'Profesor Aprobado',
      email: 'profesor2@ies.es',
      password: hash,
      role: 'teacher',
      canUseAi: true
    });

    // 2. Ejecutar la migración de inicialización de administrador
    await createAdminUp();

    // 3. Verificar que los usuarios auto-registrados siguen existiendo intactos
    const checkUser1 = await User.findById(user1._id);
    expect(checkUser1).not.toBeNull();
    expect(checkUser1?.email).toBe('profesor1@ies.es');
    expect(checkUser1?.role).toBe('pending');
    expect(checkUser1?.canUseAi).toBe(false);

    const checkUser2 = await User.findById(user2._id);
    expect(checkUser2).not.toBeNull();
    expect(checkUser2?.email).toBe('profesor2@ies.es');
    expect(checkUser2?.role).toBe('teacher');
    expect(checkUser2?.canUseAi).toBe(true);

    // 4. Verificar que el admin configurado existe
    const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@plappin.org' });
    expect(adminUser).not.toBeNull();
    expect(adminUser?.role).toBe('admin');
    expect(adminUser?.canUseAi).toBe(true);
  });

  it('Ejecutar la migración múltiples veces no duplica administradores ni borra usuarios', async () => {
    const User = mongoose.model('User');
    
    // Crear un usuario registrado
    await User.create({
      name: 'Usuario Registrado',
      email: 'usuario@ies.es',
      password: 'password123',
      role: 'pending'
    });

    // Ejecutar migración dos veces
    await createAdminUp();
    await createAdminUp();

    // El usuario registrado debe seguir existiendo
    const registered = await User.findOne({ email: 'usuario@ies.es' });
    expect(registered).not.toBeNull();

    // El admin no debe estar duplicado
    const adminCount = await User.countDocuments({ role: 'admin' });
    expect(adminCount).toBe(1);
  });

  it('Carga los RA del CFGS Educación Infantil sin duplicar ni tocar otros niveles', async () => {
    await RA.create({ id: 'RA1', module: 'Otro', tipoNivel: 'CFGM_PELUQUERIA', description: 'Ajeno' });

    await ingestEducacionInfantilUp();
    await ingestEducacionInfantilUp();

    const ras = await RA.find({ tipoNivel: 'CFGS_EDUCACION_INFANTIL' });
    expect(ras).toHaveLength(82);
    expect(await RA.countDocuments({ tipoNivel: 'CFGM_PELUQUERIA' })).toBe(1);

    const didactica = ras.find((r) => r.moduleCode === '0011' && r.id === 'RA1');
    expect(didactica?.module_es).toBe('Didáctica de la educación infantil');
    expect(didactica?.module_ca).toBe("Didàctica de l'educació infantil");
    expect(didactica?.criterios_es[0]).toMatch(/^a\) Se ha /);
    expect(didactica?.criterios_ca[0]).toMatch(/^a\) S'ha /);
    expect(didactica?.criterios_ca).toHaveLength(didactica?.criterios_es.length ?? -1);
  });

  it('Carga los RA del CFGM Atención a Personas en Situación de Dependencia sin duplicar ni tocar otros niveles', async () => {
    await RA.create({ id: 'RA1', moduleCode: '0020', tipoNivel: 'CFGS_EDUCACION_INFANTIL', description: 'Ajeno' });

    await ingestAtencionDependenciaUp();
    await ingestAtencionDependenciaUp();

    const ras = await RA.find({ tipoNivel: 'CFGM_ATENCION_DEPENDENCIA' });
    expect(ras).toHaveLength(78);
    expect(await RA.countDocuments({ tipoNivel: 'CFGS_EDUCACION_INFANTIL' })).toBe(1);

    const teleasistencia = ras.find((r) => r.moduleCode === '0831' && r.id === 'RA1');
    expect(teleasistencia?.module_es).toBe('Teleasistencia');
    expect(teleasistencia?.module_ca).toBe('Teleassistència');
    expect(teleasistencia?.description).toBe(teleasistencia?.description_ca);
    expect(teleasistencia?.criterios_ca).toHaveLength(teleasistencia?.criterios_es.length ?? -1);
  });

  it('Carga los RA del CFGM Guía en el Medio Natural y de Tiempo Libre sin duplicar ni tocar otros niveles', async () => {
    await RA.create({ id: 'RA1', moduleCode: '1709', tipoNivel: 'CFGM_ATENCION_DEPENDENCIA', description: 'Ajeno' });

    await ingestGuiaMedioNaturalUp();
    await ingestGuiaMedioNaturalUp();

    const ras = await RA.find({ tipoNivel: 'CFGM_GUIA_MEDIO_NATURAL' });
    expect(ras).toHaveLength(97);
    expect(await RA.countDocuments({ tipoNivel: 'CFGM_ATENCION_DEPENDENCIA' })).toBe(1);

    const cuerdas = ras.find((r) => r.moduleCode === '1339' && r.id === 'RA1');
    expect(cuerdas?.module_es).toBe('Maniobras con cuerdas');
    expect(cuerdas?.module_ca).toBe('Maniobres amb cordes');
    expect(cuerdas?.description).toBe(cuerdas?.description_ca);
    expect(cuerdas?.criterios_ca).toHaveLength(cuerdas?.criterios_es.length ?? -1);
  });

  it('Carga los RA del CFGM Cuidados Auxiliares de Enfermería sin duplicar ni tocar otros niveles', async () => {
    await RA.create({ id: 'RA1', moduleCode: '1325', tipoNivel: 'CFGM_GUIA_MEDIO_NATURAL', description: 'Ajeno' });

    await ingestCuidadosAuxiliaresUp();
    await ingestCuidadosAuxiliaresUp();

    const ras = await RA.find({ tipoNivel: 'CFGM_CUIDADOS_AUXILIARES_ENFERMERIA' });
    expect(ras).toHaveLength(30);
    expect(await RA.countDocuments({ tipoNivel: 'CFGM_GUIA_MEDIO_NATURAL' })).toBe(1);

    const tecnicas = ras.find((r) => r.moduleCode === 'CAE2' && r.id === 'RA1');
    expect(tecnicas?.module_es).toBe('Técnicas básicas de enfermería');
    expect(tecnicas?.module_ca).toBe("Tècniques bàsiques d'infermeria");
    expect(tecnicas?.description).toBe(tecnicas?.description_ca);
    expect(tecnicas?.criterios_ca).toHaveLength(tecnicas?.criterios_es.length ?? -1);
  });

  it('Carga los RA del CFGS Acondicionamiento Físico sin duplicar ni tocar otros niveles', async () => {
    await RA.create({ id: 'RA1', moduleCode: '0017', tipoNivel: 'CFGS_EDUCACION_INFANTIL', description: 'Ajeno' });

    await ingestAcondicionamientoFisicoUp();
    await ingestAcondicionamientoFisicoUp();

    const ras = await RA.find({ tipoNivel: 'CFGS_ACONDICIONAMIENTO_FISICO' });
    expect(ras).toHaveLength(78);
    expect(await RA.countDocuments({ tipoNivel: 'CFGS_EDUCACION_INFANTIL' })).toBe(1);

    const hidrocinesia = ras.find((r) => r.moduleCode === '1152' && r.id === 'RA1');
    expect(hidrocinesia?.module_es).toBe('Técnicas de hidrocinesia');
    expect(hidrocinesia?.module_ca).toBe("Tècniques d'hidrocinèsia");
    expect(hidrocinesia?.description).toBe(hidrocinesia?.description_ca);
    expect(hidrocinesia?.criterios_ca).toHaveLength(hidrocinesia?.criterios_es.length ?? -1);
  });

  it('Carga los RA del CFGS Enseñanza y Animación Sociodeportiva sin duplicar ni tocar otros niveles', async () => {
    await RA.create({ id: 'RA1', moduleCode: '1136', tipoNivel: 'CFGS_ACONDICIONAMIENTO_FISICO', description: 'Ajeno' });

    await ingestAnimacionSociodeportivaUp();
    await ingestAnimacionSociodeportivaUp();

    const ras = await RA.find({ tipoNivel: 'CFGS_ANIMACION_SOCIODEPORTIVA' });
    expect(ras).toHaveLength(90);
    expect(await RA.countDocuments({ tipoNivel: 'CFGS_ACONDICIONAMIENTO_FISICO' })).toBe(1);

    const dinamizacion = ras.find((r) => r.moduleCode === '1124' && r.id === 'RA1');
    expect(dinamizacion?.module_es).toBe('Dinamización grupal');
    expect(dinamizacion?.module_ca).toBe('Dinamització grupal');
    expect(dinamizacion?.description).toBe(dinamizacion?.description_ca);
    expect(dinamizacion?.criterios_ca).toHaveLength(dinamizacion?.criterios_es.length ?? -1);
  });

  it('Recarga los RA del CFGM Estética sin duplicar ni tocar otros niveles', async () => {
    await RA.create({ id: 'RA1', module: 'Otro', tipoNivel: 'CFGM_PELUQUERIA', description: 'Ajeno' });
    await RA.create({ id: 'RA1', moduleCode: '0633', tipoNivel: 'CFGM_ESTETICA', description: 'Obsoleto' });

    await reingestEsteticaUp();
    await reingestEsteticaUp();

    const ras = await RA.find({ tipoNivel: 'CFGM_ESTETICA' });
    expect(ras).toHaveLength(CFGM_ESTETICA_RAS_DATA.length);
    expect(ras.some((r) => r.description === 'Obsoleto')).toBe(false);
    expect(await RA.countDocuments({ tipoNivel: 'CFGM_PELUQUERIA' })).toBe(1);
    const higiene = ras.find((r) => r.moduleCode === '0633' && r.id === CFGM_ESTETICA_RAS_DATA[0]?.id);
    expect(higiene?.criterios_ca?.length).toBe(higiene?.criterios_es?.length);
    expect(higiene?.description).toBe(higiene?.description_ca);
  });
});
