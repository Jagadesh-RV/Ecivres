import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProvidersService } from './providers.service';
import {
  CreateProviderProfileDto,
  UpdateProviderProfileDto,
} from './dto/provider-profile.dto';

@ApiTags('providers')
@Controller('providers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

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
}
