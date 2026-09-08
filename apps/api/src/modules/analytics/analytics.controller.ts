import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('provider/metrics')
  @ApiOperation({ summary: 'Get provider performance analytics & completion rates' })
  async getProviderMetrics(@CurrentUser() user: any) {
    return this.analyticsService.getProviderPerformanceMetrics(user.id);
  }

  @Get('customer/activity')
  @ApiOperation({ summary: 'Get customer activity metrics' })
  async getCustomerActivity(@CurrentUser() user: any) {
    return this.analyticsService.getCustomerActivityMetrics(user.id);
  }

  @Get('admin/revenue')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get marketplace revenue analytics dashboard (Admin)' })
  async getRevenueDashboard() {
    return this.analyticsService.getRevenueAnalyticsDashboard();
  }

  @Get('funnel')
  @ApiOperation({ summary: 'Get booking conversion funnel analytics' })
  async getBookingFunnel() {
    return this.analyticsService.getBookingConversionFunnel();
  }
}
