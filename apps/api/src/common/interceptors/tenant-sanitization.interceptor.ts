import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantSanitizationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TenantSanitizationInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;

    // Only inspect state-mutating requests
    if (['POST', 'PUT', 'PATCH'].includes(method) && request.body && typeof request.body === 'object') {
      if (user && !user.roles?.includes('SUPER_ADMIN') && user.role !== 'SUPER_ADMIN') {
        const userOrgId = user.orgId;

        // If user belongs to a tenant, prevent them from setting a different orgId in body
        if (userOrgId) {
          const bodyOrgId = request.body.orgId || request.body.organizationId || request.body.tenantId;

          if (bodyOrgId && bodyOrgId !== userOrgId) {
            this.logger.warn(
              `[TENANT SANITIZATION] Blocked tenant spoofing attempt: User '${user.id || user.sub}' (Org: '${userOrgId}') tried assigning resource to Org: '${bodyOrgId}'`,
            );
            throw new ForbiddenException(
              `Tenant spoofing rejected: Cannot assign or mutate resources outside your organization boundary '${userOrgId}'`,
            );
          }

          // Enforce legitimate tenant ID
          if (request.body.orgId !== undefined) {
            request.body.orgId = userOrgId;
          }
          if (request.body.organizationId !== undefined) {
            request.body.organizationId = userOrgId;
          }
          if (request.body.tenantId !== undefined) {
            request.body.tenantId = userOrgId;
          }
        }
      }
    }

    return next.handle();
  }
}
