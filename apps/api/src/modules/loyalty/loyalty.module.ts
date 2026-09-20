import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LoyaltyTierService } from './services/loyalty-tier.service';
import { LoyaltyController } from './loyalty.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LoyaltyController],
  providers: [LoyaltyTierService],
  exports: [LoyaltyTierService],
})
export class LoyaltyModule {}
