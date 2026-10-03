import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderActivationService } from './services/provider-activation.service';
import { ProviderRetentionService } from './services/provider-retention.service';
import { ProviderHealthScoreService } from './services/provider-health-score.service';

describe('ProviderLifecycleModule Services', () => {
  let activationService: ProviderActivationService;
  let retentionService: ProviderRetentionService;
  let healthScoreService: ProviderHealthScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderActivationService, ProviderRetentionService, ProviderHealthScoreService],
    }).compile();

    activationService = module.get<ProviderActivationService>(ProviderActivationService);
    retentionService = module.get<ProviderRetentionService>(ProviderRetentionService);
    healthScoreService = module.get<ProviderHealthScoreService>(ProviderHealthScoreService);
  });

  it('should update provider activation milestones and score', () => {
    let progress = activationService.getActivationProgress('prov_lifecycle_1');
    expect(progress.activationScorePercent).toBe(0);

    progress = activationService.updateMilestone('prov_lifecycle_1', 'verificationCompleted');
    progress = activationService.updateMilestone('prov_lifecycle_1', 'serviceCreated');
    expect(progress.activationScorePercent).toBe(33);
  });

  it('should assess churn risk level and supply actionable recommendations', () => {
    const risk = retentionService.assessChurnRisk('prov_lifecycle_2', 45, 1);
    expect(risk.churnRiskLevel).toBe('HIGH');
    expect(risk.recommendations.length).toBeGreaterThan(0);
  });

  it('should calculate provider health score and assign PLATINUM tier for high ratings', () => {
    const health = healthScoreService.calculateHealthScore('prov_lifecycle_3', 4.9, 98, 99);
    expect(health.tier).toBe('PLATINUM');
    expect(health.overallScore).toBeGreaterThanOrEqual(90);
  });
});
