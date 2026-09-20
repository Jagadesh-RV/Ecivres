import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DamageAssessmentService } from './services/damage-assessment.service';
import { ClaimsAutomationController } from './claims-automation.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClaimsAutomationController],
  providers: [DamageAssessmentService],
  exports: [DamageAssessmentService],
})
export class ClaimsAutomationModule {}
