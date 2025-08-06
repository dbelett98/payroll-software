// seed-clients.js: Seeds test clients into PostgreSQL via free open-source Prisma (run once for dashboard testing).
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();  // Free client.

async function main() {
  // Assume test user ID 1 from previous seed (adjust if different; query prisma.user.findFirst({ select: { id: true } }) to get ID if needed – free).
  await prisma.client.createMany({
    data: [
      { name: 'Test Client 1', bankAccount: '123456789', userId: 1 },  // Test client 1 (free data entry).
      { name: 'Test Client 2', bankAccount: '987654321', userId: 1 }  // Test client 2 (free).
    ]
  });
  console.log('Test clients seeded');  // Confirmation.
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());  // Cleanup (free).