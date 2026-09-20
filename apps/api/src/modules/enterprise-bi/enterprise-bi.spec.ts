import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CohortAnalyzerService } from './services/cohort-analyzer.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CohortAnalyzerService', () => {
  let service: CohortAnalyzerService;

  const mockPrisma = {
    biAnalyticsReport: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CohortAnalyzerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CohortAnalyzerService>(CohortAnalyzerService);
  });

  it('should generate executive BI report', async () => {
    mockPrisma.biAnalyticsReport.create.mockResolvedValue({
      reportId: 'rep_1',
      title: 'Exec Report',
      metricsJson: '{}',
    });

    const res = await service.generateReport('Exec Report', 'EXECUTIVE');
    expect(res.reportId).toBe('rep_1');
  });
});
