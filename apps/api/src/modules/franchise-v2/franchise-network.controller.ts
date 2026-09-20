import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FranchiseNetworkService } from './services/franchise-network.service';
import { OnboardFranchiseNetworkDto } from './dto/onboard-franchise-network.dto';

@ApiTags('franchise-v2')
@Controller('franchise-v2')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FranchiseNetworkController {
  constructor(private readonly franchiseService: FranchiseNetworkService) {}

  @Post('networks')
  @ApiOperation({ summary: 'Onboard regional franchise marketplace network' })
  async onboardNetwork(@Body() dto: OnboardFranchiseNetworkDto) {
    return this.franchiseService.onboardNetwork(dto.regionCode, dto.name, dto.royaltyRate);
  }

  @Get('networks/:id/royalty-split')
  @ApiOperation({ summary: 'Calculate franchise network royalty split' })
  async calculateRoyaltySplit(@Param('id') id: string, @Query('revenue') revenue: string) {
    return this.franchiseService.calculateRoyaltySplit(id, parseFloat(revenue || '1000'));
  }
}
