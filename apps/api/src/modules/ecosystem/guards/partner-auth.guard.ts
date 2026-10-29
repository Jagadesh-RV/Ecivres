import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PartnerApiService } from '../services/partner-api.service';

export const REQUIRED_SCOPE_KEY = 'partner_required_scope';

@Injectable()
export class PartnerAuthGuard implements CanActivate {
  constructor(
    private readonly partnerApiService: PartnerApiService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const apiKeyHeader = request.headers['x-api-key'];

    let apiKey = apiKeyHeader;
    if (!apiKey && authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    }

    if (!apiKey) {
      throw new UnauthorizedException('Missing Partner API credentials. Provide Bearer token or x-api-key header.');
    }

    const requiredScope = this.reflector.get<string>(REQUIRED_SCOPE_KEY, context.getHandler());
    const partnerRecord = await this.partnerApiService.authenticateKey(apiKey, requiredScope);

    // Verify tenant boundary if target organization is specified in params or body
    const targetOrgId = request.params?.organizationId || request.body?.organizationId;
    if (targetOrgId && targetOrgId !== partnerRecord.organizationId) {
      throw new ForbiddenException(
        `Cross-tenant access prohibited. Partner is scoped to Org '${partnerRecord.organizationId}' but requested Org '${targetOrgId}'.`,
      );
    }

    request.partner = {
      keyId: partnerRecord.id,
      organizationId: partnerRecord.organizationId,
      keyName: partnerRecord.keyName,
      scopes: partnerRecord.scopes,
      rateLimitPerMin: partnerRecord.rateLimitPerMin,
    };

    return true;
  }
}
