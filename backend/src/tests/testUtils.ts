import request from 'supertest';
import { app } from '../server';
import mongoose from 'mongoose';

export const createTestUser = async (role: 'pending' | 'teacher' | 'admin', email: string) => {
  // Directamente en la base de datos para saltarnos la ruta de login normal y setear el rol
  const User = mongoose.model('User');
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const user = new User({ name: 'Test User', email, password: hashedPassword, role });
  await user.save();
  
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' });
  return { token: res.body.token, user: { ...res.body.user, _id: user._id } };
};
