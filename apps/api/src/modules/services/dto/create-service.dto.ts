import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateServiceDto {
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  duration: number; // Duration in minutes
}
