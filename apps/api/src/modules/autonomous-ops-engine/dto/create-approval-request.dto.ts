import { IsString, IsNotEmpty, IsObject, IsEnum, IsOptional } from 'class-validator';
import { AnomalySeverityDto } from '../../anomaly-detection/dto/detect-anomaly.dto';

export class CreateApprovalRequestDto {
  @IsString()
  @IsNotEmpty()
  actionType: string;

  @IsString()
  @IsNotEmpty()
  requestedBy: string;

  @IsObject()
  context: Record<string, any>;

  @IsEnum(AnomalySeverityDto)
  @IsOptional()
  riskLevel?: AnomalySeverityDto;
}
