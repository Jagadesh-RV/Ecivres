import { CsrfProtectionGuard } from './csrf.guard';
import { ApiAbuseDetectorService } from './api-abuse-detector.service';
import { ForbiddenException } from '@nestjs/common';

describe('Advanced Security Controls', () => {
  describe('CsrfProtectionGuard', () => {
    let guard: CsrfProtectionGuard;

    beforeEach(() => {
      guard = new CsrfProtectionGuard();
    });

    it('should allow safe HTTP GET requests without CSRF header', () => {
      const context: any = {
        switchToHttp: () => ({
          getRequest: () => ({ method: 'GET', headers: {} }),
        }),
      };
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should reject POST request when CSRF token is missing', () => {
      const context: any = {
        switchToHttp: () => ({
          getRequest: () => ({ method: 'POST', headers: {} }),
        }),
      };
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('ApiAbuseDetectorService', () => {
    let abuseDetector: ApiAbuseDetectorService;

    beforeEach(() => {
      abuseDetector = new ApiAbuseDetectorService();
    });

    it('should calculate CRITICAL threat score for high request velocity and failed logins', () => {
      const result = abuseDetector.analyzeRequestPattern('192.168.1.100', 600, 15);
      expect(result.threatLevel).toBe('CRITICAL');
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.flaggedReasons).toHaveLength(2);
    });
  });
});
