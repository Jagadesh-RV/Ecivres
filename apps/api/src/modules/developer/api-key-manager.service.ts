import { Injectable, Logger } from '@nestjs/common';

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  hashedSecret: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
}

@Injectable()
export class ApiKeyManagerService {
  private readonly logger = new Logger(ApiKeyManagerService.name);

  generateApiKey(name: string, scopes: string[]): { keyId: string; rawSecretKey: string; keyRecord: ApiKeyRecord } {
    const keyId = `key_${Date.now()}`;
    const rawSecretKey = `ecv_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    const keyPrefix = rawSecretKey.substring(0, 12);
    
    this.logger.log(`Generated new API key '${name}' with scopes: ${scopes.join(', ')}`);

    const keyRecord: ApiKeyRecord = {
      id: keyId,
      name,
      keyPrefix,
      hashedSecret: `hashed_${rawSecretKey}`,
      scopes,
      createdAt: new Date().toISOString(),
    };

    return { keyId, rawSecretKey, keyRecord };
  }

  verifyScope(keyScopes: string[], requiredScope: string): boolean {
    return keyScopes.includes('*') || keyScopes.includes(requiredScope);
  }
}
