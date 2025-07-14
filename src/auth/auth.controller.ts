import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { RtGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { TokenService } from './token.service';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<Tokens, 'refresh_token'>> {
    const tokens = await this.authService.signupLocal(dto);
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });
    return { access_token: tokens.access_token };
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'tokens'> & { access_token: string }> {
    const result = await this.authService.signinLocal(dto);
    res.cookie('refreshToken', result.tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });
    // Return user info and access_token only
    const { tokens, ...userInfo } = result;
    return { ...userInfo, access_token: tokens.access_token };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<{ access_token: string }> {
    const tokens = await this.tokenService.refreshTokens(userId, refreshToken);
    return { access_token: tokens.access_token };
  }
}
