import { Module } from '@nestjs/common';
import { CustomerAgentService } from './customer-agent.service';
import { ProviderAgentService } from './provider-agent.service';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { AiAgentsController } from './ai-agents.controller';

@Module({
  controllers: [AiAgentsController],
  providers: [CustomerAgentService, ProviderAgentService, AgentOrchestratorService],
  exports: [CustomerAgentService, ProviderAgentService, AgentOrchestratorService],
})
export class AiAgentsModule {}
