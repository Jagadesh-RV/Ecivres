import { Injectable, Logger } from '@nestjs/common';

export interface StaffPayrollSummary {
  staffId: string;
  staffName: string;
  hoursWorked: number;
  hourlyRate: number;
  completedJobsBonus: number;
  grossPay: number;
  netPay: number;
}

@Injectable()
export class PayrollManagementService {
  private readonly logger = new Logger(PayrollManagementService.name);

  calculateWeeklyPayroll(staffId: string, hoursWorked: number, hourlyRate: number, bonus = 0): StaffPayrollSummary {
    const grossPay = hoursWorked * hourlyRate + bonus;
    const taxDeduction = grossPay * 0.15; // 15% estimated withholding tax
    const netPay = grossPay - taxDeduction;

    this.logger.log(`Calculated payroll for staff ${staffId}: Gross \$${grossPay}, Net \$${netPay}`);

    return {
      staffId,
      staffName: 'Alex Rivera',
      hoursWorked,
      hourlyRate,
      completedJobsBonus: bonus,
      grossPay,
      netPay,
    };
  }
}
