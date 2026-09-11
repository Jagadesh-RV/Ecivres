import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProvidersService } from './providers.service';
import { ProviderAnalyticsService } from './provider-analytics.service';
import { ProviderStaffService } from './provider-staff.service';
import { ProviderInventoryService } from './provider-inventory.service';
import { ProviderPortfolioService } from './provider-portfolio.service';
import {
  CreateProviderProfileDto,
  UpdateProviderProfileDto,
} from './dto/provider-profile.dto';

@ApiTags('providers')
@Controller('providers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProvidersController {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly analyticsService: ProviderAnalyticsService,
    private readonly staffService: ProviderStaffService,
    private readonly inventoryService: ProviderInventoryService,
    private readonly portfolioService: ProviderPortfolioService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current provider profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.providersService.getProfile(user.id);
  }

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get provider analytics and revenue dashboard metrics' })
  async getDashboardStats(@CurrentUser() user: any) {
    return this.providersService.getProviderDashboardStats(user.id);
  }

  @Get('business-analytics')
  @ApiOperation({ summary: 'Get advanced business suite analytics & AI insights' })
  async getBusinessAnalytics(@CurrentUser() user: any) {
    return this.analyticsService.getBusinessAnalytics(user.id);
  }

  @Get('staff')
  @ApiOperation({ summary: 'Get list of staff members for provider' })
  async getStaff(@CurrentUser() user: any) {
    return this.staffService.getStaffMembers(user.id);
  }

  @Post('staff')
  @ApiOperation({ summary: 'Add a new staff member' })
  async addStaff(@CurrentUser() user: any, @Body() dto: any) {
    return this.staffService.addStaffMember(user.id, dto);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory list for provider' })
  async getInventory(@CurrentUser() user: any) {
    return this.inventoryService.getInventory(user.id);
  }

  @Post('inventory')
  @ApiOperation({ summary: 'Add inventory item' })
  async addInventory(@CurrentUser() user: any, @Body() dto: any) {
    return this.inventoryService.addInventoryItem(user.id, dto);
  }

  @Get('tax-estimate')
  @ApiOperation({ summary: 'Calculate estimated tax & profit report' })
  async getTaxEstimate(@CurrentUser() user: any) {
    return this.inventoryService.calculateTaxEstimate(user.id);
  }

  @Get('portfolio')
  @ApiOperation({ summary: 'Get provider before/after portfolio items' })
  async getPortfolio(@CurrentUser() user: any) {
    return this.portfolioService.getPortfolio(user.id);
  }

  @Post('portfolio')
  @ApiOperation({ summary: 'Add portfolio work item' })
  async addPortfolio(@CurrentUser() user: any, @Body() dto: any) {
    return this.portfolioService.addPortfolioItem(user.id, dto);
  }

  @Post('profile')
  @ApiOperation({ summary: 'Create provider profile' })
  async createProfile(
    @CurrentUser() user: any,
    @Body() createDto: CreateProviderProfileDto,
  ) {
    return this.providersService.createProfile(user.id, createDto);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update provider profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateProviderProfileDto,
  ) {
    return this.providersService.updateProfile(user.id, updateDto);
  }

  @Get('public/:userId')
  @ApiOperation({ summary: 'Get public provider profile by user ID' })
  async getPublicProfile(@Param('userId') userId: string) {
    return this.providersService.getPublicProfile(userId);
  }

  @Get('availability')
  @ApiOperation({ summary: 'Get provider weekly operating schedule' })
  async getAvailability(@CurrentUser() user: any) {
    return this.providersService.getAvailability(user.id);
  }

  @Patch('availability')
  @ApiOperation({ summary: 'Update provider operating availability schedule' })
  async updateAvailability(
    @CurrentUser() user: any,
    @Body() body: { schedule: any[] },
  ) {
    return this.providersService.updateAvailability(user.id, body.schedule);
  }

  @Patch('presence')
  @ApiOperation({ summary: 'Update provider online/offline presence status' })
  async updatePresence(
    @CurrentUser() user: any,
    @Body() body: { isOnline: boolean },
  ) {
    return this.providersService.updatePresenceStatus(user.id, body.isOnline);
  }
}

