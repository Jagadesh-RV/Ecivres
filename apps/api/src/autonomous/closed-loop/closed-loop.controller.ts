import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ClosedLoopOrchestratorService } from './closed-loop-orchestrator.service';
import { ActionExecutorService } from './action-executor.service';
import { ExecuteActionDto } from './dto/execute-action.dto';
import { TriggerRemediationDto } from './dto/trigger-remediation.dto';

@Controller('autonomous/closed-loop')
export class ClosedLoopController {
  constructor(
    private readonly orchestrator: ClosedLoopOrchestratorService,
    private readonly executor: ActionExecutorService,
  ) {}

  @Post('execute')
  async executeAction(@Body() dto: ExecuteActionDto) {
    const result = await this.executor.executeAction(dto);
    return { success: true, data: result };
  }

  @Post('orchestrate')
  async orchestrateDecision(@Body() dtos: ExecuteActionDto[]) {
    const summary = await this.orchestrator.orchestrateDecision(dtos);
    return { success: true, data: summary };
  }

  @Post('remediate')
  async remediate(@Body() dto: TriggerRemediationDto) {
    const result = await this.orchestrator.triggerRemediation(dto);
    return { success: true, data: result };
  }

  @Get('execution/:id')
  async getExecution(@Param('id') id: string) {
    const result = await this.executor.getExecution(id);
    return { success: !!result, data: result };
  }

  @Get('summary/:decisionId')
  async getSummary(@Param('decisionId') decisionId: string) {
    const summary = await this.orchestrator.getSummary(decisionId);
    return { success: !!summary, data: summary };
  }
}
