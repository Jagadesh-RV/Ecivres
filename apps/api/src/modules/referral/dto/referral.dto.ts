import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferralDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customCode?: string;

  @ApiProperty({ required: false, default: 15.0 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  rewardAmount?: number = 15.0;
}

export class RedeemReferralDto {
  @ApiProperty({ example: 'REF-A1B2C3' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
