import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  label: string; // 'Home', 'Office', 'Apartment'

  @IsString()
  streetAddress: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
