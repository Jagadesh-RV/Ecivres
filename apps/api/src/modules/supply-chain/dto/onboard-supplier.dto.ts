import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class OnboardSupplierDto {
  @IsString()
  supplierName!: string;

  @IsString()
  contactEmail!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(1)
  minimumOrderQuantity!: number;

  @IsOptional()
  @IsString()
  warehouseLocation?: string;
}
