import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantBoundaryGuard implements CanActivate {
  private readonly logger = new Logger(TenantBoundaryGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthenticated request: user context missing');
    }

    // Super Admin has global platform governance bypass
    if (user.roles?.includes('SUPER_ADMIN') || user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Extract target tenant/organization ID from params, query, or body
    const targetOrgId =
      request.params?.orgId ||
      request.params?.organizationId ||
      request.params?.tenantId ||
      request.query?.orgId ||
      request.query?.organizationId ||
      request.body?.orgId ||
      request.body?.organizationId;

    if (!targetOrgId) {
      // No explicit organization parameter scoped on this route
      return true;
    }

    // If user has an explicit active orgId in token matching target
    if (user.orgId && user.orgId === targetOrgId) {
      return true;
    }

    // Validate membership in the target organization via database
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        userId: user.id || user.sub,
        orgId: targetOrgId,
      },
    });

    if (!membership) {
      this.logger.warn(
        `[IDOR ALERT] Cross-tenant boundary breach attempt blocked: User '${user.id || user.sub}' tried accessing organization '${targetOrgId}'`,
      );
      throw new ForbiddenException(
        `Cross-tenant boundary breach blocked: You do not possess authorized membership in organization '${targetOrgId}'`,
      );
    }

    return true;
  }
}
