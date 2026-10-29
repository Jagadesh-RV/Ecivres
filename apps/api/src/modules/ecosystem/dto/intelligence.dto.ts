import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsObject, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type IntelligenceSignalCategory =
  | 'FACT'
  | 'STATISTICAL_ESTIMATE'
  | 'PREDICTION'
  | 'RECOMMENDATION'
  | 'EXECUTED_ACTION';

export type IntelligenceMetricType =
  | 'LIQUIDITY_RATIO'
  | 'DEMAND_SURGE'
  | 'SUPPLY_IMBALANCE'
  | 'CONVERSION_DRIFT';

export class RecordIntelligenceSignalDto {
  @ApiProperty({ description: 'Region code', example: 'US' })
  @IsString()
  @IsNotEmpty()
  regionCode: string;

  @ApiProperty({ description: 'Metric type', example: 'LIQUIDITY_RATIO' })
  @IsString()
  @IsNotEmpty()
  metricType: IntelligenceMetricType;

  @ApiProperty({ description: 'Signal epistemic classification', example: 'STATISTICAL_ESTIMATE' })
  @IsString()
  @IsNotEmpty()
  signalType: IntelligenceSignalCategory;

  @ApiProperty({ description: 'Observed or computed value', example: 1.45 })
  @IsNumber()
  observedValue: number;

  @ApiProperty({ description: 'Expected baseline value for anomaly detection', required: false })
  @IsNumber()
  @IsOptional()
  baselineValue?: number;

  @ApiProperty({ description: 'Statistical confidence score (0.0 to 1.0)', default: 0.95 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  confidence?: number = 0.95;

  @ApiProperty({ description: 'Evidence payload supporting the signal', required: false })
  @IsObject()
  @IsOptional()
  evidenceJson?: Record<string, any>;
}

export class ProvenanceRecordDto {
  @ApiProperty({ description: 'Unique decision or signal identifier' })
  signalId: string;

  @ApiProperty({ description: 'Epistemic classification' })
  classification: IntelligenceSignalCategory;

  @ApiProperty({ description: 'Data quality indicator (0 to 1)' })
  dataQualityScore: number;

  @ApiProperty({ description: 'Whether the data is statistically sufficient for autonomous action' })
  isSufficientData: boolean;

  @ApiProperty({ description: 'Timestamp when signal was recorded' })
  recordedAt: Date;
}
