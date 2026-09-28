import { Injectable, Logger } from '@nestjs/common';

export interface RequiredDocumentRule {
  docType: string;
  name: string;
  isMandatory: boolean;
}

@Injectable()
export class RegionalKycRulesService {
  private readonly logger = new Logger(RegionalKycRulesService.name);

  private readonly kycRulesByCountry: Record<string, RequiredDocumentRule[]> = {
    IN: [
      { docType: 'AADHAAR', name: 'Aadhaar Card', isMandatory: true },
      { docType: 'PAN', name: 'PAN Card', isMandatory: true },
      { docType: 'GST_CERTIFICATE', name: 'GST Registration Certificate', isMandatory: false },
    ],
    US: [
      { docType: 'SSN_EIN', name: 'SSN or EIN Tax ID', isMandatory: true },
      { docType: 'DRIVERS_LICENSE', name: 'State Driver License / ID', isMandatory: true },
      { docType: 'GENERAL_LIABILITY_INSURANCE', name: 'General Liability Insurance Certificate', isMandatory: true },
    ],
    GB: [
      { docType: 'PASSPORT_NINO', name: 'UK Passport / National Insurance Number', isMandatory: true },
      { docType: 'COMPANIES_HOUSE_CRN', name: 'Companies House Registration Number', isMandatory: false },
    ],
    AE: [
      { docType: 'EMIRATES_ID', name: 'Emirates ID', isMandatory: true },
      { docType: 'TRADE_LICENSE', name: 'DED Trade License', isMandatory: true },
    ],
  };

  getRequiredKycDocuments(countryCode: string): RequiredDocumentRule[] {
    const rules = this.kycRulesByCountry[countryCode.toUpperCase()] || this.kycRulesByCountry['US'];
    this.logger.log(`Retrieved ${rules.length} required KYC document rules for country ${countryCode}`);
    return rules;
  }
}
