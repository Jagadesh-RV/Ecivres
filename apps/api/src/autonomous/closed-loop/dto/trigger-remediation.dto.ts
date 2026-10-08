import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class TriggerRemediationDto {
  @IsString()
  @IsNotEmpty()
  executionId!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsObject()
  @IsOptional()
  overridePayload?: Record<string, any>;
}
