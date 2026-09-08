import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfigService {
  constructor(private configService: ConfigService) {}

  getApiKey(): string {
    return this.configService.get<string>('RESEND_API_KEY') || 're_mock_key';
  }

  getFromEmail(): string {
    return this.configService.get<string>('EMAIL_FROM') || 'EcivreS Marketplace <notifications@ecivres.com>';
  }
}
