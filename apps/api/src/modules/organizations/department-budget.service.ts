import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DepartmentBudgetStatus {
  departmentId: string;
  departmentName: string;
  monthlyLimit: number;
  currentSpend: number;
  remainingBudget: number;
  isOverLimit: boolean;
  alertLevel: 'NORMAL' | 'WARNING' | 'EXCEEDED';
}

@Injectable()
export class DepartmentBudgetService {
  private departmentLimits: Map<string, { name: string; limit: number; current: number }> = new Map();

  constructor(private readonly prisma: PrismaService) {
    // Default mock data
    this.departmentLimits.set('dept_fac', { name: 'Facilities & Maintenance', limit: 5000, current: 3200 });
    this.departmentLimits.set('dept_hr', { name: 'Human Resources', limit: 2000, current: 1850 });
  }

  async checkDepartmentBudget(departmentId: string, additionalAmount: number): Promise<DepartmentBudgetStatus> {
    const dept = this.departmentLimits.get(departmentId) || { name: 'General Ops', limit: 3000, current: 1200 };
    const projectedSpend = dept.current + additionalAmount;
    const remaining = Math.max(0, dept.limit - projectedSpend);
    const isOverLimit = projectedSpend > dept.limit;

    let alertLevel: 'NORMAL' | 'WARNING' | 'EXCEEDED' = 'NORMAL';
    if (isOverLimit) {
      alertLevel = 'EXCEEDED';
    } else if (projectedSpend / dept.limit >= 0.85) {
      alertLevel = 'WARNING';
    }

    return {
      departmentId,
      departmentName: dept.name,
      monthlyLimit: dept.limit,
      currentSpend: projectedSpend,
      remainingBudget: remaining,
      isOverLimit,
      alertLevel,
    };
  }

  async recordDepartmentSpend(departmentId: string, amount: number): Promise<void> {
    const status = await this.checkDepartmentBudget(departmentId, amount);
    if (status.isOverLimit) {
      throw new BadRequestException(
        `Department ${status.departmentName} exceeds monthly budget limit ($${status.monthlyLimit})`,
      );
    }

    const dept = this.departmentLimits.get(departmentId);
    if (dept) {
      dept.current += amount;
    }
  }

  async updateDepartmentBudget(departmentId: string, limit: number): Promise<DepartmentBudgetStatus> {
    const dept = this.departmentLimits.get(departmentId) || { name: 'General Ops', limit: 3000, current: 0 };
    dept.limit = limit;
    this.departmentLimits.set(departmentId, dept);
    return this.checkDepartmentBudget(departmentId, 0);
  }
}
