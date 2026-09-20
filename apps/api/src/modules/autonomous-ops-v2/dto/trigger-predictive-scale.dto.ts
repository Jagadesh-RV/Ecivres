import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriggerPredictiveScaleDto {
  @ApiProperty({ description: 'Target K8s Cluster ID', example: 'cluster_us_east' })
  @IsString()
  clusterId: string;

  @ApiProperty({ description: 'Target Replicas Count', example: 10 })
  @IsNumber()
  @Min(1)
  targetReplicas: number;

  @ApiProperty({ description: 'Predictive Metric Trigger', example: 'TRAFFIC_SPIKE_FORECAST' })
  @IsString()
  triggerMetric: string;
}
