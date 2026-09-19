import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class EdgeRouteDto {
  @IsString()
  clientIp!: string;

  @IsString()
  requestPath!: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
