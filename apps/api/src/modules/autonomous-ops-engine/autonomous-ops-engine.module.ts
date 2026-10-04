import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AutomationPolicyService } from './services/automation-policy.service';
import { AutomationApprovalService } from './services/automation-approval.service';
import { AutomationAuditService } from './services/automation-audit.service';
import { AutonomousOperationsService } from './services/autonomous-operations.service';
import { AutonomousOpsController } from './autonomous-ops.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AutonomousOpsController],
  providers: [
    AutomationPolicyService,
    AutomationApprovalService,
    AutomationAuditService,
    AutonomousOperationsService,
  ],
  exports: [
    AutomationPolicyService,
    AutomationApprovalService,
    AutomationAuditService,
    AutonomousOperationsService,
  ],
})
export class AutonomousOpsEngineModule {}
