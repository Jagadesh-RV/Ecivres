import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateAutomationPolicyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  triggerEvent: string;

  @IsObject()
  conditionRules: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  actionType: string;

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @IsNumber()
  @IsOptional()
  maxExecutionFrequencyMs?: number;
}
