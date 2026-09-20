import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriggerRecoveryDto {
  @ApiProperty({ description: 'Target Kubernetes Cluster', example: 'us-east-prod-k8s' })
  @IsString()
  clusterName: string;

  @ApiProperty({ description: 'Target Deployment Name', example: 'api-service' })
  @IsString()
  targetDeployment: string;

  @ApiProperty({ description: 'Incident Trigger Reason', example: 'High Error Rate (> 5%)' })
  @IsString()
  reason: string;
}
