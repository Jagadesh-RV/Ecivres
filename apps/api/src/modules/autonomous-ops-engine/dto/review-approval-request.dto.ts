import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export enum ApprovalActionDto {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ReviewApprovalRequestDto {
  @IsEnum(ApprovalActionDto)
  @IsNotEmpty()
  action: ApprovalActionDto;

  @IsString()
  @IsOptional()
  reason?: string;
}
