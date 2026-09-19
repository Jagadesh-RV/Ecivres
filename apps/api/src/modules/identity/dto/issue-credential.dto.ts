import { IsString, IsObject } from 'class-validator';

export class IssueCredentialDto {
  @IsString()
  subjectDid!: string;

  @IsString()
  credentialType!: string;

  @IsObject()
  claims!: Record<string, any>;
}
