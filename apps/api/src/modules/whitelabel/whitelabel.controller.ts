import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { WhitelabelTenantService } from './services/whitelabel-tenant.service';
import { BrandThemeConfigService } from './services/brand-theme-config.service';
import { RevenueShareCalculatorService } from './services/revenue-share-calculator.service';

@ApiTags('whitelabel')
@Controller('whitelabel')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WhitelabelController {
  constructor(
    private readonly tenantService: WhitelabelTenantService,
    private readonly themeService: BrandThemeConfigService,
    private readonly revenueShareService: RevenueShareCalculatorService,
  ) {}

  @Post('tenant')
  @ApiOperation({ summary: 'Register whitelabel tenant partner' })
  async createTenant(@Body() body: { partnerName: string; customDomain: string; tenantRevenueSharePct?: number }) {
    return this.tenantService.createTenant(body.partnerName, body.customDomain, body.tenantRevenueSharePct);
  }

  @Get('lookup-domain')
  @ApiOperation({ summary: 'Find whitelabel tenant by custom domain' })
  async lookupDomain(@Query('domain') domain: string) {
    return this.tenantService.getTenantByDomain(domain);
  }

  @Post('theme')
  @ApiOperation({ summary: 'Configure brand theme for whitelabel tenant' })
  async setTheme(@Body() body: { tenantId: string; logoUrl: string; primaryColorHex: string; secondaryColorHex: string }) {
    return this.themeService.setTheme(body.tenantId, body);
  }

  @Get('theme')
  @ApiOperation({ summary: 'Get brand theme for tenant' })
  async getTheme(@Query('tenantId') tenantId: string) {
    return this.themeService.getTheme(tenantId);
  }

  @Get('revenue-share')
  @ApiOperation({ summary: 'Calculate whitelabel partner revenue share payout' })
  async getRevenueShare(@Query('gmv') gmv?: string, @Query('commission') commission?: string, @Query('tenantShare') tenantShare?: string) {
    return this.revenueShareService.calculateTenantRevenueShare(
      Number(gmv || 10000),
      Number(commission || 15),
      Number(tenantShare || 10),
    );
  }
}
