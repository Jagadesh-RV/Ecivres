import { IsString, IsNumber, IsOptional } from 'class-validator';

export class SwarmProposalDto {
  @IsString()
  title: string;

  @IsString()
  proposedAction: string;

  @IsNumber()
  proposedValue: number;

  @IsString()
  @IsOptional()
  region?: string = 'GLOBAL';
}
