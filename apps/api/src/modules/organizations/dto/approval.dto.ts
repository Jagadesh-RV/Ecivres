import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluateApprovalDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ description: 'Requester User ID' })
  @IsString()
  @IsNotEmpty()
  requesterUserId: string;

  @ApiProperty({ description: 'Booking total amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Department ID' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
