import { Controller, Post, Body } from '@nestjs/common';
import { AutoRefundService } from './auto-refund.service';
import { AiSupportRoutingService } from './ai-support-routing.service';

@Controller('automation/operations')
export class OperationalAutomationController {
  constructor(
    private readonly autoRefund: AutoRefundService,
    private readonly supportRouting: AiSupportRoutingService,
  ) {}

  @Post('evaluate-sla-refund')
  evaluateRefund(@Body() body: { bookingId: string; delayMinutes: number; bookingAmount: number }) {
    return this.autoRefund.evaluateSlaRefund(body.bookingId, body.delayMinutes, body.bookingAmount);
  }

  @Post('triage-ticket')
  triageTicket(@Body() body: { ticketId: string; subject: string; description: string }) {
    return this.supportRouting.triageTicket(body.ticketId, body.subject, body.description);
  }
}
