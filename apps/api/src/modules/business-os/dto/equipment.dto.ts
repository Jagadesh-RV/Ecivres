import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class TrackEquipmentDto {
  @IsString()
  providerId!: string;

  @IsString()
  equipmentName!: string;

  @IsNumber()
  @Min(0)
  purchaseCostUsd!: number;

  @IsNumber()
  @Min(1)
  expectedLifespanMonths!: number;

  @IsOptional()
  @IsString()
  serialNumber?: string;
}
