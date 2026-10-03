import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RevenueShareCalculatorService {
  private readonly logger = new Logger(RevenueShareCalculatorService.name);

  calculateTenantRevenueShare(gmvUsd: number, marketplaceCommissionPct: number, tenantSharePct: number) {
    this.logger.log(`Calculating whitelabel revenue share (GMV: $${gmvUsd}, Marketplace Comm: ${marketplaceCommissionPct}%, Tenant Share: ${tenantSharePct}%)`);

    const grossCommissionUsd = (gmvUsd * marketplaceCommissionPct) / 100;
    const tenantPayoutUsd = (grossCommissionUsd * tenantSharePct) / 100;
    const platformNetRevenueUsd = grossCommissionUsd - tenantPayoutUsd;

    return {
      gmvUsd,
      marketplaceCommissionPct,
      grossCommissionUsd,
      tenantSharePct,
      tenantPayoutUsd: Math.round(tenantPayoutUsd * 100) / 100,
      platformNetRevenueUsd: Math.round(platformNetRevenueUsd * 100) / 100,
    };
  }
}
