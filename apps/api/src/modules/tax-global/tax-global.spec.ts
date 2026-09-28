import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RegionalTaxCalculatorService } from './services/regional-tax-calculator.service';

describe('RegionalTaxCalculatorService', () => {
  let service: RegionalTaxCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionalTaxCalculatorService],
    }).compile();

    service = module.get<RegionalTaxCalculatorService>(RegionalTaxCalculatorService);
  });

  it('should calculate 18% GST for subtotal $100', () => {
    const res = service.calculateTax(100, 'GST', 18.0);
    expect(res.taxAmount).toBe(18.0);
    expect(res.totalAmountWithTax).toBe(118.0);
  });

  it('should validate Indian GSTIN format', () => {
    const res = service.validateBusinessTaxId('IN', '27AAPFU0939F1ZV');
    expect(res.isValid).toBe(true);
  });

  it('should reject invalid US EIN format', () => {
    const res = service.validateBusinessTaxId('US', 'INVALID_EIN');
    expect(res.isValid).toBe(false);
  });
});
