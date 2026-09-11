import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

export interface DeviceSession {
  sessionId: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface RiskAnalysisResult {
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresMfa: boolean;
  reasons: string[];
}

@Injectable()
export class MfaSecurityService {
  private activeSessions: Map<string, DeviceSession[]> = new Map();
  private mfaSecrets: Map<string, string> = new Map();

  async analyzeLoginRisk(userId: string, ipAddress: string, userAgent: string): Promise<RiskAnalysisResult> {
    const reasons: string[] = [];
    let riskScore = 10;

    // Check if IP is new or unrecognized
    const existingSessions = this.activeSessions.get(userId) || [];
    const knownIp = existingSessions.some((s) => s.ipAddress === ipAddress);

    if (!knownIp && existingSessions.length > 0) {
      riskScore += 45;
      reasons.push('Unrecognized IP address location');
    }

    if (userAgent.includes('Headless') || userAgent.includes('Bot')) {
      riskScore += 50;
      reasons.push('Suspicious automated user-agent');
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (riskScore >= 70) riskLevel = 'HIGH';
    else if (riskScore >= 40) riskLevel = 'MEDIUM';

    return {
      riskScore,
      riskLevel,
      requiresMfa: riskScore >= 40,
      reasons,
    };
  }

  async registerDeviceSession(userId: string, deviceName: string, ipAddress: string, location: string): Promise<DeviceSession> {
    const sessions = this.activeSessions.get(userId) || [];
    const newSession: DeviceSession = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      deviceName,
      ipAddress,
      location,
      lastActive: new Date(),
      isCurrent: true,
    };

    // Mark previous current as false
    sessions.forEach((s) => (s.isCurrent = false));
    sessions.push(newSession);
    this.activeSessions.set(userId, sessions);
    return newSession;
  }

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const sessions = this.activeSessions.get(userId) || [];
    const filtered = sessions.filter((s) => s.sessionId !== sessionId);
    this.activeSessions.set(userId, filtered);
    return true;
  }

  async getActiveSessions(userId: string): Promise<DeviceSession[]> {
    return this.activeSessions.get(userId) || [];
  }
}
