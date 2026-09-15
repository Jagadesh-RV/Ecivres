import { PayrollManagementService } from './payroll-management.service';
import { ShiftPlanningService } from './shift-planning.service';

describe('Provider Business OS Services', () => {
  describe('PayrollManagementService', () => {
    let payroll: PayrollManagementService;

    beforeEach(() => {
      payroll = new PayrollManagementService();
    });

    it('should calculate gross and net pay with 15% withholding', () => {
      const summary = payroll.calculateWeeklyPayroll('staff_1', 40, 25, 100);
      expect(summary.grossPay).toBe(1100); // 40*25 + 100
      expect(summary.netPay).toBe(935);   // 1100 - 15%
    });
  });

  describe('ShiftPlanningService', () => {
    let shift: ShiftPlanningService;

    beforeEach(() => {
      shift = new ShiftPlanningService();
    });

    it('should schedule new staff shift', () => {
      const res = shift.createShift('staff_1', '2026-10-01T08:00:00Z', '2026-10-01T16:00:00Z', 'Downtown');
      expect(res.shiftId).toBeDefined();
      expect(res.status).toBe('SCHEDULED');
    });
  });
});
