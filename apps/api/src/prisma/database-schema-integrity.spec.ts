import * as fs from 'fs';
import * as path from 'path';

describe('Phase 28: Database Schema Integrity & Migration DDL Verification', () => {
  const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
  const migrationPath = path.resolve(__dirname, '../../prisma/migrations/20261112000000_init/migration.sql');

  let schemaContent: string;
  let migrationContent: string;

  beforeAll(() => {
    expect(fs.existsSync(schemaPath)).toBe(true);
    expect(fs.existsSync(migrationPath)).toBe(true);

    schemaContent = fs.readFileSync(schemaPath, 'utf8');
    migrationContent = fs.readFileSync(migrationPath, 'utf8');
  });

  describe('1. Core Domain Models Presence', () => {
    const requiredModels = [
      'User',
      'Role',
      'Permission',
      'RolePermission',
      'UserRole',
      'CustomerProfile',
      'ProviderProfile',
      'Category',
      'Service',
      'Booking',
      'Payment',
      'Review',
      'EnterpriseOrganization',
      'OrganizationMember',
      'ImmutableAuditLog',
      'MarketplacePolicy',
      'ServiceLevelObjectiveRecord',
      'SelfHealingExecutionAudit',
    ];

    it.each(requiredModels)('schema.prisma contains model %s', (modelName) => {
      const modelRegex = new RegExp(`model\\s+${modelName}\\s+\\{`, 'm');
      expect(schemaContent).toMatch(modelRegex);
    });

    it.each(requiredModels)('migration.sql contains CREATE TABLE for %s', (modelName) => {
      const tableRegex = new RegExp(`CREATE TABLE "${modelName}"`, 'm');
      expect(migrationContent).toMatch(tableRegex);
    });
  });

  describe('2. Foreign Key Cascade & Restriction Policies', () => {
    it('enforces CASCADE deletion on CustomerProfile when User is deleted', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY \("userId"\) REFERENCES "User"\("id"\) ON DELETE CASCADE/m,
      );
    });

    it('enforces CASCADE deletion on ProviderProfile when User is deleted', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY \("userId"\) REFERENCES "User"\("id"\) ON DELETE CASCADE/m,
      );
    });

    it('enforces RESTRICT deletion on Booking to preserve customer audit history', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY \("customerId"\) REFERENCES "User"\("id"\) ON DELETE RESTRICT/m,
      );
    });

    it('enforces RESTRICT deletion on Payment to uphold financial audit compliance', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY \("bookingId"\) REFERENCES "Booking"\("id"\) ON DELETE RESTRICT/m,
      );
    });

    it('enforces CASCADE deletion on OrganizationMember when EnterpriseOrganization is removed', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_orgId_fkey" FOREIGN KEY \("orgId"\) REFERENCES "EnterpriseOrganization"\("id"\) ON DELETE CASCADE/m,
      );
    });
  });

  describe('3. Indexing & Multi-Tenant Performance Optimization', () => {
    it('creates index on SelfHealingExecutionAudit(actionType) for fast audit queries', () => {
      expect(migrationContent).toMatch(/CREATE INDEX "SelfHealingExecutionAudit_actionType_idx" ON "SelfHealingExecutionAudit"\("actionType"\)/m);
    });

    it('enforces UNIQUE index on ServiceLevelObjectiveRecord(workflowName)', () => {
      expect(migrationContent).toMatch(/CREATE UNIQUE INDEX "ServiceLevelObjectiveRecord_workflowName_key" ON "ServiceLevelObjectiveRecord"\("workflowName"\)/m);
    });

    it('enforces UNIQUE index on User(email)', () => {
      expect(migrationContent).toMatch(/CREATE UNIQUE INDEX "User_email_key" ON "User"\("email"\)/m);
    });

    it('enforces UNIQUE index on EnterpriseOrganization(slug)', () => {
      expect(migrationContent).toMatch(/CREATE UNIQUE INDEX "EnterpriseOrganization_slug_key" ON "EnterpriseOrganization"\("slug"\)/m);
    });

    it('enforces UNIQUE index on SelfHealingExecutionAudit(executionId)', () => {
      expect(migrationContent).toMatch(/CREATE UNIQUE INDEX "SelfHealingExecutionAudit_executionId_key" ON "SelfHealingExecutionAudit"\("executionId"\)/m);
    });
  });
});
