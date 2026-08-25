import request from 'supertest';
import { app } from '../server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middlewares/auth.middleware';

export const createTestUser = async (role: 'pending' | 'teacher' | 'admin', email: string) => {
  const User = mongoose.model('User');
  const user = new User({ name: 'Test User', email, password: 'hashedpassword', role });
  await user.save();
  
  const token = jwt.sign({ _id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
  return { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } };
};
