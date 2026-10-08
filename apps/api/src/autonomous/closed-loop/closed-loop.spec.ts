import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ActionExecutorService } from './action-executor.service';
import { ClosedLoopOrchestratorService } from './closed-loop-orchestrator.service';
import { ClosedLoopController } from './closed-loop.controller';
import { ExecuteActionDto } from './dto/execute-action.dto';
import { ConflictException } from '@nestjs/common';

describe('ClosedLoopModule', () => {
  let controller: ClosedLoopController;
  let executor: ActionExecutorService;
  let orchestrator: ClosedLoopOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClosedLoopController],
      providers: [ActionExecutorService, ClosedLoopOrchestratorService],
    }).compile();

    controller = module.get<ClosedLoopController>(ClosedLoopController);
    executor = module.get<ActionExecutorService>(ActionExecutorService);
    orchestrator = module.get<ClosedLoopOrchestratorService>(ClosedLoopOrchestratorService);
  });

  it('should execute action successfully', async () => {
    const dto: ExecuteActionDto = {
      decisionId: 'dec_123',
      actionType: 'ADJUST_PRICE',
      idempotencyKey: 'idemp_001',
      targetEntity: 'SERVICE_OFFERING',
      payload: { newPrice: 150 },
    };

    const res = await controller.executeAction(dto);
    expect(res.success).toBe(true);
    expect(res.data.status).toBe('EXECUTED');
    expect(res.data.decisionId).toBe('dec_123');
  });

  it('should enforce idempotency for duplicate actions', async () => {
    const dto: ExecuteActionDto = {
      decisionId: 'dec_123',
      actionType: 'ADJUST_PRICE',
      idempotencyKey: 'idemp_duplicate',
      targetEntity: 'SERVICE_OFFERING',
      payload: { newPrice: 150 },
    };

    await controller.executeAction(dto);
    await expect(controller.executeAction(dto)).rejects.toThrow(ConflictException);
  });

  it('should orchestrate multi-action decision and remediate on request', async () => {
    const dtos: ExecuteActionDto[] = [
      {
        decisionId: 'dec_multi',
        actionType: 'NOTIFY_USER',
        idempotencyKey: 'idemp_m1',
        targetEntity: 'USER_ACCOUNT',
        payload: { message: 'Offer available' },
      },
      {
        decisionId: 'dec_multi',
        actionType: 'APPLY_DISCOUNT',
        idempotencyKey: 'idemp_m2',
        targetEntity: 'USER_WALLET',
        payload: { discount: 20 },
      },
    ];

    const orchRes = await controller.orchestrateDecision(dtos);
    expect(orchRes.success).toBe(true);
    expect(orchRes.data.status).toBe('COMPLETED');
    expect(orchRes.data.totalActions).toBe(2);

    const execId = orchRes.data.results[0].executionId;
    const remediateRes = await controller.remediate({ executionId: execId, reason: 'User opt-out' });
    expect(remediateRes.success).toBe(true);
    expect(remediateRes.data.status).toBe('COMPENSATED');
  });
});
