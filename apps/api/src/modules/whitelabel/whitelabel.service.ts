import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface WhiteLabelTenantConfig {
  tenantId: string;
  brandName: string;
  logoUrl: string;
  customDomain?: string;
  domainVerified: boolean;
  themeColors: { primaryHex: string; secondaryHex: string; bgHex: string };
  emailBranding: { senderName: string; footerText: string };
  featureToggles: {
    enableArPreview: boolean;
    enableSplitPayments: boolean;
    enableGamification: boolean;
  };
}

@Injectable()
export class WhiteLabelService {
  private tenantConfigs: Map<string, WhiteLabelTenantConfig> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async setTenantConfig(dto: Omit<WhiteLabelTenantConfig, 'domainVerified'>): Promise<WhiteLabelTenantConfig> {
    const config: WhiteLabelTenantConfig = {
      ...dto,
      domainVerified: !!dto.customDomain,
    };
    this.tenantConfigs.set(dto.tenantId, config);
    return config;
  }

  async getTenantByDomain(domain: string): Promise<WhiteLabelTenantConfig | null> {
    for (const config of this.tenantConfigs.values()) {
      if (config.customDomain === domain) return config;
    }
    return null;
  }

  async getTenantConfig(tenantId: string): Promise<WhiteLabelTenantConfig> {
    const config = this.tenantConfigs.get(tenantId);
    if (!config) {
      // Default EcivreS fallback config
      return {
        tenantId,
        brandName: 'EcivreS',
        logoUrl: 'https://ecivres.com/logo.png',
        domainVerified: true,
        themeColors: { primaryHex: '#6366F1', secondaryHex: '#4F46E5', bgHex: '#0F172A' },
        emailBranding: { senderName: 'EcivreS Marketplace', footerText: 'Powered by EcivreS Platform' },
        featureToggles: {
          enableArPreview: true,
          enableSplitPayments: true,
          enableGamification: true,
        },
      };
    }
    return config;
  }
}
