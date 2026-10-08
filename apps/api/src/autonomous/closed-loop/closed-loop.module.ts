import { Module } from '@nestjs/common';
import { ActionExecutorService } from './action-executor.service';
import { ClosedLoopOrchestratorService } from './closed-loop-orchestrator.service';
import { ClosedLoopController } from './closed-loop.controller';

@Module({
  controllers: [ClosedLoopController],
  providers: [ActionExecutorService, ClosedLoopOrchestratorService],
  exports: [ActionExecutorService, ClosedLoopOrchestratorService],
})
export class ClosedLoopModule {}
