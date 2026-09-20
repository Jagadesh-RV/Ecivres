import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PredictiveMaintenanceService } from './services/predictive-maintenance.service';
import { SmartHomeIotController } from './smart-home-iot.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SmartHomeIotController],
  providers: [PredictiveMaintenanceService],
  exports: [PredictiveMaintenanceService],
})
export class SmartHomeIotModule {}
