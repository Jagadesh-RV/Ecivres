import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PolicyGovernanceService } from './policy-governance.service';
import { ImmutableAuditService } from './immutable-audit.service';
import { EnterpriseOrgService } from './enterprise-org.service';
import { DataPrivacyLifecycleService } from './data-privacy-lifecycle.service';
import { AutonomousGovernanceService } from './autonomous-governance.service';

describe('Phase 20: Governance, Compliance & Enterprise Readiness Master Test Suite', () => {
  let policyService: PolicyGovernanceService;
  let auditService: ImmutableAuditService;
  let enterpriseOrgService: EnterpriseOrgService;
  let privacyService: DataPrivacyLifecycleService;
  let autonomousGovernanceService: AutonomousGovernanceService;

  const mockPrismaService = {
    marketplacePolicy: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    immutableAuditLog: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findMany: jest.fn().mockResolvedValue([]),
    },
    enterpriseOrganization: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    organizationMember: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    dataPrivacyRequest: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    user: {
      findUnique: jest.fn().mockImplementation((args) =>
        Promise.resolve({
          id: args.where.id,
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+15551234567',
        }),
      ),
      update: jest.fn().mockResolvedValue({}),
    },
    booking: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'bkg_1', serviceId: 'srv_1', amount: 150.0, status: 'COMPLETED' },
      ]),
    },
    payment: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'pay_1', amount: 150.0, status: 'PAID', invoiceNumber: 'INV-2026-001' },
      ]),
    },
    review: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'rev_1', rating: 5, comment: 'Excellent enterprise provider!' },
      ]),
    },
    governanceLifecycleRecord: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findFirst: jest.fn().mockResolvedValue(null),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyGovernanceService,
        ImmutableAuditService,
        EnterpriseOrgService,
        DataPrivacyLifecycleService,
        AutonomousGovernanceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    policyService = module.get<PolicyGovernanceService>(PolicyGovernanceService);
    auditService = module.get<ImmutableAuditService>(ImmutableAuditService);
    enterpriseOrgService = module.get<EnterpriseOrgService>(EnterpriseOrgService);
    privacyService = module.get<DataPrivacyLifecycleService>(DataPrivacyLifecycleService);
    autonomousGovernanceService = module.get<AutonomousGovernanceService>(AutonomousGovernanceService);
  });

  describe('1. Centralized Marketplace Policy Governance & Lifecycle', () => {
    it('should create a versioned policy in DRAFT status', async () => {
      const policy = await policyService.createPolicy({
        name: 'Surge Pricing Policy',
        category: 'PRICING',
        version: 'v1.0',
        rulesConfig: { maxSurgeMultiplier: 2.5, minProviderAvailability: 0.2 },
        authorId: 'usr_author_1',
      });

      expect(policy.id).toBeDefined();
      expect(policy.status).toBe('DRAFT');
      expect(policy.version).toBe('v1.0');
      expect(policy.authorId).toBe('usr_author_1');
    });

    it('should advance policy from DRAFT to REVIEW by the author', async () => {
      const policy = await policyService.createPolicy({
        name: 'Cancellation Fee Cap',
        category: 'REFUND',
        version: 'v1.0',
        rulesConfig: { maxCancellationPct: 15 },
        authorId: 'usr_author_1',
      });

      const inReview = await policyService.submitForReview(policy.id, 'usr_author_1');
      expect(inReview.status).toBe('REVIEW');
    });

    it('should enforce separation of duty: prevent policy author from approving own policy', async () => {
      const policy = await policyService.createPolicy({
        name: 'Escrow Release Policy',
        category: 'REFUND',
        version: 'v1.0',
        rulesConfig: { holdHours: 48 },
        authorId: 'usr_author_1',
      });
      await policyService.submitForReview(policy.id, 'usr_author_1');

      await expect(
        policyService.approvePolicy({
          policyId: policy.id,
          approverId: 'usr_author_1', // Same as author!
          justification: 'Self-approving my policy',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow distinct authorized reviewer to approve policy and then activate it', async () => {
      const policy = await policyService.createPolicy({
        name: 'Provider Payout Threshold',
        category: 'SUPPLY',
        version: 'v1.0',
        rulesConfig: { minBalance: 100 },
        authorId: 'usr_author_1',
      });
      await policyService.submitForReview(policy.id, 'usr_author_1');

      const approved = await policyService.approvePolicy({
        policyId: policy.id,
        approverId: 'usr_reviewer_compliance',
        justification: 'Verified against risk framework guidelines.',
      });
      expect(approved.status).toBe('APPROVED');
      expect(approved.approverId).toBe('usr_reviewer_compliance');

      const activated = await policyService.activatePolicy({
        policyId: policy.id,
        activatorId: 'usr_ops_lead',
      });
      expect(activated.status).toBe('ACTIVE');
    });

    it('should support safe versioned rollback to a previously approved policy version', async () => {
      // Create v1.0 and activate
      const v1 = await policyService.createPolicy({
        name: 'Dynamic Commission Policy',
        category: 'PRICING',
        version: 'v1.0',
        rulesConfig: { baseRate: 0.10 },
        authorId: 'usr_author_1',
      });
      await policyService.submitForReview(v1.id, 'usr_author_1');
      await policyService.approvePolicy({
        policyId: v1.id,
        approverId: 'usr_reviewer_2',
        justification: 'Approved baseRate 0.10',
      });
      await policyService.activatePolicy({ policyId: v1.id, activatorId: 'usr_ops_1' });

      // Create v2.0 and activate
      const v2 = await policyService.createPolicy({
        name: 'Dynamic Commission Policy',
        category: 'PRICING',
        version: 'v2.0',
        rulesConfig: { baseRate: 0.15 },
        authorId: 'usr_author_2',
      });
      await policyService.submitForReview(v2.id, 'usr_author_2');
      await policyService.approvePolicy({
        policyId: v2.id,
        approverId: 'usr_reviewer_2',
        justification: 'Approved baseRate 0.15',
      });
      await policyService.activatePolicy({ policyId: v2.id, activatorId: 'usr_ops_1' });

      // Rollback to v1.0
      const rolledBack = await policyService.rollbackPolicy({
        policyId: v2.id,
        targetVersion: 'v1.0',
        operatorId: 'usr_ops_1',
        reason: 'Unforeseen conversion drop on v2.0 commission structure',
      });

      expect(rolledBack.reactivated.status).toBe('ACTIVE');
      expect(rolledBack.reactivated.version).toBe('v1.0');
      expect(rolledBack.current.status).toBe('RETIRED');
      expect(rolledBack.current.rollbackVersion).toBe('v1.0');
    });
  });

  describe('2. Immutable-Style Tamper-Evident Audit Trail', () => {
    it('should cryptographically hash-chain audit log entries using SHA-256', async () => {
      const entry1 = await auditService.recordAuditEvent({
        tenantId: 'tenant_corp_1',
        actorId: 'usr_admin_1',
        actorRole: 'SUPER_ADMIN',
        action: 'POLICY_ACTIVATE',
        targetResource: 'MarketplacePolicy',
        targetId: 'pol_101',
        metadata: { version: 'v1.0' },
        correlationId: 'req_1001',
      });

      const entry2 = await auditService.recordAuditEvent({
        tenantId: 'tenant_corp_1',
        actorId: 'usr_admin_2',
        actorRole: 'COMPLIANCE_OFFICER',
        action: 'PRIVACY_EXPORT',
        targetResource: 'UserData',
        targetId: 'usr_customer_55',
        metadata: { format: 'JSON' },
        correlationId: 'req_1002',
      });

      expect(entry1.entryHash).toHaveLength(64);
      expect(entry2.previousHash).toBe(entry1.entryHash);
      expect(entry2.entryHash).toHaveLength(64);
    });

    it('should sanitize and redact passwords, tokens, API keys, and credit cards from metadata', async () => {
      const entry = await auditService.recordAuditEvent({
        tenantId: 'tenant_corp_1',
        actorId: 'usr_admin_1',
        actorRole: 'ADMIN',
        action: 'CREDENTIAL_UPDATE',
        targetResource: 'IntegrationConfig',
        targetId: 'cfg_stripe',
        metadata: {
          clientId: 'client_ecivres_1',
          password: 'SuperSecretPassword!123',
          apiKey: 'sk_live_abcdef1234567890',
          creditCard: '4111222233334444',
          cvv: '123',
          publicSetting: 'enabled',
        },
        correlationId: 'req_1003',
      });

      expect(entry.metadata.password).toBe('[REDACTED]');
      expect(entry.metadata.apiKey).toBe('[REDACTED]');
      expect(entry.metadata.creditCard).toBe('[REDACTED]');
      expect(entry.metadata.cvv).toBe('[REDACTED]');
      expect(entry.metadata.publicSetting).toBe('enabled');
    });

    it('should verify chain integrity and detect tampering if entry content or hash is modified', async () => {
      await auditService.recordAuditEvent({
        tenantId: 'tenant_corp_1',
        actorId: 'usr_admin_1',
        actorRole: 'ADMIN',
        action: 'SETTING_CHANGE',
        targetResource: 'FeeSchedule',
        targetId: 'fee_global',
        metadata: { fee: 0.05 },
        correlationId: 'req_2001',
      });

      const entry2 = await auditService.recordAuditEvent({
        tenantId: 'tenant_corp_1',
        actorId: 'usr_admin_2',
        actorRole: 'ADMIN',
        action: 'USER_ROLE_ASSIGN',
        targetResource: 'UserRole',
        targetId: 'usr_99',
        metadata: { role: 'MODERATOR' },
        correlationId: 'req_2002',
      });

      // Valid check
      const validCheck = await auditService.verifyChainIntegrity();
      expect(validCheck.isChainValid).toBe(true);

      // Simulate malicious tampering with payload in entry2
      entry2.action = 'UNAUTHORIZED_SUPER_ADMIN_GRANT';

      // Re-verify integrity
      const tamperedCheck = await auditService.verifyChainIntegrity();
      expect(tamperedCheck.isChainValid).toBe(false);
      expect(tamperedCheck.corruptedEntryId).toBe(entry2.id);
      expect(tamperedCheck.details).toContain('Hash mismatch');
    });
  });

  describe('3. Enterprise Organization Administration & Tenancy', () => {
    it('should register an enterprise organization with creator as OWNER', async () => {
      const org = await enterpriseOrgService.createOrganization(
        {
          name: 'Acme Facilities Corp',
          slug: 'acme-facilities',
          tier: 'ENTERPRISE',
          settings: { allowSubcontractors: true, maxMonthlySpend: 500000 },
        },
        'usr_enterprise_founder',
      );

      expect(org.id).toBeDefined();
      expect(org.slug).toBe('acme-facilities');
      expect(org.tier).toBe('ENTERPRISE');

      const members = await enterpriseOrgService.getOrganizationMembers(org.id);
      expect(members.length).toBe(1);
      expect(members[0].userId).toBe('usr_enterprise_founder');
      expect(members[0].role).toBe('OWNER');
    });

    it('should prevent duplicate organization slugs', async () => {
      await enterpriseOrgService.createOrganization(
        { name: 'Beta Logistics', slug: 'beta-logistics' },
        'usr_founder_beta',
      );

      await expect(
        enterpriseOrgService.createOrganization(
          { name: 'Beta Logistics Duplicate', slug: 'beta-logistics' },
          'usr_other_user',
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow OWNER to add members with scoped roles', async () => {
      const org = await enterpriseOrgService.createOrganization(
        { name: 'Gamma Enterprises', slug: 'gamma-enterprises' },
        'usr_gamma_owner',
      );

      const newMember = await enterpriseOrgService.addMember(
        {
          orgId: org.id,
          userId: 'usr_gamma_admin',
          role: 'ADMIN',
          permissions: ['manage_bookings', 'view_reports'],
        },
        'usr_gamma_owner',
      );

      expect(newMember.role).toBe('ADMIN');
      expect(newMember.permissions).toContain('manage_bookings');
    });

    it('should prevent regular MEMBER from inviting other members', async () => {
      const org = await enterpriseOrgService.createOrganization(
        { name: 'Delta Dynamics', slug: 'delta-dynamics' },
        'usr_delta_owner',
      );

      // Add regular MEMBER
      await enterpriseOrgService.addMember(
        {
          orgId: org.id,
          userId: 'usr_delta_member',
          role: 'MEMBER',
          permissions: ['view_catalog'],
        },
        'usr_delta_owner',
      );

      // Regular member attempts to invite another user
      await expect(
        enterpriseOrgService.addMember(
          {
            orgId: org.id,
            userId: 'usr_delta_guest',
            role: 'MEMBER',
            permissions: [],
          },
          'usr_delta_member', // Non-admin caller!
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should enforce cross-tenant isolation and deny access across different organizations', async () => {
      const orgA = await enterpriseOrgService.createOrganization(
        { name: 'Org Alpha', slug: 'org-alpha' },
        'usr_alpha_user',
      );

      const orgB = await enterpriseOrgService.createOrganization(
        { name: 'Org Beta', slug: 'org-beta' },
        'usr_beta_user',
      );

      // User from Org A should succeed for Org A
      const accessA = await enterpriseOrgService.verifyTenantAccess(orgA.id, 'usr_alpha_user');
      expect(accessA.role).toBe('OWNER');

      // User from Org A should be rejected when accessing Org B
      await expect(
        enterpriseOrgService.verifyTenantAccess(orgB.id, 'usr_alpha_user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('4. Data Lifecycle & Privacy Controls (DSAR)', () => {
    it('should submit a data portability export request in PENDING status', async () => {
      const req = await privacyService.submitPrivacyRequest({
        userId: 'usr_dsar_1',
        requestType: 'DATA_EXPORT',
        metadata: { reason: 'User GDPR Request' },
      });

      expect(req.id).toBeDefined();
      expect(req.status).toBe('PENDING');
      expect(req.requestType).toBe('DATA_EXPORT');
    });

    it('should generate a comprehensive structured user data export bundle', async () => {
      const bundle = await privacyService.generateUserDataBundle('usr_dsar_1');

      expect(bundle.userId).toBe('usr_dsar_1');
      expect(bundle.profile).toBeDefined();
      expect(bundle.bookings.length).toBeGreaterThan(0);
      expect(bundle.payments.length).toBeGreaterThan(0);
      expect(bundle.reviews.length).toBeGreaterThan(0);
      expect(bundle.exportedAt).toBeDefined();
    });

    it('should process account deletion with pseudonymization while upholding 7-year legal/financial retention exception', async () => {
      const req = await privacyService.submitPrivacyRequest({
        userId: 'usr_customer_delete',
        requestType: 'ACCOUNT_DELETION',
      });

      const processed = await privacyService.processPrivacyRequest({
        requestId: req.id,
        decision: 'APPROVED',
        processedBy: 'compliance_officer_1',
      });

      expect(processed.status).toBe('COMPLETED');
      expect(processed.exemptionReason).toContain('7-year statutory financial retention exemption');
    });
  });

  describe('5. Autonomous Decision Governance & Operator Oversight', () => {
    it('should record an operator approval for an autonomous action proposal', async () => {
      const decision = await autonomousGovernanceService.governDecision({
        decisionId: 'dec_auto_scale_55',
        action: 'APPROVED',
        operatorId: 'ops_specialist_jane',
        justification: 'Confirmed high weekend traffic demand justifies auto-scaling compute by 50%.',
      });

      expect(decision.decisionId).toBe('dec_auto_scale_55');
      expect(decision.governanceStatus).toBe('APPROVED');
      expect(decision.operatorId).toBe('ops_specialist_jane');

      const fetched = await autonomousGovernanceService.getDecisionGovernance('dec_auto_scale_55');
      expect(fetched.governanceStatus).toBe('APPROVED');
    });

    it('should allow operator to override autonomous parameters with full attribution', async () => {
      const override = await autonomousGovernanceService.governDecision({
        decisionId: 'dec_pricing_surge_99',
        action: 'OVERRIDDEN',
        operatorId: 'pricing_lead_mark',
        justification: 'Capping maximum surge factor to 1.8x instead of proposed 2.5x to preserve brand reputation.',
        overrideParameters: { maxMultiplier: 1.8 },
      });

      expect(override.governanceStatus).toBe('OVERRIDDEN');
      expect(override.overrideParameters).toEqual({ maxMultiplier: 1.8 });
      expect(override.justification).toContain('Capping maximum surge');
    });

    it('should allow operator to reject an autonomous action', async () => {
      const rejection = await autonomousGovernanceService.governDecision({
        decisionId: 'dec_circuit_trip_12',
        action: 'REJECTED',
        operatorId: 'sre_lead_alex',
        justification: 'Circuit trip rejected; downstream provider restored service 2 minutes ago.',
      });

      expect(rejection.governanceStatus).toBe('REJECTED');
      expect(rejection.operatorId).toBe('sre_lead_alex');
    });
  });
});
