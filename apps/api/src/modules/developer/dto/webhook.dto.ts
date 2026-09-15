import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestWebhookDispatchDto {
  @ApiProperty({ description: 'Webhook Subscription Object' })
  @IsObject()
  subscription: any;

  @ApiProperty({ description: 'Event type string' })
  @IsString()
  @IsNotEmpty()
  eventType: string;
}
