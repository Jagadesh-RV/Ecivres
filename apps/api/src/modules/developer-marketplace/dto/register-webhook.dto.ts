import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterWebhookDto {
  @ApiProperty({ description: 'Developer Application ID', example: 'app_dev_404' })
  @IsString()
  appId: string;

  @ApiProperty({ description: 'Webhook Destination Target URL', example: 'https://api.partner.com/webhooks/ecivres' })
  @IsUrl()
  targetUrl: string;

  @ApiProperty({ description: 'Subscribed Events JSON String', example: '["booking.created","booking.completed"]' })
  @IsString()
  eventsJson: string;
}
