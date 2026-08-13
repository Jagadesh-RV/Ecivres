import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'AUTH_EMAIL_ALREADY_EXISTS' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user and return tokens' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'AUTH_INVALID_CREDENTIALS' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'AUTH_INVALID_TOKEN or AUTH_REFRESH_TOKEN_REVOKED' })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.refresh_token);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Body() refreshDto: RefreshTokenDto) {
    await this.authService.logout(refreshDto.refresh_token);
    return { success: true };
  }
}
