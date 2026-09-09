import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { User } from '../models/User';

export async function up() {
  
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = 'PlappinAdmin2026!';
  const defaultHash = await bcrypt.hash(defaultPassword, salt);

  // Obtener correo y clave definidos en .env, o fallback a admin@plappin.org
  const targetEmail = process.env.ADMIN_EMAIL || 'admin@plappin.org';
  const targetPassword = process.env.ADMIN_PASSWORD || defaultPassword;
  const targetHash = await bcrypt.hash(targetPassword, salt);

  // Si se ha configurado un administrador específico en el entorno distinto de admin@plappin.org,
  // eliminamos el admin genérico por defecto para mantener un único administrador en la app
  if (targetEmail !== 'admin@plappin.org') {
    await User.deleteMany({ email: 'admin@plappin.org' });
  }

  const existingAdmin = await User.findOne({ email: targetEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Administrador PAI',
      email: targetEmail,
      password: targetHash,
      role: 'admin',
      canUseAi: true
    });
    console.log(`✅ Usuario administrador único (${targetEmail}) creado exitosamente.`);
  } else {
    existingAdmin.role = 'admin';
    existingAdmin.canUseAi = true;
    await existingAdmin.save();
    console.log(`✅ Usuario administrador único (${targetEmail}) verificado.`);
  }
}
