import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegionalConfigService } from './regional-config.service';

@Injectable()
export class CountryActivationService {
  private readonly logger = new Logger(CountryActivationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly regionalConfig: RegionalConfigService,
  ) {}

  async activateCountry(code: string) {
    const config = this.regionalConfig.getRegionalConfig(code);
    this.logger.log(`Activating marketplace operations for ${config.countryName} (${code})`);

    const existing = await this.prisma.countryRecord.findUnique({ where: { code } });
    if (existing) {
      return this.prisma.countryRecord.update({
        where: { code },
        data: { isActive: true },
      });
    }

    return this.prisma.countryRecord.create({
      data: {
        code: config.countryCode,
        name: config.countryName,
        currencyCode: config.currency,
        currencySymbol: config.symbol,
        defaultLanguage: config.defaultLanguage,
        isRtl: config.defaultLanguage === 'ar',
        isActive: true,
        taxType: config.taxType,
        taxRatePercent: config.defaultTaxRatePercent,
      },
    });
  }

  async getActiveCountries() {
    return this.prisma.countryRecord.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
