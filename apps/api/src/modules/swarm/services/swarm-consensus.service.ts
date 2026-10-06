import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SwarmProposalDto } from '../dto/swarm-proposal.dto';
import { PricingAgentService } from './pricing-agent.service';
import { SupplyAgentService } from './supply-agent.service';
import { RiskAgentService } from './risk-agent.service';
import { AgentVote } from './pricing-agent.service';

export interface SwarmDecision {
  consensusReached: boolean;
  approvalScorePct: number;
  finalDecision: 'APPROVED' | 'REJECTED';
  votes: AgentVote[];
}

@Injectable()
export class SwarmConsensusService {
  private readonly logger = new Logger(SwarmConsensusService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingAgent: PricingAgentService,
    private readonly supplyAgent: SupplyAgentService,
    private readonly riskAgent: RiskAgentService,
  ) {}

  async negotiateAndDecide(proposal: SwarmProposalDto): Promise<SwarmDecision & { id: string }> {
    const votes: AgentVote[] = [
      this.pricingAgent.evaluateProposal(proposal),
      this.supplyAgent.evaluateProposal(proposal),
      this.riskAgent.evaluateProposal(proposal),
    ];

    let totalWeight = 0;
    let approvedWeight = 0;

    for (const v of votes) {
      totalWeight += v.weight;
      if (v.vote === 'APPROVE') {
        approvedWeight += v.weight;
      }
    }

    const approvalScorePct = Number(((approvedWeight / totalWeight) * 100).toFixed(2));
    const consensusReached = approvalScorePct >= 66.0; // 2/3 supermajority threshold
    const finalDecision = consensusReached ? 'APPROVED' : 'REJECTED';

    const logRecord = await this.prisma.autonomousDecisionLog.create({
      data: {
        decisionType: `SWARM_${proposal.proposedAction}`,
        region: proposal.region || 'GLOBAL',
        recommendedAction: `${proposal.title} (Value: ${proposal.proposedValue})`,
        expectedImpact: `Consensus Score: ${approvalScorePct}%`,
        confidenceScore: approvalScorePct,
        riskLevel: finalDecision === 'APPROVED' ? 'LOW' : 'HIGH',
        status: finalDecision === 'APPROVED' ? 'EXECUTED' : 'REJECTED',
        reasoning: votes.map(v => `[${v.agentName}]: ${v.vote} - ${v.reasoning}`).join(' | '),
      },
    });

    this.logger.log(`Swarm decision ${logRecord.id} score=${approvalScorePct}% decision=${finalDecision}`);
    return {
      consensusReached,
      approvalScorePct,
      finalDecision,
      votes,
      id: logRecord.id,
    };
  }
}
