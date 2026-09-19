import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { SdkGeneratorService } from './services/sdk-generator.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SdkGeneratorService', () => {
  let service: SdkGeneratorService;

  const mockPrisma = {
    apiMarketplaceApp: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdkGeneratorService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SdkGeneratorService>(SdkGeneratorService);
  });

  it('should register developer app and generate API Key', async () => {
    mockPrisma.apiMarketplaceApp.create.mockResolvedValue({
      appId: 'app_123',
      developerId: 'dev_1',
      name: 'Test App',
      apiKey: 'ecv_live_xyz',
      ratePlan: 'PRO',
    });

    const res = await service.registerApp('dev_1', 'Test App', 'PRO');
    expect(res.appId).toBe('app_123');
    expect(res.ratePlan).toBe('PRO');
  });
});
