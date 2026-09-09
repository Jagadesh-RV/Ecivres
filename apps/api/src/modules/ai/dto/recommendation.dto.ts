import { IsOptional, IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RecommendationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

export class RecommendedProviderResponseDto {
  providerId: string;
  businessName: string;
  isVerified: boolean;
  score: number;
  breakdown: {
    ratingScore: number;
    completionScore: number;
    responseTimeScore: number;
    distanceScore: number;
    repeatCustomerScore: number;
  };
  distanceKm?: number;
  averageRating: number;
  completedBookingsCount: number;
}
