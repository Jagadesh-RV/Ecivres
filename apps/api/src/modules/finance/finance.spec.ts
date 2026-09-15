import { EscrowWalletService } from './escrow-wallet.service';
import { InstantPayoutService } from './instant-payout.service';
import { TaxReportingService } from './tax-reporting.service';

describe('Marketplace Finance Services', () => {
  describe('EscrowWalletService', () => {
    let escrow: EscrowWalletService;

    beforeEach(() => {
      escrow = new EscrowWalletService();
    });

    it('should hold customer payment in escrow status', async () => {
      const res = await escrow.holdFunds('bk_1001', 250, 'USD');
      expect(res.escrowHoldId).toBeDefined();
      expect(res.status).toBe('HELD_IN_ESCROW');
    });

    it('should release held escrow funds to provider', async () => {
      const res = await escrow.releaseFunds('esc_1001');
      expect(res.status).toBe('RELEASED_TO_PROVIDER');
    });
  });

  describe('InstantPayoutService', () => {
    let payout: InstantPayoutService;

    beforeEach(() => {
      payout = new InstantPayoutService();
    });

    it('should deduct 1.5% instant fee and settle net payout', async () => {
      const res = await payout.processInstantPayout('prov_1', 1000, 'acct_bank_123');
      expect(res.feeDeducted).toBe(15);
      expect(res.netPayoutAmount).toBe(985);
      expect(res.status).toBe('SETTLED_INSTANTLY');
    });
  });

  describe('TaxReportingService', () => {
    let tax: TaxReportingService;

    beforeEach(() => {
      tax = new TaxReportingService();
    });

    it('should compute taxable income for 1099-K report', async () => {
      const report = await tax.generate1099KReport('prov_1', 2026);
      expect(report.netTaxableIncome).toBe(report.grossEarnings - report.platformFees);
    });
  });

  describe('MicroLoanService', () => {
    let microLoanService: MicroLoanService;

    beforeEach(() => {
      const { MicroLoanService } = require('./micro-loan.service');
      microLoanService = new MicroLoanService();
    });

    it('should approve micro loan application and calculate monthly installments', async () => {
      const result = await microLoanService.evaluateAndIssueLoan({
        providerId: 'prov_99',
        requestedAmount: 1000,
        repaymentTermMonths: 6,
      });

      expect(result.status).toBe('APPROVED');
      expect(result.approvedAmount).toBe(1000);
      expect(result.monthlyInstallment).toBeGreaterThan(0);
    });
  });
});
