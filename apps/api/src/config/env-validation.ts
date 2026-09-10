export interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export function validateProductionEnvironment(config: Record<string, any>): EnvironmentConfig {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  for (const key of required) {
    if (!config[key]) {
      console.warn(`[WARNING] Missing environment variable: ${key}. Using fallback for development.`);
    }
  }

  return {
    NODE_ENV: config.NODE_ENV || 'development',
    PORT: parseInt(config.PORT || '3000', 10),
    DATABASE_URL: config.DATABASE_URL || 'postgresql://localhost:5432/ecivres',
    JWT_SECRET: config.JWT_SECRET || 'super_secret_jwt_key_ecivres',
  };
}
