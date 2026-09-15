import { AutoRefundService } from './auto-refund.service';
import { AiSupportRoutingService } from './ai-support-routing.service';

describe('Operational Automation Services', () => {
  describe('AutoRefundService', () => {
    let refund: AutoRefundService;

    beforeEach(() => {
      refund = new AutoRefundService();
    });

    it('should auto-approve SLA breach refund for 60m+ delay under $150', () => {
      const res = refund.evaluateSlaRefund('bk_1', 75, 120);
      expect(res.autoApproved).toBe(true);
      expect(res.refundAmount).toBe(120);
    });

    it('should escalate SLA breach refund to human support if over $150 cap', () => {
      const res = refund.evaluateSlaRefund('bk_2', 90, 500);
      expect(res.autoApproved).toBe(false);
      expect(res.escalatedToSupport).toBe(true);
    });
  });

  describe('AiSupportRoutingService', () => {
    let routing: AiSupportRoutingService;

    beforeEach(() => {
      routing = new AiSupportRoutingService();
    });

    it('should triage safety incident tickets to URGENT Trust & Safety queue', () => {
      const res = routing.triageTicket('t_1', 'Safety concern during plumbing job', 'Provider was unvetted');
      expect(res.category).toBe('SAFETY');
      expect(res.priority).toBe('URGENT');
    });
  });
});
