import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum ScenarioType {
  SURGE_PRICING = 'SURGE_PRICING',
  TAKE_RATE_ADJUSTMENT = 'TAKE_RATE_ADJUSTMENT',
  MARKETING_SPIKE = 'MARKETING_SPIKE',
  PROVIDER_INCENTIVE = 'PROVIDER_INCENTIVE',
  EMERGENCY_DISRUPTION = 'EMERGENCY_DISRUPTION',
}

export class RunSimulationDto {
  @IsEnum(ScenarioType)
  scenarioType: ScenarioType;

  @IsNumber()
  parameterChangePct: number; // e.g. +15 or -5 %

  @IsString()
  @IsOptional()
  region?: string = 'GLOBAL';

  @IsString()
  @IsOptional()
  category?: string;
}
