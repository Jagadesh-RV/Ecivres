import { Controller, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AutomatedSettlementService } from './services/automated-settlement.service';
import { SettleEscrowDto } from './dto/settle-escrow.dto';

@ApiTags('autonomous-finance')
@Controller('autonomous-finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AutonomousFinanceController {
  constructor(private readonly settlementService: AutomatedSettlementService) {}

  @Post('settlements')
  @ApiOperation({ summary: 'Execute autonomous escrow payout settlement' })
  async settleEscrow(@Body() dto: SettleEscrowDto) {
    return this.settlementService.settleEscrow(dto.escrowId, dto.grossAmount);
  }

  @Post('refunds/process')
  @ApiOperation({ summary: 'Execute SLA-driven automated refund' })
  async processRefund(@Query('bookingId') bookingId: string, @Query('amount') amount: string) {
    return this.settlementService.processAutomatedRefund(bookingId, parseFloat(amount || '0'));
  }
}
