import { CircuitBreakerDrillService } from './circuit-breaker-drill.service';
import { CircuitBreakerService } from '../trust-resilience/circuit-breaker.service';
import { IncidentManagerService } from './incident-manager.service';
import { IncidentSeverity } from './dto/reliability.dto';
import { PrismaService } from '../../prisma/prisma.service';

describe('Phase 28: Incident Recovery, Fault Injection & Self-Healing Drill Specification', () => {
  let drillService: CircuitBreakerDrillService;
  let circuitBreakerService: CircuitBreakerService;
  let incidentManager: IncidentManagerService;

  const mockPrisma = {
    incidentReport: {
      create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'inc_drill_1', ...args.data })),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    operationsIncident: {
      create: jest.fn().mockResolvedValue({ id: 'op_inc_1' }),
      update: jest.fn().mockResolvedValue({ id: 'op_inc_1' }),
    },
  };

  beforeEach(() => {
    circuitBreakerService = new CircuitBreakerService(mockPrisma as any);
    drillService = new CircuitBreakerDrillService(circuitBreakerService);
    incidentManager = new IncidentManagerService(mockPrisma as any);
  });

  it('1. should execute autonomous circuit breaker fault injection and verify self-healing recovery', async () => {
    const drillResult = await drillService.executeRecoveryDrill(
      'mock-cloud-storage-service',
      3,
      50, // 50ms recovery window
    );

    expect(drillResult).toBeDefined();
    expect(drillResult.targetService).toBe('mock-cloud-storage-service');
    expect(drillResult.injectedFailureCount).toBe(3);
    expect(drillResult.initialState).toBe('CLOSED');
    expect(drillResult.trippedState).toBe('OPEN');
    expect(drillResult.autonomousRecoveryVerified).toBe(true);
    expect(drillResult.finalState).toBe('CLOSED');
    expect(drillResult.recoveryDurationMs).toBeGreaterThanOrEqual(50);
  });

  it('2. should manage incident lifecycle during fault simulation through RESOLVED', async () => {
    const incident = await incidentManager.createIncident({
      severity: IncidentSeverity.SEV1,
      title: 'Database connection saturation during stress drill',
      description: 'PostgreSQL connection pool reached 95% capacity in staging cluster',
      source: 'database-monitor',
      affectedWorkflows: ['checkout', 'payment'],
    });

    expect(incident).toBeDefined();
    expect(incident.incidentId).toBeDefined();
    expect(incident.status).toBe('OPEN');
    expect(incident.runbookUrl).toContain('/docs/platform/');

    // Transition to INVESTIGATING
    const investigating = await incidentManager.updateIncidentStatus(
      incident.incidentId,
      'INVESTIGATING',
      'Operator initiated connection pool drain and query analysis',
    );
    expect(investigating.status).toBe('INVESTIGATING');

    // Transition to RESOLVED
    const resolved = await incidentManager.updateIncidentStatus(
      incident.incidentId,
      'RESOLVED',
      'Connection pool size adjusted, circuit breaker closed, all metrics nominal',
    );
    expect(resolved.status).toBe('RESOLVED');
  });
});
