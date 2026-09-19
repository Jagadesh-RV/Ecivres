import { Injectable, Logger } from '@nestjs/common';
import { IncidentReportDto } from './dto/incident-report.dto';

export interface IncidentEvaluation {
  incidentId: string;
  serviceName: string;
  isActionRequired: boolean;
  recommendedRemediation: string;
  detectedAt: string;
}

@Injectable()
export class IncidentDetectorService {
  private readonly logger = new Logger(IncidentDetectorService.name);

  async evaluateIncident(dto: IncidentReportDto): Promise<IncidentEvaluation> {
    const incidentId = `inc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const isActionRequired = dto.errorRatePercentage > 1.0 || dto.p99LatencyMs > 500;

    this.logger.warn(`AI Incident Detector analyzing ${dto.serviceName}: ErrorRate=${dto.errorRatePercentage}%, Latency=${dto.p99LatencyMs}ms`);

    let recommendedRemediation = 'No action needed (nominal operating state)';
    if (dto.errorRatePercentage > 5.0) {
      recommendedRemediation = 'RESTART_POD_AND_DRAIN_CANARY';
    } else if (dto.p99LatencyMs > 500) {
      recommendedRemediation = 'SCALE_OUT_REPLICAS_50_PERCENT';
    }

    return {
      incidentId,
      serviceName: dto.serviceName,
      isActionRequired,
      recommendedRemediation,
      detectedAt: new Date().toISOString(),
    };
  }
}
