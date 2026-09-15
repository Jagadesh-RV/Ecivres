import { Injectable, Logger } from '@nestjs/common';

export interface TaxReport1099 {
  taxYear: number;
  providerId: string;
  tinLast4: string;
  grossEarnings: number;
  platformFees: number;
  netTaxableIncome: number;
  reportPdfUrl: string;
}

@Injectable()
export class TaxReportingService {
  private readonly logger = new Logger(TaxReportingService.name);

  async generate1099KReport(providerId: string, year: number): Promise<TaxReport1099> {
    this.logger.log(`Generating 1099-K tax report for provider ${providerId} (Tax Year: ${year})`);

    const grossEarnings = 42500;
    const platformFees = 4250;

    return {
      taxYear: year,
      providerId,
      tinLast4: '9876',
      grossEarnings,
      platformFees,
      netTaxableIncome: grossEarnings - platformFees,
      reportPdfUrl: `https://cdn.ecivres.com/tax/1099k_${providerId}_${year}.pdf`,
    };
  }
}
