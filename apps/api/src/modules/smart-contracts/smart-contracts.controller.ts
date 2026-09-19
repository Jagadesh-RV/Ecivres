import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SmartEscrowService } from './services/smart-escrow.service';
import { CreateSmartEscrowDto } from './dto/create-escrow.dto';

@ApiTags('smart-contracts')
@Controller('smart-contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SmartContractsController {
  constructor(private readonly escrowService: SmartEscrowService) {}

  @Post('escrow')
  @ApiOperation({ summary: 'Create smart contract milestone escrow hold' })
  async createEscrow(@Body() dto: CreateSmartEscrowDto) {
    return this.escrowService.createEscrow(dto.bookingId, dto.amount, dto.milestone);
  }

  @Post('escrow/:id/release')
  @ApiOperation({ summary: 'Release smart contract milestone payout' })
  async releaseMilestone(@Param('id') id: string) {
    return this.escrowService.releaseMilestone(id);
  }
}
