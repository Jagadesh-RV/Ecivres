import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyWorkspaceDto {
  @ApiProperty({ description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ description: 'Corporate email domain' })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiPropertyOptional({ description: 'Monthly budget cap' })
  @IsNumber()
  @IsOptional()
  monthlyBudgetCap?: number;
}
