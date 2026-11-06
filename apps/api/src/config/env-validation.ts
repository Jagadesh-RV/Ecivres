export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'test' | 'staging' | 'production';
  PORT: number;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CORS_ORIGINS: string[];
}

const INSECURE_PLACEHOLDER_SUBSTRINGS = [
  'super_secret',
  'change_in_prod',
  'super-secret',
  'password123',
  'default_secret',
];

/**
 * Validates runtime environment configuration against DevSecOps production gates.
 * In production/staging, enforces explicit non-empty secrets and rejects insecure development placeholders.
 */
export function validateProductionEnvironment(config: Record<string, any> = process.env): EnvironmentConfig {
  const nodeEnv = (config.NODE_ENV || 'development').toLowerCase() as EnvironmentConfig['NODE_ENV'];
  const isProductionOrStaging = nodeEnv === 'production' || nodeEnv === 'staging';

  const requiredKeys = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missingKeys: string[] = [];

  for (const key of requiredKeys) {
    const val = config[key] || (key === 'JWT_ACCESS_SECRET' ? config['JWT_SECRET'] : undefined);
    if (!val || String(val).trim() === '') {
      missingKeys.push(key);
    }
  }

  if (isProductionOrStaging && missingKeys.length > 0) {
    throw new Error(
      `[DEVSECOPS CRITICAL] Production startup halted. Missing required environment secrets: ${missingKeys.join(', ')}`,
    );
  }

  // Reject insecure development placeholders in production
  if (isProductionOrStaging) {
    const accessSecret = String(config.JWT_ACCESS_SECRET || config.JWT_SECRET || '');
    const refreshSecret = String(config.JWT_REFRESH_SECRET || '');

    const hasInsecureAccess = INSECURE_PLACEHOLDER_SUBSTRINGS.some((ph) => accessSecret.toLowerCase().includes(ph));
    const hasInsecureRefresh = INSECURE_PLACEHOLDER_SUBSTRINGS.some((ph) => refreshSecret.toLowerCase().includes(ph));

    if (hasInsecureAccess || hasInsecureRefresh) {
      throw new Error(
        `[DEVSECOPS CRITICAL] Production startup halted. Insecure development fallback detected in JWT secrets. Ensure high-entropy cryptographic keys are supplied from AWS Secrets Manager / Vault.`,
      );
    }
  }

  const corsOrigins = config.CORS_ORIGINS
    ? String(config.CORS_ORIGINS)
        .split(',')
        .map((s) => s.trim())
    : ['http://localhost:3000', 'http://localhost:5001', 'http://localhost:8081'];

  return {
    NODE_ENV: nodeEnv,
    PORT: parseInt(config.API_PORT || config.PORT || '5001', 10),
    DATABASE_URL: config.DATABASE_URL || 'postgresql://postgres:password@localhost:5433/ecivres?schema=public',
    JWT_ACCESS_SECRET: config.JWT_ACCESS_SECRET || config.JWT_SECRET || 'dev_access_secret_entropy_87236',
    JWT_REFRESH_SECRET: config.JWT_REFRESH_SECRET || 'dev_refresh_secret_entropy_99182',
    CORS_ORIGINS: corsOrigins,
  };
}
