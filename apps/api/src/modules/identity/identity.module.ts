import { Module } from '@nestjs/common';
import { DigitalIdWalletService } from './digital-id-wallet.service';
import { VerifiableCredentialService } from './verifiable-credential.service';
import { ReputationVaultService } from './reputation-vault.service';
import { IdentityController } from './identity.controller';

@Module({
  controllers: [IdentityController],
  providers: [DigitalIdWalletService, VerifiableCredentialService, ReputationVaultService],
  exports: [DigitalIdWalletService, VerifiableCredentialService, ReputationVaultService],
})
export class IdentityModule {}
