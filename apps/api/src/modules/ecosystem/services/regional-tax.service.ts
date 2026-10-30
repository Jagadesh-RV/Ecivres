import { Injectable, Logger } from '@nestjs/common';
import { RegionalMarketService } from './regional-market.service';
import { CurrencyMathService, MoneyValue } from './currency-math.service';
import { CalculateRegionalTaxDto, RegionalTaxResultDto } from '../dto/regional.dto';

@Injectable()
export class RegionalTaxService {
  private readonly logger = new Logger(RegionalTaxService.name);

  constructor(
    private readonly regionalMarketService: RegionalMarketService,
    private readonly mathService: CurrencyMathService,
  ) {}

  /**
   * Calculates statutory tax/VAT/GST amount for a given order in a region.
   */
  async calculateTax(dto: CalculateRegionalTaxDto): Promise<RegionalTaxResultDto> {
    const region = await this.regionalMarketService.getRegion(dto.regionCode);
    const subtotal: MoneyValue = {
      minorUnits: dto.subtotalMinorUnits,
      currency: dto.currency.toUpperCase(),
    };

    const taxRatePercent = region.defaultTaxRate;
    // Basis points = taxRatePercent * 100 (e.g. 20% = 2000 basis points)
    const basisPoints = Math.round(taxRatePercent * 100);

    const taxAmount = this.mathService.multiplyBasisPoints(subtotal, basisPoints);
    const total = this.mathService.add(subtotal, taxAmount);

    this.logger.debug(
      `Tax computed for ${region.code} (${region.taxType} @ ${taxRatePercent}%): Subtotal=${subtotal.minorUnits}, Tax=${taxAmount.minorUnits}, Total=${total.minorUnits}`,
    );

    return {
      regionCode: region.code,
      taxType: region.taxType,
      taxRatePercent,
      taxMinorUnits: taxAmount.minorUnits,
      totalMinorUnits: total.minorUnits,
      currency: dto.currency.toUpperCase(),
    };
  }
}
