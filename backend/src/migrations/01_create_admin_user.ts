import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

export async function up() {
  const User = mongoose.model('User');
  
  const email = process.env.ADMIN_EMAIL || 'admin@plappin.org';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('⚠️ ATENCIÓN: No se ha definido ADMIN_PASSWORD en el archivo .env.');
    console.error('Se creará la contraseña por defecto "PlappinAdmin2026!" por seguridad temporal.');
  }

  const finalPassword = password || 'PlappinAdmin2026!';
  
  const existingAdmin = await User.findOne({ email });
  
  if (existingAdmin) {
    console.log(`El administrador ${email} ya existe. Omitiendo.`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(finalPassword, salt);

  await User.create({
    name: 'Administrador PAI',
    email,
    password: hashedPassword,
    role: 'admin'
  });

  console.log(`✅ Usuario administrador (${email}) creado exitosamente.`);
}
