// seed.js: Seeds initial users into the database – free open-source Node.js/Prisma.
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'staff@example.com';
  const password = 'testpassword';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user exists, update or create
  const user = await prisma.user.upsert({
    where: { email },
    update: {}, // No updates needed if exists
    create: {
      email,
      password: hashedPassword,
      role: 'STAFF',
    },
  });
  console.log('Seeded or updated staff user with ID:', user.id);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());