import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RegionalCustomerExperienceService } from './services/regional-customer-experience.service';

describe('RegionalCustomerExperienceService', () => {
  let service: RegionalCustomerExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionalCustomerExperienceService],
    }).compile();

    service = module.get<RegionalCustomerExperienceService>(RegionalCustomerExperienceService);
  });

  it('should return Indian Diwali festival promotions for IN', () => {
    const promos = service.getRegionalPromotions('IN');
    expect(promos.length).toBeGreaterThan(0);
    expect(promos[0].promoCode).toBe('FESTIVE500');
  });

  it('should convert USD to INR at rate 83.5', () => {
    const res = service.getLocalizedPricing(100, 'IN');
    expect(res.currency).toBe('INR');
    expect(res.convertedAmount).toBe(8350);
  });
});
