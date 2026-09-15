import { CompanyWorkspaceService } from './workspace.service';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { CorporateInvoiceService } from './corporate-invoice.service';

describe('Enterprise Organization Services', () => {
  describe('CompanyWorkspaceService', () => {
    let workspaceService: CompanyWorkspaceService;

    beforeEach(() => {
      workspaceService = new CompanyWorkspaceService();
    });

    it('should create company workspace with budget cap', async () => {
      const res = await workspaceService.createWorkspace('Acme Corp', 'acme.com', 25000);
      expect(res.workspaceId).toBeDefined();
      expect(res.monthlyBudgetCap).toBe(25000);
    });
  });

  describe('ApprovalWorkflowService', () => {
    let approvalService: ApprovalWorkflowService;

    beforeEach(() => {
      approvalService = new ApprovalWorkflowService();
    });

    it('should auto-approve bookings under $250', () => {
      const res = approvalService.evaluateBookingApproval({
        bookingId: 'bk_1',
        requesterUserId: 'usr_1',
        amount: 150,
        departmentId: 'dept_1',
      });
      expect(res.approvalRequired).toBe(false);
      expect(res.status).toBe('APPROVED');
    });

    it('should require manager approval for bookings over $250', () => {
      const res = approvalService.evaluateBookingApproval({
        bookingId: 'bk_2',
        requesterUserId: 'usr_1',
        amount: 800,
        departmentId: 'dept_1',
      });
      expect(res.approvalRequired).toBe(true);
      expect(res.status).toBe('PENDING_MANAGER_APPROVAL');
    });
  });

  describe('CorporateInvoiceService', () => {
    let invoiceService: CorporateInvoiceService;

    beforeEach(() => {
      invoiceService = new CorporateInvoiceService();
    });

    it('should generate monthly consolidated invoice with grand total', async () => {
      const inv = await invoiceService.generateMonthlyInvoice('org_acme', '2026-09');
      expect(inv.grandTotal).toBe(inv.subtotalAmount + inv.taxAmount);
      expect(inv.pdfDownloadUrl).toContain('org_acme');
    });
  });
});
