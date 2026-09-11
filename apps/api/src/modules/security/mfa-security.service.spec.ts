import { Test, TestingModule } from '@nestjs/testing';
import { MfaSecurityService } from './mfa-security.service';

describe('MfaSecurityService', () => {
  let service: MfaSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MfaSecurityService],
    }).compile();

    service = module.get<MfaSecurityService>(MfaSecurityService);
  });

  it('should analyze risk and trigger MFA requirement on unknown IP', async () => {
    // First register a session
    await service.registerDeviceSession('u100', 'iPhone 15', '192.168.1.1', 'New York, US');

    // Attempt login from unknown IP
    const risk = await service.analyzeLoginRisk('u100', '10.0.0.99', 'Mozilla/5.0');
    expect(risk.requiresMfa).toBe(true);
    expect(risk.riskLevel).toBe('MEDIUM');
    expect(risk.reasons.length).toBeGreaterThan(0);
  });

  it('should list and revoke active device sessions', async () => {
    const s1 = await service.registerDeviceSession('u100', 'MacBook Pro', '192.168.1.1', 'NY');
    const s2 = await service.registerDeviceSession('u100', 'Android Phone', '192.168.1.2', 'NY');

    let sessions = await service.getActiveSessions('u100');
    expect(sessions.length).toBe(2);

    await service.revokeSession('u100', s1.sessionId);
    sessions = await service.getActiveSessions('u100');
    expect(sessions.length).toBe(1);
    expect(sessions[0].sessionId).toBe(s2.sessionId);
  });
});
