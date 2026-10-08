import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class ExecuteActionDto {
  @IsString()
  @IsNotEmpty()
  decisionId!: string;

  @IsString()
  @IsNotEmpty()
  actionType!: string;

  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string;

  @IsString()
  @IsNotEmpty()
  targetEntity!: string;

  @IsObject()
  @IsNotEmpty()
  payload!: Record<string, any>;

  @IsObject()
  @IsOptional()
  compensationPayload?: Record<string, any>;

  @IsString()
  @IsOptional()
  tenantId?: string;
}
