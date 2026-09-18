import { Module } from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { TerritoryService } from './territory.service';
import { RoyaltyCalculatorService } from './royalty-calculator.service';
import { FranchiseController } from './franchise.controller';

@Module({
  controllers: [FranchiseController],
  providers: [FranchiseService, TerritoryService, RoyaltyCalculatorService],
  exports: [FranchiseService, TerritoryService, RoyaltyCalculatorService],
})
export class FranchiseModule {}
