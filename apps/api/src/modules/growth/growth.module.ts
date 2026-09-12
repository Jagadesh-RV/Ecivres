import { Module } from '@nestjs/common';
import { GrowthController } from './growth.controller';
import { GrowthService } from './growth.service';
import { LoyaltyExpansionService } from './loyalty-expansion.service';
import { CustomerMissionsService } from './customer-missions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GrowthController],
  providers: [GrowthService, LoyaltyExpansionService, CustomerMissionsService],
  exports: [GrowthService, LoyaltyExpansionService, CustomerMissionsService],
})
export class GrowthModule {}
