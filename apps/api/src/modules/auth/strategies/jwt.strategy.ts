import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') || process.env.JWT_ACCESS_SECRET || 'ecivres_production_secure_jwt_secret_key_2026_x99',
    });
  }

  async validate(payload: any) {
    // The payload contains the decoded JWT.
    // Return what you want to attach to the Request object as `req.user`.
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { id: payload.sub, email: payload.email };
  }
}
