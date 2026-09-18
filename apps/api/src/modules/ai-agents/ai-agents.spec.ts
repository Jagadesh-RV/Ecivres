import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAgentService } from './customer-agent.service';
import { ProviderAgentService } from './provider-agent.service';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { AgentRole } from './dto/agent-task.dto';

describe('AI Multi-Agent Module Services', () => {
  let customerAgent: CustomerAgentService;
  let providerAgent: ProviderAgentService;
  let orchestrator: AgentOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerAgentService, ProviderAgentService, AgentOrchestratorService],
    }).compile();

    customerAgent = module.get<CustomerAgentService>(CustomerAgentService);
    providerAgent = module.get<ProviderAgentService>(ProviderAgentService);
    orchestrator = module.get<AgentOrchestratorService>(AgentOrchestratorService);
  });

  it('should evaluate customer preferences and budget limit', async () => {
    const pref = await customerAgent.evaluatePreferences('cust_1', 'Plumbing');
    expect(pref.maxBudgetUsd).toBe(350);
    expect(pref.autoApproveNegotiation).toBe(true);
  });

  it('should generate competitive 5% discount bid from provider agent', async () => {
    const bid = await providerAgent.generateAutonomousBid('prov_1', 300);
    expect(bid.proposedPriceUsd).toBe(285);
    expect(bid.confidenceScore).toBe(0.94);
  });

  it('should reach consensus when provider bid is within customer max budget', async () => {
    const res = await orchestrator.orchestrateConsensus(
      {
        taskId: 'task_100',
        senderAgent: AgentRole.CUSTOMER_AGENT,
        targetAgent: AgentRole.PROVIDER_AGENT,
        actionType: 'NEGOTIATE_BOOKING',
      },
      350,
      285,
    );
    expect(res.consensusReached).toBe(true);
    expect(res.agreedPriceUsd).toBe(285);
    expect(res.status).toBe('AGREED');
  });
});
