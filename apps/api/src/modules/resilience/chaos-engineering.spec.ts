import { ChaosEngineeringService } from './chaos-engineering.service';

describe('ChaosEngineeringService', () => {
  let chaos: ChaosEngineeringService;

  beforeEach(() => {
    chaos = new ChaosEngineeringService();
  });

  it('should inject chaos fault and maintain circuit breaker closed state', () => {
    const res = chaos.injectChaosFault('PaymentGateway', 300);
    expect(res.experimentId).toBeDefined();
    expect(res.resilienceScore).toBeGreaterThanOrEqual(0.95);
  });
});
