import { Injectable, Logger } from '@nestjs/common';

export interface EnterpriseOrg {
  id: string;
  name: string;
  parentOrgId?: string;
  netTermsDays: number; // e.g. Net 30, Net 60
  approvalThresholdUsd: number;
  locationsCount: number;
  isActive: boolean;
}

@Injectable()
export class EnterpriseOrganizationService {
  private readonly logger = new Logger(EnterpriseOrganizationService.name);
  private readonly orgsMap = new Map<string, EnterpriseOrg>();

  async createOrganization(name: string, parentOrgId?: string, netTermsDays = 30, approvalThresholdUsd = 1000) {
    const org: EnterpriseOrg = {
      id: `org_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      parentOrgId,
      netTermsDays,
      approvalThresholdUsd,
      locationsCount: 1,
      isActive: true,
    };
    this.orgsMap.set(org.id, org);
    this.logger.log(`Created enterprise organization ${org.name} (${org.id})`);
    return org;
  }

  async getOrgById(orgId: string): Promise<EnterpriseOrg | null> {
    return this.orgsMap.get(orgId) || null;
  }
}
