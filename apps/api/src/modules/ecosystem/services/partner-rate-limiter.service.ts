import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

export interface RateLimitCheckResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

@Injectable()
export class PartnerRateLimiterService {
  private readonly logger = new Logger(PartnerRateLimiterService.name);
  private readonly requestWindows = new Map<string, number[]>();
  private readonly WINDOW_SIZE_MS = 60 * 1000; // 1 minute sliding window

  /**
   * Consumes 1 request from partner's sliding window rate limit.
   */
  checkRateLimit(keyId: string, limitPerMinute: number = 120): RateLimitCheckResult {
    const now = Date.now();
    const windowStart = now - this.WINDOW_SIZE_MS;

    const timestamps = this.requestWindows.get(keyId) || [];
    // Filter to retain only requests within current window
    const validTimestamps = timestamps.filter((t) => t > windowStart);

    if (validTimestamps.length >= limitPerMinute) {
      const oldestInWindow = validTimestamps[0];
      const resetSeconds = Math.ceil((oldestInWindow + this.WINDOW_SIZE_MS - now) / 1000);

      this.logger.warn(`Partner key ${keyId} exceeded rate limit (${limitPerMinute} req/min). Reset in ${resetSeconds}s`);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Partner API rate limit exceeded. Max ${limitPerMinute} requests/minute. Try again in ${resetSeconds} seconds.`,
          retryAfterSeconds: resetSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    validTimestamps.push(now);
    this.requestWindows.set(keyId, validTimestamps);

    const remaining = Math.max(0, limitPerMinute - validTimestamps.length);
    const resetSeconds = 60;

    return {
      allowed: true,
      limit: limitPerMinute,
      remaining,
      resetSeconds,
    };
  }

  /**
   * Resets rate limiter window for testing.
   */
  resetLimit(keyId: string): void {
    this.requestWindows.delete(keyId);
  }
}
