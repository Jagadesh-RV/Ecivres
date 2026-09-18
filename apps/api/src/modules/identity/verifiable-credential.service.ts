import { Injectable, Logger } from '@nestjs/common';
import { IssueCredentialDto } from './dto/issue-credential.dto';

export interface VerifiableCredential {
  id: string;
  context: string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    [key: string]: any;
  };
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
}

@Injectable()
export class VerifiableCredentialService {
  private readonly logger = new Logger(VerifiableCredentialService.name);

  async issueCredential(dto: IssueCredentialDto): Promise<VerifiableCredential> {
    const credId = `urn:uuid:${Math.random().toString(36).substring(2, 12)}`;
    const issuanceDate = new Date().toISOString();

    this.logger.log(`Issuing W3C Verifiable Credential ${credId} to ${dto.subjectDid}`);

    return {
      id: credId,
      context: ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', dto.credentialType],
      issuer: 'did:ecivres:issuer:mainnet',
      issuanceDate,
      credentialSubject: {
        id: dto.subjectDid,
        ...dto.claims,
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: issuanceDate,
        proofPurpose: 'assertionMethod',
        verificationMethod: 'did:ecivres:issuer:mainnet#key-1',
        jws: `eyJhbGciOiJFZERTQSI...sig_${Date.now()}`,
      },
    };
  }
}
