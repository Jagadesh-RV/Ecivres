import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const headerValue =
      req.headers['x-correlation-id'] ||
      req.headers['x-request-id'] ||
      req.headers['traceparent'];

    const correlationId =
      typeof headerValue === 'string' && headerValue.trim().length > 0
        ? headerValue.trim()
        : `req-${crypto.randomUUID()}`;

    // Attach to request for downstream logging and audit interceptors
    req.correlationId = correlationId;

    // Propagate on HTTP response headers
    res.setHeader('X-Correlation-Id', correlationId);

    next();
  }
}
