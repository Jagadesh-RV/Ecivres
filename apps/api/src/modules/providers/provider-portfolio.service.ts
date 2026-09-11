import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PortfolioItem {
  id: string;
  providerId: string;
  title: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  videoUrl?: string;
  category: string;
  tags: string[];
}

export interface CertificateItem {
  id: string;
  providerId: string;
  title: string;
  issuingOrganization: string;
  issueDate: Date;
  certificateUrl?: string;
  verified: boolean;
}

@Injectable()
export class ProviderPortfolioService {
  private portfolioStore: Map<string, PortfolioItem[]> = new Map();
  private certificateStore: Map<string, CertificateItem[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async addPortfolioItem(
    providerId: string,
    dto: { title: string; beforeImageUrl?: string; afterImageUrl?: string; videoUrl?: string; category: string; tags?: string[] },
  ): Promise<PortfolioItem> {
    const list = this.portfolioStore.get(providerId) || [];
    const item: PortfolioItem = {
      id: `port_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      providerId,
      title: dto.title,
      beforeImageUrl: dto.beforeImageUrl,
      afterImageUrl: dto.afterImageUrl,
      videoUrl: dto.videoUrl,
      category: dto.category,
      tags: dto.tags || [],
    };
    list.push(item);
    this.portfolioStore.set(providerId, list);
    return item;
  }

  async getPortfolio(providerId: string): Promise<PortfolioItem[]> {
    return this.portfolioStore.get(providerId) || [];
  }

  async addCertificate(
    providerId: string,
    dto: { title: string; issuingOrganization: string; issueDate: Date; certificateUrl?: string },
  ): Promise<CertificateItem> {
    const list = this.certificateStore.get(providerId) || [];
    const cert: CertificateItem = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      providerId,
      title: dto.title,
      issuingOrganization: dto.issuingOrganization,
      issueDate: dto.issueDate,
      certificateUrl: dto.certificateUrl,
      verified: true, // Auto-verified in prototype
    };
    list.push(cert);
    this.certificateStore.set(providerId, list);
    return cert;
  }

  async getCertificates(providerId: string): Promise<CertificateItem[]> {
    return this.certificateStore.get(providerId) || [];
  }
}
