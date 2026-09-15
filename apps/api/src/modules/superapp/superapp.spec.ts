import { Test, TestingModule } from '@nestjs/testing';
import { SuperAppService } from './superapp.service';

describe('SuperAppService', () => {
  let service: SuperAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperAppService],
    }).compile();

    service = module.get<SuperAppService>(SuperAppService);
  });

  it('should generate standard maintenance plan for newer property', async () => {
    const plan = await service.generateMaintenancePlan({
      propertyId: 'prop_new',
      propertyAgeYears: 5,
    });

    expect(plan.propertyId).toBe('prop_new');
    expect(plan.tasks.length).toBe(3);
    expect(plan.annualEstimatedSavingsUsd).toBeGreaterThan(0);
  });

  it('should add electrical audit task for older properties (>15 years)', async () => {
    const plan = await service.generateMaintenancePlan({
      propertyId: 'prop_old',
      propertyAgeYears: 20,
    });

    expect(plan.tasks.length).toBe(4);
    const electricalTask = plan.tasks.find((t) => t.category === 'Electrical');
    expect(electricalTask).toBeDefined();
    expect(electricalTask?.title).toContain('Panel & Wiring Safety Audit');
  });
});
