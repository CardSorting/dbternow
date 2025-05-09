import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedDBT } from './dbt-seed.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Demo User',
      role: 'USER',
    },
  });
  console.log('Created regular user:', user.email);

  // Seed DBT modules, skills, challenges using our specialized seed file
  await seedDBT();
  
  // Create achievements
  const achievements = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first skill',
      icon: '🌱',
      condition: 'Complete any skill',
      pointsReward: 50,
    },
    {
      id: '2',
      name: 'Mindfulness Master',
      description: 'Complete all skills in the Mindfulness module',
      icon: '🧠',
      condition: 'Complete all skills in the Mindfulness module',
      pointsReward: 100,
    },
    {
      id: '3',
      name: 'Challenge Accepted',
      description: 'Complete 5 challenges',
      icon: '🏆',
      condition: 'Complete any 5 challenges across all skills',
      pointsReward: 75,
    },
    {
      id: '4',
      name: 'Perfect Score',
      description: 'Get 100% on a quiz challenge',
      icon: '🎯',
      condition: 'Score 100% on any quiz challenge',
      pointsReward: 50,
    },
    {
      id: '5',
      name: 'Consistent Practice',
      description: 'Login and complete at least one challenge for 5 consecutive days',
      icon: '📅',
      condition: 'Log in and complete at least one challenge each day for 5 days in a row',
      pointsReward: 150,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    });
  }

  console.log('Created achievements');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
