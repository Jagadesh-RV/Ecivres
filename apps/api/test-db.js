const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5433/ecivres?schema=public' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    const role = await prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
    if (!role) {
      console.log('Role not found!');
      return;
    }
    console.log('Role:', role);

    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found!');
      return;
    }
    
    // delete profile if exists
    await prisma.customerProfile.deleteMany({ where: { userId: user.id } });

    console.log('Trying transaction...');
    await prisma.$transaction(async (tx) => {
      console.log('Creating profile for', user.id);
      const profile = await tx.customerProfile.create({
        data: {
          userId: user.id,
          firstName: 'Test',
          lastName: 'User',
          phone: '123456'
        },
      });
      console.log('Profile created');

      console.log('Upserting userRole');
      await tx.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        create: {
          userId: user.id,
          roleId: role.id,
        },
        update: {},
      });
      console.log('Upsert successful');
    });
    
  } catch (err) {
    console.error('Error in script:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
