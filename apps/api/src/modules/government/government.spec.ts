import { Test, TestingModule } from '@nestjs/testing';
import { LicenseVerifierService } from './license-verifier.service';
import { BackgroundCheckService } from './background-check.service';

describe('Government Module Services', () => {
  let licenseVerifier: LicenseVerifierService;
  let backgroundCheck: BackgroundCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LicenseVerifierService, BackgroundCheckService],
    }).compile();

    licenseVerifier = module.get<LicenseVerifierService>(LicenseVerifierService);
    backgroundCheck = module.get<BackgroundCheckService>(BackgroundCheckService);
  });

  it('should validate active unexpired trade license', async () => {
    const res = await licenseVerifier.verifyLicense({
      providerId: 'prov_77',
      licenseNumber: 'LIC-WA-99881',
      issuingStateAuthority: 'WA State Dept of Licensing',
      tradeCategory: 'Electrical',
      expirationDate: '2028-12-31',
    });
    expect(res.verificationId).toBeDefined();
    expect(res.isValid).toBe(true);
    expect(res.verificationStatus).toBe('ACTIVE_VALIDATED');
  });

  it('should flag expired trade license', async () => {
    const res = await licenseVerifier.verifyLicense({
      providerId: 'prov_77',
      licenseNumber: 'LIC-WA-11223',
      issuingStateAuthority: 'WA State Dept of Licensing',
      tradeCategory: 'Plumbing',
      expirationDate: '2020-01-01',
    });
    expect(res.isValid).toBe(false);
    expect(res.verificationStatus).toBe('EXPIRED');
  });

  it('should pass criminal background check audit', async () => {
    const res = await backgroundCheck.performBackgroundCheck('prov_77', '9988');
    expect(res.cleared).toBe(true);
    expect(res.riskRating).toBe('PASSED');
  });
});
