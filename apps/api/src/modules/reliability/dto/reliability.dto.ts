import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, Min } from 'class-validator';

export enum IncidentSeverity {
  SEV1 = 'SEV1', // Critical customer impact / platform outage
  SEV2 = 'SEV2', // Major degradation of critical workflow
  SEV3 = 'SEV3', // Minor degradation / non-critical feature impaired
  SEV4 = 'SEV4', // Low impact operational anomaly
}

export enum SelfHealingActionType {
  REDRIVE_DEAD_LETTER_WEBHOOKS = 'REDRIVE_DEAD_LETTER_WEBHOOKS',
  RESET_TRIPPED_CIRCUIT_BREAKER = 'RESET_TRIPPED_CIRCUIT_BREAKER',
  DAMPEN_UNHEALTHY_INTEGRATION = 'DAMPEN_UNHEALTHY_INTEGRATION',
  THROTTLE_BACKGROUND_WORKERS = 'THROTTLE_BACKGROUND_WORKERS',
  RECONNECT_RESOURCE = 'RECONNECT_RESOURCE',
}

export class TriggerSelfHealingDto {
  @IsEnum(SelfHealingActionType)
  @IsNotEmpty()
  actionType: SelfHealingActionType;

  @IsString()
  @IsNotEmpty()
  targetComponent: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsString()
  @IsOptional()
  operatorAttribution?: string;

  @IsBoolean()
  @IsOptional()
  bypassApprovals?: boolean;
}

export class CreateIncidentReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(IncidentSeverity)
  @IsNotEmpty()
  severity: IncidentSeverity;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsOptional()
  affectedWorkflows?: string[];
}

export class RecordSloEventDto {
  @IsString()
  @IsNotEmpty()
  workflowName: string;

  @IsNumber()
  @Min(0)
  durationMs: number;

  @IsBoolean()
  success: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
