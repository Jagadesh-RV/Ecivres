import { Module } from '@nestjs/common';
import { PlatformSettingsService } from './settings.service';
import { PlatformSettingsController } from './settings.controller';

@Module({
  controllers: [PlatformSettingsController],
  providers: [PlatformSettingsService],
  exports: [PlatformSettingsService],
})
export class PlatformSettingsModule {}
