import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MultiCurrencyService } from './multi-currency.service';
import { RegionalTaxService } from './regional-tax.service';

@Controller('globalization')
export class GlobalizationController {
  constructor(
    private readonly currencyService: MultiCurrencyService,
    private readonly taxService: RegionalTaxService,
  ) {}

  @Post('convert-currency')
  convertCurrency(@Body() body: { amount: number; from: string; to: string }) {
    return this.currencyService.convertCurrency(body.amount, body.from, body.to);
  }

  @Get('regional-tax')
  getTax(@Query('amount') amount: number, @Query('country') country: string) {
    return this.taxService.calculateRegionalTax(Number(amount) || 100, country || 'US');
  }
}
