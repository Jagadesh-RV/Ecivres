import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RegionalTaxCalculatorService } from './services/regional-tax-calculator.service';

@ApiTags('tax-global')
@Controller('tax-global')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TaxGlobalController {
  constructor(private readonly taxCalculator: RegionalTaxCalculatorService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate subtotal, tax amount, and total with tax' })
  async calculate(@Body() body: { subtotalAmount: number; taxType: 'VAT' | 'GST' | 'SALES_TAX'; taxRatePercent: number }) {
    return this.taxCalculator.calculateTax(body.subtotalAmount, body.taxType, body.taxRatePercent);
  }

  @Post('validate-tax-id')
  @ApiOperation({ summary: 'Validate country-specific business tax ID format' })
  async validateTaxId(@Body() body: { countryCode: string; taxId: string }) {
    return this.taxCalculator.validateBusinessTaxId(body.countryCode, body.taxId);
  }
}
