import { IsString, IsNumber, Min } from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsString()
  supplierId!: string;

  @IsString()
  itemSku!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPriceUsd!: number;
}
