import { Injectable, Logger } from '@nestjs/common';

export interface WhitelabelTenant {
  id: string;
  partnerName: string;
  customDomain: string;
  tenantRevenueSharePct: number;
  isActive: boolean;
}

@Injectable()
export class WhitelabelTenantService {
  private readonly logger = new Logger(WhitelabelTenantService.name);
  private readonly tenantsMap = new Map<string, WhitelabelTenant>();

  async createTenant(partnerName: string, customDomain: string, tenantRevenueSharePct = 5.0) {
    const tenant: WhitelabelTenant = {
      id: `wt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      partnerName,
      customDomain,
      tenantRevenueSharePct,
      isActive: true,
    };
    this.tenantsMap.set(tenant.id, tenant);
    this.logger.log(`Created whitelabel tenant '${partnerName}' for domain ${customDomain}`);
    return tenant;
  }

  async getTenantByDomain(domain: string): Promise<WhitelabelTenant | null> {
    const tenants = Array.from(this.tenantsMap.values());
    return tenants.find((t) => t.customDomain === domain) || null;
  }
}
