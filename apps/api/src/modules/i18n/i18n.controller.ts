import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DynamicLanguageLoaderService } from './services/dynamic-language-loader.service';

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: DynamicLanguageLoaderService) {}

  @Get('translations/:locale')
  @ApiOperation({ summary: 'Get active translation dictionary by locale' })
  async getTranslations(@Param('locale') locale: string) {
    return this.i18nService.getTranslations(locale);
  }

  @Get('rtl-check/:locale')
  @ApiOperation({ summary: 'Check if locale requires Right-To-Left (RTL) layout' })
  async checkRtl(@Param('locale') locale: string) {
    return this.i18nService.evaluateRtlLayout(locale);
  }

  @Get('format-currency')
  @ApiOperation({ summary: 'Format currency localized' })
  async formatCurrency(@Query('amount') amount: number, @Query('currency') currency: string, @Query('locale') locale?: string) {
    return {
      formatted: this.i18nService.formatLocalizedCurrency(Number(amount), currency, locale || 'en-US'),
    };
  }
}
