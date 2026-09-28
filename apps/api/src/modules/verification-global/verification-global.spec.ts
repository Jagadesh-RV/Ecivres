import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RegionalKycRulesService } from './services/regional-kyc-rules.service';

describe('RegionalKycRulesService', () => {
  let service: RegionalKycRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionalKycRulesService],
    }).compile();

    service = module.get<RegionalKycRulesService>(RegionalKycRulesService);
  });

  it('should return Aadhaar & PAN mandatory rules for India (IN)', () => {
    const rules = service.getRequiredKycDocuments('IN');
    const docTypes = rules.map((r) => r.docType);
    expect(docTypes).toContain('AADHAAR');
    expect(docTypes).toContain('PAN');
  });

  it('should verify provider document cleanly', async () => {
    const res = await service.verifyRegionalDocument('p_100', 'IN', 'AADHAAR', '1234-5678-9012');
    expect(res.status).toBe('VERIFIED');
  });
});
