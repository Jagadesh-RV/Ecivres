import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RegionalConfigService } from './services/regional-config.service';
import { CountryActivationService } from './services/country-activation.service';

@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(
    private readonly regionalConfig: RegionalConfigService,
    private readonly countryActivation: CountryActivationService,
  ) {}

  @Get('active')
  @ApiOperation({ summary: 'Get all active regional country marketplaces' })
  async getActiveCountries() {
    return this.countryActivation.getActiveCountries();
  }

  @Get('config/:code')
  @ApiOperation({ summary: 'Get regional marketplace configuration by country code' })
  async getConfig(@Param('code') code: string) {
    return this.regionalConfig.getRegionalConfig(code);
  }

  @Post('activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a new country marketplace (Admin)' })
  async activateCountry(@Body() body: { code: string }) {
    return this.countryActivation.activateCountry(body.code);
  }
}
