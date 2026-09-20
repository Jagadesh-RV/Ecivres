import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGraphNodeDto {
  @ApiProperty({ description: 'Graph Node Entity Type', example: 'SERVICE' })
  @IsString()
  entityType: string;

  @ApiProperty({ description: 'Graph Node Label', example: 'Emergency Plumbing Repair' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Node Properties JSON String', example: '{"category":"plumbing","urgency":"high"}' })
  @IsString()
  propertiesJson: string;
}
