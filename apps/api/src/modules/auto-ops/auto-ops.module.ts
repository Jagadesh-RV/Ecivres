import { Module } from '@nestjs/common';
import { IncidentDetectorService } from './incident-detector.service';
import { AutoRemediationService } from './auto-remediation.service';
import { AutoOpsController } from './auto-ops.controller';

@Module({
  controllers: [AutoOpsController],
  providers: [IncidentDetectorService, AutoRemediationService],
  exports: [IncidentDetectorService, AutoRemediationService],
})
export class AutoOpsModule {}
