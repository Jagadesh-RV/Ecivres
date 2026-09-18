import { Controller, Post, Body } from '@nestjs/common';
import { AgentTaskDto } from './dto/agent-task.dto';
import { CustomerAgentService } from './customer-agent.service';
import { ProviderAgentService } from './provider-agent.service';
import { AgentOrchestratorService } from './agent-orchestrator.service';

@Controller('ai-agents')
export class AiAgentsController {
  constructor(
    private readonly customerAgent: CustomerAgentService,
    private readonly providerAgent: ProviderAgentService,
    private readonly orchestrator: AgentOrchestratorService,
  ) {}

  @Post('orchestrate')
  async orchestrateAgents(@Body() task: AgentTaskDto) {
    const custPref = await this.customerAgent.evaluatePreferences('cust_demo', 'HVAC');
    const provBid = await this.providerAgent.generateAutonomousBid('prov_demo', 300);
    return this.orchestrator.orchestrateConsensus(task, custPref.maxBudgetUsd, provBid.proposedPriceUsd);
  }
}
