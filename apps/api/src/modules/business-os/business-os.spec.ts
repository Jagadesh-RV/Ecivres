import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentInventoryService } from './equipment-inventory.service';

describe('EquipmentInventoryService', () => {
  let service: EquipmentInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentInventoryService],
    }).compile();

    service = module.get<EquipmentInventoryService>(EquipmentInventoryService);
  });

  it('should register tool and calculate monthly depreciation and service due date', async () => {
    const res = await service.registerEquipment({
      providerId: 'prov_55',
      equipmentName: 'Commercial Pressure Washer',
      purchaseCostUsd: 1200,
      expectedLifespanMonths: 24,
    });

    expect(res.equipmentId).toBeDefined();
    expect(res.monthlyDepreciationRate).toBe(50);
    expect(res.currentDepreciatedValueUsd).toBe(1050);
    expect(res.nextServiceDueDate).toBeDefined();
  });
});
