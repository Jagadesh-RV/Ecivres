import { IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';

export enum MunicipalCategory {
  WATER_MAIN_BREAK = 'WATER_MAIN_BREAK',
  STREET_LIGHT_REPAIR = 'STREET_LIGHT_REPAIR',
  POTHOLE_REPAVING = 'POTHOLE_REPAVING',
  PUBLIC_PARK_MAINTENANCE = 'PUBLIC_PARK_MAINTENANCE',
}

export class MunicipalRequestDto {
  @IsString()
  cityId!: string;

  @IsEnum(MunicipalCategory)
  category!: MunicipalCategory;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @IsString()
  reportedByCitizenId!: string;
}
