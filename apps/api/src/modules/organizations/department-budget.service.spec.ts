import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentBudgetService } from './department-budget.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DepartmentBudgetService', () => {
  let service: DepartmentBudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentBudgetService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<DepartmentBudgetService>(DepartmentBudgetService);
  });

  it('should evaluate department budget limits and return warning status when near limit', async () => {
    const status = await service.checkDepartmentBudget('dept_hr', 100);
    expect(status.alertLevel).toBe('WARNING');
    expect(status.isOverLimit).toBe(false);
  });

  it('should throw exception when department spend exceeds budget cap', async () => {
    await expect(service.recordDepartmentSpend('dept_hr', 500)).rejects.toThrow(
      'exceeds monthly budget limit',
    );
  });
});
