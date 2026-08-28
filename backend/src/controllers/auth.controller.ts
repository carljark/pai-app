import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ _id: user._id, role: user.role, name: user.name, canUseAi: user.canUseAi }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
