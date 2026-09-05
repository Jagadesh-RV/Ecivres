import { Test, TestingModule } from '@nestjs/testing';
import { PlatformSettingsController } from './settings.controller';
import { PlatformSettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

describe('PlatformSettingsController', () => {
  let controller: PlatformSettingsController;

  const mockSettingsService = {
    getSettings: jest.fn(),
    updateSettings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformSettingsController],
      providers: [{ provide: PlatformSettingsService, useValue: mockSettingsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PlatformSettingsController>(PlatformSettingsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get settings', async () => {
    mockSettingsService.getSettings.mockResolvedValue({ platformFeePercentage: 10 });
    const res = await controller.getSettings();
    expect(res).toEqual({ platformFeePercentage: 10 });
  });

  it('should update settings', async () => {
    mockSettingsService.updateSettings.mockResolvedValue({ platformFeePercentage: 12 });
    const res = await controller.updateSettings({ platformFeePercentage: 12 });
    expect(res).toEqual({ platformFeePercentage: 12 });
  });
});
