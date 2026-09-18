import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OnboardFranchiseDto } from './dto/onboard-franchise.dto';
import { AllocateTerritoryDto } from './dto/territory.dto';
import { FranchiseService } from './franchise.service';
import { TerritoryService } from './territory.service';
import { RoyaltyCalculatorService } from './royalty-calculator.service';

@Controller('franchise')
export class FranchiseController {
  constructor(
    private readonly franchiseService: FranchiseService,
    private readonly territoryService: TerritoryService,
    private readonly royaltyCalculator: RoyaltyCalculatorService,
  ) {}

  @Post('onboard')
  onboardFranchise(@Body() dto: OnboardFranchiseDto) {
    return this.franchiseService.onboardFranchise(dto);
  }

  @Post('territory')
  allocateTerritory(@Body() dto: AllocateTerritoryDto) {
    return this.territoryService.allocateTerritory(dto);
  }

  @Get('royalty-split')
  calculateRoyalty(
    @Query('franchiseId') franchiseId: string,
    @Query('grossRevenueUsd') grossRevenueUsd: number,
    @Query('royaltyPct') royaltyPct: number,
  ) {
    return this.royaltyCalculator.calculateRoyaltySplit(
      franchiseId || 'fran_demo',
      Number(grossRevenueUsd) || 10000,
      Number(royaltyPct) || 8,
    );
  }
}
