import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegionalCustomerExperienceService } from './services/regional-customer-experience.service';

@ApiTags('customer-experience-global')
@Controller('customer-experience-global')
export class CustomerExperienceGlobalController {
  constructor(private readonly customerExperience: RegionalCustomerExperienceService) {}

  @Get('promotions/:countryCode')
  @ApiOperation({ summary: 'Get active regional promotional offers for country' })
  async getPromotions(@Param('countryCode') countryCode: string) {
    return this.customerExperience.getRegionalPromotions(countryCode);
  }

  @Get('localized-price')
  @ApiOperation({ summary: 'Get converted localized price for country' })
  async getLocalizedPrice(@Query('baseAmountUsd') baseAmountUsd: number, @Query('countryCode') countryCode: string) {
    return this.customerExperience.getLocalizedPricing(Number(baseAmountUsd), countryCode);
  }
}
