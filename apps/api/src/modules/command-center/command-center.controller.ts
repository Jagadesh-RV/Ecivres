import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MarketplaceCommandCenterService } from './services/marketplace-command-center.service';
import { MarketplaceHealthService } from './services/marketplace-health.service';
import { MarketplaceAlertService } from './services/marketplace-alert.service';

@ApiTags('command-center')
@Controller('admin/command-center')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class CommandCenterController {
  constructor(
    private readonly commandCenterService: MarketplaceCommandCenterService,
    private readonly healthService: MarketplaceHealthService,
    private readonly alertService: MarketplaceAlertService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get unified Marketplace Command Center state' })
  async getDashboard() {
    return this.commandCenterService.getFullCommandCenterState();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get marketplace customer, provider, and operational health metrics' })
  async getHealth() {
    return this.healthService.getMarketplaceHealth();
  }

  @Get('financial')
  @ApiOperation({ summary: 'Get financial health and margin indicators' })
  async getFinancial() {
    return this.healthService.getFinancialHealth();
  }

  @Get('operational')
  @ApiOperation({ summary: 'Get system infrastructure and region health' })
  async getOperational() {
    return this.healthService.getOperationalHealth();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get active operational alerts' })
  async getAlerts() {
    return this.alertService.getActiveAlerts();
  }
}
