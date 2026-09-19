import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LeadScoringService {
  private readonly logger = new Logger(LeadScoringService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createRecord(providerId: string, customerId: string, leadScore: number, notes?: string) {
    const recordId = `crm_${Date.now()}`;
    this.logger.log(`Creating CRM record ${recordId} for customer ${customerId} (Score: ${leadScore})`);
    return this.prisma.customerCrmRecord.create({
      data: {
        recordId,
        providerId,
        customerId,
        leadScore,
        notes,
      },
    });
  }

  async calculateLeadScore(bookingCount: number, totalSpent: number) {
    const score = Math.min(100, bookingCount * 15 + Math.floor(totalSpent / 50));
    this.logger.log(`Calculated lead score: ${score} based on ${bookingCount} bookings & $${totalSpent}`);
    return { leadScore: score, segment: score > 75 ? 'VIP' : score > 40 ? 'REGULAR' : 'PROSPECT' };
  }
}
