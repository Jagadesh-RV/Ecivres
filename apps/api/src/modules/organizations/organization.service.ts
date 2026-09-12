import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface EnterpriseOrganization {
  id: string;
  name: string;
  taxId: string;
  domain: string;
  branches: { id: string; name: string; address: string }[];
  departments: { id: string; name: string; budgetLimit: number }[];
  members: { userId: string; role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'; departmentId?: string }[];
  monthlyBudgetCap: number;
}

@Injectable()
export class OrganizationService {
  private orgStore: Map<string, EnterpriseOrganization> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(
    dto: { name: string; taxId: string; domain: string; ownerUserId: string; monthlyBudgetCap?: number },
  ): Promise<EnterpriseOrganization> {
    const org: EnterpriseOrganization = {
      id: `org_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: dto.name,
      taxId: dto.taxId,
      domain: dto.domain,
      branches: [{ id: 'br_main', name: 'Headquarters', address: '100 Enterprise Way' }],
      departments: [
        { id: 'dept_fac', name: 'Facilities & Maintenance', budgetLimit: 5000 },
        { id: 'dept_hr', name: 'Human Resources', budgetLimit: 2000 },
      ],
      members: [{ userId: dto.ownerUserId, role: 'ADMIN' }],
      monthlyBudgetCap: dto.monthlyBudgetCap || 15000,
    };

    this.orgStore.set(org.id, org);
    return org;
  }

  async addBranch(orgId: string, name: string, address: string): Promise<EnterpriseOrganization> {
    const org = this.orgStore.get(orgId);
    if (!org) throw new NotFoundException(`Organization ${orgId} not found`);

    org.branches.push({
      id: `br_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      address,
    });
    return org;
  }

  async inviteEmployee(orgId: string, email: string, role: 'MANAGER' | 'EMPLOYEE', departmentId?: string): Promise<{ invited: boolean; inviteCode: string }> {
    const org = this.orgStore.get(orgId);
    if (!org) throw new NotFoundException(`Organization ${orgId} not found`);

    return {
      invited: true,
      inviteCode: `ORG-INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
  }

  async getOrganization(orgId: string): Promise<EnterpriseOrganization> {
    const org = this.orgStore.get(orgId);
    if (!org) throw new NotFoundException(`Organization ${orgId} not found`);
    return org;
  }
}
