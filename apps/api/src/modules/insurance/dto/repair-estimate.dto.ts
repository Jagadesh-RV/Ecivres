import { IsString, IsNumber, IsArray, Min } from 'class-validator';

export class RepairEstimateItemDto {
  @IsString()
  itemDescription!: string;

  @IsNumber()
  @Min(0)
  laborHours!: number;

  @IsNumber()
  @Min(0)
  materialsCostUsd!: number;
}

export class CalculateRepairEstimateDto {
  @IsString()
  claimId!: string;

  @IsArray()
  items!: RepairEstimateItemDto[];
}
