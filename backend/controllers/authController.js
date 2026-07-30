import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../models/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Bu e-posta adresiyle zaten kayıtlı bir kullanıcı var.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    password: hashedPassword,
    role: 'user'
  };

  users.push(newUser);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: generateToken(newUser.id)
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } else {
    res.status(401).json({ message: 'Geçersiz e-posta adresi veya şifre.' });
  }
};

export const getUserProfile = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
};
