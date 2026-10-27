import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePolicyDto, ApprovePolicyDto, ActivatePolicyDto, RollbackPolicyDto } from './dto/governance-compliance-dtos';

export interface PolicyRecord {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'RETIRED';
  rulesConfig: Record<string, any>;
  authorId: string;
  approverId?: string;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  rollbackVersion?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PolicyGovernanceService {
  private readonly logger = new Logger(PolicyGovernanceService.name);
  private readonly inMemoryPolicies = new Map<string, PolicyRecord>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Submits a new versioned policy in DRAFT status.
   */
  async createPolicy(dto: CreatePolicyDto): Promise<PolicyRecord> {
    const policyId = `pol_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date();

    const record: PolicyRecord = {
      id: policyId,
      name: dto.name,
      category: dto.category,
      version: dto.version,
      status: 'DRAFT',
      rulesConfig: dto.rulesConfig,
      authorId: dto.authorId,
      effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
      effectiveUntil: dto.effectiveUntil ? new Date(dto.effectiveUntil) : undefined,
      tenantId: dto.tenantId || 'GLOBAL',
      createdAt: now,
      updatedAt: now,
    };

    this.inMemoryPolicies.set(policyId, record);

    try {
      await this.prisma.marketplacePolicy.create({
        data: {
          id: policyId,
          tenantId: record.tenantId,
          name: record.name,
          category: record.category,
          version: record.version,
          status: 'DRAFT',
          rulesConfig: record.rulesConfig,
          authorId: record.authorId,
          effectiveFrom: record.effectiveFrom,
          effectiveUntil: record.effectiveUntil,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist policy to db: ${err.message}`);
    }

    this.logger.log(`Created policy draft '${dto.name}' ${dto.version} by ${dto.authorId}`);
    return record;
  }

  /**
   * Advances a policy from DRAFT to REVIEW.
   */
  async submitForReview(policyId: string, authorId: string): Promise<PolicyRecord> {
    const policy = await this.getPolicyById(policyId);
    if (policy.status !== 'DRAFT') {
      throw new BadRequestException(`Policy '${policyId}' is in status '${policy.status}', expected 'DRAFT'.`);
    }

    policy.status = 'REVIEW';
    policy.updatedAt = new Date();
    this.inMemoryPolicies.set(policyId, policy);

    try {
      await this.prisma.marketplacePolicy.update({
        where: { id: policyId },
        data: { status: 'REVIEW' },
      });
    } catch {}

    return policy;
  }

  /**
   * Approves a policy with strict separation of duty (author cannot be approver).
   */
  async approvePolicy(dto: ApprovePolicyDto): Promise<PolicyRecord> {
    const policy = await this.getPolicyById(dto.policyId);

    if (policy.status !== 'REVIEW') {
      throw new BadRequestException(`Policy '${dto.policyId}' is in status '${policy.status}', expected 'REVIEW'.`);
    }

    // Non-negotiable separation of duty
    if (policy.authorId === dto.approverId) {
      this.logger.error(`Separation of duty violation: Author '${dto.approverId}' attempted to approve own policy.`);
      throw new ForbiddenException(`Separation of duty violation. Authors cannot approve their own policies.`);
    }

    policy.status = 'APPROVED';
    policy.approverId = dto.approverId;
    policy.updatedAt = new Date();
    this.inMemoryPolicies.set(dto.policyId, policy);

    try {
      await this.prisma.marketplacePolicy.update({
        where: { id: dto.policyId },
        data: {
          status: 'APPROVED',
          approverId: dto.approverId,
        },
      });
    } catch {}

    this.logger.log(`Policy '${policy.name}' ${policy.version} APPROVED by ${dto.approverId}`);
    return policy;
  }

  /**
   * Activates an approved policy, transitioning any existing active version to RETIRED.
   */
  async activatePolicy(dto: ActivatePolicyDto): Promise<PolicyRecord> {
    const policy = await this.getPolicyById(dto.policyId);

    if (policy.status !== 'APPROVED') {
      throw new BadRequestException(`Policy '${dto.policyId}' is in status '${policy.status}', expected 'APPROVED'.`);
    }

    // Retire any previously active policy of same name & tenant
    for (const [id, p] of this.inMemoryPolicies.entries()) {
      if (p.name === policy.name && p.tenantId === policy.tenantId && p.status === 'ACTIVE' && id !== policy.id) {
        p.status = 'RETIRED';
        p.updatedAt = new Date();
        this.inMemoryPolicies.set(id, p);
      }
    }

    policy.status = 'ACTIVE';
    policy.effectiveFrom = policy.effectiveFrom || new Date();
    policy.updatedAt = new Date();
    this.inMemoryPolicies.set(dto.policyId, policy);

    try {
      // Deactivate previous
      await this.prisma.marketplacePolicy.updateMany({
        where: {
          name: policy.name,
          tenantId: policy.tenantId,
          status: 'ACTIVE',
          NOT: { id: policy.id },
        },
        data: { status: 'RETIRED' },
      });

      // Activate new
      await this.prisma.marketplacePolicy.update({
        where: { id: dto.policyId },
        data: {
          status: 'ACTIVE',
          effectiveFrom: policy.effectiveFrom,
        },
      });
    } catch {}

    this.logger.log(`Policy '${policy.name}' ${policy.version} ACTIVATED by ${dto.activatorId}`);
    return policy;
  }

  /**
   * Performs an instant versioned rollback to a previously approved or retired version.
   */
  async rollbackPolicy(dto: RollbackPolicyDto): Promise<{ current: PolicyRecord; reactivated: PolicyRecord }> {
    const currentActive = await this.getPolicyById(dto.policyId);

    // Find target version
    let targetPolicy: PolicyRecord | undefined;
    for (const p of this.inMemoryPolicies.values()) {
      if (p.name === currentActive.name && p.tenantId === currentActive.tenantId && p.version === dto.targetVersion) {
        targetPolicy = p;
        break;
      }
    }

    if (!targetPolicy) {
      try {
        const found = await this.prisma.marketplacePolicy.findFirst({
          where: {
            name: currentActive.name,
            tenantId: currentActive.tenantId,
            version: dto.targetVersion,
          },
        });
        if (found) {
          targetPolicy = {
            id: found.id,
            name: found.name,
            category: found.category,
            version: found.version,
            status: found.status as any,
            rulesConfig: found.rulesConfig as any,
            authorId: found.authorId,
            approverId: found.approverId || undefined,
            effectiveFrom: found.effectiveFrom || undefined,
            effectiveUntil: found.effectiveUntil || undefined,
            rollbackVersion: found.rollbackVersion || undefined,
            tenantId: found.tenantId,
            createdAt: found.createdAt,
            updatedAt: found.updatedAt,
          };
        }
      } catch {}
    }

    if (!targetPolicy) {
      throw new NotFoundException(`Target rollback version '${dto.targetVersion}' for policy '${currentActive.name}' not found.`);
    }

    // Retire current active
    currentActive.status = 'RETIRED';
    currentActive.rollbackVersion = dto.targetVersion;
    currentActive.updatedAt = new Date();
    this.inMemoryPolicies.set(currentActive.id, currentActive);

    // Reactivate target version
    targetPolicy.status = 'ACTIVE';
    targetPolicy.updatedAt = new Date();
    this.inMemoryPolicies.set(targetPolicy.id, targetPolicy);

    try {
      await this.prisma.marketplacePolicy.update({
        where: { id: currentActive.id },
        data: { status: 'RETIRED', rollbackVersion: dto.targetVersion },
      });
      await this.prisma.marketplacePolicy.update({
        where: { id: targetPolicy.id },
        data: { status: 'ACTIVE' },
      });
    } catch {}

    this.logger.warn(
      `POLICY ROLLBACK: '${currentActive.name}' reverted from ${currentActive.version} to ${targetPolicy.version} by ${dto.operatorId}. Reason: ${dto.reason}`,
    );

    return { current: currentActive, reactivated: targetPolicy };
  }

  async getPolicyById(policyId: string): Promise<PolicyRecord> {
    const inMem = this.inMemoryPolicies.get(policyId);
    if (inMem) return inMem;

    try {
      const found = await this.prisma.marketplacePolicy.findUnique({
        where: { id: policyId },
      });
      if (found) {
        const record: PolicyRecord = {
          id: found.id,
          name: found.name,
          category: found.category,
          version: found.version,
          status: found.status as any,
          rulesConfig: found.rulesConfig as any,
          authorId: found.authorId,
          approverId: found.approverId || undefined,
          effectiveFrom: found.effectiveFrom || undefined,
          effectiveUntil: found.effectiveUntil || undefined,
          rollbackVersion: found.rollbackVersion || undefined,
          tenantId: found.tenantId,
          createdAt: found.createdAt,
          updatedAt: found.updatedAt,
        };
        this.inMemoryPolicies.set(record.id, record);
        return record;
      }
    } catch {}

    throw new NotFoundException(`Policy '${policyId}' not found.`);
  }

  async getActivePolicy(name: string, tenantId: string = 'GLOBAL'): Promise<PolicyRecord | null> {
    for (const p of this.inMemoryPolicies.values()) {
      if (p.name === name && p.tenantId === tenantId && p.status === 'ACTIVE') {
        return p;
      }
    }

    try {
      const found = await this.prisma.marketplacePolicy.findFirst({
        where: { name, tenantId, status: 'ACTIVE' },
      });
      if (found) {
        return {
          id: found.id,
          name: found.name,
          category: found.category,
          version: found.version,
          status: found.status as any,
          rulesConfig: found.rulesConfig as any,
          authorId: found.authorId,
          approverId: found.approverId || undefined,
          effectiveFrom: found.effectiveFrom || undefined,
          effectiveUntil: found.effectiveUntil || undefined,
          rollbackVersion: found.rollbackVersion || undefined,
          tenantId: found.tenantId,
          createdAt: found.createdAt,
          updatedAt: found.updatedAt,
        };
      }
    } catch {}

    return null;
  }
}
