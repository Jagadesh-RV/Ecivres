import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

@Injectable()
export class PushConfigService {
  private readonly logger = new Logger(PushConfigService.name);

  constructor(private configService: ConfigService) {}

  getFirebaseConfig(): FirebaseAdminConfig {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID') || 'ecivres-marketplace';
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL') || 'firebase-adminsdk@ecivres.iam.gserviceaccount.com';
    const privateKey = (this.configService.get<string>('FIREBASE_PRIVATE_KEY') || 'mock_key').replace(/\\n/g, '\n');

    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  isConfigured(): boolean {
    const config = this.getFirebaseConfig();
    return Boolean(config.projectId && config.clientEmail && config.privateKey !== 'mock_key');
  }
}
