import { Module } from '@nestjs/common';
import { LoyaltyVipTierService } from './services/loyalty-vip-tier.service';
import { LoyaltyController } from './loyalty.controller';

@Module({
  controllers: [LoyaltyController],
  providers: [LoyaltyVipTierService],
  exports: [LoyaltyVipTierService],
})
export class LoyaltyModule {}
