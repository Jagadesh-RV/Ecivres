import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { LoyaltyTierService } from './services/loyalty-tier.service';
import { CalculateCashbackDto } from './dto/calculate-cashback.dto';

@ApiTags('loyalty')
@Controller('loyalty')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyTierService) {}

  @Get('account/:userId')
  @ApiOperation({ summary: 'Get user loyalty account and tier status' })
  async getAccount(@Param('userId') userId: string) {
    return this.loyaltyService.getUserTier(userId);
  }

  @Post('cashback/calculate')
  @ApiOperation({ summary: 'Calculate cashback for transaction' })
  async calculateCashback(@Body() dto: CalculateCashbackDto) {
    return this.loyaltyService.calculateCashback(dto.userId, dto.amount);
  }
}
