import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { EnterpriseOrganizationService } from './services/enterprise-organization.service';
import { CustomRateCardService } from './services/custom-rate-card.service';
import { PurchaseOrderBillingService } from './services/purchase-order-billing.service';

@ApiTags('enterprise-b2b')
@Controller('enterprise-b2b')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EnterpriseB2bController {
  constructor(
    private readonly orgService: EnterpriseOrganizationService,
    private readonly rateCardService: CustomRateCardService,
    private readonly poBillingService: PurchaseOrderBillingService,
  ) {}

  @Post('org')
  @ApiOperation({ summary: 'Create enterprise organization account' })
  async createOrg(@Body() body: { name: string; parentOrgId?: string; netTermsDays?: number; approvalThresholdUsd?: number }) {
    return this.orgService.createOrganization(body.name, body.parentOrgId, body.netTermsDays, body.approvalThresholdUsd);
  }

  @Post('rate-card')
  @ApiOperation({ summary: 'Set custom negotiated rate card for org category' })
  async setRateCard(@Body() body: { orgId: string; categoryId: string; discountPct: number }) {
    this.rateCardService.setNegotiatedRate(body.orgId, body.categoryId, body.discountPct);
    return { success: true };
  }

  @Get('price-quote')
  @ApiOperation({ summary: 'Calculate enterprise negotiated price quote' })
  async getQuote(@Query('orgId') orgId: string, @Query('categoryId') categoryId: string, @Query('standardPrice') standardPrice: string) {
    return this.rateCardService.calculateNegotiatedPrice(orgId, categoryId, Number(standardPrice || 100));
  }

  @Post('po-invoice')
  @ApiOperation({ summary: 'Create purchase order invoice with net terms billing' })
  async createPoInvoice(@Body() body: { orgId: string; poNumber: string; amountUsd: number }) {
    return this.poBillingService.createPurchaseOrderInvoice(body.orgId, body.poNumber, body.amountUsd);
  }
}
