import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IntegrationRegistryService } from './services/integration-registry.service';
import { WebhookIngestionService } from './services/webhook-ingestion.service';
import { WebhookReconciliationService } from './services/webhook-reconciliation.service';
import { RegionalMarketService } from './services/regional-market.service';
import { RegionalTaxService } from './services/regional-tax.service';
import { CurrencyConversionService } from './services/currency-conversion.service';
import { CurrencyMathService } from './services/currency-math.service';
import { EcosystemIntelligenceService } from './services/ecosystem-intelligence.service';
import { PartnerApiService } from './services/partner-api.service';
import { InboundWebhookDto } from './dto/webhook.dto';
import { CreateMarketplaceRegionDto, CalculateRegionalTaxDto } from './dto/regional.dto';
import { RecordIntelligenceSignalDto } from './dto/intelligence.dto';
import { CreatePartnerApiKeyDto, RotatePartnerApiKeyDto, RevokePartnerApiKeyDto } from './dto/partner.dto';

@ApiTags('Autonomous Marketplace Ecosystem & Interoperability (Phase 21)')
@Controller('api/v1/ecosystem')
export class EcosystemController {
  constructor(
    private readonly integrationRegistry: IntegrationRegistryService,
    private readonly webhookIngestion: WebhookIngestionService,
    private readonly webhookReconciliation: WebhookReconciliationService,
    private readonly regionalMarket: RegionalMarketService,
    private readonly regionalTax: RegionalTaxService,
    private readonly currencyConversion: CurrencyConversionService,
    private readonly currencyMath: CurrencyMathService,
    private readonly intelligence: EcosystemIntelligenceService,
    private readonly partnerApi: PartnerApiService,
  ) {}

  // 1. Integrations
  @Get('integrations/health')
  @ApiOperation({ summary: 'Health check across all external integration adapters' })
  async checkIntegrationsHealth() {
    return this.integrationRegistry.checkAllHealth();
  }

  // 2. Webhooks
  @Post('webhooks/:provider')
  @ApiOperation({ summary: 'Inbound authenticated webhook ingestion' })
  async ingestWebhook(
    @Param('provider') provider: string,
    @Body() payload: Record<string, any>,
    @Headers('x-signature') signature: string,
    @Headers('x-timestamp') timestampStr: string,
    @Headers('x-event-id') externalEventId: string,
  ) {
    const timestamp = timestampStr ? parseInt(timestampStr, 10) : Math.floor(Date.now() / 1000);
    const dto: InboundWebhookDto = {
      provider,
      externalEventId: externalEventId || `evt_${Date.now()}`,
      signature: signature || '',
      timestamp,
      payload,
    };
    return this.webhookIngestion.ingestWebhook(dto, 'whsec_platform_shared_secret');
  }

  @Post('webhooks/reconcile')
  @ApiOperation({ summary: 'Reconcile pending/failed webhooks against authoritative provider state' })
  async reconcileWebhooks(@Query('provider') provider?: string, @Query('limit') limit?: number) {
    return this.webhookReconciliation.reconcilePendingEvents(provider, limit ? Number(limit) : 50);
  }

  // 3. Regions & Currency
  @Get('regions')
  @ApiOperation({ summary: 'List all active marketplace regions' })
  async listRegions() {
    return this.regionalMarket.listActiveRegions();
  }

  @Get('regions/:code')
  @ApiOperation({ summary: 'Retrieve region configuration by country code' })
  async getRegion(@Param('code') code: string) {
    return this.regionalMarket.getRegion(code);
  }

  @Post('regions')
  @ApiOperation({ summary: 'Register a new marketplace region' })
  async registerRegion(@Body() dto: CreateMarketplaceRegionDto) {
    return this.regionalMarket.registerRegion(dto);
  }

  @Post('tax/calculate')
  @ApiOperation({ summary: 'Calculate statutory tax/VAT/GST for an order in a region' })
  async calculateTax(@Body() dto: CalculateRegionalTaxDto) {
    return this.regionalTax.calculateTax(dto);
  }

  @Post('currency/convert')
  @ApiOperation({ summary: 'Convert money between currencies safely' })
  async convertCurrency(
    @Body('minorUnits') minorUnits: number,
    @Body('fromCurrency') fromCurrency: string,
    @Body('toCurrency') toCurrency: string,
  ) {
    return this.currencyConversion.convert({ minorUnits, currency: fromCurrency }, toCurrency);
  }

  // 4. Intelligence
  @Post('intelligence/signals')
  @ApiOperation({ summary: 'Record marketplace intelligence signal' })
  async recordSignal(@Body() dto: RecordIntelligenceSignalDto) {
    const id = await this.intelligence.recordSignal(dto);
    return { signalId: id, status: 'RECORDED' };
  }

  // 5. Partners
  @Post('partners/keys')
  @ApiOperation({ summary: 'Generate a new scoped Partner API key' })
  async createPartnerKey(@Body() dto: CreatePartnerApiKeyDto) {
    return this.partnerApi.createApiKey(dto);
  }

  @Post('partners/keys/rotate')
  @ApiOperation({ summary: 'Rotate existing Partner API key' })
  async rotatePartnerKey(@Body() dto: RotatePartnerApiKeyDto) {
    return this.partnerApi.rotateApiKey(dto);
  }

  @Post('partners/keys/revoke')
  @ApiOperation({ summary: 'Revoke Partner API key' })
  async revokePartnerKey(@Body() dto: RevokePartnerApiKeyDto) {
    return this.partnerApi.revokeApiKey(dto);
  }
}
