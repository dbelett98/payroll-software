// seed.js: Seeds test data into PostgreSQL via free open-source Prisma (run once for dev to fix 401 on invalid credentials).
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');  // Free hashing (already installed).

const prisma = new PrismaClient();  // Free client initialization.

async function main() {
  const hashedPassword = await bcrypt.hash('testpassword', 10);  // Hash for security (free, 10 salt rounds).
  await prisma.user.upsert({  // Upsert to avoid duplicates (free Prisma method).
    where: { email: 'staff@example.com' },  // Check by email.
    update: {},  // No update if exists.
    create: {
      email: 'staff@example.com',
      password: hashedPassword,
      role: 'STAFF'  // Test staff user (add more as needed, e.g., for CLIENT role).
    }
  });
  console.log('Test user seeded');  // Confirmation log.
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());  // Cleanup (free, best practice).