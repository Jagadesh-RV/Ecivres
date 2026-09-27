import { Module } from '@nestjs/common';
import { CustomerMissionService } from './services/customer-mission.service';
import { CustomerMissionsController } from './customer-missions.controller';

@Module({
  controllers: [CustomerMissionsController],
  providers: [CustomerMissionService],
  exports: [CustomerMissionService],
})
export class CustomerMissionsModule {}
