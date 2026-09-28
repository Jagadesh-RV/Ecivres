import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DynamicLanguageLoaderService {
  private readonly logger = new Logger(DynamicLanguageLoaderService.name);

  private readonly rtlLanguages = new Set(['ar', 'he', 'fa', 'ur']);

  private readonly translations: Record<string, Record<string, string>> = {
    en: { welcome: 'Welcome to EcivreS', book_now: 'Book Service Now', total: 'Total' },
    hi: { welcome: 'एसीवरेस में आपका स्वागत है', book_now: 'अभी सेवा बुक करें', total: 'कुल' },
    ar: { welcome: 'مرحبا بكم في إيكفريس', book_now: 'احجز الخدمة الآن', total: 'المجموع' },
    es: { welcome: 'Bienvenido a EcivreS', book_now: 'Reservar Servicio Ahora', total: 'Total' },
    fr: { welcome: 'Bienvenue sur EcivreS', book_now: 'Réserver un service maintenant', total: 'Total' },
  };

  getTranslations(locale: string): Record<string, string> {
    const lang = locale.toLowerCase().slice(0, 2);
    const dict = this.translations[lang] || this.translations['en'];
    this.logger.log(`Loaded ${Object.keys(dict).length} translation keys for locale ${locale}`);
    return dict;
  }

  evaluateRtlLayout(locale: string): { isRtl: boolean; direction: 'rtl' | 'ltr' } {
    const lang = locale.toLowerCase().slice(0, 2);
    const isRtl = this.rtlLanguages.has(lang);
    return { isRtl, direction: isRtl ? 'rtl' : 'ltr' };
  }

  formatLocalizedCurrency(amount: number, currencyCode: string, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amount);
  }
}
