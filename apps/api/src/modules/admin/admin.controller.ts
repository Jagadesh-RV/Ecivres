import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get platform analytics overview metrics (Admin only)' })
  async getDashboardStats() {
    return this.adminService.getAdminDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with profiles (Admin only)' })
  async getUsers() {
    return this.adminService.findAllUsers();
  }

  @Patch('providers/:id/verify')
  @ApiOperation({ summary: 'Verify a provider profile (Admin only)' })
  async verifyProvider(@Param('id') providerProfileId: string) {
    return this.adminService.approveProvider(providerProfileId);
  }

  @Patch('providers/:id/approve')
  @ApiOperation({ summary: 'Approve provider verification request (Admin only)' })
  async approveProvider(@Param('id') providerProfileId: string) {
    return this.adminService.approveProvider(providerProfileId);
  }

  @Patch('providers/:id/reject')
  @ApiOperation({ summary: 'Reject provider verification request (Admin only)' })
  async rejectProvider(@Param('id') providerProfileId: string) {
    return this.adminService.rejectProvider(providerProfileId);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get system audit trail logs (Admin only)' })
  async getAuditLogs() {
    return this.adminService.getPlatformAuditLogs();
  }

  @Get('revenue-breakdown')
  @ApiOperation({ summary: 'Get detailed revenue breakdown and fee metrics (Admin only)' })
  async getRevenueBreakdown() {
    return this.adminService.getRevenueBreakdown();
  }

  @Get('marketplace-metrics')
  @ApiOperation({ summary: 'Get real-time marketplace booking analytics and monitoring metrics (Admin only)' })
  async getMarketplaceMetrics() {
    return this.adminService.getMarketplaceMonitoringMetrics();
  }
}

