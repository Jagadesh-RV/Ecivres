import {
  runStagingSeed,
  STAGING_ORGANIZATIONS,
  STAGING_USERS,
  STAGING_ROLES,
  STAGING_CATEGORIES,
} from '../../prisma/seed-staging';

describe('Staging Seed Data and Tenant Verification', () => {
  it('should define isolated enterprise staging tenants with distinct slugs and properties', () => {
    expect(STAGING_ORGANIZATIONS).toBeDefined();
    expect(STAGING_ORGANIZATIONS.length).toBeGreaterThanOrEqual(2);

    const orgSlugs = STAGING_ORGANIZATIONS.map((o) => o.slug);
    const uniqueSlugs = new Set(orgSlugs);
    expect(uniqueSlugs.size).toBe(orgSlugs.length);

    const ids = STAGING_ORGANIZATIONS.map((o) => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const org of STAGING_ORGANIZATIONS) {
      expect(org.status).toBe('ACTIVE');
      expect(org.settings).toHaveProperty('netTermsDays');
      expect(org.settings).toHaveProperty('approvalThresholdUsd');
    }
  });

  it('should define required multi-role users for staging end-to-end testing', () => {
    expect(STAGING_USERS).toBeDefined();
    const emails = STAGING_USERS.map((u) => u.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(emails.length);

    const roles = STAGING_USERS.map((u) => u.role);
    expect(roles).toContain('ADMIN');
    expect(roles).toContain('OWNER');
    expect(roles).toContain('MEMBER');
  });

  it('should define standard staging categories and roles', () => {
    expect(STAGING_ROLES).toContain('ADMIN');
    expect(STAGING_ROLES).toContain('CUSTOMER');
    expect(STAGING_ROLES).toContain('PROVIDER');
    expect(STAGING_CATEGORIES.length).toBeGreaterThanOrEqual(4);
  });

  it('should execute runStagingSeed idempotently against mock Prisma client', async () => {
    const mockPrisma = {
      role: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: `role_${args.create.name}`, ...args.create })),
      },
      enterpriseOrganization: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ ...args.create })),
      },
      user: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: `usr_${args.create.email}`, ...args.create })),
      },
      userRole: {
        upsert: jest.fn().mockResolvedValue({ id: 'ur-1' }),
      },
      organizationMember: {
        upsert: jest.fn().mockResolvedValue({ id: 'mem-1' }),
      },
      category: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ ...args.create })),
      },
    };

    const result = await runStagingSeed(mockPrisma);
    expect(result).toBeDefined();
    expect(result.tenantsCreated).toBe(STAGING_ORGANIZATIONS.length);
    expect(result.usersCreated).toBe(STAGING_USERS.length);
    expect(result.rolesCreated).toBe(STAGING_ROLES.length);
    expect(result.categoriesCreated).toBe(STAGING_CATEGORIES.length);

    expect(mockPrisma.enterpriseOrganization.upsert).toHaveBeenCalledTimes(STAGING_ORGANIZATIONS.length);
    expect(mockPrisma.user.upsert).toHaveBeenCalledTimes(STAGING_USERS.length);
    expect(mockPrisma.category.upsert).toHaveBeenCalledTimes(STAGING_CATEGORIES.length);
  });
});
