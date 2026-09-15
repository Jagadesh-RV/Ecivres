import { PasskeyService } from './passkey.service';
import { DeviceTrustService } from './device-trust.service';

describe('Zero Trust Security 2.0 Services', () => {
  describe('PasskeyService', () => {
    let passkey: PasskeyService;

    beforeEach(() => {
      passkey = new PasskeyService();
    });

    it('should generate WebAuthn registration options with ES256 algorithm', () => {
      const opts = passkey.generateRegistrationOptions('u_1', 'user@ecivres.com');
      expect(opts.rp.name).toBeDefined();
      expect(opts.pubKeyCredParams[0].alg).toBe(-7);
    });
  });

  describe('DeviceTrustService', () => {
    let trust: DeviceTrustService;

    beforeEach(() => {
      trust = new DeviceTrustService();
    });

    it('should require MFA step-up for unrecognized devices', () => {
      const score = trust.evaluateDeviceTrust('fp_unknown', 'Mozilla', '192.168.1.1', ['fp_known_1']);
      expect(score.isRecognizedDevice).toBe(false);
      expect(score.requiresMfaStepUp).toBe(true);
    });

    it('should grant 95 trust score for recognized registered device', () => {
      const score = trust.evaluateDeviceTrust('fp_known_1', 'Mozilla', '192.168.1.1', ['fp_known_1']);
      expect(score.isRecognizedDevice).toBe(true);
      expect(score.trustScore).toBe(95);
      expect(score.requiresMfaStepUp).toBe(false);
    });
  });
});
