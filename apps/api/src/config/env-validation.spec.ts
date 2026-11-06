import { validateProductionEnvironment } from './env-validation';

describe('Phase 24: DevSecOps Environment Configuration & Secret Hardening', () => {
  it('should accept valid high-entropy configuration in production', () => {
    const validProdConfig = {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://prod_user:StrongKMSPasswd9821@prod-db.internal:5432/ecivres',
      JWT_ACCESS_SECRET: 'a8f9c1b2e3d4e5f67890123456789abcdef0123456789abcdef0123456789abc',
      JWT_REFRESH_SECRET: 'b1c2d3e4f5a6b7c8901234567890abcdef0123456789abcdef0123456789abc',
      CORS_ORIGINS: 'https://ecivres.com,https://api.ecivres.com',
    };

    const parsed = validateProductionEnvironment(validProdConfig);
    expect(parsed.NODE_ENV).toBe('production');
    expect(parsed.CORS_ORIGINS).toContain('https://ecivres.com');
  });

  it('should reject production startup if required secrets are missing', () => {
    const missingSecretConfig = {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://prod-db:5432/ecivres',
      // Missing JWT secrets
    };

    expect(() => validateProductionEnvironment(missingSecretConfig)).toThrow(
      /Missing required environment secrets/i,
    );
  });

  it('should reject production startup if insecure development placeholders are detected', () => {
    const insecureConfig = {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://prod-db:5432/ecivres',
      JWT_ACCESS_SECRET: 'super_secret_access_token_key_change_in_prod',
      JWT_REFRESH_SECRET: 'prod_refresh_secret_entropy_99182',
    };

    expect(() => validateProductionEnvironment(insecureConfig)).toThrow(
      /Insecure development fallback detected in JWT secrets/i,
    );
  });

  it('should gracefully supply defaults in local development environment', () => {
    const devConfig = {
      NODE_ENV: 'development',
    };

    const parsed = validateProductionEnvironment(devConfig);
    expect(parsed.NODE_ENV).toBe('development');
    expect(parsed.PORT).toBe(5001);
    expect(parsed.DATABASE_URL).toBeDefined();
    expect(parsed.JWT_ACCESS_SECRET).toBeDefined();
  });
});
