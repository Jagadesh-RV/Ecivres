import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateDepartmentBudgetDto {
  @IsString()
  departmentId!: string;

  @IsNumber()
  @Min(0)
  allocatedBudget!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  warningThresholdPercentage?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
