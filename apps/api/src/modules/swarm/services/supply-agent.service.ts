import { Injectable } from '@nestjs/common';
import { SwarmProposalDto } from '../dto/swarm-proposal.dto';
import { AgentVote } from './pricing-agent.service';

@Injectable()
export class SupplyAgentService {
  evaluateProposal(proposal: SwarmProposalDto): AgentVote {
    // Supply agent advocates for provider retention, bonuses, and reasonable surge
    if (proposal.proposedAction.includes('INCENTIVE') || (proposal.proposedAction.includes('SURGE') && proposal.proposedValue >= 10)) {
      return {
        agentName: 'SupplyAgent',
        vote: 'APPROVE',
        weight: 0.35,
        reasoning: 'Incentivizes supply coverage density and provider earnings',
      };
    }
    return {
      agentName: 'SupplyAgent',
      vote: 'APPROVE',
      weight: 0.35,
      reasoning: 'Sufficient supply coverage maintained',
    };
  }
}
