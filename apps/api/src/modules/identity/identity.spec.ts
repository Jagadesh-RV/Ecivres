import { Test, TestingModule } from '@nestjs/testing';
import { DigitalIdWalletService } from './digital-id-wallet.service';
import { VerifiableCredentialService } from './verifiable-credential.service';
import { ReputationVaultService } from './reputation-vault.service';
import { IdentityType } from './dto/register-digital-id.dto';

describe('Digital Identity Services', () => {
  let walletService: DigitalIdWalletService;
  let credentialService: VerifiableCredentialService;
  let reputationVault: ReputationVaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DigitalIdWalletService, VerifiableCredentialService, ReputationVaultService],
    }).compile();

    walletService = module.get<DigitalIdWalletService>(DigitalIdWalletService);
    credentialService = module.get<VerifiableCredentialService>(VerifiableCredentialService);
    reputationVault = module.get<ReputationVaultService>(ReputationVaultService);
  });

  it('should register digital ID wallet with DID', async () => {
    const wallet = await walletService.registerWallet({
      userId: 'u_100',
      identityType: IdentityType.CERTIFIED_PROVIDER,
      didIdentifier: 'did:ecivres:prov:100',
    });
    expect(wallet.walletId).toBeDefined();
    expect(wallet.didIdentifier).toBe('did:ecivres:prov:100');
    expect(wallet.status).toBe('ACTIVE');
  });

  it('should issue cryptographic W3C Verifiable Credential', async () => {
    const vc = await credentialService.issueCredential({
      subjectDid: 'did:ecivres:prov:100',
      credentialType: 'TradeLicenseCredential',
      claims: { licenseNumber: 'LIC-990', trade: 'HVAC' },
    });
    expect(vc.id).toBeDefined();
    expect(vc.issuer).toBe('did:ecivres:issuer:mainnet');
    expect(vc.proof.jws).toBeDefined();
  });

  it('should verify Zero-Knowledge reputation score threshold', async () => {
    const zkp = await reputationVault.generateZkReputationProof('did:ecivres:prov:100', 4.5);
    expect(zkp.minThresholdPassed).toBe(true);
    expect(zkp.zkProofHash).toBeDefined();
  });
});
