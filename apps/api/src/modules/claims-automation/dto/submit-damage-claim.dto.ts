import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitDamageClaimDto {
  @ApiProperty({ description: 'Insurance Policy ID', example: 'pol_statefarm_1001' })
  @IsString()
  policyId: string;

  @ApiProperty({ description: 'Assigned Provider ID', example: 'prov_808' })
  @IsString()
  providerId: string;

  @ApiProperty({ description: 'Assessed Repair Damage Cost in USD', example: 1250.0 })
  @IsNumber()
  @Min(10)
  assessedAmount: number;
}
