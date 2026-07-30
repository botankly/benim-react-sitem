import bcrypt from 'bcryptjs';
import { users, products } from './models/db.js';

const runSeed = async () => {
  console.log('🌱 Database seeding started...');
  
  // Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const mockUsers = [
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

  users.push(...mockUsers);
  console.log(`✅ Seeded ${users.length} users successfully.`);

  // Seed Products
  console.log(`✅ Seeded ${products.length} products successfully.`);
  console.log('🌲 Seeding completed successfully!');
};

runSeed();
