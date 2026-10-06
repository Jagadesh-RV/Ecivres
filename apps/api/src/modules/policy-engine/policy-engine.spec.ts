import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { PolicyEngineService } from './services/policy-engine.service';
import { GuardrailValidatorService } from './services/guardrail-validator.service';
import { PolicyExecutorService } from './services/policy-executor.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PolicyActionType } from './dto/evaluate-policy.dto';

describe('PolicyEngineService', () => {
  let service: PolicyEngineService;

  const mockPrisma = {
    autonomousDecisionLog: {
      create: jest.fn().mockResolvedValue({ id: 'log-123' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyEngineService,
        GuardrailValidatorService,
        PolicyExecutorService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PolicyEngineService>(PolicyEngineService);
  });

  it('should execute policy action within guardrails autonomously', async () => {
    const res = await service.evaluateAndExecute({
      actionType: PolicyActionType.SURGE_PRICING_TRIGGER,
      proposedValue: 20, // 20% surge, within limits (<30% auto)
      requireAutoExecution: true,
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('log-123');
    expect(res.status).toBe('EXECUTED_AUTONOMOUSLY');
    expect(res.executed).toBe(true);
  });

  it('should flag policy action for human review if above soft threshold', async () => {
    const res = await service.evaluateAndExecute({
      actionType: PolicyActionType.SURGE_PRICING_TRIGGER,
      proposedValue: 40, // >30% requires review, but <50% cap
      requireAutoExecution: true,
    });

    expect(res.status).toBe('PENDING_HUMAN_REVIEW');
    expect(res.executed).toBe(false);
  });

  it('should reject policy action exceeding strict guardrail limit', async () => {
    const res = await service.evaluateAndExecute({
      actionType: PolicyActionType.SURGE_PRICING_TRIGGER,
      proposedValue: 60, // >50% max surge cap
      requireAutoExecution: true,
    });

    expect(res.status).toBe('REJECTED_GUARDRAIL_VIOLATION');
    expect(res.executed).toBe(false);
  });
});
