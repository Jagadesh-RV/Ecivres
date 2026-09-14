import { Test, TestingModule } from '@nestjs/testing';
import { SecretRotationService } from './secret-rotation.service';

describe('Security Hardening Services', () => {
  let service: SecretRotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretRotationService],
    }).compile();

    service = module.get<SecretRotationService>(SecretRotationService);
  });

  it('should rotate database and JWT secrets via AWS Secrets Manager', async () => {
    const dbRotation = await service.rotateDatabaseSecret('ecivres/production/database');
    expect(dbRotation.status).toBe('SUCCESS');
    expect(dbRotation.secretId).toBe('ecivres/production/database');

    const jwtRotation = await service.rotateJwtSecret('ecivres/production/jwt');
    expect(jwtRotation.status).toBe('SUCCESS');
  });
});
