import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return refreshToken;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      // Removed automatic customer profile creation
    });

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.generateRefreshToken(user.id);

    const fullUser = await this.usersService.findOneById(user.id);

    return {
      access_token,
      refresh_token,
      user: fullUser,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.generateRefreshToken(user.id);

    const fullUser = await this.usersService.findOneById(user.id);

    return {
      access_token,
      refresh_token,
      user: fullUser,
    };
  }

  async refresh(refreshTokenStr: string) {
    if (!refreshTokenStr) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // Find all unexpired tokens (in a real scenario, we might clean up expired ones)
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    let matchedToken = null;
    for (const tokenRecord of activeTokens) {
      const isMatch = await bcrypt.compare(
        refreshTokenStr,
        tokenRecord.tokenHash,
      );
      if (isMatch) {
        matchedToken = tokenRecord;
        break;
      }
    }

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Delete the old token (Token rotation)
    await this.prisma.refreshToken.delete({
      where: { id: matchedToken.id },
    });

    const user = matchedToken.user;
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
    };
  }

  async logout(refreshTokenStr: string) {
    if (!refreshTokenStr) {
      return { success: true };
    }

    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    for (const tokenRecord of activeTokens) {
      const isMatch = await bcrypt.compare(
        refreshTokenStr,
        tokenRecord.tokenHash,
      );
      if (isMatch) {
        await this.prisma.refreshToken.delete({
          where: { id: tokenRecord.id },
        });
        break;
      }
    }

    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return { message: 'If an account with that email exists, reset instructions have been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: `RESET:${resetTokenHash}`,
        expiresAt,
      },
    });

    return {
      message: 'If an account with that email exists, reset instructions have been sent.',
      resetToken,
    };
  }

  async resetPassword(resetDto: { token: string; newPassword: string }) {
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        tokenHash: { startsWith: 'RESET:' },
        expiresAt: { gt: new Date() },
      },
    });

    let matchedTokenRecord = null;
    for (const tokenRecord of activeTokens) {
      const rawHash = tokenRecord.tokenHash.replace('RESET:', '');
      const isMatch = await bcrypt.compare(resetDto.token, rawHash);
      if (isMatch) {
        matchedTokenRecord = tokenRecord;
        break;
      }
    }

    if (!matchedTokenRecord) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: matchedTokenRecord.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.refreshToken.delete({
      where: { id: matchedTokenRecord.id },
    });

    return { message: 'Password reset successful' };
  }
}
