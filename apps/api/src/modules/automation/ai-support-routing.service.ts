import { Injectable, Logger } from '@nestjs/common';

export interface SupportTicketRouting {
  ticketId: string;
  category: 'BILLING' | 'SAFETY' | 'TECHNICAL' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedQueue: string;
  suggestedSolution?: string;
}

@Injectable()
export class AiSupportRoutingService {
  private readonly logger = new Logger(AiSupportRoutingService.name);

  triageTicket(ticketId: string, subject: string, description: string): SupportTicketRouting {
    const text = `${subject} ${description}`.toLowerCase();
    this.logger.log(`Triaging support ticket ${ticketId} via NLP classification`);

    if (text.includes('accident') || text.includes('injury') || text.includes('safety')) {
      return {
        ticketId,
        category: 'SAFETY',
        priority: 'URGENT',
        assignedQueue: 'Trust & Safety Emergency Escalations',
      };
    }

    if (text.includes('refund') || text.includes('charged') || text.includes('invoice')) {
      return {
        ticketId,
        category: 'BILLING',
        priority: 'HIGH',
        assignedQueue: 'Billing & Payments Queue',
        suggestedSolution: 'Check billing FAQ or request instant refund via customer dashboard',
      };
    }

    return {
      ticketId,
      category: 'GENERAL',
      priority: 'MEDIUM',
      assignedQueue: 'Tier 1 General Support Queue',
    };
  }
}
