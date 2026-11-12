import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5433/ecivres_staging?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export interface StagingSeedResult {
  tenantsCreated: number;
  usersCreated: number;
  rolesCreated: number;
  categoriesCreated: number;
}

export async function runStagingSeed(): Promise<StagingSeedResult> {
  console.log('[Staging Seed] Initializing staging seed data...');

  const passwordHash = await bcrypt.hash('StagingSecurePasswd2026!', 10);

  // 1. Roles & Core Tenancy Roles
  const roleNames = ['ADMIN', 'CUSTOMER', 'PROVIDER', 'OWNER', 'MEMBER', 'BILLING'];
  const roles: Record<string, any> = {};
  for (const name of roleNames) {
    roles[name] = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `Staging ${name} role` },
    });
  }

  // 2. Enterprise Tenants
  const tenantAlpha = await prisma.enterpriseOrganization.upsert({
    where: { slug: 'alpha-corp' },
    update: {},
    create: {
      id: 'org_alpha_corp',
      name: 'Alpha Corporation',
      slug: 'alpha-corp',
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      settings: { netTermsDays: 30, approvalThresholdUsd: 5000 },
    },
  });

  const tenantBeta = await prisma.enterpriseOrganization.upsert({
    where: { slug: 'beta-industries' },
    update: {},
    create: {
      id: 'org_beta_industries',
      name: 'Beta Industries',
      slug: 'beta-industries',
      tier: 'BUSINESS',
      status: 'ACTIVE',
      settings: { netTermsDays: 15, approvalThresholdUsd: 2500 },
    },
  });

  // 3. Staging Users
  const stagingUsers = [
    { email: 'staging-admin@ecivres.com', role: 'ADMIN' },
    { email: 'alpha-owner@alpha.corp', role: 'OWNER', orgId: tenantAlpha.id },
    { email: 'alpha-member@alpha.corp', role: 'MEMBER', orgId: tenantAlpha.id },
    { email: 'beta-owner@beta.industries', role: 'OWNER', orgId: tenantBeta.id },
    { email: 'beta-member@beta.industries', role: 'MEMBER', orgId: tenantBeta.id },
  ];

  let usersCount = 0;
  for (const u of stagingUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: passwordHash,
      },
    });
    usersCount++;

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: roles[u.role].id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: roles[u.role].id,
      },
    });

    if (u.orgId) {
      await prisma.organizationMember.upsert({
        where: { id: `mem_${user.id}_${u.orgId}` },
        update: {},
        create: {
          id: `mem_${user.id}_${u.orgId}`,
          orgId: u.orgId,
          userId: user.id,
          role: u.role,
          permissions: u.role === 'OWNER' ? ['*'] : ['services:view', 'bookings:create'],
        },
      });
    }
  }

  // 4. Staging Categories
  const categories = ['HVAC & Cooling', 'Electrical Systems', 'Plumbing & Drainage', 'Commercial Cleaning'];
  let categoriesCount = 0;
  for (const catName of categories) {
    await prisma.category.upsert({
      where: { id: `cat_${catName.toLowerCase().replace(/[^a-z0-9]/g, '_')}` },
      update: {},
      create: {
        id: `cat_${catName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name: catName,
        description: `Staging category for ${catName}`,
      },
    });
    categoriesCount++;
  }

  console.log('[Staging Seed] Completed successfully.');
  return {
    tenantsCreated: 2,
    usersCreated: usersCount,
    rolesCreated: roleNames.length,
    categoriesCreated: categoriesCount,
  };
}

if (require.main === module) {
  runStagingSeed()
    .then((res) => {
      console.log('Seed result:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
