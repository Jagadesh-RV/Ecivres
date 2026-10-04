import { Injectable, Logger } from '@nestjs/common';
import { AnomalyRuleService, TelemetrySample } from './anomaly-rule.service';
import { AnomalyEventService } from './anomaly-event.service';
import { DetectAnomalyDto } from '../dto/detect-anomaly.dto';

@Injectable()
export class AnomalyDetectionService {
  private readonly logger = new Logger(AnomalyDetectionService.name);

  constructor(
    private readonly ruleService: AnomalyRuleService,
    private readonly eventService: AnomalyEventService,
  ) {}

  async processTelemetry(sample: TelemetrySample) {
    this.logger.log(`Processing telemetry sample for metric ${sample.metricName}...`);
    const evalResult = this.ruleService.evaluateTelemetry(sample);

    if (evalResult.isAnomaly) {
      const dto: DetectAnomalyDto = {
        type: evalResult.type,
        severity: evalResult.severity,
        region: sample.region,
        category: sample.category,
        evidence: evalResult.evidence,
        confidence: evalResult.confidence,
        recommendedAction: evalResult.recommendedAction,
      };
      return this.eventService.createAnomaly(dto);
    }

    return null;
  }
}
