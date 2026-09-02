import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrator' },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'Customer' },
  });

  const providerRole = await prisma.role.upsert({
    where: { name: 'PROVIDER' },
    update: {},
    create: { name: 'PROVIDER', description: 'Service Provider' },
  });

  // Create Permissions
  const manageCategoriesPermission = await prisma.permission.upsert({
    where: { name: 'manage:categories' },
    update: {},
    create: {
      name: 'manage:categories',
      description: 'Manage service categories (create and delete)',
    },
  });

  const manageServicesPermission = await prisma.permission.upsert({
    where: { name: 'manage:services' },
    update: {},
    create: {
      name: 'manage:services',
      description: 'Manage service listings (create, update, delete)',
    },
  });

  const customerDashboardPermission = await prisma.permission.upsert({
    where: { name: 'read:customer-dashboard' },
    update: {},
    create: {
      name: 'read:customer-dashboard',
      description: 'Access customer analytics and dashboard',
    },
  });

  const createBookingPermission = await prisma.permission.upsert({
    where: { name: 'create:customer-booking' },
    update: {},
    create: {
      name: 'create:customer-booking',
      description: 'Create new service bookings',
    },
  });

  const cancelBookingPermission = await prisma.permission.upsert({
    where: { name: 'cancel:customer-booking' },
    update: {},
    create: {
      name: 'cancel:customer-booking',
      description: 'Cancel customer bookings',
    },
  });

  // Link Permissions to Roles
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageCategoriesPermission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageCategoriesPermission.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: providerRole.id,
        permissionId: manageServicesPermission.id,
      },
    },
    update: {},
    create: {
      roleId: providerRole.id,
      permissionId: manageServicesPermission.id,
    },
  });

  const customerPermissions = [
    customerDashboardPermission,
    createBookingPermission,
    cancelBookingPermission,
  ];

  for (const perm of customerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: customerRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: customerRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Create an Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ecivres.local' },
    update: {},
    create: {
      email: 'admin@ecivres.local',
      password: adminPassword,
      userRoles: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
