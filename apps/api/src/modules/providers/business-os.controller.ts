import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PayrollManagementService } from './payroll-management.service';
import { ShiftPlanningService } from './shift-planning.service';

@Controller('providers/business-os')
export class ProviderBusinessOsController {
  constructor(
    private readonly payrollService: PayrollManagementService,
    private readonly shiftService: ShiftPlanningService,
  ) {}

  @Post('payroll/calculate')
  calculatePayroll(@Body() body: { staffId: string; hoursWorked: number; hourlyRate: number; bonus?: number }) {
    return this.payrollService.calculateWeeklyPayroll(body.staffId, body.hoursWorked, body.hourlyRate, body.bonus || 0);
  }

  @Post('shifts')
  createShift(@Body() body: { staffId: string; startTime: string; endTime: string; zone: string }) {
    return this.shiftService.createShift(body.staffId, body.startTime, body.endTime, body.zone);
  }
}
