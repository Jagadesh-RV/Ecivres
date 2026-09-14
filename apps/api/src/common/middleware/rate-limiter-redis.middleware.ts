import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RedisRateLimiterMiddleware implements NestMiddleware {
  private readonly windowMs = 60 * 1000;
  private readonly maxRequests = 100;
  private readonly requestsMap = new Map<string, { count: number; expiresAt: number }>();

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
    const now = Date.now();
    const current = this.requestsMap.get(clientIp);

    if (!current || now > current.expiresAt) {
      this.requestsMap.set(clientIp, { count: 1, expiresAt: now + this.windowMs });
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', (this.maxRequests - 1).toString());
      return next();
    }

    if (current.count >= this.maxRequests) {
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('Retry-After', Math.ceil((current.expiresAt - now) / 1000).toString());
      throw new HttpException('Too many requests, please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    current.count += 1;
    res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (this.maxRequests - current.count).toString());
    next();
  }
}
