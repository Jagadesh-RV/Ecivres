import { Controller, Post, Body } from '@nestjs/common';
import { IncidentReportDto } from './dto/incident-report.dto';
import { IncidentDetectorService } from './incident-detector.service';
import { AutoRemediationService } from './auto-remediation.service';

@Controller('auto-ops')
export class AutoOpsController {
  constructor(
    private readonly incidentDetector: IncidentDetectorService,
    private readonly autoRemediation: AutoRemediationService,
  ) {}

  @Post('evaluate-incident')
  evaluateIncident(@Body() dto: IncidentReportDto) {
    return this.incidentDetector.evaluateIncident(dto);
  }

  @Post('execute-remediation')
  executeRemediation(@Body() body: { incidentId: string; action: string }) {
    return this.autoRemediation.executeRemediation(body.incidentId, body.action);
  }
}
