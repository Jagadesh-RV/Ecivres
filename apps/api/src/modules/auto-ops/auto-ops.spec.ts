import { Test, TestingModule } from '@nestjs/testing';
import { IncidentDetectorService } from './incident-detector.service';
import { AutoRemediationService } from './auto-remediation.service';
import { IncidentSeverity } from './dto/incident-report.dto';

describe('Autonomous Operations Module Services', () => {
  let incidentDetector: IncidentDetectorService;
  let autoRemediation: AutoRemediationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentDetectorService, AutoRemediationService],
    }).compile();

    incidentDetector = module.get<IncidentDetectorService>(IncidentDetectorService);
    autoRemediation = module.get<AutoRemediationService>(AutoRemediationService);
  });

  it('should flag high error rate incident and recommend pod restart', async () => {
    const res = await incidentDetector.evaluateIncident({
      serviceName: 'PaymentGateway',
      severity: IncidentSeverity.CRITICAL_OUTAGE,
      errorRatePercentage: 8.5,
      p99LatencyMs: 650,
    });
    expect(res.isActionRequired).toBe(true);
    expect(res.recommendedRemediation).toBe('RESTART_POD_AND_DRAIN_CANARY');
  });

  it('should execute self-healing remediation worker action', async () => {
    const res = await autoRemediation.executeRemediation('inc_100', 'RESTART_POD_AND_DRAIN_CANARY');
    expect(res.executionId).toBeDefined();
    expect(res.executionStatus).toBe('EXECUTED_SUCCESSFULLY');
  });
});
