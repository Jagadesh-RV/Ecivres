import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriageSupportTicketDto {
  @ApiProperty({ description: 'Support Ticket ID' })
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty({ description: 'Ticket subject line' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Ticket full description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
