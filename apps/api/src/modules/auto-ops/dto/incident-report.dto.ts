import { IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL_OUTAGE = 'CRITICAL_OUTAGE',
}

export class IncidentReportDto {
  @IsString()
  serviceName!: string;

  @IsEnum(IncidentSeverity)
  severity!: IncidentSeverity;

  @IsNumber()
  @Min(0)
  errorRatePercentage!: number;

  @IsNumber()
  p99LatencyMs!: number;
}
