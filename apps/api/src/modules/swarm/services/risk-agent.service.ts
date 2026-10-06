import { Injectable } from '@nestjs/common';
import { SwarmProposalDto } from '../dto/swarm-proposal.dto';
import { AgentVote } from './pricing-agent.service';

@Injectable()
export class RiskAgentService {
  evaluateProposal(proposal: SwarmProposalDto): AgentVote {
    // Risk agent enforces platform stability & strict caps (>30% surge rejected)
    if (proposal.proposedAction.includes('SURGE') && proposal.proposedValue > 30) {
      return {
        agentName: 'RiskAgent',
        vote: 'REJECT',
        weight: 0.30,
        reasoning: 'Surge value exceeds safe platform risk threshold of 30%',
      };
    }
    return {
      agentName: 'RiskAgent',
      vote: 'APPROVE',
      weight: 0.30,
      reasoning: 'Risk profile acceptable for autonomous execution',
    };
  }
}
