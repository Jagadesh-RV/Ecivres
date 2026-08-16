const bcrypt = require('./apps/api/node_modules/bcrypt');
const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@ecivres.com',
      password: hash,
      customerProfile: {
        create: {
          firstName: 'Mobile',
          lastName: 'User'
        }
      }
    }
  });
  console.log('User successfully created with email:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
