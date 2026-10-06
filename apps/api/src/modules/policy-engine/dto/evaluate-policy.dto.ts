import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export enum PolicyActionType {
  SURGE_PRICING_TRIGGER = 'SURGE_PRICING_TRIGGER',
  TAKE_RATE_SHIFT = 'TAKE_RATE_SHIFT',
  MARKETING_BUDGET_ALLOCATION = 'MARKETING_BUDGET_ALLOCATION',
  PROVIDER_INCENTIVE_DISPATCH = 'PROVIDER_INCENTIVE_DISPATCH',
}

export class EvaluatePolicyDto {
  @IsEnum(PolicyActionType)
  actionType: PolicyActionType;

  @IsNumber()
  proposedValue: number; // e.g., surge multiplier 1.4, take rate 12%, budget 5000 USD

  @IsString()
  @IsOptional()
  region?: string = 'GLOBAL';

  @IsBoolean()
  @IsOptional()
  requireAutoExecution?: boolean = true;
}
