import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface RedisConnectionConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  getRedisConfig(): RedisConnectionConfig {
    return {
      host: this.configService.get<string>('REDIS_HOST') || '127.0.0.1',
      port: Number(this.configService.get<number>('REDIS_PORT')) || 6379,
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      db: Number(this.configService.get<number>('REDIS_DB')) || 0,
    };
  }
}
