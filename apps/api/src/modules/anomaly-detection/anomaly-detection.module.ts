import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AnomalyRuleService } from './services/anomaly-rule.service';
import { AnomalyEventService } from './services/anomaly-event.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { AnomalyController } from './anomaly.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AnomalyController],
  providers: [AnomalyRuleService, AnomalyEventService, AnomalyDetectionService],
  exports: [AnomalyRuleService, AnomalyEventService, AnomalyDetectionService],
})
export class AnomalyDetectionModule {}
