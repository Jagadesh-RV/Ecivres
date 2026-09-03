import { IsOptional, IsUUID, IsNumberString, IsString } from 'class-validator';

export class ServiceQueryDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsUUID()
  @IsOptional()
  providerId?: string;

  @IsNumberString()
  @IsOptional()
  minPrice?: string;

  @IsNumberString()
  @IsOptional()
  maxPrice?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;
}
