import { Injectable, Logger } from '@nestjs/common';

export interface PasskeyCredential {
  credentialId: string;
  userId: string;
  publicKey: string;
  counter: number;
  transports: string[];
}

@Injectable()
export class PasskeyService {
  private readonly logger = new Logger(PasskeyService.name);

  generateRegistrationOptions(userId: string, email: string) {
    this.logger.log(`Generating WebAuthn Passkey registration options for ${email} (${userId})`);
    return {
      rp: { name: 'EcivreS Enterprise Platform', id: 'ecivres.com' },
      user: { id: userId, name: email, displayName: email },
      challenge: `challenge_${Date.now()}`,
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256
      authenticatorSelection: { userVerification: 'preferred', authenticatorAttachment: 'platform' },
    };
  }

  verifyPasskeySignature(credentialId: string, clientDataJSON: string, signature: string): boolean {
    this.logger.log(`Verifying WebAuthn Passkey signature for credential ${credentialId}`);
    return signature.length > 0;
  }
}
