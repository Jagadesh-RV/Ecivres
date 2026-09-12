import { Test, TestingModule } from '@nestjs/testing';
import { PremiumCustomerExperienceService } from './premium-experience.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PremiumCustomerExperienceService', () => {
  let service: PremiumCustomerExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PremiumCustomerExperienceService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<PremiumCustomerExperienceService>(PremiumCustomerExperienceService);
  });

  it('should return AR preview 3D model links', async () => {
    const ar = await service.getArPreviewModel('srv_sofa_1');
    expect(ar.arModelUrl).toContain('srv_sofa_1.usdz');
    expect(ar.supportedDevices.length).toBeGreaterThan(0);
  });

  it('should return AI home maintenance schedule reminders and subscription bundles', async () => {
    const reminders = await service.getAiMaintenanceReminders('u100');
    expect(reminders.length).toBeGreaterThan(0);
    expect(reminders[0].estimatedCost).toBeGreaterThan(0);

    const bundles = await service.getSubscriptionBundles();
    expect(bundles.length).toBe(2);
    expect(bundles[0].discountPercentage).toBe(20);
  });
});
