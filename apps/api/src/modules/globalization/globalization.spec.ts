import { MultiCurrencyService } from './multi-currency.service';
import { RegionalTaxService } from './regional-tax.service';

describe('Global Expansion Services', () => {
  describe('MultiCurrencyService', () => {
    let fx: MultiCurrencyService;

    beforeEach(() => {
      fx = new MultiCurrencyService();
    });

    it('should convert USD to INR at rate 83.5', () => {
      const res = fx.convertCurrency(100, 'USD', 'INR');
      expect(res.convertedAmount).toBe(8350);
    });
  });

  describe('RegionalTaxService', () => {
    let tax: RegionalTaxService;

    beforeEach(() => {
      tax = new RegionalTaxService();
    });

    it('should calculate 20% VAT for UK/GB transactions', () => {
      const res = tax.calculateRegionalTax(100, 'GB');
      expect(res.taxName).toBe('VAT');
      expect(res.taxAmount).toBe(20);
      expect(res.totalWithTax).toBe(120);
    });
  });

  describe('ContentTranslatorService', () => {
    let translator: ContentTranslatorService;

    beforeEach(() => {
      const { ContentTranslatorService } = require('./content-translator.service');
      translator = new ContentTranslatorService();
    });

    it('should translate input texts to target locale format', async () => {
      const res = await translator.translateTexts({
        sourceLanguage: 'en',
        targetLanguage: 'es',
        texts: ['House Cleaning', 'Plumbing Repair'],
      });

      expect(res.targetLanguage).toBe('es');
      expect(res.translations['House Cleaning']).toBe('[ES] House Cleaning');
    });
  });
});
