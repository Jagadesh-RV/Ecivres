import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ExpansionAnalyticsService } from './services/expansion-analytics.service';

@ApiTags('expansion-console')
@Controller('expansion-console')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExpansionConsoleController {
  constructor(private readonly expansionAnalytics: ExpansionAnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get global expansion analytics overview dashboard (Admin)' })
  async getOverview() {
    return this.expansionAnalytics.getGlobalExpansionOverview();
  }

  @Get('compliance/:countryCode')
  @ApiOperation({ summary: 'Get country compliance health audit report (Admin)' })
  async getCompliance(@Param('countryCode') countryCode: string) {
    return this.expansionAnalytics.getComplianceHealthReport(countryCode);
  }
}
