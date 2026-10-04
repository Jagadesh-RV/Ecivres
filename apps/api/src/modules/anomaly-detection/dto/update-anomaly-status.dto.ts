import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AnomalyStatusDto {
  DETECTED = 'DETECTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export class UpdateAnomalyStatusDto {
  @IsEnum(AnomalyStatusDto)
  @IsNotEmpty()
  status: AnomalyStatusDto;
}
