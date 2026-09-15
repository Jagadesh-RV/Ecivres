import { IsString, IsNumber, Min, Max } from 'class-validator';

export class SyntheticBenchmarkConfigDto {
  @IsString()
  testSuiteName!: string;

  @IsNumber()
  @Min(1)
  @Max(1000)
  simulatedRps!: number;

  @IsNumber()
  @Min(1)
  @Max(300)
  durationSeconds!: number;
}
