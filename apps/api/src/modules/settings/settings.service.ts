import { Injectable } from '@nestjs/common';
import { UpdatePlatformSettingsDto } from './dto/update-settings.dto';

export interface PlatformSettings {
  platformFeePercentage: number;
  payoutMinimumThreshold: number;
  maintenanceMode: boolean;
  systemAnnouncementMessage: string;
  updatedAt: Date;
}

@Injectable()
export class PlatformSettingsService {
  private currentSettings: PlatformSettings = {
    platformFeePercentage: 10,
    payoutMinimumThreshold: 50,
    maintenanceMode: false,
    systemAnnouncementMessage: 'Welcome to EcivreS Platform Services!',
    updatedAt: new Date(),
  };

  async getSettings(): Promise<PlatformSettings> {
    return this.currentSettings;
  }

  async updateSettings(dto: UpdatePlatformSettingsDto): Promise<PlatformSettings> {
    if (dto.platformFeePercentage !== undefined) {
      this.currentSettings.platformFeePercentage = dto.platformFeePercentage;
    }
    if (dto.payoutMinimumThreshold !== undefined) {
      this.currentSettings.payoutMinimumThreshold = dto.payoutMinimumThreshold;
    }
    if (dto.maintenanceMode !== undefined) {
      this.currentSettings.maintenanceMode = dto.maintenanceMode;
    }
    if (dto.systemAnnouncementMessage !== undefined) {
      this.currentSettings.systemAnnouncementMessage = dto.systemAnnouncementMessage;
    }
    this.currentSettings.updatedAt = new Date();
    return this.currentSettings;
  }
}
