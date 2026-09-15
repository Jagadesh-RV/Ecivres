import { BookingPlannerService } from './booking-planner.service';
import { NegotiationAssistantService } from './negotiation-assistant.service';
import { ProviderAgentService } from './provider-agent.service';

describe('Autonomous AI Marketplace Services', () => {
  describe('BookingPlannerService', () => {
    let planner: BookingPlannerService;

    beforeEach(() => {
      planner = new BookingPlannerService();
    });

    it('should generate multi-step autonomous booking plan with savings', async () => {
      const res = await planner.generateAutonomousPlan({
        userId: 'user_1',
        goal: 'Prepare home for autumn party',
      });

      expect(res.planId).toBeDefined();
      expect(res.steps.length).toBeGreaterThan(0);
      expect(res.savingsPercent).toBeGreaterThan(0);
    });
  });

  describe('NegotiationAssistantService', () => {
    let assistant: NegotiationAssistantService;

    beforeEach(() => {
      assistant = new NegotiationAssistantService();
    });

    it('should calculate fair counter offer within 15% threshold', () => {
      const result = assistant.analyzeCounterOffer({
        serviceId: 'srv_1',
        originalPrice: 200,
        targetPrice: 150,
        userFlexibility: 'MODERATE',
      });

      expect(result.recommendedOffer).toBeGreaterThanOrEqual(170);
      expect(result.suggestedCounterMessage).toBeDefined();
    });
  });

  describe('ProviderAgentService', () => {
    let providerAgent: ProviderAgentService;

    beforeEach(() => {
      providerAgent = new ProviderAgentService();
    });

    it('should generate auto-reply suggestions with high confidence', () => {
      const reply = providerAgent.generateAutoReply('Are you available tomorrow for plumbing repair?');
      expect(reply.confidence).toBeGreaterThanOrEqual(0.9);
      expect(reply.suggestedReply).toContain('available tomorrow');
    });
  });
});
