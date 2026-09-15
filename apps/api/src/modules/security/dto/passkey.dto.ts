import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasskeyRegistrationOptionsDto {
  @ApiProperty({ description: 'Target User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
