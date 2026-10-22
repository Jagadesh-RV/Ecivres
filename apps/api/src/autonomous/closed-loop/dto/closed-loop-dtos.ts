import { IsString, IsNotEmpty, IsOptional, IsObject, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MeasureOutcomeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  decisionId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  executionId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  metricName!: string;

  @ApiProperty()
  @IsNumber()
  expectedValue!: number;

  @ApiProperty()
  @IsNumber()
  actualValue!: number;

  @ApiProperty({ required: false, enum: ['1h', '24h', '7d'] })
  @IsOptional()
  measurementWindow?: '1h' | '24h' | '7d';

  @ApiProperty({ required: false })
  @IsOptional()
  attributionMethod?: 'OBSERVED' | 'PREDICTED' | 'SIMULATED' | 'ESTIMATED' | 'ATTRIBUTED';
}

export class EvaluateEffectivenessDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  decisionId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  executionId!: string;

  @ApiProperty({ enum: ['SUCCESS', 'FAILED', 'PARTIAL'] })
  @IsString()
  executionStatus!: 'SUCCESS' | 'FAILED' | 'PARTIAL';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  interventionCost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  measuredGmvImpact?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  unintendedNegativeEffects?: string[];
}

export class DigitalTwinSimulateDto {
  @ApiProperty()
  @IsArray()
  scenarios!: Array<{
    scenarioName: string;
    surgePriceMultiplier: number;
    providerIncentiveBonusPct: number;
    promotionDiscountPct: number;
    takeRatePct: number;
  }>;
}

export class CreateExperimentRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  hypothesis!: string;

  @ApiProperty()
  @IsString()
  objectiveMetric!: string;

  @ApiProperty()
  @IsObject()
  controlVariant!: Record<string, any>;

  @ApiProperty()
  @IsArray()
  testVariants!: Record<string, any>[];

  @ApiProperty()
  @IsObject()
  trafficSplit!: Record<string, number>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  errorGuardrailThreshold?: number;
}

export class EvaluateGuardrailsDto {
  @ApiProperty()
  @IsNumber()
  currentErrorRate!: number;

  @ApiProperty()
  @IsNumber()
  conversionDropPct!: number;

  @ApiProperty()
  @IsNumber()
  fraudIndicatorCount!: number;
}

export class RunOptimizationDto {
  @ApiProperty({ enum: ['MAX_GMV', 'MAX_REVENUE', 'MAX_PROVIDER_UTILIZATION', 'BALANCED_EQUILIBRIUM'] })
  @IsString()
  objective!: 'MAX_GMV' | 'MAX_REVENUE' | 'MAX_PROVIDER_UTILIZATION' | 'BALANCED_EQUILIBRIUM';

  @ApiProperty()
  @IsNumber()
  initialGmv!: number;

  @ApiProperty()
  @IsObject()
  constraints!: {
    maxSurgeMultiplier: number;
    maxProviderChurnPct: number;
    maxRefundRatePct: number;
    minProviderRetentionPct: number;
    budgetSubsidyCap: number;
  };
}

export class EvaluateDriftDto {
  @ApiProperty()
  @IsString()
  metricName!: string;

  @ApiProperty()
  @IsString()
  featureName!: string;

  @ApiProperty()
  @IsNumber()
  baselineValue!: number;

  @ApiProperty()
  @IsNumber()
  currentValue!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  driftThreshold?: number;
}

export class GovernanceTransitionRequestDto {
  @ApiProperty({ enum: ['POLICY', 'DECISION', 'ACTION', 'EXPERIMENT', 'AGENT', 'MODEL'] })
  @IsString()
  entityType!: 'POLICY' | 'DECISION' | 'ACTION' | 'EXPERIMENT' | 'AGENT' | 'MODEL';

  @ApiProperty()
  @IsString()
  entityId!: string;

  @ApiProperty({ enum: ['DRAFT', 'EVALUATING', 'APPROVED', 'ACTIVE', 'MONITORED', 'DEPRECATED', 'RETIRED'] })
  @IsString()
  targetState!: 'DRAFT' | 'EVALUATING' | 'APPROVED' | 'ACTIVE' | 'MONITORED' | 'DEPRECATED' | 'RETIRED';

  @ApiProperty()
  @IsString()
  reason!: string;

  @ApiProperty()
  @IsString()
  actorId!: string;
}

export class KillSwitchTriggerRequestDto {
  @ApiProperty({ enum: ['GLOBAL', 'TENANT', 'AGENT', 'ACTION', 'EXPERIMENT'] })
  @IsString()
  scope!: 'GLOBAL' | 'TENANT' | 'AGENT' | 'ACTION' | 'EXPERIMENT';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scopeId?: string;

  @ApiProperty()
  @IsString()
  reason!: string;

  @ApiProperty()
  @IsString()
  triggeredBy!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;
}
