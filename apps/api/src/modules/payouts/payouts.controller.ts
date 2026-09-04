import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { RequestPayoutDto } from './dto/request-payout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('payouts')
@Controller('payouts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get provider payout summary balance and history' })
  async getSummary(@CurrentUser() user: any) {
    return this.payoutsService.getPayoutSummary(user.id);
  }

  @Post('request')
  @ApiOperation({ summary: 'Request a withdrawal / bank payout' })
  async requestPayout(
    @CurrentUser() user: any,
    @Body() dto: RequestPayoutDto,
  ) {
    return this.payoutsService.requestPayout(user.id, dto);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending payout requests (Admin)' })
  async getPendingPayouts() {
    return this.payoutsService.getPendingPayouts();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a payout request (Admin)' })
  async approvePayout(@Param('id') payoutId: string) {
    return this.payoutsService.approvePayout(payoutId);
  }
}
