import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import type { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.prisma = new PrismaClient();
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('AUTH_EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        // Since we don't know the exact role, we'll just create a CustomerProfile by default
        // The instructions said to use a temporary identity strategy
        customerProfile: {
          create: {
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || '',
          },
        },
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const normalizedEmail = email.toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('AUTH_INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('AUTH_INVALID_CREDENTIALS');
    }

    const roles = user.userRoles.filter(ur => ur.role).map((ur) => ur.role!.name);
    return this.generateTokens(user.id, user.email, roles);
  }

  async refreshToken(refreshTokenString: string) {
    try {
      const payload = this.jwtService.verify(refreshTokenString, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const userId = payload.sub;

      // Find all refresh tokens for user
      const userTokens = await this.prisma.refreshToken.findMany({
        where: { userId },
      });

      // Find the one that matches
      let matchedTokenId: string | null = null;
      for (const token of userTokens) {
        if (await bcrypt.compare(refreshTokenString, token.tokenHash)) {
          matchedTokenId = token.id;
          break;
        }
      }

      if (!matchedTokenId) {
        throw new UnauthorizedException('AUTH_REFRESH_TOKEN_REVOKED');
      }

      // Check expiration
      const tokenRecord = userTokens.find((t) => t.id === matchedTokenId);
      if (tokenRecord && tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('AUTH_REFRESH_TOKEN_EXPIRED');
      }

      // Revoke old token
      await this.prisma.refreshToken.delete({ where: { id: matchedTokenId } });

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { userRoles: { include: { role: true } } },
      });

      if (!user) {
        throw new UnauthorizedException('AUTH_UNAUTHORIZED');
      }

      const roles = user.userRoles.filter(ur => ur.role).map((ur) => ur.role!.name);
      return this.generateTokens(user.id, user.email, roles);
    } catch (e) {
      throw new UnauthorizedException('AUTH_INVALID_TOKEN');
    }
  }

  async logout(refreshTokenString: string) {
    if (!refreshTokenString) return;
    try {
      const payload = this.jwtService.verify(refreshTokenString, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        ignoreExpiration: true,
      });

      const userId = payload.sub;
      const userTokens = await this.prisma.refreshToken.findMany({
        where: { userId },
      });

      let matchedTokenId: string | null = null;
      for (const token of userTokens) {
        if (await bcrypt.compare(refreshTokenString, token.tokenHash)) {
          matchedTokenId = token.id;
          break;
        }
      }

      if (matchedTokenId) {
        await this.prisma.refreshToken.delete({
          where: { id: matchedTokenId },
        });
      }
    } catch (e) {
      // Ignore invalid tokens on logout
    }
  }

  private async generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as StringValue,
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Parse '7d' to a date, assuming default 7 days for simplicity if we can't parse easily
    // In a production app, we'd use a better parser for expiration strings
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: userId,
          email,
          roles,
        },
      },
    };
  }
}
