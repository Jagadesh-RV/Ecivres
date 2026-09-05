import { calculateInvoice } from './invoice-calculator';

describe('InvoiceCalculator', () => {
  it('should calculate subtotal, tax, platform fee, and total accurately', () => {
    const invoice = calculateInvoice(100, 10, 0, 5);
    expect(invoice.subtotal).toBe(100);
    expect(invoice.taxAmount).toBe(10);
    expect(invoice.platformFee).toBe(5);
    expect(invoice.totalAmount).toBe(115);
  });

  it('should apply discount before tax calculation', () => {
    const invoice = calculateInvoice(100, 10, 20, 5);
    // Taxable = 80, Tax = 8, Fee = 5, Total = 93
    expect(invoice.discountAmount).toBe(20);
    expect(invoice.taxAmount).toBe(8);
    expect(invoice.totalAmount).toBe(93);
  });
});
