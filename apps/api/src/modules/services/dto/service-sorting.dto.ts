import { IsOptional, IsEnum, IsNumber, Min } from 'class-validator';

export enum ServiceSortOption {
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  RATING_DESC = 'RATING_DESC',
  NEWEST = 'NEWEST',
}

export class ServiceSortingDto {
  @IsOptional()
  @IsEnum(ServiceSortOption)
  sortBy?: ServiceSortOption = ServiceSortOption.NEWEST;

  @IsOptional()
  @IsNumber()
  @Min(0)
  radiusKm?: number;
}
