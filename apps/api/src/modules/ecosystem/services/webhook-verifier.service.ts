import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class WebhookVerifierService {
  private readonly logger = new Logger(WebhookVerifierService.name);
  private readonly MAX_CLOCK_SKEW_SECONDS = 300; // 5 minutes

  /**
   * Computes expected HMAC-SHA256 signature for a raw payload and timestamp.
   */
  computeSignature(payload: string, secret: string, timestamp: number): string {
    const signaturePayload = `${timestamp}.${payload}`;
    return createHmac('sha256', secret).update(signaturePayload).digest('hex');
  }

  /**
   * Verifies incoming webhook signature with timing-safe comparison and clock-skew tolerance.
   */
  verifySignature(
    payload: string,
    signature: string,
    secret: string,
    timestamp: number,
  ): boolean {
    const now = Math.floor(Date.now() / 1000);

    // 1. Check clock skew
    if (Math.abs(now - timestamp) > this.MAX_CLOCK_SKEW_SECONDS) {
      this.logger.warn(`Webhook signature rejected: Timestamp drift ${Math.abs(now - timestamp)}s exceeds tolerance.`);
      throw new UnauthorizedException('Webhook timestamp outside allowed clock skew window.');
    }

    // 2. Compute expected HMAC
    const expected = this.computeSignature(payload, secret, timestamp);

    // 3. Timing-safe comparison
    try {
      const expectedBuf = Buffer.from(expected, 'hex');
      const receivedBuf = Buffer.from(signature, 'hex');

      if (expectedBuf.length !== receivedBuf.length) {
        return false;
      }

      return timingSafeEqual(expectedBuf, receivedBuf);
    } catch {
      return false;
    }
  }
}
