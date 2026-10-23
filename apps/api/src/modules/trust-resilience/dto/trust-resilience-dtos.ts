import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetectTrustRiskDto {
  @ApiProperty({ description: 'Target entity type', example: 'CUSTOMER' })
  @IsString()
  @IsNotEmpty()
  targetType: 'CUSTOMER' | 'PROVIDER' | 'BOOKING' | 'REVIEW';

  @ApiProperty({ description: 'Target entity ID', example: 'cust_9872' })
  @IsString()
  @IsNotEmpty()
  targetId: string;

  @ApiProperty({ description: 'Specific trust anomaly indicator', example: 'BOOKING_ABUSE' })
  @IsString()
  @IsNotEmpty()
  incidentType: 'BOOKING_ABUSE' | 'REVIEW_MANIPULATION' | 'PAYMENT_VELOCITY' | 'PROVIDER_UNRELIABILITY';

  @ApiProperty({ description: 'Observed telemetry evidence signals' })
  @IsNotEmpty()
  evidenceSignals: Record<string, any>;

  @ApiProperty({ description: 'Multi-tenant ID', required: false, default: 'GLOBAL' })
  @IsString()
  @IsOptional()
  tenantId?: string = 'GLOBAL';
}

export class ReviewIncidentDto {
  @ApiProperty({ description: 'Incident ID to review', example: 'inc_12345' })
  @IsString()
  @IsNotEmpty()
  incidentId: string;

  @ApiProperty({ description: 'Resolution decision', example: 'CONFIRMED' })
  @IsString()
  @IsNotEmpty()
  decision: 'CONFIRMED' | 'OVERRIDDEN' | 'DISMISSED';

  @ApiProperty({ description: 'Reviewer user ID', example: 'admin_ops_1' })
  @IsString()
  @IsNotEmpty()
  reviewerId: string;

  @ApiProperty({ description: 'Operational justification notes' })
  @IsString()
  @IsNotEmpty()
  notes: string;
}

export class SubmitAppealDto {
  @ApiProperty({ description: 'Incident ID being appealed', example: 'inc_12345' })
  @IsString()
  @IsNotEmpty()
  incidentId: string;

  @ApiProperty({ description: 'User submitting the appeal', example: 'prov_4432' })
  @IsString()
  @IsNotEmpty()
  appellantId: string;

  @ApiProperty({ description: 'Justification and explanation for the appeal' })
  @IsString()
  @IsNotEmpty()
  justification: string;

  @ApiProperty({ description: 'Supporting evidence payload', required: false })
  @IsOptional()
  evidence?: Record<string, any>;
}

export class ExplainDecisionDto {
  @ApiProperty({ description: 'Autonomous Decision ID', example: 'dec_98765' })
  @IsString()
  @IsNotEmpty()
  decisionId: string;

  @ApiProperty({ description: 'Event that triggered the autonomous decision', example: 'SUPPLY_DEFICIT_DETECTED' })
  @IsString()
  @IsNotEmpty()
  initiatingEvent: string;

  @ApiProperty({ description: 'Marketplace resource affected', example: 'ZONE_DOWNTOWN_HVAC' })
  @IsString()
  @IsNotEmpty()
  affectedResource: string;

  @ApiProperty({ description: 'Policy identifier applied', example: 'DYNAMIC_PRICING_GUARDRAIL_V2' })
  @IsString()
  @IsNotEmpty()
  policyApplied: string;

  @ApiProperty({ description: 'Policy version', example: 'v2.1' })
  @IsString()
  @IsOptional()
  policyVersion?: string = 'v1.0';

  @ApiProperty({ description: 'Autonomy level (0-5)', example: 3 })
  @IsNumber()
  @Min(0)
  @Max(5)
  autonomyLevel: number;

  @ApiProperty({ description: 'Statistical confidence score (0-1)', example: 0.92 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceScore: number;

  @ApiProperty({ description: 'Selected action type', example: 'PROVIDER_INCENTIVE_PAYOUT' })
  @IsString()
  @IsNotEmpty()
  selectedAction: string;

  @ApiProperty({ description: 'Alternatives evaluated and discarded' })
  @IsArray()
  alternativesConsidered: Array<{
    actionType: string;
    score: number;
    discardReason: string;
  }>;

  @ApiProperty({ description: 'Key evidence signals informing decision' })
  @IsNotEmpty()
  keyEvidenceSignals: Record<string, any>;

  @ApiProperty({ description: 'Human-readable trade-off analysis' })
  @IsString()
  @IsNotEmpty()
  tradeoffAnalysis: string;

  @ApiProperty({ description: 'Human executive approval obtained flag', default: false })
  @IsBoolean()
  @IsOptional()
  humanApprovalObtained?: boolean = false;

  @ApiProperty({ description: 'Tenant ID', default: 'GLOBAL' })
  @IsString()
  @IsOptional()
  tenantId?: string = 'GLOBAL';
}

export class CircuitBreakerConfigDto {
  @ApiProperty({ description: 'Downstream service identifier', example: 'PAYMENT_GATEWAY_STRIPE' })
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @ApiProperty({ description: 'Number of consecutive failures to trip circuit', example: 5 })
  @IsNumber()
  @Min(1)
  failureThreshold: number = 5;

  @ApiProperty({ description: 'Cooldown duration in milliseconds before half-open probe', example: 30000 })
  @IsNumber()
  @Min(1000)
  recoveryTimeMs: number = 30000;
}

export class TriggerRemediationWithGuardDto {
  @ApiProperty({ description: 'Remediation unique task key', example: 'remed_dlq_booking_sync' })
  @IsString()
  @IsNotEmpty()
  remediationKey: string;

  @ApiProperty({ description: 'Action type to perform', example: 'RETRY_DLQ_MESSAGES' })
  @IsString()
  @IsNotEmpty()
  actionType: string;

  @ApiProperty({ description: 'Remediation action parameters' })
  @IsNotEmpty()
  payload: Record<string, any>;

  @ApiProperty({ description: 'Tenant ID', default: 'GLOBAL' })
  @IsString()
  @IsOptional()
  tenantId?: string = 'GLOBAL';
}
