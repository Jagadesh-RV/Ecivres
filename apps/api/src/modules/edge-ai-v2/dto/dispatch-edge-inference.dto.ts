import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DispatchEdgeInferenceDto {
  @ApiProperty({ description: 'Target Regional Edge Node ID', example: 'edge_node_fra1' })
  @IsString()
  edgeNodeId: string;

  @ApiProperty({ description: 'SHA-256 Input Feature Hash', example: 'hash_99a8b7c6' })
  @IsString()
  inputHash: string;

  @ApiProperty({ description: 'Inference Output JSON String', example: '{"recommendations":["srv_1","srv_2"]}' })
  @IsString()
  outputJson: string;
}
