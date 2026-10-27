import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PolicyGovernanceService } from './policy-governance.service';
import { ImmutableAuditService } from './immutable-audit.service';
import { EnterpriseOrgService } from './enterprise-org.service';
import { DataPrivacyLifecycleService } from './data-privacy-lifecycle.service';
import { AutonomousGovernanceService } from './autonomous-governance.service';
import { GovernanceComplianceController } from './governance-compliance.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GovernanceComplianceController],
  providers: [
    PolicyGovernanceService,
    ImmutableAuditService,
    EnterpriseOrgService,
    DataPrivacyLifecycleService,
    AutonomousGovernanceService,
  ],
  exports: [
    PolicyGovernanceService,
    ImmutableAuditService,
    EnterpriseOrgService,
    DataPrivacyLifecycleService,
    AutonomousGovernanceService,
  ],
})
export class GovernanceComplianceModule {}
