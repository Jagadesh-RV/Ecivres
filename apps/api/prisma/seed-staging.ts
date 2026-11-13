import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

export const STAGING_ROLES = ['ADMIN', 'CUSTOMER', 'PROVIDER', 'OWNER', 'MEMBER', 'BILLING'];

export const STAGING_ORGANIZATIONS = [
  {
    id: 'org_alpha_corp',
    name: 'Alpha Corporation',
    slug: 'alpha-corp',
    tier: 'ENTERPRISE',
    status: 'ACTIVE',
    settings: { netTermsDays: 30, approvalThresholdUsd: 5000 },
  },
  {
    id: 'org_beta_industries',
    name: 'Beta Industries',
    slug: 'beta-industries',
    tier: 'BUSINESS',
    status: 'ACTIVE',
    settings: { netTermsDays: 15, approvalThresholdUsd: 2500 },
  },
];

export const STAGING_USERS = [
  { email: 'staging-admin@ecivres.com', role: 'ADMIN' },
  { email: 'alpha-owner@alpha.corp', role: 'OWNER', orgId: 'org_alpha_corp' },
  { email: 'alpha-member@alpha.corp', role: 'MEMBER', orgId: 'org_alpha_corp' },
  { email: 'beta-owner@beta.industries', role: 'OWNER', orgId: 'org_beta_industries' },
  { email: 'beta-member@beta.industries', role: 'MEMBER', orgId: 'org_beta_industries' },
];

export const STAGING_CATEGORIES = [
  'HVAC & Cooling',
  'Electrical Systems',
  'Plumbing & Drainage',
  'Commercial Cleaning',
];

export interface StagingSeedResult {
  tenantsCreated: number;
  usersCreated: number;
  rolesCreated: number;
  categoriesCreated: number;
}

export async function runStagingSeed(customPrisma?: any): Promise<StagingSeedResult> {
  let prisma = customPrisma;
  let localPool: Pool | null = null;

  if (!prisma) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5433/ecivres_staging?schema=public';
    localPool = new Pool({ connectionString });
    const adapter = new PrismaPg(localPool);
    prisma = new PrismaClient({ adapter });
  }

  console.log('[Staging Seed] Initializing staging seed data...');

  const passwordHash = await bcrypt.hash('StagingSecurePasswd2026!', 10);

  // 1. Roles & Core Tenancy Roles
  const roles: Record<string, any> = {};
  for (const name of STAGING_ROLES) {
    roles[name] = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `Staging ${name} role` },
    });
  }

  // 2. Enterprise Tenants
  for (const org of STAGING_ORGANIZATIONS) {
    await prisma.enterpriseOrganization.upsert({
      where: { slug: org.slug },
      update: {},
      create: org,
    });
  }

  // 3. Staging Users
  let usersCount = 0;
  for (const u of STAGING_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: passwordHash,
      },
    });
    usersCount++;

    if (roles[u.role]) {
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
    }

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
  let categoriesCount = 0;
  for (const catName of STAGING_CATEGORIES) {
    const id = `cat_${catName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await prisma.category.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name: catName,
        description: `Staging category for ${catName}`,
      },
    });
    categoriesCount++;
  }

  console.log('[Staging Seed] Completed successfully.');

  if (localPool) {
    await prisma.$disconnect();
    await localPool.end();
  }

  return {
    tenantsCreated: STAGING_ORGANIZATIONS.length,
    usersCreated: usersCount,
    rolesCreated: STAGING_ROLES.length,
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
    });
}
