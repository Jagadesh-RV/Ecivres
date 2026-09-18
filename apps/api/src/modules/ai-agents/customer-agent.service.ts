import { Injectable, Logger } from '@nestjs/common';

export interface CustomerAgentDecision {
  agentId: string;
  customerId: string;
  preferredTimeSlot: string;
  maxBudgetUsd: number;
  autoApproveNegotiation: boolean;
}

@Injectable()
export class CustomerAgentService {
  private readonly logger = new Logger(CustomerAgentService.name);

  async evaluatePreferences(customerId: string, category: string): Promise<CustomerAgentDecision> {
    this.logger.log(`Customer AI Agent evaluating preferences for customer ${customerId} (${category})`);

    return {
      agentId: `agent_cust_${customerId}`,
      customerId,
      preferredTimeSlot: 'MORNING_9AM_12PM',
      maxBudgetUsd: 350,
      autoApproveNegotiation: true,
    };
  }
}
