import { Module } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { RepairEstimateService } from './repair-estimate.service';
import { DirectBillingService } from './direct-billing.service';
import { InsuranceController } from './insurance.controller';

@Module({
  controllers: [InsuranceController],
  providers: [ClaimsService, RepairEstimateService, DirectBillingService],
  exports: [ClaimsService, RepairEstimateService, DirectBillingService],
})
export class InsuranceModule {}
