import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class OnboardFranchiseDto {
  @IsString()
  brandName!: string;

  @IsString()
  ownerEmail!: string;

  @IsString()
  primaryRegion!: string;

  @IsNumber()
  @Min(0)
  @Max(50)
  royaltyPercentage!: number;

  @IsOptional()
  @IsString()
  taxIdNumber?: string;
}
