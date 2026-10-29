import { IsString, IsNotEmpty, IsObject, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InboundWebhookDto {
  @ApiProperty({ description: 'Originating webhook provider', example: 'STRIPE' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ description: 'Unique external event ID assigned by provider', example: 'evt_123456789' })
  @IsString()
  @IsNotEmpty()
  externalEventId: string;

  @ApiProperty({ description: 'Cryptographic signature from request headers' })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ description: 'Unix timestamp from request headers for clock-skew verification' })
  @IsInt()
  timestamp: number;

  @ApiProperty({ description: 'Unique nonce for replay prevention', required: false })
  @IsString()
  @IsOptional()
  nonce?: string;

  @ApiProperty({ description: 'Event payload object' })
  @IsObject()
  payload: Record<string, any>;
}

export class WebhookProcessResultDto {
  @ApiProperty({ description: 'Internal event record ID' })
  eventId: string;

  @ApiProperty({ description: 'Event lifecycle status', example: 'PROCESSED' })
  status: 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'DEAD_LETTER';

  @ApiProperty({ description: 'Provider name' })
  provider: string;

  @ApiProperty({ description: 'Whether the event was already received (idempotent no-op)' })
  isDuplicate: boolean;

  @ApiProperty({ description: 'Processing latency in milliseconds' })
  latencyMs: number;

  @ApiProperty({ description: 'Error message if processing failed', required: false })
  error?: string;
}

export class WebhookReconciliationQueryDto {
  @ApiProperty({ description: 'Provider name to reconcile', required: false })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({ description: 'Filter by event status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Maximum events to process', default: 50 })
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  limit?: number = 50;
}
