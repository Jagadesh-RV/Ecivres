export interface InvoiceBreakdown {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  platformFee: number;
  totalAmount: number;
}

export function calculateInvoice(
  subtotal: number,
  taxRatePercent: number = 8.5,
  discountAmount: number = 0,
  platformFeePercent: number = 5,
): InvoiceBreakdown {
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number(((taxableAmount * taxRatePercent) / 100).toFixed(2));
  const platformFee = Number(((subtotal * platformFeePercent) / 100).toFixed(2));
  const totalAmount = Number((taxableAmount + taxAmount + platformFee).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount,
    discountAmount: Number(discountAmount.toFixed(2)),
    platformFee,
    totalAmount,
  };
}
