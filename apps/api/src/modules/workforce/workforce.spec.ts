import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ShiftOptimizerService } from './services/shift-optimizer.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ShiftOptimizerService', () => {
  let service: ShiftOptimizerService;

  const mockPrisma = {
    workforceShift: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftOptimizerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ShiftOptimizerService>(ShiftOptimizerService);
  });

  it('should predict overtime risk level correctly', async () => {
    const res = await service.predictOvertime('staff_1', 52);
    expect(res.predictedOvertime).toBe(12);
    expect(res.riskLevel).toBe('HIGH');
  });
});
