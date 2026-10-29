import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMarketplaceRegionDto } from '../dto/regional.dto';

export interface RegionConfigRecord {
  id: string;
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  defaultLocale: string;
  timezone: string;
  taxType: 'SALES_TAX' | 'GST' | 'VAT';
  defaultTaxRate: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PLANNED';
  supportedGateways: string[];
  cancellationWindowHours: number;
}

@Injectable()
export class RegionalMarketService {
  private readonly logger = new Logger(RegionalMarketService.name);
  private readonly inMemoryRegions = new Map<string, RegionConfigRecord>();

  constructor(private readonly prisma: PrismaService) {
    this.seedDefaultRegions();
  }

  private seedDefaultRegions(): void {
    const defaults: CreateMarketplaceRegionDto[] = [
      { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', defaultLocale: 'en-US', timezone: 'America/New_York', taxType: 'SALES_TAX', defaultTaxRate: 8.5, supportedGateways: ['STRIPE', 'APPLE_PAY', 'GOOGLE_PAY'], cancellationWindowHours: 24 },
      { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', defaultLocale: 'hi-IN', timezone: 'Asia/Kolkata', taxType: 'GST', defaultTaxRate: 18.0, supportedGateways: ['RAZORPAY', 'UPI', 'STRIPE'], cancellationWindowHours: 12 },
      { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', defaultLocale: 'en-GB', timezone: 'Europe/London', taxType: 'VAT', defaultTaxRate: 20.0, supportedGateways: ['STRIPE', 'APPLE_PAY'], cancellationWindowHours: 24 },
      { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'AED', defaultLocale: 'ar-AE', timezone: 'Asia/Dubai', taxType: 'VAT', defaultTaxRate: 5.0, supportedGateways: ['STRIPE', 'APPLE_PAY'], cancellationWindowHours: 48 },
      { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', defaultLocale: 'de-DE', timezone: 'Europe/Berlin', taxType: 'VAT', defaultTaxRate: 19.0, supportedGateways: ['STRIPE', 'SEPA'], cancellationWindowHours: 24 },
      { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: 'S$', defaultLocale: 'en-SG', timezone: 'Asia/Singapore', taxType: 'GST', defaultTaxRate: 9.0, supportedGateways: ['STRIPE', 'PAYNOW'], cancellationWindowHours: 24 },
      { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', defaultLocale: 'ja-JP', timezone: 'Asia/Tokyo', taxType: 'VAT', defaultTaxRate: 10.0, supportedGateways: ['STRIPE', 'LINE_PAY'], cancellationWindowHours: 24 },
    ];

    for (const r of defaults) {
      this.inMemoryRegions.set(r.code.toUpperCase(), {
        id: `reg_${r.code.toLowerCase()}`,
        code: r.code.toUpperCase(),
        name: r.name,
        currency: r.currency.toUpperCase(),
        currencySymbol: r.currencySymbol,
        defaultLocale: r.defaultLocale,
        timezone: r.timezone,
        taxType: r.taxType,
        defaultTaxRate: r.defaultTaxRate,
        status: 'ACTIVE',
        supportedGateways: r.supportedGateways,
        cancellationWindowHours: r.cancellationWindowHours ?? 24,
      });
    }
  }

  async getRegion(code: string): Promise<RegionConfigRecord> {
    const key = code.toUpperCase();
    const inMem = this.inMemoryRegions.get(key);
    if (inMem) return inMem;

    try {
      const fromDb = await this.prisma.marketplaceRegion.findUnique({
        where: { code: key },
      });
      if (fromDb) {
        const record: RegionConfigRecord = {
          id: fromDb.id,
          code: fromDb.code,
          name: fromDb.name,
          currency: fromDb.currency,
          currencySymbol: fromDb.currencySymbol,
          defaultLocale: fromDb.defaultLocale,
          timezone: fromDb.timezone,
          taxType: fromDb.taxType as any,
          defaultTaxRate: fromDb.defaultTaxRate,
          status: fromDb.status as any,
          supportedGateways: (fromDb.supportedGateways as any) || [],
          cancellationWindowHours: fromDb.cancellationWindowHours,
        };
        this.inMemoryRegions.set(key, record);
        return record;
      }
    } catch {}

    throw new NotFoundException(`Marketplace region '${code}' is not supported or active.`);
  }

  async listActiveRegions(): Promise<RegionConfigRecord[]> {
    return Array.from(this.inMemoryRegions.values()).filter((r) => r.status === 'ACTIVE');
  }

  async registerRegion(dto: CreateMarketplaceRegionDto): Promise<RegionConfigRecord> {
    const key = dto.code.toUpperCase();
    const record: RegionConfigRecord = {
      id: `reg_${dto.code.toLowerCase()}`,
      code: key,
      name: dto.name,
      currency: dto.currency.toUpperCase(),
      currencySymbol: dto.currencySymbol,
      defaultLocale: dto.defaultLocale,
      timezone: dto.timezone,
      taxType: dto.taxType,
      defaultTaxRate: dto.defaultTaxRate,
      status: 'ACTIVE',
      supportedGateways: dto.supportedGateways,
      cancellationWindowHours: dto.cancellationWindowHours ?? 24,
    };

    this.inMemoryRegions.set(key, record);

    try {
      await this.prisma.marketplaceRegion.upsert({
        where: { code: key },
        create: {
          id: record.id,
          code: record.code,
          name: record.name,
          currency: record.currency,
          currencySymbol: record.currencySymbol,
          defaultLocale: record.defaultLocale,
          timezone: record.timezone,
          taxType: record.taxType,
          defaultTaxRate: record.defaultTaxRate,
          status: record.status,
          supportedGateways: record.supportedGateways,
          cancellationWindowHours: record.cancellationWindowHours,
        },
        update: {
          name: record.name,
          defaultTaxRate: record.defaultTaxRate,
          status: record.status,
          supportedGateways: record.supportedGateways,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist region ${key} to DB: ${err.message}`);
    }

    this.logger.log(`Registered marketplace region: ${dto.name} (${key})`);
    return record;
  }
}
