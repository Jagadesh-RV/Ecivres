import { Module } from '@nestjs/common';
import { EnterpriseOrganizationService } from './services/enterprise-organization.service';
import { CustomRateCardService } from './services/custom-rate-card.service';
import { PurchaseOrderBillingService } from './services/purchase-order-billing.service';
import { EnterpriseB2bController } from './enterprise-b2b.controller';

@Module({
  controllers: [EnterpriseB2bController],
  providers: [EnterpriseOrganizationService, CustomRateCardService, PurchaseOrderBillingService],
  exports: [EnterpriseOrganizationService, CustomRateCardService, PurchaseOrderBillingService],
})
export class EnterpriseB2bModule {}
