import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ReviewModerationAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class ModerateReviewDto {
  @IsEnum(ReviewModerationAction)
  action: ReviewModerationAction;

  @IsOptional()
  @IsString()
  moderationNote?: string;
}
