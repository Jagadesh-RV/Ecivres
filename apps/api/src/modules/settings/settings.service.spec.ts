import { Test, TestingModule } from '@nestjs/testing';
import { PlatformSettingsService } from './settings.service';

describe('PlatformSettingsService', () => {
  let service: PlatformSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformSettingsService],
    }).compile();

    service = module.get<PlatformSettingsService>(PlatformSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return default platform settings', async () => {
    const settings = await service.getSettings();
    expect(settings.platformFeePercentage).toBe(10);
    expect(settings.payoutMinimumThreshold).toBe(50);
    expect(settings.maintenanceMode).toBe(false);
  });

  it('should update platform settings', async () => {
    const updated = await service.updateSettings({
      platformFeePercentage: 15,
      maintenanceMode: true,
    });
    expect(updated.platformFeePercentage).toBe(15);
    expect(updated.maintenanceMode).toBe(true);
  });
});
