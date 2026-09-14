import { Injectable, Logger } from '@nestjs/common';

export interface AbuseScoreResult {
  clientIp: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number; // 0-100
  flaggedReasons: string[];
}

@Injectable()
export class ApiAbuseDetectorService {
  private readonly logger = new Logger(ApiAbuseDetectorService.name);

  analyzeRequestPattern(clientIp: string, reqCountInWindow: number, failedLoginsCount: number): AbuseScoreResult {
    let score = 0;
    const flaggedReasons: string[] = [];

    if (reqCountInWindow > 500) {
      score += 40;
      flaggedReasons.push('High velocity request surge');
    }

    if (failedLoginsCount > 10) {
      score += 50;
      flaggedReasons.push('Credential stuffing pattern detected');
    }

    let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 80) threatLevel = 'CRITICAL';
    else if (score >= 50) threatLevel = 'HIGH';
    else if (score >= 30) threatLevel = 'MEDIUM';

    if (threatLevel === 'HIGH' || threatLevel === 'CRITICAL') {
      this.logger.warn(`API Abuse Alert for IP ${clientIp}: ${threatLevel} (score: ${score}). Reasons: ${flaggedReasons.join(', ')}`);
    }

    return { clientIp, threatLevel, score, flaggedReasons };
  }
}
