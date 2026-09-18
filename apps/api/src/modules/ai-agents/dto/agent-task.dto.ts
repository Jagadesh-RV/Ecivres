import { IsString, IsEnum, IsObject, IsOptional } from 'class-validator';

export enum AgentRole {
  CUSTOMER_AGENT = 'CUSTOMER_AGENT',
  PROVIDER_AGENT = 'PROVIDER_AGENT',
  LOGISTICS_AGENT = 'LOGISTICS_AGENT',
  FINANCE_AGENT = 'FINANCE_AGENT',
  OPERATIONS_AGENT = 'OPERATIONS_AGENT',
}

export class AgentTaskDto {
  @IsString()
  taskId!: string;

  @IsEnum(AgentRole)
  senderAgent!: AgentRole;

  @IsEnum(AgentRole)
  targetAgent!: AgentRole;

  @IsString()
  actionType!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
