import { Injectable, Logger, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEnterpriseOrgDto, AddOrgMemberDto } from './dto/governance-compliance-dtos';

export interface EnterpriseOrgRecord {
  id: string;
  name: string;
  slug: string;
  tier: 'ENTERPRISE' | 'BUSINESS' | 'PRO';
  status: 'ACTIVE' | 'SUSPENDED';
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgMemberRecord {
  id: string;
  orgId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'BILLING' | 'MEMBER';
  permissions: string[];
  invitedBy?: string;
  createdAt: Date;
}

@Injectable()
export class EnterpriseOrgService {
  private readonly logger = new Logger(EnterpriseOrgService.name);
  private readonly inMemoryOrgs = new Map<string, EnterpriseOrgRecord>();
  private readonly inMemoryMembers = new Map<string, OrgMemberRecord[]>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new Enterprise Organization.
   */
  async createOrganization(dto: CreateEnterpriseOrgDto, creatorUserId: string): Promise<EnterpriseOrgRecord> {
    for (const org of this.inMemoryOrgs.values()) {
      if (org.slug === dto.slug) {
        throw new ConflictException(`Enterprise organization slug '${dto.slug}' already registered.`);
      }
    }

    const orgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date();

    const record: EnterpriseOrgRecord = {
      id: orgId,
      name: dto.name,
      slug: dto.slug,
      tier: dto.tier || 'ENTERPRISE',
      status: 'ACTIVE',
      settings: dto.settings || {},
      createdAt: now,
      updatedAt: now,
    };

    this.inMemoryOrgs.set(orgId, record);

    // Automatically make creator the OWNER
    const ownerMember: OrgMemberRecord = {
      id: `mem_${Date.now()}_owner`,
      orgId,
      userId: creatorUserId,
      role: 'OWNER',
      permissions: ['*'],
      createdAt: now,
    };
    this.inMemoryMembers.set(orgId, [ownerMember]);

    try {
      await this.prisma.enterpriseOrganization.create({
        data: {
          id: orgId,
          name: record.name,
          slug: record.slug,
          tier: record.tier,
          status: record.status,
          settings: record.settings,
        },
      });
      await this.prisma.organizationMember.create({
        data: {
          id: ownerMember.id,
          orgId,
          userId: creatorUserId,
          role: 'OWNER',
          permissions: ownerMember.permissions as any,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist org to db: ${err.message}`);
    }

    this.logger.log(`Created Enterprise Organization '${dto.name}' (${dto.slug}) with Owner ${creatorUserId}`);
    return record;
  }

  /**
   * Adds or invites a member to an enterprise organization with role scoping.
   */
  async addMember(dto: AddOrgMemberDto, executingUserId: string): Promise<OrgMemberRecord> {
    const org = await this.getOrganizationById(dto.orgId);
    if (org.status === 'SUSPENDED') {
      throw new ForbiddenException(`Cannot add members to a SUSPENDED organization.`);
    }

    // Authorization check: executingUser must be OWNER or ADMIN of this org
    const members = this.inMemoryMembers.get(dto.orgId) || [];
    const callerMember = members.find((m) => m.userId === executingUserId);

    if (!callerMember || (callerMember.role !== 'OWNER' && callerMember.role !== 'ADMIN')) {
      throw new ForbiddenException(`Only Organization Owners or Admins can invite new members.`);
    }

    // Check duplicate
    if (members.some((m) => m.userId === dto.userId)) {
      throw new ConflictException(`User '${dto.userId}' is already a member of organization '${dto.orgId}'.`);
    }

    const memberRecord: OrgMemberRecord = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      orgId: dto.orgId,
      userId: dto.userId,
      role: dto.role,
      permissions: dto.permissions || this.getDefaultPermissionsForRole(dto.role),
      invitedBy: executingUserId,
      createdAt: new Date(),
    };

    members.push(memberRecord);
    this.inMemoryMembers.set(dto.orgId, members);

    try {
      await this.prisma.organizationMember.create({
        data: {
          id: memberRecord.id,
          orgId: memberRecord.orgId,
          userId: memberRecord.userId,
          role: memberRecord.role,
          permissions: memberRecord.permissions as any,
          invitedBy: executingUserId,
        },
      });
    } catch {}

    this.logger.log(`Added user ${dto.userId} as ${dto.role} to Org ${dto.orgId}`);
    return memberRecord;
  }

  /**
   * Verifies cross-tenant isolation by checking user membership in target organization.
   */
  async verifyTenantAccess(orgId: string, userId: string): Promise<OrgMemberRecord> {
    const members = this.inMemoryMembers.get(orgId) || [];
    const member = members.find((m) => m.userId === userId);
    if (!member) {
      this.logger.warn(`CROSS-TENANT ISOLATION BREACH ATTEMPT: User ${userId} attempted access to Org ${orgId}`);
      throw new ForbiddenException(`Cross-tenant access denied. You are not a member of organization '${orgId}'.`);
    }
    return member;
  }

  async getOrganizationById(orgId: string): Promise<EnterpriseOrgRecord> {
    const inMem = this.inMemoryOrgs.get(orgId);
    if (inMem) return inMem;

    try {
      const found = await this.prisma.enterpriseOrganization.findUnique({
        where: { id: orgId },
      });
      if (found) {
        const record: EnterpriseOrgRecord = {
          id: found.id,
          name: found.name,
          slug: found.slug,
          tier: found.tier as any,
          status: found.status as any,
          settings: (found.settings as any) || {},
          createdAt: found.createdAt,
          updatedAt: found.updatedAt,
        };
        this.inMemoryOrgs.set(record.id, record);
        return record;
      }
    } catch {}

    throw new NotFoundException(`Enterprise organization '${orgId}' not found.`);
  }

  async getOrganizationMembers(orgId: string): Promise<OrgMemberRecord[]> {
    return this.inMemoryMembers.get(orgId) || [];
  }

  private getDefaultPermissionsForRole(role: string): string[] {
    switch (role) {
      case 'OWNER':
        return ['*'];
      case 'ADMIN':
        return ['org:manage', 'members:invite', 'billing:view', 'policies:manage'];
      case 'BILLING':
        return ['billing:manage', 'invoices:view', 'reports:export'];
      case 'MEMBER':
      default:
        return ['services:view', 'bookings:create'];
    }
  }
}
