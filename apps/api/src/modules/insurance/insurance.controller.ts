import { Controller, Post, Body } from '@nestjs/common';
import { CreateClaimDto } from './dto/create-claim.dto';
import { CalculateRepairEstimateDto } from './dto/repair-estimate.dto';
import { ClaimsService } from './claims.service';
import { RepairEstimateService } from './repair-estimate.service';
import { DirectBillingService } from './direct-billing.service';

@Controller('insurance')
export class InsuranceController {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly repairEstimate: RepairEstimateService,
    private readonly directBilling: DirectBillingService,
  ) {}

  @Post('claims')
  fileClaim(@Body() dto: CreateClaimDto) {
    return this.claimsService.fileClaim(dto);
  }

  @Post('repair-estimate')
  calculateEstimate(@Body() dto: CalculateRepairEstimateDto) {
    return this.repairEstimate.calculateEstimate(dto);
  }

  @Post('direct-bill')
  processDirectBill(@Body() body: { claimId: string; insurerCode: string; amount: number }) {
    return this.directBilling.processDirectBilling(body.claimId, body.insurerCode, body.amount);
  }
}
