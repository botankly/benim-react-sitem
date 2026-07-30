import bcrypt from 'bcryptjs';

const adminPassword = bcrypt.hashSync('admin123', 10);
const userPassword = bcrypt.hashSync('user123', 10);

export const users = [
  {
    id: '1',
    name: 'Botan Admin',
    email: 'admin@botankulay.com',
    password: adminPassword,
    role: 'admin'
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@test.com',
    password: userPassword,
    role: 'user'
  }
];
export const products = [
  { id: '1', name: 'Ergonomik Kablosuz Mouse', category: 'Teknoloji', price: 850, stock: 15, rating: 4.8 },
  { id: '2', name: 'Termos 1L', category: 'Ev/Yaşam', price: 620, stock: 45, rating: 4.5 },
  { id: '3', name: 'Katlanabilir Kamp Sandalyesi', category: 'Spor', price: 480, stock: 8, rating: 4.6 }
];
export const orders = [];
export const reviews = [];
