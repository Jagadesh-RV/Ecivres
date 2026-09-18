import { IsString, IsArray, ArrayMinSize } from 'class-validator';

export class AllocateTerritoryDto {
  @IsString()
  franchiseId!: string;

  @IsString()
  branchName!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  assignedZipCodes!: string[];
}
