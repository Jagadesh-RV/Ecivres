import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RegionalConfigService } from './services/regional-config.service';
import { CountryActivationService } from './services/country-activation.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RegionalConfigService & CountryActivationService', () => {
  let configService: RegionalConfigService;
  let activationService: CountryActivationService;

  const mockPrisma = {
    countryRecord: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionalConfigService,
        CountryActivationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    configService = module.get<RegionalConfigService>(RegionalConfigService);
    activationService = module.get<CountryActivationService>(CountryActivationService);
  });

  it('should return correct regional configuration for India (IN)', () => {
    const config = configService.getRegionalConfig('IN');
    expect(config.currency).toBe('INR');
    expect(config.taxType).toBe('GST');
    expect(config.defaultTaxRatePercent).toBe(18.0);
  });

  it('should activate a country marketplace', async () => {
    mockPrisma.countryRecord.findUnique.mockResolvedValue(null);
    mockPrisma.countryRecord.create.mockResolvedValue({
      code: 'IN',
      name: 'India',
      isActive: true,
    });

    const res = await activationService.activateCountry('IN');
    expect(res.code).toBe('IN');
    expect(res.isActive).toBe(true);
  });
});
