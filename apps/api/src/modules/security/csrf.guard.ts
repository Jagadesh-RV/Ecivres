import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfProtectionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // Skip CSRF validation for safe HTTP methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return true;
    }

    const csrfHeader = req.headers['x-csrf-token'];
    const csrfCookie = req.cookies ? req.cookies['XSRF-TOKEN'] : undefined;

    if (!csrfHeader || (csrfCookie && csrfHeader !== csrfCookie)) {
      throw new ForbiddenException('Invalid or missing CSRF token');
    }

    return true;
  }
}
