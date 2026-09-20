import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { K8sSelfHealingService } from './services/k8s-self-healing.service';
import { AutonomousRecoveryController } from './autonomous-recovery.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AutonomousRecoveryController],
  providers: [K8sSelfHealingService],
  exports: [K8sSelfHealingService],
})
export class AutonomousRecoveryModule {}
