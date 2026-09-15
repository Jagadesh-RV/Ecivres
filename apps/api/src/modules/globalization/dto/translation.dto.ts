import { IsString, IsArray, ArrayMinSize } from 'class-validator';

export class TranslateContentDto {
  @IsString()
  sourceLanguage!: string;

  @IsString()
  targetLanguage!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  texts!: string[];
}
