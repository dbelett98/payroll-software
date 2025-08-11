// seed-clients.js: Seeds test clients for the staff user – free open-source Node.js/Prisma.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Assume user ID 1 from previous seed (adjust if different)
  await prisma.client.createMany({
    data: [
      { name: 'Test Client 1', userId: 1 },
      { name: 'Test Client 2', userId: 1 },
    ],
  });
  console.log('Seeded test clients');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());