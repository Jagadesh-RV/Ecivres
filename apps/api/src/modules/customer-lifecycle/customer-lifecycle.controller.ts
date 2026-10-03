import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CustomerLifecycleService } from './services/customer-lifecycle.service';
import { CustomerRetentionService } from './services/customer-retention.service';
import { CustomerReactivationService } from './services/customer-reactivation.service';

@ApiTags('customer-lifecycle')
@Controller('customer-lifecycle')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerLifecycleController {
  constructor(
    private readonly lifecycleService: CustomerLifecycleService,
    private readonly retentionService: CustomerRetentionService,
    private readonly reactivationService: CustomerReactivationService,
  ) {}

  @Get('segment')
  @ApiOperation({ summary: 'Evaluate customer lifecycle segment' })
  async getSegment(@Query('bookings') bookings?: string, @Query('spend') spend?: string, @Query('daysSinceLast') daysSinceLast?: string) {
    const seg = this.lifecycleService.determineSegment(Number(bookings || 0), Number(spend || 0), Number(daysSinceLast || 0));
    return { segment: seg };
  }

  @Get('retention-offer')
  @ApiOperation({ summary: 'Generate lifecycle retention offer respecting notification preferences' })
  async getOffer(@Query('userId') userId: string, @Query('segment') segment: string, @Query('optIn') optIn?: string) {
    return this.retentionService.generateRetentionOffer(userId, segment, optIn !== 'false');
  }

  @Post('reactivate')
  @ApiOperation({ summary: 'Trigger automated customer reactivation campaign' })
  async reactivate(@Body() body: { userId: string }) {
    return this.reactivationService.triggerReactivationCampaign(body.userId);
  }
}
