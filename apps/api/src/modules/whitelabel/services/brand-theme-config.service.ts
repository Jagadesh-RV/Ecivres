import { Injectable, Logger } from '@nestjs/common';

export interface BrandThemeConfig {
  tenantId: string;
  logoUrl: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  faviconUrl?: string;
  customCss?: string;
}

@Injectable()
export class BrandThemeConfigService {
  private readonly logger = new Logger(BrandThemeConfigService.name);
  private readonly themesMap = new Map<string, BrandThemeConfig>();

  setTheme(tenantId: string, theme: Omit<BrandThemeConfig, 'tenantId'>) {
    const config: BrandThemeConfig = { tenantId, ...theme };
    this.themesMap.set(tenantId, config);
    this.logger.log(`Updated brand theme configuration for tenant ${tenantId}`);
    return config;
  }

  getTheme(tenantId: string): BrandThemeConfig {
    return (
      this.themesMap.get(tenantId) || {
        tenantId,
        logoUrl: 'https://cdn.ecivres.com/brand/default-logo.png',
        primaryColorHex: '#4F46E5',
        secondaryColorHex: '#06B6D4',
      }
    );
  }
}
