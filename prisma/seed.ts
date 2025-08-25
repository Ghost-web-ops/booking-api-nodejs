// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'AdminPassword123!'; // Use a strong password

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create or update the admin user
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // We don't need to update anything if the user exists
    create: {
      email: adminEmail,
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN', // This is the most important part
    },
  });

  console.log({ adminUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });