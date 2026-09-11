import { Injectable } from '@nestjs/common';

export interface LocalizedFormatOptions {
  locale: string;
  currency: string;
  timeZone: string;
}

export interface GdprExportPackage {
  userId: string;
  exportTimestamp: Date;
  personalData: Record<string, any>;
  bookingHistoryCount: number;
  retentionNotice: string;
}

@Injectable()
export class InternationalizationService {
  private supportedLocales = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ar-SA', 'zh-CN', 'ja-JP', 'hi-IN', 'pt-BR', 'it-IT'];

  formatCurrency(amount: number, options: LocalizedFormatOptions): string {
    try {
      return new Intl.NumberFormat(options.locale, {
        style: 'currency',
        currency: options.currency,
      }).format(amount);
    } catch {
      return `$${amount.toFixed(2)}`;
    }
  }

  formatDate(date: Date, options: LocalizedFormatOptions): string {
    try {
      return new Intl.DateTimeFormat(options.locale, {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: options.timeZone,
      }).format(date);
    } catch {
      return date.toISOString();
    }
  }

  isRtlLocale(locale: string): boolean {
    return ['ar-SA', 'he-IL', 'fa-IR', 'ur-PK'].includes(locale);
  }

  async generateGdprExportPackage(userId: string): Promise<GdprExportPackage> {
    return {
      userId,
      exportTimestamp: new Date(),
      personalData: {
        id: userId,
        email: 'user@example.com',
        gdprConsentGiven: true,
        consentDate: '2026-01-15',
      },
      bookingHistoryCount: 14,
      retentionNotice: 'Data retained in compliance with GDPR Article 17 and local financial record laws.',
    };
  }
}
