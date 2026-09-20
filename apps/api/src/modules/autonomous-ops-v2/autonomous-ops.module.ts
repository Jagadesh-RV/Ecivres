import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PredictiveScalingService } from './services/predictive-scaling.service';
import { AutonomousOpsController } from './autonomous-ops.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AutonomousOpsController],
  providers: [PredictiveScalingService],
  exports: [PredictiveScalingService],
})
export class AutonomousOpsModule {}
