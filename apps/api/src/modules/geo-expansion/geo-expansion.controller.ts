import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GeographicExpansionService } from './services/geographic-expansion.service';
import { LocalizationConfigService } from './services/localization-config.service';
import { CrossBorderMarketplaceService } from './services/cross-border-marketplace.service';

@ApiTags('geo-expansion')
@Controller('geo-expansion')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GeoExpansionController {
  constructor(
    private readonly geoService: GeographicExpansionService,
    private readonly locService: LocalizationConfigService,
    private readonly crossBorderService: CrossBorderMarketplaceService,
  ) {}

  @Get('zones')
  @ApiOperation({ summary: 'List active geographic expansion zones' })
  async getZones() {
    return this.geoService.getActiveZones();
  }

  @Get('lookup-postal')
  @ApiOperation({ summary: 'Find regional zone by postal code' })
  async lookupPostal(@Query('postalCode') postalCode: string) {
    return this.geoService.getZoneByPostalCode(postalCode || '10001');
  }

  @Get('localization-config')
  @ApiOperation({ summary: 'Get regional tax, currency, and language settings' })
  async getLocalization(@Query('countryCode') countryCode: string) {
    return this.locService.getRegionalConfig(countryCode || 'US');
  }

  @Get('cross-border-fx')
  @ApiOperation({ summary: 'Calculate FX conversion and cross-border settlement fee' })
  async calculateFx(
    @Query('amount') amount?: string,
    @Query('sourceCurrency') sourceCurrency?: string,
    @Query('targetCurrency') targetCurrency?: string,
  ) {
    return this.crossBorderService.calculateCrossBorderSettlement(
      Number(amount || 100),
      sourceCurrency || 'USD',
      targetCurrency || 'EUR',
    );
  }
}
