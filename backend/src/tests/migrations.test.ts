import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { connectDB, closeDB, clearDB } from './testSetup';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { up as createAdminUp } from '../migrations/01_create_admin_user';

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
});
