import { Module } from '@nestjs/common';
import { DynamicLanguageLoaderService } from './services/dynamic-language-loader.service';
import { I18nController } from './i18n.controller';

@Module({
  controllers: [I18nController],
  providers: [DynamicLanguageLoaderService],
  exports: [DynamicLanguageLoaderService],
})
export class I18nModule {}
