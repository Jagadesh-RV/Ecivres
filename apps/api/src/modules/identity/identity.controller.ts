import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RegisterDigitalIdDto } from './dto/register-digital-id.dto';
import { IssueCredentialDto } from './dto/issue-credential.dto';
import { DigitalIdWalletService } from './digital-id-wallet.service';
import { VerifiableCredentialService } from './verifiable-credential.service';
import { ReputationVaultService } from './reputation-vault.service';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly walletService: DigitalIdWalletService,
    private readonly credentialService: VerifiableCredentialService,
    private readonly reputationVault: ReputationVaultService,
  ) {}

  @Post('wallet')
  registerWallet(@Body() dto: RegisterDigitalIdDto) {
    return this.walletService.registerWallet(dto);
  }

  @Post('credentials')
  issueCredential(@Body() dto: IssueCredentialDto) {
    return this.credentialService.issueCredential(dto);
  }

  @Get('zk-reputation')
  verifyReputationZk(@Query('did') did: string, @Query('minScore') minScore: number) {
    return this.reputationVault.generateZkReputationProof(did || 'did:ecivres:demo', Number(minScore) || 4.5);
  }
}
