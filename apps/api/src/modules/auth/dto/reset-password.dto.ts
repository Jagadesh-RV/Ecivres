import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token received via email' })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({ description: 'New password to set' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
