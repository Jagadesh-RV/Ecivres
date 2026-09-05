import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PlatformSettingsService } from './settings.service';
import { UpdatePlatformSettingsDto } from './dto/update-settings.dto';

@Controller('settings')
export class PlatformSettingsController {
  constructor(private settingsService: PlatformSettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateSettings(@Body() dto: UpdatePlatformSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
