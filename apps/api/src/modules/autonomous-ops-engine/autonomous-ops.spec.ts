import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomationPolicyService } from './services/automation-policy.service';
import { AutomationApprovalService } from './services/automation-approval.service';
import { AutomationAuditService } from './services/automation-audit.service';
import { AutonomousOperationsService } from './services/autonomous-operations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AutonomousOpsEngineModule Services', () => {
  let policyService: AutomationPolicyService;
  let approvalService: AutomationApprovalService;
  let auditService: AutomationAuditService;
  let opsService: AutonomousOperationsService;

  const mockPrisma = {
    automationPolicy: {
      create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'pol_1', ...args.data })),
      findMany: jest.fn().mockResolvedValue([
        { id: 'pol_1', name: 'Auto-Promote', triggerEvent: 'HIGH_DEMAND', actionType: 'APPLY_PROMO', requiresApproval: true },
      ]),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    approvalRequest: {
      create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'req_1', ...args.data })),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      findUnique: jest.fn().mockResolvedValue({ id: 'req_1', status: 'PENDING' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    automationExecution: {
      create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'exec_1', ...args.data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomationPolicyService,
        AutomationApprovalService,
        AutomationAuditService,
        AutonomousOperationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    policyService = module.get<AutomationPolicyService>(AutomationPolicyService);
    approvalService = module.get<AutomationApprovalService>(AutomationApprovalService);
    auditService = module.get<AutomationAuditService>(AutomationAuditService);
    opsService = module.get<AutonomousOperationsService>(AutonomousOperationsService);
  });

  it('should create an automation policy', async () => {
    const res = await policyService.createPolicy({
      name: 'Auto-Promote',
      triggerEvent: 'HIGH_DEMAND',
      conditionRules: { minDemand: 100 },
      actionType: 'APPLY_PROMO',
      requiresApproval: true,
    });
    expect(res.name).toBe('Auto-Promote');
  });

  it('should evaluate event and enqueue human approval request when required', async () => {
    const evalRes = await opsService.evaluateAndExecuteEvent({
      eventName: 'HIGH_DEMAND',
      context: { demandIndex: 120 },
      actorId: 'usr_admin',
      actorRole: 'ADMIN',
    });
    expect(evalRes.executed).toBe(true);
    expect(evalRes.results[0].status).toBe('PENDING_APPROVAL');
  });

  it('should approve a pending request', async () => {
    const res = await approvalService.reviewRequest('req_1', 'usr_reviewer', {
      action: 'APPROVED' as any,
      reason: 'Looks good',
    });
    expect(res.status).toBe('APPROVED');
  });
});
