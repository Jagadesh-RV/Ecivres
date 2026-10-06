import { Injectable } from '@nestjs/common';
import { SwarmProposalDto } from '../dto/swarm-proposal.dto';

export interface AgentVote {
  agentName: string;
  vote: 'APPROVE' | 'REJECT' | 'ABSTAIN';
  weight: number; // 0.0 to 1.0
  reasoning: string;
}

@Injectable()
export class PricingAgentService {
  evaluateProposal(proposal: SwarmProposalDto): AgentVote {
    // Pricing agent approves revenue positive or surge adjustments up to 25%
    if (proposal.proposedAction.includes('SURGE') && proposal.proposedValue <= 25) {
      return {
        agentName: 'PricingAgent',
        vote: 'APPROVE',
        weight: 0.35,
        reasoning: 'Boosts platform revenue and optimizes peak marketplace yields',
      };
    }
    return {
      agentName: 'PricingAgent',
      vote: proposal.proposedValue > 40 ? 'REJECT' : 'APPROVE',
      weight: 0.35,
      reasoning: proposal.proposedValue > 40 ? 'Excessive surge causes demand drop' : 'Moderate pricing adjustment approved',
    };
  }
}
